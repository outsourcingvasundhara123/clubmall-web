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
import CartDrawer from './page/CartDrawer';

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
  const {drawer, mainloder, setMainLoder, mainstopAnimation, mainstartAnimation, mainplayer, startAnimation, stopAnimation, player, handelwishSell, sellIs_wished, categoryWeb, getCategoryWeb, wishProductUrl, currentUser,
    productList, trendingProductList, getProducts, getWishList, wishlist, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);


  useEffect(() => {
    if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
      localStorage.setItem('lastVisitedPath', window.location.pathname);
    }
  }, [window.location.pathname]);


  // user devise 
  function getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor;
    // Apple devices (iPod, iPhone and iPad)
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
    }

    // Android devices
    else if (/android/i.test(userAgent)) {
      return "Android";
    }

    // If it's not an iPhone or Android we will assume it's "desktop"
    return "desktop";
  }


  // ios user redirect to appstore 
  useEffect(() => {
    if (window.location.pathname.startsWith("/product-details/") && getMobileOperatingSystem() == "iOS") {
      window.open("https://apps.apple.com/us/app/clubmall/id6444752184");
    }
  }, [window.location.pathname]);


  function getPathName() {
    const path = window.location.pathname;
    const pathParts = path.split("/");
    const firstPartOfPath = pathParts[1];

    if (!firstPartOfPath || firstPartOfPath === '') {
      return "For you";
    } else if (firstPartOfPath.toLowerCase() === 'selling') {
      return "Hot selling";
    } else {
      return firstPartOfPath.charAt(0).toUpperCase() + firstPartOfPath.slice(1);
    }
  }

  useEffect(() => {
    document.title = `${getPathName()} | Clubmall`;
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
        window.location.pathname !== "/" &&
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



      <CartDrawer />
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
