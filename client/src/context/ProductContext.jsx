import { createContext, useState, useEffect } from 'react';
import { getProducts, getProduct } from '../api/api';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    sort: 'default'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts(filters);
      
      if (response.success && response.productDatas) {
        setProducts(response.productDatas);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
      
      return response;
    } catch (error) {
      setError(error.message || 'An error occurred');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetail = async (productId) => {
    if (!productId) {
      setError('Product ID is required');
      return { success: false, message: 'Product ID is required' };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProduct(productId);
      
      if (response.success && response.productData) {
        setCurrentProduct(response.productData);
      } else {
        // Fallback: check if the product is in the local products array
        const product = products.find(p => p._id === productId);
        if (product) {
          setCurrentProduct(product);
          return { success: true, productData: product };
        } else {
          setError(response.message || 'Product not found');
        }
      }
      
      return response;
    } catch (error) {
      setError(error.message || 'An error occurred');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        currentProduct,
        filters,
        fetchProducts,
        fetchProductDetail,
        updateFilters
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}; 