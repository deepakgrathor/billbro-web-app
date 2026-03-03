import axios from "axios";
import { NewBaseurl } from "../Utils/Constant";
import { getToken } from "../Utils/CommonFunc";

const API = axios.create({
  baseURL: NewBaseurl,
});

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();

      if (token) {
        config.headers["token"] = token;
        config.headers["Content-Type"] =
          config.contentType === "multipart/form-data"
            ? "multipart/form-data"
            : "application/json";
      } else {
        delete config.headers["token"];
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Token expire hone par (401) — auto logout + RN ko notify karo
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      if (window.ReactNativeWebView) {
        // React Native app ko logout karo — woh AsyncStorage bhi clear karega
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ action: "LOGOUT" })
        );
      } else {
        // Browser me directly login page par bhejo
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
