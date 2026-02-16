import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    skuCode: {
      type: String,
      required: true,
      unique: true,
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: true,

    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

productVariantSchema.index({ product: 1, size: 1 }, { unique: true });

const ProductVariant = mongoose.models.productVariant || mongoose.model("productVariant", productVariantSchema);

export default ProductVariant;
