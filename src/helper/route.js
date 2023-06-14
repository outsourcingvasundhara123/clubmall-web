import Selling from '../page/Selling';
import Trending from '../page/Trending';
import Categories from '../page/Categories';
import ProductInfo from '../page/ProductInfo';
import Cart from '../page/Cart';
import Profile from '../page/Profile';
import Fashion from '../page/Fashion';
import Home from '../page/Home';
import ForYou from '../page/ForYou';
import LogIn from '../page/loginpage/LogIn';
import Register from '../page/registerpage/Register';
import Wishlist from '../page/Wishlist';
import About from '../page/About';
import Policy from '../page/Policy';


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
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/product-info",
    element: <ProductInfo />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/profile",
    element: <Profile />,
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
    element: <Wishlist />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/privacy-policy",
    element: <Policy />,
  },
];