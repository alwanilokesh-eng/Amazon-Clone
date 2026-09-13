import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });
  const [shippingAddress, setShippingAddressState] = useState(() => {
    const stored = localStorage.getItem('shippingAddress');
    return stored ? JSON.parse(stored) : {};
  });
  const [paymentMethod, setPaymentMethodState] = useState(
    () => localStorage.getItem('paymentMethod') || 'Cash on Delivery'
  );

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((x) => x.product === item.product);
      if (exists) {
        return prev.map((x) => (x.product === item.product ? item : x));
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((x) => x.product !== productId));
  };

  const clearCart = () => setCartItems([]);

  const setShippingAddress = (address) => {
    setShippingAddressState(address);
    localStorage.setItem('shippingAddress', JSON.stringify(address));
  };

  const setPaymentMethod = (method) => {
    setPaymentMethodState(method);
    localStorage.setItem('paymentMethod', method);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        shippingAddress,
        setShippingAddress,
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
