import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useCart } from '../hooks/useCart';

const Products = () => {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { addToCart } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  
  const loading = productsLoading || categoriesLoading;

  const filterProducts = () => {
    if (!products) return [];
    
    let filtered = [...products];
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category && product.category._id === selectedCategory
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Default sorting (featured or best selling)
        filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    }
    
    return filtered;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const filteredProducts = filterProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Các Dòng Sản Phẩm
      </motion.h1>

      {/* Filters and Sorting */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Danh mục:</h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    selectedCategory === null
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tất cả
                </motion.button>
                {categories && categories.map((category) => (
                  <motion.button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`px-3 py-1.5 text-sm rounded-full ${
                      selectedCategory === category._id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">Sắp xếp:</label>
              <select
                id="sort"
                className="rounded border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Phổ biến nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên: A-Z</option>
                <option value="name-desc">Tên: Z-A</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

            <div className="flex border rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
                aria-label="View as grid"
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
                aria-label="View as list"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-search text-gray-300 text-5xl mb-4"></i>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy sản phẩm nào</h3>
              <p className="text-gray-500">Vui lòng thử lại với bộ lọc khác.</p>
            </div>
          ) : (
            viewMode === 'grid' ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredProducts.map((product) => (
                  <motion.div 
                    key={product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Link to={`/product/${product._id}`} className="relative h-64 overflow-hidden block">
                      <img 
                        src={product.image || (product.images && product.images[0])} 
                        alt={product.name || product.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      {product.quantity <= 0 && (
                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold px-3 py-1 bg-red-500 rounded">Hết hàng</span>
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-lg font-semibold mb-2 truncate">{product.name || product.title}</h3>
                      </Link>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-500 font-bold">{product.price.toLocaleString()} VNĐ</span>
                        <motion.button
                          disabled={product.quantity <= 0}
                          onClick={() => addToCart(product)}
                          className={`p-2 rounded-full ${
                            product.quantity > 0 
                              ? 'bg-orange-500 text-white hover:bg-orange-600' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <i className="fas fa-shopping-cart"></i>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredProducts.map((product) => (
                  <motion.div 
                    key={product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row"
                    variants={itemVariants}
                  >
                    <Link to={`/product/${product._id}`} className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                      <img 
                        src={product.image || (product.images && product.images[0])} 
                        alt={product.name || product.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </Link>
                    <div className="p-4 md:w-3/4 flex flex-col">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-xl font-semibold mb-2">{product.name || product.title}</h3>
                      </Link>
                      <p className="text-gray-500 text-sm mb-4 flex-grow">{product.description}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <div>
                          {product.category && (
                            <span className="text-xs text-gray-500 mb-1 block">
                              {product.category.name || (product.category.category && product.category.category.name)}
                            </span>
                          )}
                          <span className="text-orange-500 font-bold text-lg">{product.price.toLocaleString()} VNĐ</span>
                        </div>
                        <motion.button
                          disabled={product.quantity <= 0}
                          onClick={() => addToCart(product)}
                          className={`px-4 py-2 rounded ${
                            product.quantity > 0 
                              ? 'bg-orange-500 text-white hover:bg-orange-600' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {product.quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )
          )}
        </>
      )}

      {/* Featured Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Danh Mục Nổi Bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            className="relative h-64 rounded-lg overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3" 
              alt="Phong Cảnh" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h3 className="text-xl font-bold mb-1">Phong Cảnh</h3>
                <button className="text-sm underline">Xem thêm</button>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative h-64 rounded-lg overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1536924430914-91f9e2041b83?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3" 
              alt="Trừu Tượng" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h3 className="text-xl font-bold mb-1">Trừu Tượng</h3>
                <button className="text-sm underline">Xem thêm</button>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative h-64 rounded-lg overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1606293926249-9390535b676b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
              alt="Hoa & Thực Vật" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h3 className="text-xl font-bold mb-1">Hoa & Thực Vật</h3>
                <button className="text-sm underline">Xem thêm</button>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative h-64 rounded-lg overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1507644636607-e72f1a50e25e?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3" 
              alt="Đời Sống" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h3 className="text-xl font-bold mb-1">Đời Sống</h3>
                <button className="text-sm underline">Xem thêm</button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Products; 