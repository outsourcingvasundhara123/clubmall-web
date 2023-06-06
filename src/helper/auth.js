// auth.js

export const login = (user) => {
    sessionStorage.setItem('token', user.token);
    sessionStorage.setItem('name', user.name);
  };
  
  export const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
  };
  
  export const isAuthenticated = () => {
    return sessionStorage.getItem('token') !== null;
  };