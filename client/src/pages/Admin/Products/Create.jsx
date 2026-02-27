import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../../../api/admin.js";
import { getAllCategoriesAdmin } from "../../../api/admin.js";
import { uploadImage, deleteImage } from "../../../api/upload.js";

// ── IMAGE UPLOADER ────────────────────────────────────────────────────────────
const ImageUploader = ({ images, onAdd, onRemove, uploading, setUploading }) => {
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      alert("Maximum 6 images allowed");
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        const data = await uploadImage(file);
        onAdd({ url: data.url, publicId: data.publicId });
      }
    } catch {
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#1A1A1A",
          marginBottom: "10px",
        }}
      >
        Product Images
        <span style={{ color: "#9A9A9A", fontWeight: 400, marginLeft: "6px" }}>
          (max 6, first image is cover)
        </span>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: "10px",
        }}
      >
        {/* Existing images */}
        {images.map((img, i) => (
          <div
            key={img.url}
            style={{
              position: "relative",
              aspectRatio: "3/4",
              background: "#EDECEA",
              overflow: "hidden",
            }}
          >
            <img
              src={img.url}
              alt={`Product ${i + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Cover badge */}
            {i === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "6px",
                  left: "6px",
                  background: "#C9B99A",
                  color: "#1A1A1A",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  fontWeight: 700,
                  padding: "2px 6px",
                  letterSpacing: "0.08em",
                }}
              >
                COVER
              </div>
            )}
            {/* Remove button */}
            <button
              onClick={() => onRemove(img)}
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                width: "22px",
                height: "22px",
                background: "#1A1A1A",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F5F4F0",
              }}
            >
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}

        {/* Upload button */}
        {images.length < 6 && (
          <label
            style={{
              aspectRatio: "3/4",
              border: "2px dashed #E0DED8",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: uploading ? "not-allowed" : "pointer",
              gap: "8px",
              background: uploading ? "#F8F8F7" : "transparent",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!uploading) e.currentTarget.style.borderColor = "#C9B99A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E0DED8";
            }}
          >
            {uploading ? (
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "#9A9A9A",
                  textAlign: "center",
                  padding: "8px",
                }}
              >
                Uploading...
              </span>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: "#9A9A9A" }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px",
                    color: "#9A9A9A",
                    textAlign: "center",
                    padding: "0 8px",
                  }}
                >
                  Upload
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
        )}
      </div>
    </div>
  );
};

// ── FORM FIELD ────────────────────────────────────────────────────────────────
const FormField = ({ label, required, error, children, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: error ? "#E53E3E" : "#1A1A1A",
      }}
    >
      {label}
      {required && <span style={{ color: "#E53E3E", marginLeft: "3px" }}>*</span>}
    </label>
    {children}
    {hint && (
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9A9A9A", margin: 0 }}>
        {hint}
      </p>
    )}
    {error && (
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#E53E3E", margin: 0 }}>
        {error}
      </p>
    )}
  </div>
);

const inputStyle = (error) => ({
  width: "100%",
  padding: "10px 12px",
  background: "#fff",
  border: `1.5px solid ${error ? "#E53E3E" : "#E0DED8"}`,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  color: "#1A1A1A",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
});

// ── CREATE PRODUCT PAGE ───────────────────────────────────────────────────────
const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "Delle Dunes",
    category: "",
    basePrice: "",
    offerPrice: "",
    costPrice: "",
    isFeatured: false,
  });

  const [images, setImages] = useState([]); // [{ url, publicId }]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategoriesAdmin();
        setCategories(data.data || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddImage = (img) => setImages((prev) => [...prev, img]);

  const handleRemoveImage = async (img) => {
    setImages((prev) => prev.filter((i) => i.url !== img.url));
    // Delete from Cloudinary
    if (img.publicId) {
      try {
        await deleteImage(img.publicId);
      } catch {
        // fail silently
      }
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.category) e.category = "Category is required";
    if (!form.basePrice || isNaN(form.basePrice) || Number(form.basePrice) <= 0)
      e.basePrice = "Valid base price is required";
    if (!form.offerPrice || isNaN(form.offerPrice) || Number(form.offerPrice) <= 0)
      e.offerPrice = "Valid offer price is required";
    if (!form.costPrice || isNaN(form.costPrice) || Number(form.costPrice) <= 0)
      e.costPrice = "Valid cost price is required";
    if (Number(form.offerPrice) > Number(form.basePrice))
      e.offerPrice = "Offer price cannot be higher than base price";
    if (Number(form.costPrice) > Number(form.offerPrice))
      e.costPrice = "Cost price cannot be higher than offer price";
    if (images.length === 0) e.images = "At least one image is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setSubmitting(true);
    try {
      await createProduct({
        ...form,
        basePrice: Number(form.basePrice),
        offerPrice: Number(form.offerPrice),
        costPrice: Number(form.costPrice),
        images: images.map((i) => i.url),
      });
      navigate("/admin/products");
    } catch (err) {
      setErrors({ submit: err?.response?.data?.message || "Failed to create product" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>

      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <Link
            to="/admin/products"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#9A9A9A",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1A1A1A"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#9A9A9A"}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Products
          </Link>
          <span style={{ color: "#E0DED8" }}>/</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#1A1A1A" }}>
            Create
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(28px, 3vw, 40px)",
            letterSpacing: "0.04em",
            color: "#1A1A1A",
            margin: 0,
          }}
        >
          Add New Product
        </h1>
      </div>

      {/* Submit error */}
      {errors.submit && (
        <div
          style={{
            padding: "12px 16px",
            background: "#FFF5F5",
            border: "1px solid #FED7D7",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#E53E3E",
          }}
        >
          {errors.submit}
        </div>
      )}

      {/* Form */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #F0EFEB",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Images */}
        <div>
          <ImageUploader
            images={images}
            onAdd={handleAddImage}
            onRemove={handleRemoveImage}
            uploading={uploading}
            setUploading={setUploading}
          />
          {errors.images && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#E53E3E", marginTop: "6px" }}>
              {errors.images}
            </p>
          )}
        </div>

        <div style={{ borderTop: "1px solid #F0EFEB" }} />

        {/* Name */}
        <FormField label="Product Name" required error={errors.name}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Desert Oversized Hoodie"
            style={inputStyle(errors.name)}
            onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
            onBlur={(e) => e.target.style.borderColor = errors.name ? "#E53E3E" : "#E0DED8"}
          />
        </FormField>

        {/* Description */}
        <FormField label="Description" required error={errors.description}>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the product — material, fit, feel..."
            rows={4}
            style={{
              ...inputStyle(errors.description),
              resize: "vertical",
            }}
            onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
            onBlur={(e) => e.target.style.borderColor = errors.description ? "#E53E3E" : "#E0DED8"}
          />
        </FormField>

        {/* Brand + Category */}
        <div className="form-grid-2">
          <FormField label="Brand" error={errors.brand}>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Delle Dunes"
              style={inputStyle(errors.brand)}
              onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
              onBlur={(e) => e.target.style.borderColor = "#E0DED8"}
            />
          </FormField>

          <FormField label="Category" required error={errors.category}>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                ...inputStyle(errors.category),
                cursor: "pointer",
              }}
              onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
              onBlur={(e) => e.target.style.borderColor = errors.category ? "#E53E3E" : "#E0DED8"}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Prices */}
        <div className="form-grid-3">
          <FormField
            label="Base Price (MRP)"
            required
            error={errors.basePrice}
            hint="Original price shown with strikethrough"
          >
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#9A9A9A",
                }}
              >
                ₹
              </span>
              <input
                name="basePrice"
                type="number"
                value={form.basePrice}
                onChange={handleChange}
                placeholder="2999"
                style={{ ...inputStyle(errors.basePrice), paddingLeft: "24px" }}
                onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
                onBlur={(e) => e.target.style.borderColor = errors.basePrice ? "#E53E3E" : "#E0DED8"}
              />
            </div>
          </FormField>

          <FormField
            label="Offer Price"
            required
            error={errors.offerPrice}
            hint="Selling price shown to customers"
          >
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#9A9A9A",
                }}
              >
                ₹
              </span>
              <input
                name="offerPrice"
                type="number"
                value={form.offerPrice}
                onChange={handleChange}
                placeholder="1999"
                style={{ ...inputStyle(errors.offerPrice), paddingLeft: "24px" }}
                onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
                onBlur={(e) => e.target.style.borderColor = errors.offerPrice ? "#E53E3E" : "#E0DED8"}
              />
            </div>
          </FormField>

          <FormField
            label="Cost Price"
            required
            error={errors.costPrice}
            hint="Your purchase/production cost"
          >
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#9A9A9A",
                }}
              >
                ₹
              </span>
              <input
                name="costPrice"
                type="number"
                value={form.costPrice}
                onChange={handleChange}
                placeholder="999"
                style={{ ...inputStyle(errors.costPrice), paddingLeft: "24px" }}
                onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
                onBlur={(e) => e.target.style.borderColor = errors.costPrice ? "#E53E3E" : "#E0DED8"}
              />
            </div>
          </FormField>
        </div>

        {/* Margin preview */}
        {form.offerPrice && form.costPrice && Number(form.offerPrice) > 0 && Number(form.costPrice) > 0 && (
          <div
            style={{
              padding: "12px 16px",
              background: "#F5F4F0",
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9A9A9A", margin: "0 0 2px" }}>
                Profit per unit
              </p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "0.04em", color: "#1A1A1A", margin: 0 }}>
                ₹{(Number(form.offerPrice) - Number(form.costPrice)).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9A9A9A", margin: "0 0 2px" }}>
                Margin
              </p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "0.04em", color: "#1A1A1A", margin: 0 }}>
                {(((Number(form.offerPrice) - Number(form.costPrice)) / Number(form.offerPrice)) * 100).toFixed(1)}%
              </p>
            </div>
            {form.basePrice && Number(form.basePrice) > Number(form.offerPrice) && (
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9A9A9A", margin: "0 0 2px" }}>
                  Discount
                </p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "0.04em", color: "#C9B99A", margin: 0 }}>
                  {Math.round(((Number(form.basePrice) - Number(form.offerPrice)) / Number(form.basePrice)) * 100)}% OFF
                </p>
              </div>
            )}
          </div>
        )}

        {/* Featured toggle */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
        >
          <div
            onClick={() => setForm((p) => ({ ...p, isFeatured: !p.isFeatured }))}
            style={{
              width: "40px",
              height: "22px",
              background: form.isFeatured ? "#1A1A1A" : "#E0DED8",
              borderRadius: "11px",
              position: "relative",
              cursor: "pointer",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "3px",
                left: form.isFeatured ? "21px" : "3px",
                width: "16px",
                height: "16px",
                background: "#fff",
                borderRadius: "50%",
                transition: "left 0.2s",
              }}
            />
          </div>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", margin: 0 }}>
              Featured Product
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9A9A9A", margin: 0 }}>
              Show this product in featured sections on the home page
            </p>
          </div>
        </label>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={handleSubmit}
          disabled={submitting || uploading}
          style={{
            padding: "12px 32px",
            background: "#1A1A1A",
            color: "#F5F4F0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            border: "none",
            cursor: submitting || uploading ? "not-allowed" : "pointer",
            opacity: submitting || uploading ? 0.7 : 1,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!submitting && !uploading) {
              e.currentTarget.style.background = "#C9B99A";
              e.currentTarget.style.color = "#1A1A1A";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1A1A1A";
            e.currentTarget.style.color = "#F5F4F0";
          }}
        >
          {submitting ? "Creating..." : "Create Product"}
        </button>

        <Link
          to="/admin/products"
          style={{
            padding: "12px 24px",
            background: "none",
            color: "#6B6B6B",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textDecoration: "none",
            border: "1px solid #E0DED8",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#1A1A1A";
            e.currentTarget.style.color = "#1A1A1A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E0DED8";
            e.currentTarget.style.color = "#6B6B6B";
          }}
        >
          Cancel
        </Link>
      </div>

      <style>{`
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) {
          .form-grid-2 { grid-template-columns: 1fr; }
          .form-grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default CreateProduct;