import React, { useEffect ,useContext} from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import route from "./helper/route"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import "./assets/css/App.css"
import { Button } from 'react-bootstrap';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md'
import Header from './layout/Header';
import Footer from './layout/Footer';
import Loader from './components/Loader';
import { CartContext } from './context/CartContext';

const ScrollToTop = () => {

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}


const App = () => {

  const {startAnimation,stopAnimation,player, handelwishSell, sellIs_wished, categoryWeb, getCategoryWeb, wishProductUrl, currentUser,
    productList, trendingProductList, getProducts, getWishList, wishlist, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);

  return (
    <BrowserRouter>
      <Button
        className='btn-scroll-top'
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
        <MdOutlineKeyboardArrowUp />
      </Button>

      {/* <div className='loader-main'>
        <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} />
      </div> */}

      <ScrollToTop />
      <div className='page-layout'>
        <div>
          <Header />
          <div className='mar-cos'>
            <Routes>
              {route.map((route, index) => {
                return (
                  <Route
                    key={index}
                    exact
                    path={route.path}
                    element={route.element}
                  />
                );
              })}
            </Routes>
          </div>
        </div>

        <Footer />
      </div>

    </BrowserRouter>
  )
}

export default App
