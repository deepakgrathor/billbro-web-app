import axios from "axios";
import { NewBaseurl } from "../Utils/Constant";
import { getToken } from "../Utils/CommonFunc";

const API = axios.create({
  baseURL: NewBaseurl,
});

API.interceptors.request.use(
  async (config) => {
    try {
      // Get the token
      const token = await getToken();

      // Add the token to the request headers
      if (token) {
        config.headers["token"] = token;

        config.headers["Content-Type"] =
          config.contentType === "multipart/form-data"
            ? "multipart/form-data"
            : "application/json";
      } else {
        delete config.headers["token"]; // Remove the header if token is not available
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
