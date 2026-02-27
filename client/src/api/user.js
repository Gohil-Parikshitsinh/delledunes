import axiosInstance from "./axiosInstance.js";

export const updateProfile = async (data) => {
    const response = await axiosInstance.put("/api/users/profile", data);
    return response.data;
  };
  
  export const updatePassword = async (data) => {
    const response = await axiosInstance.put("/api/users/password", data);
    return response.data;
  };