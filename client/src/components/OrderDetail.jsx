import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getOrderById, cancelOrder } from '../api/orderApi';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        const response = await getOrderById(id);
        
        if (response.success && response.order) {
          // Transform API response to match component's expected structure
          setOrder({
            id: response.order._id || response.order.orderNumber,
            date: response.order.createdAt,
            status: response.order.status,
            total: response.order.total,
            subtotal: response.order.subtotal,
            shipping: response.order.shipping,
            discount: response.order.discount,
            items: response.order.items,
            paymentMethod: response.order.paymentMethod,
            paymentStatus: response.order.paymentStatus,
            deliveryInfo: {
              name: response.order.shippingAddress.fullName,
              phone: response.order.shippingAddress.phone,
              address: response.order.shippingAddress.address,
              district: response.order.shippingAddress.district,
              city: response.order.shippingAddress.city
            },
            timeline: response.order.timeline
          });
        } else {
          // If order not found, navigate back to orders list
          navigate('/orders');
          return;
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id, navigate]);
  
  const handleCancelOrder = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      setCancelling(true);
      try {
        const response = await cancelOrder(id, 'Khách hàng yêu cầu hủy đơn');
        
        if (response.success) {
          // Update the local order state with the updated order
          setOrder(prev => ({
            ...prev,
            status: 'cancelled',
            timeline: [
              ...prev.timeline,
              {
                status: 'cancelled',
                date: new Date().toISOString(),
                message: 'Khách hàng yêu cầu hủy đơn'
              }
            ]
          }));
          
          toast.success('Đơn hàng đã được hủy thành công');
        } else {
          toast.error(response.message || 'Không thể hủy đơn hàng');
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error('Đã xảy ra lỗi khi hủy đơn hàng');
      } finally {
        setCancelling(false);
      }
    }
  };

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

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-4 text-gray-300">
            <i className="fas fa-exclamation-triangle text-5xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-600 mb-6">Đơn hàng bạn đang tìm kiếm không tồn tại</p>
          <Link to="/orders" className="btn-primary">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/orders" className="text-orange-500 hover:text-orange-600 flex items-center mr-4">
          <i className="fas fa-arrow-left mr-2"></i>
          Quay lại
        </Link>
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin đơn hàng */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Thông tin đơn hàng</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Mã đơn hàng:</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ngày đặt hàng:</p>
                  <p className="font-medium">{new Date(order.date).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phương thức thanh toán:</p>
                  <p className="font-medium">{getPaymentMethodText(order.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Trạng thái thanh toán:</p>
                  <p className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Sản phẩm đã mua</h2>
              
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-600">{item.quantity} x {item.price.toLocaleString()}₫</span>
                        <span className="font-medium">{(item.price * item.quantity).toLocaleString()}₫</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h2>
              <div className="text-sm">
                <p className="font-medium">{order.deliveryInfo.name}</p>
                <p>{order.deliveryInfo.phone}</p>
                <p>{order.deliveryInfo.address}</p>
                <p>{order.deliveryInfo.district}, {order.deliveryInfo.city}</p>
              </div>
            </div>
          </div>
          
          {/* Tiến trình đơn hàng */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
              
              <div className="relative">
                {/* Đường kẻ dọc kết nối các bước */}
                <div className="absolute left-3 top-4 bottom-0 w-0.5 bg-gray-200"></div>
                
                {order.timeline.map((step, index) => (
                  <div key={index} className="relative flex items-start mb-6 last:mb-0">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center z-10 ${
                      index === 0 ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {index === 0 ? (
                        <i className="fas fa-check text-white text-xs"></i>
                      ) : (
                        <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{getStatusText(step.status)}</p>
                      <p className="text-gray-600 text-sm">{step.message}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(step.date).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tóm tắt đơn hàng */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="text-gray-800 font-medium">{order.subtotal.toLocaleString()}₫</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="text-green-600 font-medium">-{order.discount.toLocaleString()}₫</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-gray-800 font-medium">
                  {order.shipping > 0 ? order.shipping.toLocaleString() + '₫' : 'Miễn phí'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                <span className="text-gray-800 font-semibold">Tổng cộng</span>
                <span className="text-orange-600 font-bold text-xl">{order.total.toLocaleString()}₫</span>
              </div>
            </div>
            
            {/* Actions */}
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <div className="mt-6">
                <button className="w-full py-2 bg-red-100 text-red-700 rounded-md font-medium hover:bg-red-200 transition mb-2">
                  Hủy đơn hàng
                </button>
              </div>
            )}
            
            <div className="mt-4">
              <button className="w-full py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition">
                Liên hệ hỗ trợ
              </button>
              
              {order.status === 'delivered' && (
                <button className="w-full py-2 mt-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition">
                  Mua lại
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;