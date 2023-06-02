import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const token = sessionStorage.getItem('token');
  return token !== null;
};

const PrivateRoute = ({ element: Element, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated() ? (
          <Element />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />
  );
};

export default PrivateRoute;