
// check for token error 

import axios from "axios";


const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      localStorage.removeItem('admintoken');
      localStorage.removeItem('adminname');
      //localStorage.removeItem('user');
      localStorage.removeItem('adminprofile_image');
      window.location.href = "/admin";
      // Depending on how your app is structured, you may need to replace
      // the above line with history.push('/login') or similar.
    }
    return Promise.reject(error);
  }
);

export default {
  get: async (URL) => axiosInstance.get(URL),
  delete: async (URL) => axiosInstance.delete(URL),
  post: async (URL, DATA) => axiosInstance.post(URL, DATA),
  
  getWithToken: async (URL) =>
    axiosInstance.get(URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
      },
    }),
    
  deleteWithToken: async (URL) =>
    axiosInstance.delete(URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
      },
    }),
  postWithToken: async (URL, DATA) =>
    axiosInstance.post(URL, DATA, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
      },
    }),
    
  putWithToken: async (URL, DATA) =>
    axiosInstance.put(URL, DATA, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
      },
    }),   
};
