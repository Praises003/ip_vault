// /lib/axios.ts or /utils/axios.ts

import axios from "axios"
import { store } from "@/lib/store"               // optional: only if you're using Redux
import { logout } from "@/lib/features/authSlice" // optional: handle session expiry
import { toast } from "react-toastify"           // optional: show error toast

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true, // send refresh token cookie
// })

// let isRefreshing = false
// let failedQueue: any[] = []

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error)
//     } else {
//       prom.resolve(token)
//     }
//   })

//   failedQueue = []
// }

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/refresh-token")
//     ) {
//       originalRequest._retry = true

//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject })
//         })
//           .then((token) => {
//             originalRequest.headers["Authorization"] = `Bearer ${token}`
//             return api(originalRequest)
//           })
//           .catch((err) => {
//             return Promise.reject(err)
//           })
//       }

//       isRefreshing = true

//       try {
//         const res = await api.post("/api/auth/refresh-token")
//         const newAccessToken = res.data.accessToken

//         // Optional: update token storage
//         localStorage.setItem("accessToken", newAccessToken)

//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
//         processQueue(null, newAccessToken)
//         isRefreshing = false

//         return api(originalRequest)
//       } catch (err) {
//         processQueue(err, null)
//         isRefreshing = false

//         // Optional: logout and redirect
//         store.dispatch(logout())
//         toast.error("Session expired. Please login again.")
//         window.location.href = "/login"

//         return Promise.reject(err)
//       }
//     }

//     return Promise.reject(error)
//   }
// )

// export default api



import { getAccessToken, setAccessToken } from "@/lib/authUtils"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send refresh token cookie
})

// ➤ Add token to request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ➤ Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const res = await api.post("/auth/refresh-token")
        const newAccessToken = res.data.accessToken
        setAccessToken(newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError)
        // Optionally redirect to login
        store.dispatch(logout())
        toast.error("Session expired. Please login again.")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
