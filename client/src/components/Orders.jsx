import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getUserOrders } from '../api/orderApi';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getUserOrders();
        if (response.success && response.orders) {
          setOrders(response.orders.map(order => ({
            id: order._id || order.orderNumber,
            date: order.createdAt,
            status: order.status,
            total: order.total,
            items: order.items,
            paymentMethod: order.paymentMethod
          })));
        } else {
          console.error('Failed to fetch orders:', response.message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng';
      case 'bank':
        return 'Chuyển khoản ngân hàng';
      case 'momo':
        return 'Ví MoMo';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
          <div className="mb-4 text-orange-500">
            <i className="fas fa-lock text-5xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
          <Link to="/login" className="btn-primary">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-4 text-gray-300">
            <i className="fas fa-shopping-bag text-5xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào. Hãy mua sắm để tạo đơn hàng!</p>
          <Link to="/products" className="btn-primary">
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="hidden md:grid md:grid-cols-12 bg-gray-50 p-4 text-sm font-medium text-gray-600">
          <div className="md:col-span-2">Mã đơn hàng</div>
          <div className="md:col-span-2">Ngày đặt</div>
          <div className="md:col-span-3">Sản phẩm</div>
          <div className="md:col-span-2">Tổng tiền</div>
          <div className="md:col-span-2">Trạng thái</div>
          <div className="md:col-span-1"></div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 hover:bg-gray-50 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
            >
              <div className="md:col-span-2">
                <span className="md:hidden font-medium text-gray-500 mr-2">Mã đơn hàng:</span>
                <span className="font-medium">{order.id}</span>
              </div>
              
              <div className="md:col-span-2">
                <span className="md:hidden font-medium text-gray-500 mr-2">Ngày đặt:</span>
                <span>{new Date(order.date).toLocaleDateString('vi-VN')}</span>
              </div>
              
              <div className="md:col-span-3">
                <span className="md:hidden font-medium text-gray-500 mr-2">Sản phẩm:</span>
                <div className="text-sm">
                  {order.items.map((item, index) => (
                    <div key={index} className="truncate">
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <span className="md:hidden font-medium text-gray-500 mr-2">Tổng tiền:</span>
                <span className="font-medium text-orange-600">{order.total.toLocaleString()}₫</span>
              </div>
              
              <div className="md:col-span-2">
                <span className="md:hidden font-medium text-gray-500 mr-2">Trạng thái:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="md:col-span-1 text-right">
                <Link 
                  to={`/order/${order.id}`}
                  className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                >
                  Chi tiết
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;