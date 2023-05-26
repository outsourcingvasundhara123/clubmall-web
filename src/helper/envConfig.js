
// api.js
export const getServerURL = () => {
  return process.env.REACT_APP_API_BASE_URL;
};

//REACT_APP_API_BASE_URL                - local 
//REACT_APP_API_BASE_URL_TEST           - test dev
//REACT_APP_API_BASE_URL_PRODUCTION     - live
