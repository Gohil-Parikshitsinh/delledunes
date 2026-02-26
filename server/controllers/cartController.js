import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";

const MAX_PER_VARIANT = process.env.MAX_PER_VARIANT_PER_ORDER;

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.priceSnapshot * item.quantity;
  }, 0);
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId })
      .populate("items.product", "name slug images")
      .populate("items.variant", "size skuCode stock");

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: { items: [], totalAmount: 0 },
      });
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { product, variant, quantity } = req.body;

    if (!product || !variant || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Product, variant and valid quantity are required",
      });
    }

    if (quantity > MAX_PER_VARIANT) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_PER_VARIANT} units of the same size allowed per order`,
      });
    }

    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid product",
      });
    }

    const variantExists = await ProductVariant.findById(variant);
    if (!variantExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid variant",
      });
    }

    if (variantExists.product.toString() !== product) {
      return res.status(400).json({
        success: false,
        message: "Variant does not belong to product",
      });
    }

    // Only block if completely out of stock
    if (variantExists.stock === 0) {
      return res.status(400).json({
        success: false,
        message: "This item is out of stock",
      });
    }

    let cart = await Cart.findOne({ userId: req.userId });
    const priceSnapshot = productExists.offerPrice;

    if (!cart) {
      cart = await Cart.create({
        userId: req.userId,
        items: [{ product, variant, quantity, priceSnapshot }],
        totalAmount: priceSnapshot * quantity,
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.variant.toString() === variant
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > MAX_PER_VARIANT) {
          return res.status(400).json({
            success: false,
            message: `Maximum ${MAX_PER_VARIANT} units of the same size allowed per order`,
          });
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({ product, variant, quantity, priceSnapshot });
      }

      cart.totalAmount = calculateTotal(cart.items);
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity required",
      });
    }

    if (quantity > MAX_PER_VARIANT) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_PER_VARIANT} units of the same size allowed per order`,
      });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.variant.toString() === variantId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    const variantExists = await ProductVariant.findById(variantId);

    if (!variantExists || variantExists.stock === 0) {
      return res.status(400).json({
        success: false,
        message: "This item is out of stock",
      });
    }

    item.quantity = quantity;
    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { variantId } = req.params;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.variant.toString() !== variantId
    );

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};