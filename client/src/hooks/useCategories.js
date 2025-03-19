import { useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext.jsx';

/**
 * Custom hook to manage and access category information
 * @returns {Object} category context values
 */
export function useCategories() {
  const context = useContext(CategoryContext);
  
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  
  return context;
} 