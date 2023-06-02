// auth.js

export const login = (token) => {
    sessionStorage.setItem('token', token);
  };
  
  export const logout = () => {
    sessionStorage.removeItem('token');
  };
  
  export const isAuthenticated = () => {
    return sessionStorage.getItem('token') !== null;
  };