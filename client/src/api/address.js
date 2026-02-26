import axiosInstance from "./axiosInstance.js";

// GET /api/address
export const getAddresses = async () => {
  const response = await axiosInstance.get("/api/address");
  return response.data;
};

// POST /api/address
export const createAddress = async ({
  firstName,
  lastName,
  email,
  street,
  city,
  state,
  zipcode,
  country,
  phone,
}) => {
  const response = await axiosInstance.post("/api/address", {
    firstName,
    lastName,
    email,
    street,
    city,
    state,
    zipcode,
    country,
    phone,
  });
  return response.data;
};

// PUT /api/address/:id
export const updateAddress = async (id, fields) => {
  const response = await axiosInstance.put(`/api/address/${id}`, fields);
  return response.data;
};

// DELETE /api/address/:id
export const deleteAddress = async (id) => {
  const response = await axiosInstance.delete(`/api/address/${id}`);
  return response.data;
};