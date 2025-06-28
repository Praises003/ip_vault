// // libs/authUtils.ts
 let accessToken: string | null = null

// export function setAccessToken(token: string | null) {
//   accessToken = token
//   console.log(accessToken)
//   console.log(token)
// }

// export function getAccessToken() {
//   return accessToken
// }

// src/lib/authUtils.ts

// Function to set the access token
export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

// Function to get the access token from localStorage
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Function to remove the access token from localStorage (for logout)
export const removeAccessToken = () => {
  localStorage.removeItem("accessToken");
};



