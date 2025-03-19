import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useCategories } from '../hooks/useCategories';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductDetail, currentProduct, loading, error } = useProducts();
  const { categories } = useCategories();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        const response = await fetchProductDetail(id);
        if (!response?.success) {
          console.error("Failed to load product");
        }
      }
    };
    
    loadProduct();
  }, [id, fetchProductDetail]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (currentProduct) {
      addToCart(currentProduct, quantity);
      toast.success(`Đã thêm ${quantity} ${currentProduct.name || currentProduct.title} vào giỏ hàng!`);
    }
  };

  const getCategoryName = (categoryId) => {
    if (!categories || !categoryId) return 'Không phân loại';
    
    const category = categories.find(c => c._id === categoryId);
    return category ? category.name : 'Không phân loại';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Đã xảy ra lỗi: {error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 text-blue-500 hover:underline"
          >
            &larr; Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto p-4">
        <p>Không tìm thấy sản phẩm</p>
        <Link to="/" className="text-blue-500 hover:underline">Quay lại trang chủ</Link>
      </div>
    );
  }

  const productName = currentProduct.name || currentProduct.title;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Images */}
        <div className="md:w-1/2">
          <div className="mb-4 overflow-hidden rounded-lg">
            <motion.img
              src={currentProduct.images?.[activeImage] || currentProduct.image}
              alt={productName}
              className="w-full h-auto object-cover rounded-lg"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Thumbnail images */}
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {currentProduct.images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                    activeImage === index ? 'border-orange-500' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${productName} - hình ${index + 1}`}
                    className="w-16 h-16 object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right column - Product info */}
        <div className="md:w-1/2">
          <nav className="text-sm mb-4">
            <ol className="flex items-center space-x-1">
              <li>
                <Link to="/" className="text-gray-500 hover:text-orange-500">Trang chủ</Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link to={`/category/${currentProduct.category}`} className="text-gray-500 hover:text-orange-500">
                  {getCategoryName(currentProduct.category)}
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700 font-medium truncate">{productName}</li>
            </ol>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {productName}
          </h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-400 mr-2">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star-half-alt"></i>
            </div>
            <span className="text-gray-500 text-sm">(12 đánh giá)</span>
          </div>
          
          <div className="mb-6">
            <p className="text-2xl font-bold text-orange-600">
              {currentProduct.price?.toLocaleString()} ₫
            </p>
            {currentProduct.oldPrice && (
              <p className="text-gray-500 line-through text-sm">
                {currentProduct.oldPrice.toLocaleString()} ₫
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-2">Mô tả:</h3>
            <p className="text-gray-600">{currentProduct.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-2">Danh mục:</h3>
            <p className="text-gray-600">{getCategoryName(currentProduct.category)}</p>
          </div>
          
          {currentProduct.color && (
            <div className="mb-6">
              <h3 className="text-gray-700 font-medium mb-2">Màu sắc:</h3>
              <p className="text-gray-600">{currentProduct.color}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-2">Kích thước:</h3>
            <p className="text-gray-600">{currentProduct.size || '40cm x 60cm (Mặc định)'}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-2">Chất liệu:</h3>
            <p className="text-gray-600">{currentProduct.material || 'Canvas cao cấp'}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-2">Thông tin thêm:</h3>
            <ul className="text-gray-600 list-disc pl-5 space-y-1">
              <li>Tranh được in trên chất liệu canvas cao cấp</li>
              <li>Khung gỗ tự nhiên, chắc chắn</li>
              <li>Bảo hành 12 tháng</li>
              <li>Miễn phí vận chuyển nội thành</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-gray-700 font-medium mb-2">Số lượng:</h3>
            <div className="flex items-center">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l"
              >
                <i className="fas fa-minus"></i>
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center border-t border-b border-gray-200 py-2"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r"
              >
                <i className="fas fa-plus"></i>
              </button>
              
              <span className="ml-4 text-gray-600 text-sm">
                {currentProduct.quantity ? 
                  `Còn ${currentProduct.quantity} sản phẩm` : 
                  'Hết hàng'}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <motion.button
              onClick={handleAddToCart}
              className="btn-primary flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={!currentProduct.quantity}
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Thêm vào giỏ hàng
            </motion.button>
            
            <motion.button
              onClick={() => {
                handleAddToCart();
                navigate('/checkout');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={!currentProduct.quantity}
            >
              <i className="fas fa-bolt mr-2"></i>
              Mua ngay
            </motion.button>
            
            <motion.button
              className="btn-secondary flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-heart mr-2"></i>
              Yêu thích
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Additional product details tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-6">
            <button className="text-orange-500 border-b-2 border-orange-500 pb-2 font-medium">
              Chi tiết sản phẩm
            </button>
            <button className="text-gray-500 hover:text-orange-500 pb-2 font-medium">
              Đánh giá (12)
            </button>
            <button className="text-gray-500 hover:text-orange-500 pb-2 font-medium">
              Câu hỏi thường gặp
            </button>
          </nav>
        </div>
        
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-4">Thông tin chi tiết</h3>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Mô tả sản phẩm</h4>
            <p className="text-gray-600 mb-4">
              {currentProduct.description}
            </p>
            <p className="text-gray-600">
              Tranh canvas {productName} là sự lựa chọn hoàn hảo để trang trí không gian sống của bạn. 
              Với thiết kế tinh tế và màu sắc hài hòa, bức tranh sẽ mang đến không khí mới mẻ và sang trọng cho ngôi nhà của bạn.
            </p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Thông số kỹ thuật</h4>
            <table className="min-w-full border border-gray-200 mb-4">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 bg-gray-50 font-medium">Kích thước</td>
                  <td className="py-2 px-4">{currentProduct.size || '40cm x 60cm (Mặc định)'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 bg-gray-50 font-medium">Chất liệu</td>
                  <td className="py-2 px-4">{currentProduct.material || 'Canvas cao cấp'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 bg-gray-50 font-medium">Khung tranh</td>
                  <td className="py-2 px-4">Gỗ tự nhiên, chắc chắn</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 bg-gray-50 font-medium">Xuất xứ</td>
                  <td className="py-2 px-4">Việt Nam</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 bg-gray-50 font-medium">Bảo hành</td>
                  <td className="py-2 px-4">12 tháng</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Hướng dẫn bảo quản</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Tránh ánh nắng trực tiếp chiếu vào tranh</li>
              <li>Không treo tranh ở nơi ẩm ướt</li>
              <li>Lau chùi nhẹ nhàng bằng khăn mềm, khô</li>
              <li>Không sử dụng hóa chất tẩy rửa mạnh</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Related products section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Add related products here */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;