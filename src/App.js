import React, { useEffect, useContext, useState } from 'react'
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
import LoaderMain from './components/LoaderMain';

const ScrollToTop = () => {

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}


// This will run whenever `mainloder` changes.


const App = () => {

  const [active, setActive] = useState(window.location.pathname);
  const { mainloder, setMainLoder, mainstopAnimation, mainstartAnimation, mainplayer, startAnimation, stopAnimation, player, handelwishSell, sellIs_wished, categoryWeb, getCategoryWeb, wishProductUrl, currentUser,
    productList, trendingProductList, getProducts, getWishList, wishlist, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);


    useEffect(() => {
      if(window.location.pathname !== "/login" && window.location.pathname !== "/register"  ){
        localStorage.setItem('lastVisitedPath',window.location.pathname);
      }
    }, [window.location.pathname]);


  // UseEffect hook here
  useEffect(() => {
    if (mainloder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mainloder]);


  return (
    <BrowserRouter>


      {
        window.location.pathname !== "/"  &&
        <Button
        className='btn-scroll-top'
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
        <MdOutlineKeyboardArrowUp />
      </Button>
      }
      {
        mainloder &&

        <div className='loader-main' >
          <LoaderMain startAnimationMain={mainstartAnimation} stopAnimationMain={mainstopAnimation} player={mainplayer} />
        </div>
      }



      <ScrollToTop />

      <div className='page-layout'>
        <div>
          <Header active={active} setActive={setActive} />
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

        <Footer setActive={setActive} />
      </div>

    </BrowserRouter>
  )
}

export default App
