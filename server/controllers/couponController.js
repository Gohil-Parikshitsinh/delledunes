import Coupon from "../models/Coupon.js";
import Order from "../models/Orders.js";

// ── ADMIN: Get all coupons ────────────────────────────────────────────────────
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN: Create coupon ──────────────────────────────────────────────────────
export const createCoupon = async (req, res) => {
  try {
    const {
      code, discountType, discountValue,
      startDate, expiryDate, usageLimit,
      perUserLimit, minOrderAmount,
      isFirstOrderOnly, isActive,
    } = req.body;

    if (!code || !discountType) {
      return res.status(400).json({
        success: false,
        message: "Code and discount type are required",
      });
    }

    if (
      discountType !== "freeshipping" &&
      (!discountValue || discountValue <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount value is required for percentage and fixed types",
      });
    }

    if (discountType === "percentage" && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100",
      });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: discountType === "freeshipping" ? 0 : Number(discountValue),
      startDate: startDate || Date.now(),
      expiryDate: expiryDate || null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      perUserLimit: perUserLimit ? Number(perUserLimit) : 1,
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      isFirstOrderOnly: isFirstOrderOnly || false,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN: Update coupon ──────────────────────────────────────────────────────
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    const {
      code, discountType, discountValue,
      startDate, expiryDate, usageLimit,
      perUserLimit, minOrderAmount,
      isFirstOrderOnly, isActive,
    } = req.body;

    // If code is changing check uniqueness
    if (code && code.toUpperCase().trim() !== coupon.code) {
      const existing = await Coupon.findOne({
        code: code.toUpperCase().trim(),
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Coupon code already exists",
        });
      }
      coupon.code = code.toUpperCase().trim();
    }

    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined)
      coupon.discountValue =
        coupon.discountType === "freeshipping" ? 0 : Number(discountValue);
    if (startDate !== undefined) coupon.startDate = startDate;
    if (expiryDate !== undefined) coupon.expiryDate = expiryDate || null;
    if (usageLimit !== undefined)
      coupon.usageLimit = usageLimit ? Number(usageLimit) : null;
    if (perUserLimit !== undefined) coupon.perUserLimit = Number(perUserLimit);
    if (minOrderAmount !== undefined)
      coupon.minOrderAmount = Number(minOrderAmount);
    if (isFirstOrderOnly !== undefined) coupon.isFirstOrderOnly = isFirstOrderOnly;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN: Delete coupon ──────────────────────────────────────────────────────
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUBLIC: Apply/validate coupon ─────────────────────────────────────────────
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const userId = req.userId;

    if (!code || cartTotal === undefined) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and cart total are required",
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    // 1. Exists?
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // 2. Active?
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is no longer active",
      });
    }

    // 3. Start date
    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return res.status(400).json({
        success: false,
        message: "This coupon is not valid yet",
      });
    }

    // 4. Expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired",
      });
    }

    // 5. Total usage limit
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "This coupon has reached its usage limit",
      });
    }

    // 6. Per user limit
    const userUsage = coupon.usedBy.find(
      (u) => u.userId.toString() === userId
    );
    if (userUsage && userUsage.usedCount >= coupon.perUserLimit) {
      return res.status(400).json({
        success: false,
        message: "You have already used this coupon the maximum number of times",
      });
    }

    // 7. First order only
    if (coupon.isFirstOrderOnly) {
      const previousOrders = await Order.countDocuments({ user: userId });
      if (previousOrders > 0) {
        return res.status(400).json({
          success: false,
          message: "This coupon is only valid for first-time orders",
        });
      }
    }

    // 8. Minimum order amount
    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    const SHIPPING_COST = 199;

    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
    } else if (coupon.discountType === "fixed") {
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    } else if (coupon.discountType === "freeshipping") {
      discountAmount = cartTotal >= 2999 ? 0 : SHIPPING_COST;
    }

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};