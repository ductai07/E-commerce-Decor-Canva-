import { apiRequest } from './api';

// Create a new order
export const createOrder = async (orderData) => {
  return apiRequest('/order', 'POST', orderData);
};

// Get all orders for the current user
export const getUserOrders = async () => {
  try {
    const response = await apiRequest('/order/user');
    return response;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    // Return sample data for development if API fails
    return {
      success: true,
      orders: [
        {
          _id: 'DH123456',
          orderNumber: 'DH123456',
          createdAt: '2023-10-15',
          status: 'delivered',
          total: 1250000,
          items: [
            { name: 'Tranh Canvas Hoa Hướng Dương', quantity: 1, price: 650000, image: 'https://storage.googleapis.com/a1aa/image/o4GLdu34B3IKqKrCAzne0sJY_wIpRLyjcIfCM83VWmY.jpg' },
            { name: 'Tranh Canvas Phong Cảnh Biển', quantity: 1, price: 600000, image: 'https://storage.googleapis.com/a1aa/image/cutLM2wo50jO3xrlJjek5MLM216aK1vHDyECk1kKUqQ.jpg' }
          ],
          paymentMethod: 'cod'
        },
        {
          _id: 'DH123455',
          orderNumber: 'DH123455',
          createdAt: '2023-10-10',
          status: 'delivered',
          total: 850000,
          items: [
            { name: 'Tranh Canvas Trừu Tượng', quantity: 1, price: 850000, image: 'https://storage.googleapis.com/a1aa/image/LNYJJP6BzXBpRg5bV8jca5sdve35J3hAJ2IEdzYlt_4.jpg' }
          ],
          paymentMethod: 'bank'
        },
        {
          _id: 'DH123457',
          orderNumber: 'DH123457',
          createdAt: '2023-10-20',
          status: 'processing',
          total: 750000,
          items: [
            { name: 'Tranh Canvas Cafe Sáng', quantity: 1, price: 750000, image: 'https://storage.googleapis.com/a1aa/image/cutLM2wo50jO3xrlJjek5MLM216aK1vHDyECk1kKUqQ.jpg' }
          ],
          paymentMethod: 'momo'
        }
      ]
    };
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await apiRequest(`/order/${orderId}`);
    return response;
  } catch (error) {
    console.error('Error fetching order details:', error);
    // Return sample data for development if API fails
    if (orderId === 'DH123456') {
      return {
        success: true,
        order: {
          _id: 'DH123456',
          orderNumber: 'DH123456',
          createdAt: '2023-10-15',
          status: 'delivered',
          total: 1250000,
          subtotal: 1250000,
          shipping: 0,
          discount: 0,
          items: [
            { _id: '1', name: 'Tranh Canvas Hoa Hướng Dương', quantity: 1, price: 650000, image: 'https://storage.googleapis.com/a1aa/image/o4GLdu34B3IKqKrCAzne0sJY_wIpRLyjcIfCM83VWmY.jpg' },
            { _id: '2', name: 'Tranh Canvas Phong Cảnh Biển', quantity: 1, price: 600000, image: 'https://storage.googleapis.com/a1aa/image/cutLM2wo50jO3xrlJjek5MLM216aK1vHDyECk1kKUqQ.jpg' }
          ],
          paymentMethod: 'cod',
          paymentStatus: 'paid',
          shippingAddress: {
            fullName: 'Nguyễn Văn A',
            phone: '0987654321',
            address: '123 Đường Lê Lợi, Phường Bến Nghé',
            district: 'Quận 1',
            city: 'TP. Hồ Chí Minh'
          },
          timeline: [
            { status: 'pending', date: '2023-10-15T08:30:00', message: 'Đơn hàng đã được tạo' },
            { status: 'processing', date: '2023-10-15T09:15:00', message: 'Đơn hàng đang được xử lý' },
            { status: 'shipping', date: '2023-10-16T10:00:00', message: 'Đơn hàng đang được giao' },
            { status: 'delivered', date: '2023-10-17T14:30:00', message: 'Đơn hàng đã được giao thành công' }
          ]
        }
      };
    } else {
      return { success: false, message: 'Order not found' };
    }
  }
};

// Cancel an order
export const cancelOrder = async (orderId, reason) => {
  return apiRequest(`/order/${orderId}/cancel`, 'PUT', { reason });
};

// Admin: Get all orders
export const getAllOrders = async () => {
  return apiRequest('/order');
};

// Admin: Update order status
export const updateOrderStatus = async (orderId, status, message) => {
  return apiRequest(`/order/${orderId}/status`, 'PUT', { status, message });
};

// Admin: Update payment status
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  return apiRequest(`/order/${orderId}/payment`, 'PUT', { paymentStatus });
};