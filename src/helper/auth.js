// auth.js

export const login = (user) => {
  localStorage.setItem('token', user.token);
  localStorage.setItem('name', user.name);
  localStorage.setItem('user', user._id);
  localStorage.setItem('profile_image', user.profile_image);
  window.location.href = "/";
};
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('user');
    localStorage.removeItem('profile_image');
    localStorage.removeItem("search");
    localStorage.removeItem("selectedSubcategories")
    window.location.href = "/login";

  };
  
  export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };