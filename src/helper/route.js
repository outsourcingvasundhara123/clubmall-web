// Route-related imports
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Component imports
import React, { lazy } from 'react';
import DeleteAccount from '../page/DeleteAccount';
import PaymentUnsuccessful from '../page/PaymentUnsuccessful';

const Selling = lazy(() => import('../page/Selling'));
const Trending = lazy(() => import('../page/Trending'));
const Categories = lazy(() => import('../page/Categories'));
const ProductInfo = lazy(() => import('../page/ProductInfo'));
const Profile = lazy(() => import('../page/Profile'));
const Fashion = lazy(() => import('../page/Fashion'));
const Home = lazy(() => import('../page/Home'));
const LogIn = lazy(() => import('../page/loginpage/LogIn'));
const Register = lazy(() => import('../page/registerpage/Register'));
const Wishlist = lazy(() => import('../page/Wishlist'));
const About = lazy(() => import('../page/About'));
const Policy = lazy(() => import('../page/Policy'));
const TermsUse = lazy(() => import('../page/TermsUse'));
const Influencer = lazy(() => import('../page/Influencer'));
const Search = lazy(() => import('../page/Search'));
const ContactUs = lazy(() => import('../page/ContactUs'));
const ReturnPolicy = lazy(() => import('../page/ReturnPolicy'));
const ShippingInfo = lazy(() => import('../page/ShippingInfo'));
const ThankYou = lazy(() => import('../page/ThankYou'));
const Cart = lazy(() => import('../page/Cart'));
const ForYou = lazy(() => import('../page/ForYou'));


export default [

  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/delete-account",
    element: <DeleteAccount />,
  },
  {
    path: "/selling",
    element: <Selling />,
  },
  {
    path: "/trending",
    element: <Trending />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/product-info/:id",
    element: <ProductInfo />,
  },
  {
    path: "/product-info",
    element: <ProductInfo />,
  },
  {
    path: "/cart",
    element: <PrivateRoute><Cart /></PrivateRoute>,
  },
  {
    path: "/profile",
    element: <PrivateRoute><Profile /></PrivateRoute>,
  },
  {
    path: "/new-in",
    element: <Home />,
  },
  {
    path: "/",
    element: <ForYou />,
  },
  {
    path: "/fashion",
    element: <Fashion />,
  },
  {
    path: "/login",
    element: <LogIn />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/wishlist",
    element: <PrivateRoute><Wishlist /></PrivateRoute>,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/privacy-policy",
    element: <Policy />,
  },
  {
    path: "/terms-use",
    element: <TermsUse />,
  },
  {
    path: "/influencer",
    element: <Influencer />,
  },
  {
    path: "/contact-us",
    element: <ContactUs />,
  },
  {
    path: "/return-policy",
    element: <ReturnPolicy />,
  },
  {
    
    path: "/shipping-info",
    element: <ShippingInfo />,
  },
  {
    path: "/thankyou",
    element: <PrivateRoute><ThankYou /></PrivateRoute>,
  },
  {
    path: "/cancel",
    element: <PrivateRoute><PaymentUnsuccessful /></PrivateRoute>,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];