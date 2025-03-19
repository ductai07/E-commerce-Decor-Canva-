import { useContext } from 'react';
import { ProductContext } from '../context/ProductContext.jsx';

/**
 * Custom hook để truy cập và quản lý thông tin sản phẩm
 */
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  
  return context;
}; 