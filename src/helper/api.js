// import axios from "axios";


// export default {
//   get: async (URL) => axios.get(URL),
//   delete: async (URL) => axios.delete(URL),
//   post: async (URL, DATA) => axios.post(URL, DATA),
  
//   getWithToken: async (URL) =>
//     axios.get(URL, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     }),
    
//   deleteWithToken: async (URL) =>
//     axios.delete(URL, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     }),
//   postWithToken: async (URL, DATA) =>
//     axios.post(URL, DATA, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     }),
    
//     putWithToken: async (URL, DATA) =>
//     axios.put(URL, DATA, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     }),   
// };


import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('user');
      localStorage.removeItem('profile_image');
      window.location.href = "/login";
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
    
  deleteWithToken: async (URL) =>
    axiosInstance.delete(URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
  postWithToken: async (URL, DATA) =>
    axiosInstance.post(URL, DATA, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
    
  putWithToken: async (URL, DATA) =>
    axiosInstance.put(URL, DATA, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),   
};
