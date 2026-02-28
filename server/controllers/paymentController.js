import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Orders.js";
import Cart from "../models/Cart.js";
import ProductVariant from "../models/ProductVariant.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Coupon from "../models/Coupon.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── STEP 1: Create Razorpay order ─────────────────────────────────────────────
export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress, couponCode } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    // Validate address belongs to user
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

    // Get cart
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of cart.items) {
      const variant = await ProductVariant.findById(item.variant);
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Some items are out of stock",
        });
      }
      subtotal += item.priceSnapshot * item.quantity;
    }

    // Shipping
    const SHIPPING_FEE = 199;
    const shipping = subtotal >= 2999 ? 0 : SHIPPING_FEE;

    // Coupon
    let discountAmount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
      });

      if (!coupon || !coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "Invalid or inactive coupon",
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
          message: "Coupon usage limit reached",
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
    }

    const totalAmount = Math.max(subtotal + shipping - discountAmount, 0);

    // Create Razorpay order — amount in paise
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.userId,
        shippingAddress,
        couponCode: appliedCouponCode || "",
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        currency: "INR",
        keyId: process.env.RAZORPAY_API_KEY,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── STEP 2: Verify payment + create order in DB ───────────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
      couponCode,
    } = req.body;

    // 1. Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // 2. Get cart
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 3. Build order items + deduct stock
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

    // 4. Shipping + coupon
    const SHIPPING_FEE = 199;
    const shipping = subtotal >= 2999 ? 0 : SHIPPING_FEE;
    let discountAmount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
      });

      if (coupon && coupon.isActive) {
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
        const userUsage = coupon.usedBy.find(
          (u) => u.userId.toString() === req.userId
        );
        if (userUsage) {
          userUsage.usedCount += 1;
        } else {
          coupon.usedBy.push({ userId: req.userId, usedCount: 1 });
        }
        await coupon.save();
      }
    }

    const totalAmount = Math.max(subtotal + shipping - discountAmount, 0);

    // 5. Create order in DB
    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalAmount,
      totalCost,
      couponCode: appliedCouponCode,
      discountAmount,
      shippingAddress,
      paymentStatus: "paid",
      orderStatus: "processing",
    });

    // 6. Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Payment verified and order placed",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};