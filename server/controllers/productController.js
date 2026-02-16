import slugify from "slugify";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .select("name slug offerPrice basePrice images isFeatured")
      .populate("category", "name slug");

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProductAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ id }).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      basePrice,
      offerPrice,
      costPrice,
      images,
      isFeatured,
    } = req.body;

    if (
      !name ||
      !description ||
      !brand ||
      !category ||
      !basePrice ||
      !offerPrice ||
      !costPrice ||
      !images ||!Array.isArray(images) || images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All required field are must be provided",
      });
    }

    const catgeoryExists = await Category.findById(category);

    if (!catgeoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category does not exists",
      });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      brand,
      category,
      basePrice,
      offerPrice,
      costPrice,
      images,
      isFeatured,
    });

    
    return res.status(200).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)

    if (!product) {
        return res.status(400).json({
            success: false,
            message: "Product not found",
        });
    }
    const prodName = req.body.name
    if (prodName && prodName === product.name) {
        const slug = slugify(prodName,{lower:true, strict:true})
        
        const existingProduct = await Product.findOne({
            _id:{$ne:id},
            slug,
        })
        
        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: "Another product with same name already exists",
            });
        }
        
        req.body.slug = slug;
    }

    const updateProd = await Product.findByIdAndUpdate(
        id,
        req.body,
        {new:true}
    ).populate("category","name slug")

    return res.status(200).json({
        success: true,
        message:"Product updated successfully",
        data: updateProd,
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
