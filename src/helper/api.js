import axios from "axios";

export default {
  get: async (URL) => axios.get(URL),
  delete: async (URL) => axios.delete(URL),
  post: async (URL, DATA) => axios.post(URL, DATA),
  
  getWithToken: async (URL) =>
    axios.get(URL, {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }),
    
  deleteWithToken: async (URL) =>
    axios.delete(URL, {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }),
  postWithToken: async (URL, DATA) =>
    axios.post(URL, DATA, {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }),
    
    putWithToken: async (URL, DATA) =>
    axios.put(URL, DATA, {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }),   
};