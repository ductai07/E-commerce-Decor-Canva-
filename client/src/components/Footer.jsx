import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      className="bg-gray-100 pt-10 pb-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold mb-4">DucTai-Decor</h3>
          <p className="text-gray-600 mb-4">Mang nghệ thuật vào không gian sống của bạn với những tác phẩm tranh canvas chất lượng cao.</p>
          <div className="flex space-x-3">
            <motion.a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="text-blue-600"
            >
              <i className="fab fa-facebook-f"></i>
            </motion.a>
            <motion.a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="text-pink-600"
            >
              <i className="fab fa-instagram"></i>
            </motion.a>
            <motion.a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="text-red-600"
            >
              <i className="fab fa-youtube"></i>
            </motion.a>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold mb-4">Thông Tin</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-gray-600 hover:text-orange-500 transition">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/policies" className="text-gray-600 hover:text-orange-500 transition">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-gray-600 hover:text-orange-500 transition">
                Điều khoản dịch vụ
              </Link>
            </li>
          </ul>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold mb-4">Hỗ Trợ</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-orange-500 transition">
                Liên hệ
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-gray-600 hover:text-orange-500 transition">
                Câu hỏi thường gặp
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="text-gray-600 hover:text-orange-500 transition">
                Chính sách vận chuyển
              </Link>
            </li>
          </ul>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold mb-4">Liên Hệ</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <i className="fas fa-map-marker-alt mt-1 mr-2 text-orange-500"></i>
              <span className="text-gray-600">123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-phone-alt mr-2 text-orange-500"></i>
              <span className="text-gray-600">0123 456 789</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-envelope mr-2 text-orange-500"></i>
              <span className="text-gray-600">info@ductaidecor.com</span>
            </li>
          </ul>
        </motion.div>
      </div>
      
      <div className="flex justify-center space-x-4 my-8">
        <motion.i 
          className="fas fa-star text-yellow-500 text-2xl"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.5 }}
        ></motion.i>
        <motion.i 
          className="fas fa-star text-yellow-500 text-2xl"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.5 }}
        ></motion.i>
        <motion.i 
          className="fas fa-star text-yellow-500 text-2xl"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.5 }}
        ></motion.i>
      </div>
      
      <div className="text-center pt-6 border-t border-gray-300">
        <p className="text-gray-500">© {new Date().getFullYear()} DucTai-Decor. Tất cả quyền được bảo lưu.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;