import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";

export const getAllVariants = async (req, res) => {
  try {
    const variants = await ProductVariant.find()
      .populate("product", "name slug")
      .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: variants.length,
        data: variants
      })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createVariant = async (req, res) => {
  try {
    const {product, skuCode, size, stock} = req.body;
    if (!product || !skuCode || !size) {
        return res.status(400).json({
            success: false,
            message: "Product, SKU Code and Size are required",
          });
    }

    const productExist = await Product.findById(product)
    if (!productExist) {
        return res.status(400).json({
            success: false,
            message: "invalid Produc ID",
          });
    }

    const existingSKU = await ProductVariant.findOne({skuCode})
    if (existingSKU) {
        return res.status(500).json({
            success: false,
            message: "SKU alrady exists",
          });
    }

    const sizeUpper = size.toUpperCase();
    const variant = await ProductVariant.create({
        product,
        skuCode,
        size: sizeUpper,
        stock: stock||0
    })

    return res.status(201).json({
        success: true,
        message: "Variant created successfully",
        data: variant
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVariant = async (req, res) => {
    try {
      const { id } = req.params;
      const { product, skuCode, size, stock } = req.body;
  
      const variant = await ProductVariant.findById(id);
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Variant not found",
        });
      }
  
      // If SKU is being changed → check duplicate
      if (skuCode && skuCode !== variant.skuCode) {
        const existingSKU = await ProductVariant.findOne({ skuCode });
        if (existingSKU) {
          return res.status(409).json({
            success: false,
            message: "SKU already exists",
          });
        }
      }
  
      // If product is being changed → validate product exists
      if (product) {
        const productExist = await Product.findById(product);
        if (!productExist) {
          return res.status(400).json({
            success: false,
            message: "Invalid product ID",
          });
        }
      }
  
      const updatedVariant = await ProductVariant.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      ).populate("product", "name slug");
  
      return res.status(200).json({
        success: true,
        message: "Variant updated successfully",
        data: updatedVariant,
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  

export const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;

    const variant = await ProductVariant.findByIdAndDelete(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Variant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
