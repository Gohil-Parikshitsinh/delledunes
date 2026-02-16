import slugify from "slugify";
import Category from "../models/Category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("name slug");
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const slug = slugify(name, { lower: true, strict: false });

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const slug = slugify(name, { lower: true, strict: false });

    const existingCategory = await Category.findOne({
      _id: { $ne: id },
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Another category with same name already exists",
      });
    }

    const updateCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Category updated successfully",
      data: updateCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
    try {
        const {id} = req.params;

        const category = await Category.findByIdAndDelete(id)

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};
