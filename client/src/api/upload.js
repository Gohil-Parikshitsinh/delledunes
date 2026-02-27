// src/api/upload.js
import axiosInstance from "./axiosInstance.js";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axiosInstance.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteImage = async (publicId) => {
  const response = await axiosInstance.delete("/api/upload", {
    data: { publicId },
  });
  return response.data;
};