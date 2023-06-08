import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import route from "./helper/route"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import "./assets/css/App.css"
import { Button } from 'react-bootstrap';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md'

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

      <ScrollToTop />

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

    </BrowserRouter>
  )
}

export default App
