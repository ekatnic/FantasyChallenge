// Config for Axios requests
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

// const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const BASE_URL = "";

// ------------------------------------------
// ---- CSRF cookies ----
// ------------------------------------------

// https://docs.djangoproject.com/en/5.1/howto/csrf/
export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie("csrftoken");

const axiosConfig = {
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRFToken": csrftoken,
  },
  mode: "same-origin",
};

// export const axiosInstance = axios.create({
//   withCredentials: true,
// });

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8000/api/', // Update to match your backend base URL
//   withCredentials: true, // Include credentials (cookies) in requests
// });

// TODO: look into this idea more,
// // gets afresh CSRF token before any request
// axiosInstance.interceptors.request.use((config) => {
//   const token = getCookie("csrftoken");
//   config.headers["X-CSRFToken"] = token;
//   config.headers["Accept"] = "application/json";
//   config.headers["Content-Type"] = "application/json";
//   config.mode = "same-origin";
//   return config;
// });

// ------------------------------------------
// ---- Auth requests ----
// ------------------------------------------

export async function signup(userData) {
  const response = await axios.post(
    `${BASE_URL}/api/signup/`,
    userData,
    axiosConfig
  );
  return response.data;
}

export async function login(credentials) {
  const response = await axios.post(
    `${BASE_URL}/api/login/`,
    credentials,
    axiosConfig
  );
  return response.data;
}

export async function logout() {
  const response = await axios.post(`${BASE_URL}/api/logout/`, {}, axiosConfig);
  return response.data;
}

export async function forgotPassword(email) {
  const response = await axios.post(
    `${BASE_URL}/api/forgot-password/`,
    { email },
    axiosConfig
  );
  return response.data;
}

export async function confirmForgotPassword(data) {
  const response = await axios.post(
    `${BASE_URL}/api/confirm-forgot-password/`,
    data,
    axiosConfig
  );
  return response.data;
}

export async function changePassword(passwords) {
  const response = await axios.post(
    `${BASE_URL}/api/change-password/`,
    passwords,
    axiosConfig
  );
  return response.data;
}

export async function checkAuthStatus() {
  const response = await axios.get(`${BASE_URL}/api/auth-status/`, {
    ...axiosConfig,
  });
  return response.data;
}
