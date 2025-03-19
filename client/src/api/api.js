const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(url, method = 'GET', data = null, token = localStorage.getItem('token')) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    console.log(`[API Request] ${method} ${url}`, {
      url: `${API_URL}${url}`,
      options
    });
    console.log(options)
    const response = await fetch(`${API_URL}${url}`, options);
    console.log(`[API Response] Status: ${response.status} for ${url}`);

    let responseData;
    try {
      responseData = await response.json();
      console.log(`[API Data] ${url}:`, responseData);
    } catch (error) {
      console.error(`[API Error] Failed to parse JSON for ${url}:`, error);
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`[API Error] ${url}:`, error);
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi kết nối với máy chủ'
    };
  }
}

// Authentication endpoints
export const register = async (userData) => {
  try {
    const response = await apiRequest('/user/register', 'POST', userData);
    if (response.success && response.accessToken) {
      localStorage.setItem('token', response.accessToken);
    }
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, message: error.message };
  }
};

export const login = async (credentials) => {
  try {
    console.log('Sending login request with credentials:', { email: credentials.email, password: '***' });
    const response = await apiRequest('/user/login', 'POST', credentials);
    console.log('Raw login response:', response);
    
    if (response.success && response.accessToken) {
      localStorage.setItem('token', response.accessToken);
      console.log('Token saved to localStorage');
      
      // Kiểm tra cấu trúc userData
      if (!response.userData) {
        console.warn('userData missing from response, attempting to use accessToken');
        // Nếu không có userData trong response, thử lấy thông tin user hiện tại
        try {
          const userData = await getCurrentUser();
          if (userData.success && userData.user) {
            response.userData = userData.user;
            console.log('Retrieved user data:', userData.user);
          }
        } catch (err) {
          console.error('Failed to get current user after login:', err);
        }
      }
    }
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    return await apiRequest('/user/current', 'GET');
  } catch (error) {
    console.error('Get current user error:', error);
    return { success: false, message: error.message };
  }
};

export const logout = async () => {
  try {
    const response = await apiRequest('/user/logout', 'GET');
    localStorage.removeItem('token');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem('token');
    return { success: false, message: error.message };
  }
};

// Phần còn lại giữ nguyên
export const forgotPassword = async (email) => apiRequest('/user/forgotpassword', 'POST', { email });
export const resetPassword = async (data) => apiRequest('/user/resetpassword', 'PUT', data);

// Admin endpoints
export const getUsers = async () => apiRequest('/user', 'GET');
export const deleteUser = async (userId) => apiRequest(`/user/${userId}`, 'DELETE');
export const updateUser = async (userData) => apiRequest('/user/current', 'PUT', userData);
export const updateUserByAdmin = async (userId, userData) => apiRequest(`/user/${userId}`, 'PUT', userData);

// Product endpoints
export const getProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `/product?${queryString}` : '/product';
    
    return await apiRequest(url);
  } catch (error) {
    console.error('Error fetching products:', error);
    // If API fails, provide sample data for development
    return {
      success: true,
      productDatas: [
        {
          _id: '1',
          title: 'Tranh Canvas Cafe Sáng',
          price: 750000,
          images: ["https://storage.googleapis.com/a1aa/image/cutLM2wo50jO3xrlJjek5MLM216aK1vHDyECk1kKUqQ.jpg"],
          description: 'Tranh canvas phong cách cà phê sáng, tạo không gian ấm cúng',
          category: { _id: '1', name: 'Tranh Canvas Phong Cảnh' }
        },
        {
          _id: '2',
          title: 'Tranh Canvas Trừu Tượng',
          price: 850000,
          images: ["https://storage.googleapis.com/a1aa/image/LNYJJP6BzXBpRg5bV8jca5sdve35J3hAJ2IEdzYlt_4.jpg"],
          description: 'Tranh canvas phong cách trừu tượng hiện đại',
          category: { _id: '2', name: 'Tranh Canvas Trừu Tượng' }
        },
        {
          _id: '3',
          title: 'Tranh Canvas Hoa Hướng Dương',
          price: 650000,
          images: ["https://storage.googleapis.com/a1aa/image/o4GLdu34B3IKqKrCAzne0sJY_wIpRLyjcIfCM83VWmY.jpg"],
          description: 'Tranh canvas hoa hướng dương rực rỡ',
          category: { _id: '3', name: 'Tranh Canvas Hoa' }
        }
      ]
    };
  }
};

// Category endpoints
export const getCategories = async () => {
  try {
    return await apiRequest('/category');
  } catch (error) {
    console.error('Error fetching categories:', error);
    // If API fails, provide sample data for development
    return {
      success: true,
      categories: [
        { _id: '1', name: 'Tranh Canvas Phong Cảnh' },
        { _id: '2', name: 'Tranh Canvas Trừu Tượng' },
        { _id: '3', name: 'Tranh Canvas Hoa' },
        { _id: '4', name: 'Tranh Canvas Chữ' },
        { _id: '5', name: 'Tranh Canvas Động Vật' },
        { _id: '6', name: 'Tranh Canvas Sơn Dầu' },
        { _id: '7', name: 'Tranh Canvas Trang Trí' }
      ]
    };
  }
};

export const getProduct = async (productId) => {
  return apiRequest(`/product/${productId}`);
};

// Admin endpoints (Protected)
export const createProduct = async (productData, token) => {
  return apiRequest('/product', 'POST', productData, token);
};

export const updateProduct = async (productId, productData, token) => {
  return apiRequest(`/product/${productId}`, 'PUT', productData, token);
};

export const deleteProduct = async (productId, token) => {
  return apiRequest(`/product/${productId}`, 'DELETE', null, token);
};

export default {
  register,
  login,
  getCurrentUser,
  logout,
  forgotPassword,
  resetPassword,
  getProducts,
  getCategories,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  updateUser,
  deleteUser
};