import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

const Main = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationDirection, setAnimationDirection] = useState(1);

  // Sample featured images for carousel
  const featuredImages = [
    {
      id: 1,
      image: "https://storage.googleapis.com/a1aa/image/cutLM2wo50jO3xrlJjek5MLM216aK1vHDyECk1kKUqQ.jpg", 
      alt: "Canvas art of a breakfast tray with coffee and pastries",
      title: "Bộ Tranh Cafe Sáng",
      price: 750000
    },
    {
      id: 2,
      image: "https://storage.googleapis.com/a1aa/image/LNYJJP6BzXBpRg5bV8jca5sdve35J3hAJ2IEdzYlt_4.jpg", 
      alt: "Canvas art of abstract shapes in a living room",
      title: "Tranh Trừu Tượng Hiện Đại",
      price: 850000
    },
    {
      id: 3,
      image: "https://storage.googleapis.com/a1aa/image/o4GLdu34B3IKqKrCAzne0sJY_wIpRLyjcIfCM83VWmY.jpg", 
      alt: "Canvas art of sunflowers in a dining room",
      title: "Tranh Hoa Hướng Dương",
      price: 650000
    }
  ];

  useEffect(() => {
    // Auto slide effect
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
      setAnimationDirection(1); // Forward direction
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const handlePrev = () => {
    setAnimationDirection(-1); // Backward direction
    setCurrentSlide((prev) => (prev === 0 ? featuredImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setAnimationDirection(1); // Forward direction
    setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  // Get featured products from the products context
  const getFeaturedProducts = () => {
    if (!products || products.length === 0) return featuredImages;
    
    // Return at most 3 products for the featured section
    return products.slice(0, 3).map(product => ({
      id: product._id,
      image: product.image,
      alt: product.name,
      title: product.name,
      price: product.price,
      description: product.description,
      category: product.category
    }));
  };

  const displayProducts = getFeaturedProducts();

  return (
    <main className="p-4">
      {/* Hero Carousel */}
      <div className="relative overflow-hidden rounded-lg shadow-xl mb-8 bg-gray-100 h-96">
        {featuredImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="absolute inset-0"
            custom={animationDirection}
            variants={slideVariants}
            initial="enter"
            animate={index === currentSlide ? "center" : "exit"}
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <img 
              src={image.image} 
              alt={image.alt} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-2xl font-bold">{image.title}</h3>
              <p className="text-white">Giá: {image.price.toLocaleString()} VNĐ</p>
              <motion.button
                className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(image)}
              >
                Thêm vào giỏ hàng
              </motion.button>
            </div>
          </motion.div>
        ))}
        
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full z-10"
        >
          <i className="fas fa-chevron-left text-white text-xl"></i>
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full z-10"
        >
          <i className="fas fa-chevron-right text-white text-xl"></i>
        </button>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {featuredImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAnimationDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Featured Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Sản Phẩm Nổi Bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array(3).fill().map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            // Display products from context
            displayProducts.map((product) => (
              <motion.div 
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.alt} 
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                  </Link>
                  <p className="text-gray-700 mb-4">{product.price.toLocaleString()} VNĐ</p>
                  <motion.button
                    className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => addToCart(product)}
                  >
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Thêm vào giỏ hàng
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      
      {/* Call to Action */}
      <motion.div 
        className="mt-12 p-8 bg-orange-100 rounded-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Trang trí không gian của bạn</h2>
        <p className="text-gray-700 mb-6">Khám phá bộ sưu tập tranh canvas đa dạng cho mọi không gian sống</p>
        <Link to="/products">
          <motion.button 
            className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Xem tất cả sản phẩm
          </motion.button>
        </Link>
      </motion.div>
    </main>
  );
};

export default Main;