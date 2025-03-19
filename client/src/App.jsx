import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Nav from './components/Nav';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './components/Login';
import Cart from './components/Cart';
import Trends from './components/Trends';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import Account from './components/Account';
import Orders from './components/Orders';
import OrderDetail from './components/OrderDetail';
import ForgotPassword from './components/ForgotPassword';
import UserOrders from './components/UserOrders';

import { UserContext } from './context/UserContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { CategoryProvider } from './context/CategoryContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

import { getCurrentUser } from './api/api';
import { Link } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getCurrentUser(token)
        .then((data) => {
          if (data.success) {
            // Xử lý cả hai trường hợp dữ liệu trả về
            const userData = data.rs || data.user;
            if (userData) {
              setUser(userData);
            } else {
              console.error('User data not found in response:', data);
              localStorage.removeItem('token');
              setToken(null);
            }
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        })
        .catch((error) => {
          console.error('Error fetching current user:', error);
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      <CartProvider>
        <CategoryProvider>
          <ProductProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <Nav />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Main />
                        </motion.div>
                      } />
                      <Route path="/login" element={
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Login />
                        </motion.div>
                      } />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/cart" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Cart />
                        </motion.div>
                      } />
                      <Route path="/checkout" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Checkout />
                        </motion.div>
                      } />
                      <Route path="/account" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Account />
                        </motion.div>
                      } />
                      <Route path="/orders" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Orders />
                        </motion.div>
                      } />
                      <Route path="/order/:id" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <OrderDetail />
                        </motion.div>
                      } />
                      <Route path="/canvas" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Trends />
                        </motion.div>
                      } />
                      <Route path="/products" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Products />
                        </motion.div>
                      } />
                      <Route path="/trends" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Trends />
                        </motion.div>
                      } />
                      <Route path="/product/:id" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ProductDetail />
                        </motion.div>
                      } />
                      <Route path="/user-orders" element={
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <UserOrders />
                        </motion.div>
                      } />
                      <Route path="*" element={
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center justify-center py-20"
                        >
                          <h1 className="text-7xl font-bold gradient-text mb-4">404</h1>
                          <p className="text-xl text-gray-600 mb-8">Trang bạn tìm kiếm không tồn tại</p>
                          <Link to="/" className="btn-primary">
                            Quay về trang chủ
                          </Link>
                        </motion.div>
                      } />
                    </Routes>
                  </AnimatePresence>
                </main>
                <Footer />
                <ToastContainer 
                  position="bottom-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </div>
            </Router>
          </ProductProvider>
        </CategoryProvider>
      </CartProvider>
    </UserContext.Provider>
  );
}

export default App;