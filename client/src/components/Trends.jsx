import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProducts } from '../api/api';

const Trends = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        if (response.success && response.productDatas) {
          setProducts(response.productDatas);
        }
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const tabs = [
    { id: 'all', name: 'Tất cả' },
    { id: 'phong-canh', name: 'Phong cảnh' },
    { id: 'truu-tuong', name: 'Trừu tượng' },
    { id: 'hoa-thuc-vat', name: 'Hoa & thực vật' },
    { id: 'doi-song', name: 'Đời sống' }
  ];

  const filteredProducts = currentTab === 'all' 
    ? products 
    : products.filter(product => {
        if (currentTab === 'phong-canh' && product.category?.name === 'Phong Cảnh') return true;
        if (currentTab === 'truu-tuong' && product.category?.name === 'Trừu Tượng') return true;
        if (currentTab === 'hoa-thuc-vat' && product.category?.name === 'Hoa & Thực Vật') return true;
        if (currentTab === 'doi-song' && product.category?.name === 'Đời Sống & Thành Thị') return true;
        return false;
      });

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product._id);
    
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ 
        id: product._id, 
        title: product.title, 
        price: product.price, 
        image: product.images[0], 
        quantity: 1 
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm ${product.title} vào giỏ hàng!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.h1 
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Xu Hướng Tranh Canvas
        </motion.h1>
        <motion.p
          className="text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Khám phá các xu hướng tranh canvas mới nhất để trang trí không gian sống của bạn. 
          Từ tranh phong cảnh thiên nhiên tươi đẹp đến những tác phẩm nghệ thuật trừu tượng hiện đại.
        </motion.p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center mb-8 space-x-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 mb-2 ${
              currentTab === tab.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.name}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.map((product) => (
            <motion.div 
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Xu hướng
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 truncate">{product.title}</h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-orange-500 font-bold">{product.price.toLocaleString()} VNĐ</span>
                  <motion.button
                    onClick={() => addToCart(product)}
                    className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
        </div>
      )}

      {/* Trending features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Tại Sao Tranh Canvas Đang Là Xu Hướng?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="bg-gray-50 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-orange-500 text-3xl mb-4">
              <i className="fas fa-paint-brush"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3">Thẩm Mỹ Cao</h3>
            <p className="text-gray-600">Tranh canvas có độ sắc nét cao, màu sắc tươi sáng, không bị phai màu theo thời gian.</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-50 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-orange-500 text-3xl mb-4">
              <i className="fas fa-home"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3">Phù Hợp Nhiều Không Gian</h3>
            <p className="text-gray-600">Từ phòng khách, phòng ngủ đến văn phòng, tranh canvas đều mang lại vẻ đẹp hoàn hảo.</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-50 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-orange-500 text-3xl mb-4">
              <i className="fas fa-feather-alt"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3">Nhẹ & Dễ Lắp Đặt</h3>
            <p className="text-gray-600">Tranh canvas nhẹ hơn nhiều so với tranh truyền thống, dễ dàng treo hoặc thay đổi vị trí.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Trends; 