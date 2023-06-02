import Selling from '../page/Selling';
import Trending from '../page/Trending';
import Categories from '../page/Categories';
import ProductInfo from '../page/ProductInfo';
import Cart from '../page/Cart';
import Profile from '../page/Profile';
import ParticularCategories from '../page/ParticularCategories';
import Home from '../page/Home';
import ForYou from '../page/ForYou';
import LogIn from '../page/loginpage/LogIn';
import Register from '../page/registerpage/Register';


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
    path: "/particular-categories",
    element: <ParticularCategories />,
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
    element: <ParticularCategories />,
  },
  {
    path: "/login",
    element: <LogIn />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];