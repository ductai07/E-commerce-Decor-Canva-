import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import logo from "./ductai.png";

const Header = () => {
  const { user, token, setToken, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchOnMobile, setShowSearchOnMobile] = useState(false);

  // Animation variants
  const logoVariants = {
    hover: {
      scale: 1.1,
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1, backgroundColor: '#fff7ed' },
    tap: { scale: 0.95 },
  };

  const handleLogout = () => {
    // Clear user data and token
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    
    // Redirect to home page
    navigate('/');
    
    // Show success notification
    toast.success('Đăng xuất thành công!');
  };

  return (
    <div className="w-full border-b border-gray-200 shadow-sm">
      {/* Top bar with contact and account */}
      <div className="bg-slate-400 text-gray-500 py-1 text-sm md:text-base">
        <div className="container mx-auto flex justify-between">
          <div className="flex-auto">
            <motion.a 
              href="tel:0869520402" 
              className="flex items-center text-gray-800 hover:text-orange-600"
              whileHover={{ scale: 0.8 }}
            >
              <i className="fas fa-phone-alt mr-2 text-orange-600"></i>
              <span className="font-medium">0869 520 402</span>
            </motion.a>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-2">
                <i className="fas fa-user text-orange-600"></i>
                <span className="hidden md:inline font-medium">Xin chào,</span> 
                <Link to="/account" className="font-semibold hover:text-orange-600">{user.firstname}</Link>
                <motion.button
                  onClick={() => {
                    if(window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                      handleLogout();
                    }
                  }}
                  className="text-gray-800 hover:text-orange-600 ml-2 font-medium flex items-center"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span className="hidden md:inline">ĐĂNG XUẤT</span>
                  <i className="fas fa-sign-out-alt md:ml-1 text-orange-500"></i>
                </motion.button>
              </div>
            ) : (
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link to="/login" className="flex items-center space-x-2 text-gray-800 hover:text-orange-600 font-normal">
                  <i className="fas fa-user"></i>
                  <span>ĐĂNG NHẬP / ĐĂNG KÝ</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main header with logo, search and cart */}
      <header className=" bg-white">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-4"
            variants={logoVariants}
            whileHover="hover"
          >
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="DucTai-Decor logo"
                className="w-20 rounded-full border-2 m-1 border-gray-500 "
              />
              <span className="text-medium md:text-2xl font-bold uppercase text-yellow-900"> Decor</span>
            </Link>
          </motion.div>

          {/* Search Bar Section - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                className="w-full border border-gray-200 rounded-full py-2 px-4 pl-12 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none transition shadow-sm"
                placeholder="Tìm kiếm sản phẩm..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-600"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <i className="fas fa-search text-medium"></i>
              </motion.button>
              
              <select className="absolute right-0 top-0 h-full bg-gray-50 border-l border-gray-200 rounded-r-full px-4 text-sm focus:outline-none font-medium">
                <option value="all">Tất cả</option>
                <option value="canvas">Tranh Canvas</option>
                <option value="wallpaper">Tranh dán tường</option>
              </select>
            </div>
          </div>

          {/* Mobile search button */}
          <div className="md:hidden">
            <motion.button
              className="p-2 text-gray-600 hover:text-orange-600"
              onClick={() => setShowSearchOnMobile(!showSearchOnMobile)}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <i className="fas fa-search text-xl"></i>
            </motion.button>
          </div>

          {/* Cart Section */}
          <Link to="/cart" className="relative">
            <motion.div
              className="relative flex items-center bg-orange-50 text-orange-600 p-3 rounded-full shadow-sm"
              whileHover={{ scale: 1.1, backgroundColor: '#fff7ed' }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="ml-2 hidden md:inline font-semibold">Giỏ hàng</span>
            </motion.div>
          </Link>
        </div>
      </header>
      
      {/* Mobile search bar - shown conditionally */}
      <AnimatePresence>
        {showSearchOnMobile && (
          <motion.div 
            className="md:hidden p-4 bg-gray-50 border-t border-gray-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full">
              <input
                className="w-full border border-gray-200 rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none shadow-sm"
                placeholder="Tìm kiếm sản phẩm..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-600">
                <i className="fas fa-search text-lg"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;