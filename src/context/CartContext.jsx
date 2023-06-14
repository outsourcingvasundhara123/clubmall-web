import React, {useRef, createContext, useState } from 'react';
import { WISHLIST } from '../helper/endpoints';
import { getServerURL } from '../helper/envConfig';
import api from '../helper/api';
import { Is_Login } from '../helper/IsLogin'
import { errorResponse , afterLogin } from '../helper/constants';

// Create the cart context
export const CartContext = createContext();

// Create a provider component to wrap your app
export const CartProvider = ({ children }) => {
  const isLoggedIn = Is_Login();
  const [cart, setCart] = useState(0);
  const [Mymessage, setMyMessage] = useState("");
  const [wishlist, setWishList] = useState([]);
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const [wishProductUrl, setWishProductURL] = useState("");

  const [loading, setLoading] = useState(true);
  const serverURL = getServerURL();
  const player = useRef();

  const startAnimation = () => {
    if (player.current) {
        player.current.play(); // Check if player.current is not null before accessing play()
    }
};
const stopAnimation = () => {
    setLoading(false);
};

  const addWishList = async (id, action) => {
console.log(isLoggedIn,"isLoggedIn");
    try {
      if (isLoggedIn) {
        var data = {
          action: action,
          product_id: id
        }
        
        const res = await api.postWithToken(`${serverURL + WISHLIST}`, data)
        
        if (res.data.success == true) {
          console.log(res.data,"res.data");
          setMyMessage(res.data.message);
          setSucessSnackBarOpen(!sucessSnackBarOpen);
          getCartData()
        } else {
          setMyMessage(res.data.message);
          setWarningSnackBarOpen(!warningSnackBarOpen);
        }
      } else {
        // User is not logged in, redirect to the login page
        afterLogin(setMyMessage);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
    } catch (error) {
      console.log(error);
      errorResponse(error, setMyMessage);
    }
  };


  const getCartData = async () => {
    startAnimation()
    try {
      // if (isLoggedIn) {
        const res = await api.postWithToken(`${serverURL + WISHLIST}`, { "action": "my-wishlist-list" })
        setWishList(res.data.data.list)
        setWishProductURL(res.data.data.productImagePath)
        stopAnimation()
      // } else {
      //   // User is not logged in, redirect to the login page
      //   afterLogin(setMyMessage);
      //   setWarningSnackBarOpen(!warningSnackBarOpen);
      // }
    } catch (error) {
        errorResponse(error, setMyMessage);
        setWarningSnackBarOpen(!warningSnackBarOpen);
    }
};


  return (

    <CartContext.Provider value={{
      cart, setCart, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage,
      setSucessSnackBarOpen, setWarningSnackBarOpen , getCartData , wishlist
    }}>
      {children}
    </CartContext.Provider>

  );
};