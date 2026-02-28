import Order from "../models/Orders.js";
import Cart from "../models/Cart.js";
import ProductVariant from "../models/ProductVariant.js";
import Address from "../models/Address.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, couponCode } = req.body;

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

    let subtotal = 0;
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

      variant.stock -= item.quantity;
      await variant.save();

      subtotal += item.priceSnapshot * item.quantity;
      totalCost += product.costPrice * item.quantity;

      orderItems.push({
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        priceAtPurchase: item.priceSnapshot,
        costAtPurchase: product.costPrice,
      });
    }

    // ── Coupon logic ──────────────────────────────────────────────────────────
    let discountAmount = 0;
    let appliedCouponCode = null;
    const SHIPPING_COST = 199;
    const shipping = subtotal >= 2999 ? 0 : SHIPPING_COST;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
      });

      if (!coupon || !coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "Invalid or inactive coupon code",
        });
      }

      const now = new Date();

      if (coupon.startDate && new Date(coupon.startDate) > now) {
        return res.status(400).json({
          success: false,
          message: "This coupon is not valid yet",
        });
      }

      if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
        return res.status(400).json({
          success: false,
          message: "This coupon has expired",
        });
      }

      if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: "This coupon has reached its usage limit",
        });
      }

      const userUsage = coupon.usedBy.find(
        (u) => u.userId.toString() === req.userId
      );
      if (userUsage && userUsage.usedCount >= coupon.perUserLimit) {
        return res.status(400).json({
          success: false,
          message: "You have exceeded the usage limit for this coupon",
        });
      }

      if (coupon.isFirstOrderOnly) {
        const previousOrders = await Order.countDocuments({ user: req.userId });
        if (previousOrders > 0) {
          return res.status(400).json({
            success: false,
            message: "This coupon is only valid for first-time orders",
          });
        }
      }

      if (subtotal < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
        });
      }

      if (coupon.discountType === "percentage") {
        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      } else if (coupon.discountType === "fixed") {
        discountAmount = Math.min(coupon.discountValue, subtotal);
      } else if (coupon.discountType === "freeshipping") {
        discountAmount = shipping;
      }

      appliedCouponCode = coupon.code;

      // Update usage
      coupon.usageCount += 1;
      if (userUsage) {
        userUsage.usedCount += 1;
      } else {
        coupon.usedBy.push({ userId: req.userId, usedCount: 1 });
      }
      await coupon.save();
    }

    const shipping_fee = subtotal >= 2999 ? 0 : SHIPPING_COST;
    const totalAmount = subtotal + shipping_fee - discountAmount;

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalAmount: Math.max(totalAmount, 0),
      totalCost,
      couponCode: appliedCouponCode,
      discountAmount,
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
      .populate("items.product", "name images")
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
    const {id} = req.params;
    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name slug images")
      .populate("items.variant", "size skuCode")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user._id.toString() !== req.userId && req.role !== "admin") {
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
      .populate("items.variant", "size skuCode")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: orders.length,
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
    const { status,orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (status) order.orderStatus = status;
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
