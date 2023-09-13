import React from 'react';
import PrivateRoute from './PrivateRoute';
import { Navigate } from 'react-router-dom';
const Selling = React.lazy(() => import('../page/Selling'));
const Trending = React.lazy(() => import('../page/Trending'));
const Categories = React.lazy(() => import('../page/Categories'));
const ProductInfo = React.lazy(() => import('../page/ProductInfo'));
const Profile = React.lazy(() => import('../page/Profile'));
const Fashion = React.lazy(() => import('../page/Fashion'));
const Home = React.lazy(() => import('../page/Home'));
const LogIn = React.lazy(() => import('../page/loginpage/LogIn'));
const Register = React.lazy(() => import('../page/registerpage/Register'));
const Wishlist = React.lazy(() => import('../page/Wishlist'));
const About = React.lazy(() => import('../page/About'));
const Policy = React.lazy(() => import('../page/Policy'));
const TermsUse = React.lazy(() => import('../page/TermsUse'));
const Influencer = React.lazy(() => import('../page/Influencer'));
const Search = React.lazy(() => import('../page/Search'));
const ContactUs = React.lazy(() => import('../page/ContactUs'));
const ReturnPolicy = React.lazy(() => import('../page/ReturnPolicy'));
const ShippingInfo = React.lazy(() => import('../page/ShippingInfo'));
const ThankYou = React.lazy(() => import('../page/ThankYou'));
const Cart = React.lazy(() => import('../page/Cart'));
const ForYou = React.lazy(() => import('../page/ForYou'));


export default [

  {
    path: "/home",
    element: <Home />,
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
    path: "*",
    element: <Navigate to="/" />,
  },
];