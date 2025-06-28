// 

// /lib/axios.ts or /utils/axios.ts

import axios from "axios";
import { store } from "@/lib/store"; // Optional: If you're using Redux
import { logout } from "@/lib/features/authSlice"; // Optional: Redux logout action
import { toast } from "react-toastify"; // Optional: Toast messages for error handling
import { getAccessToken, setAccessToken } from "@/lib/authUtils"; // In-memory token management

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`, // Replace with your API URL
  withCredentials: true, // Send cookies with requests, if needed (e.g., refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getAccessToken(); // Assuming you have a refresh token
      try {
        const response = await api.post("/api/auth/refresh", { refreshToken });
        const newToken = response.data.tokens.accessToken;

        // Store the new token
        setAccessToken(newToken);

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        // Handle error (e.g., redirect to login)
        console.log("Token refresh failed");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);




export default api;
