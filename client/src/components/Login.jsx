import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { login, register } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      if (isLogin) {
        // Handle login
        const response = await login({ email, password });
        console.log('Login response in component:', response);
        
        if (response.success && (response.accessToken || response.token)) {
          // Lưu token vào context
          const tokenToUse = response.accessToken || response.token;
          setToken(tokenToUse);
          
          // Lưu thông tin user vào context
          const userToUse = response.user || response.userData;
          if (userToUse) {
            setUser(userToUse);
          }
          
          toast.success('Đăng nhập thành công!');
          navigate('/');
        } else {
          const errorMsg = response.message || 'Đăng nhập không thành công. Vui lòng kiểm tra email và mật khẩu.';
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        // Handle registration
        if (!email || !password || !firstname || !lastname) {
          setError('Vui lòng điền đầy đủ thông tin.');
          toast.error('Vui lòng điền đầy đủ thông tin');
          return;
        }
        
        const response = await register({ email, password, firstname, lastname });
        console.log('Register response:', response);
        
        if (response.success) {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
          setIsLogin(true);
          setError('');
          // Clear registration fields
          setFirstname('');
          setLastname('');
          setPassword('');
        } else {
          setError(response.message || 'Đăng ký không thành công.');
          toast.error(response.message || 'Đăng ký không thành công');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </h2>
          <p className="text-sm text-gray-600">
            {isLogin 
              ? 'Đăng nhập để tiếp tục mua sắm' 
              : 'Tạo tài khoản để trải nghiệm dịch vụ'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.form 
            key={isLogin ? 'login' : 'register'}
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {!isLogin && (
              <>
                <motion.div variants={inputVariants}>
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                    Tên
                  </label>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Nhập tên của bạn"
                  />
                </motion.div>

                <motion.div variants={inputVariants}>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Nhập họ của bạn"
                  />
                </motion.div>
              </>
            )}

            <motion.div variants={inputVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Nhập địa chỉ email"
              />
            </motion.div>

            <motion.div variants={inputVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder={isLogin ? "Nhập mật khẩu" : "Tạo mật khẩu mới"}
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            {isLogin && (
              <div className="text-sm text-right">
                <Link to="/forgot-password" className="font-medium text-orange-600 hover:text-orange-500">
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                isLogin ? 'Đăng Nhập' : 'Đăng Ký'
              )}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        <div className="mt-6 text-center">
          <motion.button
            type="button"
            onClick={handleToggle}
            className="font-medium text-orange-600 hover:text-orange-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin 
              ? 'Chưa có tài khoản? Đăng ký ngay' 
              : 'Đã có tài khoản? Đăng nhập'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;