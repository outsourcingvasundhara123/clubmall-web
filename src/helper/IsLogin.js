import React, { useEffect, useState } from 'react';

export const Is_Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by reading the session storage
    const loggedInUser = localStorage.getItem('token');
    setIsLoggedIn(!!loggedInUser);
  }, []);

  return isLoggedIn;
};