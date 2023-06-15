import React, {useRef, createContext, useState } from 'react';
import { WISHLIST,PRODUCTCATEGORY, PRODUCTList } from '../helper/endpoints';
import { getServerURL } from '../helper/envConfig';
import api from '../helper/api';
import { Is_Login } from '../helper/IsLogin'
import { errorResponse , afterLogin } from '../helper/constants';
import { useNavigate } from 'react-router-dom'

// Create the cart context
export const CartContext = createContext();

// Create a provider component to wrap your app
export const CartProvider = ({ children }) => {
  const isLoggedIn = Is_Login();
  const [cart, setCart] = useState(0);
  
  const [wishlistCount, setWishlistCount] = useState(0);

  const [Mymessage, setMyMessage] = useState("");
  const [wishlist, setWishList] = useState([]);
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const [wishProductUrl, setWishProductURL] = useState("");

  const [category, setcategory] = useState([]);
  const [currentUser, setCorrectUser] = useState("");
  const [productList, setProductList] = useState([]);
  const [trendingProductList, setTrendingProductList] = useState([]);

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
    try {
      startAnimation()
      if (isLoggedIn) {
        var data = {
          action: action,
          product_id: id
        }
        const res = await api.postWithToken(`${serverURL + WISHLIST}`, data)
        if (res.data.success == true) {
          setMyMessage(res.data.message);
          setSucessSnackBarOpen(!sucessSnackBarOpen);
          getWishList()
          getProducts()
        } else {
          setMyMessage(res.data.message);
          setWarningSnackBarOpen(!warningSnackBarOpen);
        }
      } else {
        // User is not logged in, redirect to the login page
        afterLogin(setMyMessage);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
      stopAnimation()
    } catch (error) {
      console.log(error);
      errorResponse(error, setMyMessage);
    }
  };

  const getWishList = async () => {
    startAnimation()
    try {
      // if (isLoggedIn) {
        const res = await api.postWithToken(`${serverURL + WISHLIST}`, { "action": "my-wishlist-list" })
        setWishList(res.data.data.list)
        setWishlistCount(res.data.data.list.length)
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

const getProducts = async () => {

  try {
      startAnimation()
      const apiTyp = isLoggedIn ? api.postWithToken : api.post;
      const [categoryResponse, trendingproductListResponse, productListResponse] = await Promise.all([
          api.post(`${serverURL + PRODUCTCATEGORY}`),
          apiTyp(`${serverURL + PRODUCTList}`, { "product_list_type": "trending-product" }),
          api.post(`${serverURL + PRODUCTList}`, { "product_list_type": "flashsale-products" })
      ]);

      const categoryData = categoryResponse.data.data;
      const productListData = productListResponse.data.data;
      const trendingproductData = trendingproductListResponse.data.data

      setcategory(categoryData);
      setProductList(productListData);
      setTrendingProductList(trendingproductData)

      stopAnimation()
  } catch (error) {
      console.log(error);
  }
};

  return (

    <CartContext.Provider value={{
      cart,setCart, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage,
      setSucessSnackBarOpen,setWarningSnackBarOpen , getWishList , wishlist , getProducts,wishProductUrl,category,currentUser,
      productList,trendingProductList,loading,setLoading,wishlistCount
    }}>
      {children}
    </CartContext.Provider>

  );
};