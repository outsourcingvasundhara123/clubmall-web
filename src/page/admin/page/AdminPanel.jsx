import React, { Fragment, useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';
import ProductDetails from './ProductList';
import EditProduct from './EditProduct';
import AddProduct from './AddProduct';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/admin.css';
import PrivateRoute from '../../../helper/PrivateRouteAdmin';
import { CartContext } from '../../../context/CartContext';
import LoaderMain from '../../../components/LoaderMain';
const AdminPanel = () => {

  const { mainloder, mainstopAnimation, mainstartAnimation, mainplayer } = useContext(CartContext);

  // UseEffect hook here
  useEffect(() => {
    if (mainloder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mainloder]);

  return (
    <Fragment>

      {mainloder && (
        <div className="loader-main">
          <LoaderMain startAnimationMain={mainstartAnimation} stopAnimationMain={mainstopAnimation} player={mainplayer} />
        </div>
      )}

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/product" element={<PrivateRoute> <ProductDetails /> </PrivateRoute>} />
        <Route path="/edit-product/:id" element={<PrivateRoute> <EditProduct /> </PrivateRoute>} />
        <Route path="/add-product" element={<PrivateRoute> <AddProduct /> </PrivateRoute>} />
      </Routes>
    </Fragment>
  );
}

export default AdminPanel;
