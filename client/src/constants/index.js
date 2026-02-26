// ── ORDER STATUSES ────────────────────────────────────────────────────────────
export const ORDER_STATUSES = ["processing", "shipped", "delivered", "cancelled"];

// ── PAYMENT STATUSES ─────────────────────────────────────────────────────────
export const PAYMENT_STATUSES = ["pending", "paid", "failed"];

// ── PRODUCT SIZES ─────────────────────────────────────────────────────────────
export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// ── FEATURE FLAGS ─────────────────────────────────────────────────────────────
// Flip to false at any time to hide ML-powered sections from the UI
// No other file needs to change
export const FEATURES = {
  mlPredictions: false,   // set true when ML model is ready
  mlRecommendations: false,
};