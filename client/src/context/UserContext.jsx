import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          console.log('Found token, checking if valid...');
          const response = await getCurrentUser();
          console.log('Current user response:', response);
          
          if (response.success && response.user) {
            setUser(response.user);
            setIsLoggedIn(true);
            console.log('User authenticated:', response.user);
          } else {
            // Token is invalid
            console.log('Token invalid or expired, logging out');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          localStorage.removeItem('token');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;