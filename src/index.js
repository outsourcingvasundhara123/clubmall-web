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
      process.env.REACT_APP_CLIEN_ID
    }
    >
      <CartProvider>
        <App />
      </CartProvider>
   
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();