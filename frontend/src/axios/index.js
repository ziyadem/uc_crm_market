import axios from "axios"

//? Base Axios instance
const izzo = axios.create({
  baseURL: import.meta.env.VITE_API_KEY ,
});

//? REQUEST interceptor
izzo.interceptors.request.use(
  // eslint-disable-next-line
  async (request) => {
    request.headers = {
      ...request.headers,
      authorization: "Bearer " + localStorage.getItem("ac"),
    };
    return request
  },
  (error) => {
    return Promise.reject(error);
  }
);

//? RESPONSE interceptor
izzo.interceptors.response.use(
  (res) => res,
  async (error) => {
   if (error.response.status === 401) {
      if (localStorage.getItem("re")) {
        try {
          const refreshRes = await izzo.post("/auth/refresh", {
            refreshToken: localStorage.getItem("re"),
          });
          console.log(refreshRes,'res');
          console.log('tokeni');

          localStorage.setItem("ac", refreshRes.data.accessToken)

          izzo.defaults.headers.common.authorization =
            refreshRes.data.accessToken;

          if (error.config.headers) {
            error.config.headers.authorization = refreshRes.data.accessToken;
          }
          return await izzo(error.config);
        } catch (err) {
          localStorage.removeItem("ac")
          localStorage.removeItem("re")
          localStorage.removeItem("status_name")
          window.location.replace("/login")
        }
      } else {
         localStorage.removeItem("ac");
         localStorage.removeItem("re");
         localStorage.removeItem("status_name");
         window.location.replace("/login");
      }
    }
     return Promise.reject(error);
  }
);

export default izzo;