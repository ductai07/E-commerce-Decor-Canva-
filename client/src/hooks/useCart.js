import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

/**
 * Custom hook để truy cập và quản lý giỏ hàng
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}; 