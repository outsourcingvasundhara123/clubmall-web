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
      // "402818709804-jko21qbevepmsnhqd8ev5dnk3rr7ucvr.apps.googleusercontent.com"
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