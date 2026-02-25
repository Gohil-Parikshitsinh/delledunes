import axiosInstance from "./axiosInstance.js";

// POST /api/auth/register
export const registerUser = async ({ name, email, password }) => {
  const response = await axiosInstance.post("/api/auth/register", {
    name,
    email,
    password,
  });
  return response.data;
};

// POST /api/auth/login
export const loginUser = async ({ email, password }) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

// POST /api/auth/logout
export const logoutUser = async () => {
  const response = await axiosInstance.post("/api/auth/logout");
  return response.data;
};

// GET /api/auth/me
export const getMe = async () => {
  const response = await axiosInstance.get("/api/auth/me");
  return response.data;
};