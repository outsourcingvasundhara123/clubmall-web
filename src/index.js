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
    clientId="402818709804-of0dbhqmjqeiddjejjpkvf1keu7v8556.apps.googleusercontent.com"
    >
      <CartProvider>
        <App />
      </CartProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();