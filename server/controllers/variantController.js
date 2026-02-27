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
      data: variants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const generateSKU = (categorySlug, size) => {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DD-${categorySlug.toUpperCase()}-${size}-${random}`;
};

export const createVariant = async (req, res) => {
  try {
    const { product, size, stock } = req.body;

    if (!product && !size) {
      return res.status(400).json({
        success: false,
        message: "Product and Size are required",
      });
    }

    const productExists = await Product.findById(product).populate("category", "slug");
    if (!productExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    // Check if size already exists for this product
    const sizeExists = await ProductVariant.findOne({ product, size: size.toUpperCase() });
    if (sizeExists) {
      return res.status(409).json({
        success: false,
        message: `Size ${size.toUpperCase()} already exists for this product`,
      });
    }

    // Auto-generate unique SKU
    let skuCode;
    let skuExists = true;
    while (skuExists) {
      skuCode = generateSKU(productExists.category?.slug || "DD", size.toUpperCase());
      skuExists = await ProductVariant.findOne({ skuCode });
    }

    const variant = await ProductVariant.create({
      product,
      skuCode,
      size: size.toUpperCase(),
      stock: stock || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Variant created successfully",
      data: variant,
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
    const { stock } = req.body;

    const variant = await ProductVariant.findById(id);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative",
      });
    }

    const updatedVariant = await ProductVariant.findByIdAndUpdate(
      id,
      { stock: Number(stock) },
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
