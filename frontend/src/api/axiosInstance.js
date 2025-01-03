// frontend/src/api/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/api", // 백엔드 주소
});

// 요청 시 토큰 헤더에 포함 (예: x-auth-token)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default instance;
