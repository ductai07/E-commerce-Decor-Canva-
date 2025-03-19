import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'TRANG CHỦ', path: '/' },
    { name: 'GIỚI THIỆU', path: '/about' },
    { name: 'TRANH CANVAS', path: '/canvas' },
    { name: 'TRANH TRANG TRÍ', path: '/decoration' },
    { name: 'TRANH TREO TƯỜNG', path: '/wall-art' },
    { name: 'TRANH THEO CHỦ ĐỀ', path: '/themes' },
    { name: 'TRANH VĂN PHÒNG', path: '/office' },
    { name: 'TRANH DÁN TƯỜNG', path: '/wallpaper' },
    { name: 'LIÊN HỆ', path: '/contact' },
  ];

  // Set active item based on current path 
  useEffect(() => {
    const currentPath = location.pathname;
    const current = navItems.find(item => item.path === currentPath);
    
    if (current) {
      setActiveItem(current.name);
    } else if (currentPath === '/') {
      setActiveItem('TRANG CHỦ');
    } else {
      setActiveItem(null);
    }
  }, [location.pathname]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-gray-800 text-white top-0 z-40 shadow-md">
        <div className="container mx-auto px-1">
          {/* Mobile Menu Button */}
          <div className="flex items-center justify-between md:hidden py-2">
            <Link to="/" className="text-white font-bold text-lg">
              DucTai-Decor
            </Link>
            <motion.button
              className="text-white focus:outline-none p-1 rounded-full hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                )}
              </svg>
            </motion.button>
          </div>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex md:items-center md:justify-center md:space-x-4 py-1 font-bold">
            {navItems.map((item) => (
              <li key={item.name} className="relative px-1">
                <motion.div
                  whileHover={{ y: -1, scale: 1.05, color: '#f97316' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link
                    to={item.path}
                    className={`block px-2 py-1 text-xs font-bold transition-colors duration-200 relative group ${
                      activeItem === item.name
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-white hover:text-orange-600'
                    }`}
                    onClick={() => setActiveItem(item.name)}
                  >
                    {item.name}
                    <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-orange-500 transition-all duration-200 ${
                      activeItem === item.name 
                        ? 'scale-x-100' 
                        : 'scale-x-0 group-hover:scale-x-75'
                    }`} />
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gray-800 overflow-hidden shadow-md"
            >
              <div className="px-4 py-2 space-y-1">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={item.path}
                      className={`block py-2 px-4 border-b border-gray-700 ${
                        activeItem === item.name
                          ? 'text-orange-500 font-bold'
                          : 'text-gray-200 hover:text-orange-500'
                      }`}
                      onClick={() => {
                        setActiveItem(item.name);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Subnav for categories on relevant pages */}
      {(activeItem === 'TRANH CANVAS' || activeItem === 'TRANH TRANG TRÍ') && (
        <div className="bg-gray-50 border-b border-gray-200 py-2 hidden md:block">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-6 text-sm text-gray-600 font-bold">
              <li>
                <Link to="#phong-canh" className="hover:text-orange-500 font-medium">Phong Cảnh</Link>
              </li>
              <li>
                <Link to="#truu-tuong" className="hover:text-orange-500 font-medium">Trừu Tượng</Link>
              </li>
              <li>
                <Link to="#chan-dung" className="hover:text-orange-500 font-medium">Chân Dung</Link>
              </li>
              <li>
                <Link to="#hoa" className="hover:text-orange-500 font-medium">Hoa & Thực Vật</Link>
              </li>
              <li>
                <Link to="#dong-vat" className="hover:text-orange-500 font-medium">Động Vật</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;