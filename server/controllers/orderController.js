import Order from "../models/Orders.js";
import Cart from "../models/Cart.js";
import ProductVariant from "../models/ProductVariant.js";
import Address from "../models/Address.js";
import Product from "../models/Product.js";


export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const address = await Address.findOne({
      _id: shippingAddress,
      userId: req.userId,
    });

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping address",
      });
    }

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    let totalCost = 0;
    const orderItems = [];

    for (const item of cart.items) {
        const variant = await ProductVariant.findById(item.variant);
        const product = await Product.findById(item.product);
      
        if (!variant || !product) {
          return res.status(400).json({
            success: false,
            message: "Product or variant not found",
          });
        }
      
        if (variant.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: "Some items are out of stock",
          });
        }
      
        // Deduct stock
        variant.stock -= item.quantity;
        await variant.save();
      
        totalAmount += item.priceSnapshot * item.quantity;
        totalCost += product.costPrice * item.quantity;
      
        orderItems.push({
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
          priceAtPurchase: item.priceSnapshot,
          costAtPurchase: product.costPrice,
        });
      }
      

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalAmount,
      totalCost,
      shippingAddress,
    });

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("items.product", "name slug images")
      .populate("items.variant", "size skuCode")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name slug images")
      .populate("items.variant", "size skuCode")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.userId && req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
