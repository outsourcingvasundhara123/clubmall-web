// auth.js

export const login = (user) => {
    sessionStorage.setItem('token', user.token);
    sessionStorage.setItem('name', user.name);
    sessionStorage.setItem('user', user._id);
    sessionStorage.setItem('profile_image', user.profile_image);

  };
  
  export const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('profile_image');
  };
  
  export const isAuthenticated = () => {
    return sessionStorage.getItem('token') !== null;
  };