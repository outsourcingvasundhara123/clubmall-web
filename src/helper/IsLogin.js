// import React, { useEffect, useState } from 'react';

// export const Is_Login = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Check if the user is logged in by reading the session storage
//     const loggedInUser = localStorage.getItem('token');
//     setIsLoggedIn(!!loggedInUser);
//   }, []);

//   return isLoggedIn;
// };


import React, { useEffect, useState } from 'react';

export const Is_Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by reading the local storage
    const loggedInUser = localStorage.getItem('token');
    setIsLoggedIn(!!loggedInUser);

    // Set up an event listener to check for changes in local storage
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        setIsLoggedIn(!!localStorage.getItem('token'));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return isLoggedIn;
};
