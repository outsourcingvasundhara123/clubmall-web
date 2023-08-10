import Selling from '../page/Selling';
import Trending from '../page/Trending';
import Categories from '../page/Categories';
import ProductInfo from '../page/ProductInfo';
import CartNew from '../page/CartNew';
import Profile from '../page/Profile';
import Fashion from '../page/Fashion';
import Home from '../page/Home';
import ForYou from '../page/ForYou';
import LogIn from '../page/loginpage/LogIn';
import Register from '../page/registerpage/Register';
import Wishlist from '../page/Wishlist';
import About from '../page/About';
import Policy from '../page/Policy';
import TermsUse from '../page/TermsUse';
import Influencer from '../page/Influencer';
import Search from '../page/Search';
import ContactUs from '../page/ContactUs';
import ReturnPolicy from '../page/ReturnPolicy';
import ShippingInfo from '../page/ShippingInfo';
import ThankYou from '../page/ThankYou';
import PrivateRoute from './PrivateRoute';
import Cart from '../page/Cart';
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
];