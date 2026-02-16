import Address from "../models/Address.js";

export const getAddressesByUser = async (req,res) => {
    try {
        const addresses = await Address.find({ userId: req.userId });
    
        return res.status(200).json({
          success: true,
          count: addresses.length,
          data: addresses,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch addresses",
          error: error.message,
        });
      }
}

export const createAddress = async (req,res) => {
    try {
        const {
          firstName,
          lastName,
          email,
          street,
          city,
          state,
          zipcode,
          country,
          phone,
        } = req.body;
    
        if (
          !firstName ||
          !lastName ||
          !email ||
          !street ||
          !city ||
          !state ||
          !zipcode ||
          !country ||
          !phone
        ) {
          return res.status(400).json({
            success: false,
            message: "All fields are required",
          });
        }
    
        const address = await Address.create({
          userId: req.userId,
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
    
        return res.status(201).json({
          success: true,
          message: "Address added successfully",
          data: address,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to create address",
          error: error.message,
        });
      }
}

export const updateAddress = async (req,res) => {
    try {
        const { id } = req.params;
    
        const address = await Address.findById(id);
    
        if (!address) {
          return res.status(404).json({
            success: false,
            message: "Address not found",
          });
        }
    
        if (address.userId.toString() !== req.userId) {
          return res.status(403).json({
            success: false,
            message: "Not authorized to update this address",
          });
        }
    
        const updatedAddress = await Address.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
    
        return res.status(200).json({
          success: true,
          message: "Address updated successfully",
          data: updatedAddress,
        });
    
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to update address",
          error: error.message,
        });
      }
}

export const deleteAddress = async (req,res) => {
    try {
        const { id } = req.params;
    
        const address = await Address.findById(id);
    
        if (!address) {
          return res.status(404).json({
            success: false,
            message: "Address not found",
          });
        }
    
        if (address.userId.toString() !== req.userId) {
          return res.status(403).json({
            success: false,
            message: "Not authorized to delete this address",
          });
        }
    
        await address.deleteOne();
    
        return res.status(200).json({
          success: true,
          message: "Address deleted successfully",
        });
    
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete address",
          error: error.message,
        });
      }
}
