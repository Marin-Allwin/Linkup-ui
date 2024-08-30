import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

const ref_token = Cookies.get("refresh_Token");

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 || error.response.status === 403) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await axios.get(
            "http://localhost:8080/linkup/refresh-token",
            {
              headers: {
                Authorization: `Bearer ${ref_token}`,
              },
            }
          );

          if (response.status === 200) {
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            console.log("Refresh token response data:", response.data);

            Cookies.set("access_Token", newAccessToken);
            Cookies.set("refresh_Token", newRefreshToken);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + newAccessToken;

            originalRequest.headers["Authorization"] =
              "Bearer " + newAccessToken;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  }
);

export default api;
