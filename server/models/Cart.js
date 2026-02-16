import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productVariant",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceSnapshot: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Cart =
  mongoose.models.cart || mongoose.model("cart", cartSchema);

export default Cart;
