import { useContext } from 'react';
import { UserContext } from '../context/UserContext.jsx';

/**
 * Custom hook to access and manage authentication state
 * @returns {Object} authentication context values including user, token, and auth functions
 */
export const useAuth = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useAuth must be used within a UserContext.Provider');
  }
  
  return context;
}; 