import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext';

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider 
    clientId={
      // "74880688768-lm2n06hnfi5jfdef9hjfl2hblilnf91s.apps.googleusercontent.com"
      process.env.REACT_APP_CLIEN_ID
    }>
      <CartProvider>
        <App />
      </CartProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();