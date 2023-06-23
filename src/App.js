import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import route from "./helper/route"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import "./assets/css/App.css"
import { Button } from 'react-bootstrap';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md'
import Header from './layout/Header';
import Footer from './layout/Footer';
const ScrollToTop = () => {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}


const App = () => {

  return (
    <BrowserRouter>

      <Button
        className='btn-scroll-top'
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
        <MdOutlineKeyboardArrowUp />
      </Button>

      {/* <div className='loader-main'>

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
