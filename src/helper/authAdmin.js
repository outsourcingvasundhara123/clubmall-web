// // auth.js

export const loginAdmin = (user) => {

    if(user.user_type === 1 && user?.token){
      localStorage.setItem('admintoken', user?.token);
    }
    localStorage.setItem('adminname', user.name);
    // localStorage.setItem('user', user._id);
    localStorage.setItem('adminprofile_image', user.profile_image);
    // window.location.href = "/";
  };
    
    export const logoutAdmin = () => {
      localStorage.removeItem('admintoken');
      localStorage.removeItem('adminname');
      //localStorage.removeItem('user');
      localStorage.removeItem('adminprofile_image');
      window.location.href = "/admin";
  
    };
    
    // export const isAuthenticated = () => {
    //   return localStorage.getItem('token') !== null;
    // };