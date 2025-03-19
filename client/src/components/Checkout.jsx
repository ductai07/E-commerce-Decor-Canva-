import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { createOrder } from '../api/orderApi';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: user?.firstname ? `${user.firstname} ${user.lastname || ''}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    district: '',
    ward: '',
    paymentMethod: 'cod'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      toast.info('Giỏ hàng của bạn đang trống');
    }
  }, [cartItems, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.city.trim()) newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
    if (!formData.district.trim()) newErrors.district = 'Vui lòng chọn quận/huyện';
    if (!formData.ward.trim()) newErrors.ward = 'Vui lòng chọn phường/xã';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id || item._id,
          name: item.title || item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || (item.images && item.images[0])
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          ward: formData.ward
        },
        paymentMethod: formData.paymentMethod,
        subtotal: cartTotal,
        shipping: 0, // Free shipping for now
        discount: 0, // No discount for now
        total: cartTotal
      };
      
      // Create order
      const response = await createOrder(orderData);
      
      if (response.success) {
        toast.success('Đặt hàng thành công!');
        clearCart();
        navigate('/orders');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi đặt hàng');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Thanh Toán</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form thanh toán */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Thông tin giao hàng</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Nhập email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Số nhà, tên đường"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Chọn Tỉnh/TP</option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">TP. Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Chọn Quận/Huyện</option>
                  <option value="quan1">Quận 1</option>
                  <option value="quan2">Quận 2</option>
                  <option value="quan3">Quận 3</option>
                </select>
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.ward ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Chọn Phường/Xã</option>
                  <option value="phuong1">Phường 1</option>
                  <option value="phuong2">Phường 2</option>
                  <option value="phuong3">Phường 3</option>
                </select>
                {errors.ward && <p className="text-red-500 text-xs mt-1">{errors.ward}</p>}
              </div>
            </div>
            
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Phương thức thanh toán</h2>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500"
                />
                <div className="ml-3">
                  <span className="block font-medium">Thanh toán khi nhận hàng (COD)</span>
                  <span className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</span>
                </div>
              </label>
              
              <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === 'bank'}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500"
                />
                <div className="ml-3">
                  <span className="block font-medium">Chuyển khoản ngân hàng</span>
                  <span className="text-sm text-gray-500">Thông tin tài khoản sẽ được gửi qua email</span>
                </div>
              </label>
              
              <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={formData.paymentMethod === 'momo'}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500"
                />
                <div className="ml-3">
                  <span className="block font-medium">Ví điện tử MoMo</span>
                  <span className="text-sm text-gray-500">Thanh toán qua ví MoMo</span>
                </div>
              </label>
            </div>
            
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                'Đặt hàng'
              )}
            </motion.button>
          </form>
        </div>
        
        {/* Đơn hàng tóm tắt */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Đơn hàng của bạn</h2>
            
            <div className="mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex py-3 border-b">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-500 text-sm">{item.quantity} x {item.price.toLocaleString()}₫</span>
                      <span className="font-medium">{(item.price * item.quantity).toLocaleString()}₫</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="text-gray-800 font-medium">{cartTotal.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-gray-800 font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100 mt-2">
                <span className="text-gray-800 font-bold">Tổng cộng</span>
                <span className="text-orange-600 font-bold text-xl">{cartTotal.toLocaleString()}₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;