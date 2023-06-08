import React, { createContext, useState } from 'react';

// Create the cart context
export const CartContext = createContext();

// Create a provider component to wrap your app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(0);

  // Function to update the cart
  const updateCart = (newCart) => {
    setCart(newCart);
  };

  // Count the length of the cart
  const cartLength = cart.length;

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};