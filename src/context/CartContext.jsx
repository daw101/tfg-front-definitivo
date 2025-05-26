import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((items) => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...items, { ...product, quantity: 1 }];
      }
    });
  };
function clearCart() {
  setCartItems([]);
}

  const removeFromCart = (id) => {
    setCartItems((items) => items.filter(i => i.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((items) => {
      if (quantity <= 0) {
        return items.filter(i => i.id !== id);
      }
      return items.map(i =>
        i.id === id
          ? { ...i, quantity }
          : i
      );
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
