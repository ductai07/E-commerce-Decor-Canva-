import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

const Cart = () => {
  const { cartItems, cartTotal, updateCartItemQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để tiếp tục thanh toán');
      navigate('/login', { state: { redirectTo: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <i className="fas fa-shopping-cart text-gray-300 text-7xl mb-4"></i>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-500 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiến hành mua sắm</p>
          <Link to="/products" className="btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center md:text-left">Giỏ hàng của bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 p-4 text-sm font-medium text-gray-600">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-center">Thành tiền</div>
            </div>

            {cartItems.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center"
              >
                {/* Product info */}
                <div className="md:col-span-6 flex items-center space-x-4">
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} className="text-gray-800 font-medium hover:text-orange-500 truncate block">
                      {item.title}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-gray-500 hover:text-red-500 flex items-center mt-2"
                    >
                      <i className="fas fa-trash-alt mr-1"></i> Xóa
                    </button>
                  </div>
                </div>
                
                {/* Price */}
                <div className="md:col-span-2 text-center">
                  <span className="md:hidden inline-block mr-2 font-medium">Đơn giá:</span>
                  <span className="text-gray-800">{item.price.toLocaleString()} ₫</span>
                </div>
                
                {/* Quantity */}
                <div className="md:col-span-2 flex items-center justify-center">
                  <div className="flex border border-gray-200 rounded w-24">
                    <button
                      onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l"
                    >
                      <i className="fas fa-minus text-xs"></i>
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => updateCartItemQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-full h-8 text-center text-gray-700 border-x border-gray-200 focus:outline-none"
                    />
                    <button
                      onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r"
                    >
                      <i className="fas fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                
                {/* Subtotal */}
                <div className="md:col-span-2 text-center font-medium">
                  <span className="md:hidden inline-block mr-2 font-medium">Thành tiền:</span>
                  <span className="text-orange-600">{(item.price * item.quantity).toLocaleString()} ₫</span>
                </div>
              </motion.div>
            ))}
            
            {/* Cart actions */}
            <div className="p-4 flex justify-between">
              <Link to="/products" className="text-orange-500 hover:underline flex items-center">
                <i className="fas fa-arrow-left mr-2"></i>
                Tiếp tục mua sắm
              </Link>
              <button
                onClick={clearCart}
                className="text-gray-500 hover:text-red-500 flex items-center"
              >
                <i className="fas fa-trash mr-2"></i>
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-100">Thông tin đơn hàng</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="text-gray-800 font-medium">{cartTotal.toLocaleString()} ₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giảm giá</span>
                <span className="text-gray-800 font-medium">0 ₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-gray-800 font-medium">Miễn phí</span>
              </div>
            </div>
            
            <div className="flex justify-between border-t border-gray-100 pt-4 mb-6">
              <span className="text-gray-800 font-bold">Tổng cộng</span>
              <span className="text-orange-600 font-bold text-xl">{cartTotal.toLocaleString()} ₫</span>
            </div>
            
            <div className="space-y-3">
              <motion.button
                onClick={handleCheckout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition duration-200 flex items-center justify-center"
              >
                <i className="fas fa-credit-card mr-2"></i>
                Thanh toán ngay
              </motion.button>
              
              <div className="text-sm text-gray-500 text-center mt-4">
                <p>Chúng tôi chấp nhận các phương thức thanh toán:</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <i className="fab fa-cc-visa text-gray-400 text-xl"></i>
                  <i className="fab fa-cc-mastercard text-gray-400 text-xl"></i>
                  <i className="fab fa-cc-paypal text-gray-400 text-xl"></i>
                  <i className="fas fa-money-bill-wave text-gray-400 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 