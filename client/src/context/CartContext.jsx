import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Lấy giỏ hàng từ localStorage khi component mount
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    // Cập nhật localStorage và tính toán lại tổng khi cartItems thay đổi
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Tính toán số lượng và tổng tiền
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(itemCount);
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
    
    // Kích hoạt sự kiện storage để các components khác có thể lắng nghe
    window.dispatchEvent(new Event('storage'));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    
    setCartItems(prevItems => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = prevItems.findIndex(item => item.id === product._id);
      
      if (existingItemIndex >= 0) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        
        // Hiển thị thông báo
        toast.success(`Đã cập nhật ${product.name || product.title} trong giỏ hàng!`);
        
        return updatedItems;
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        // Hiển thị thông báo
        toast.success(`Đã thêm ${product.name || product.title} vào giỏ hàng!`);
        
        return [...prevItems, {
          id: product._id,
          title: product.name || product.title,
          price: product.price,
          image: product.image || (product.images && product.images[0]),
          quantity,
          stock: product.quantity || 0
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.info(`Đã xóa ${itemToRemove.title} khỏi giỏ hàng`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 