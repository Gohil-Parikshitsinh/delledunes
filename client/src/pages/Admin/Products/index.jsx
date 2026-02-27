import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllProductsAdmin,
  deleteProduct,
} from "../../../api/admin.js";

// ── STATUS BADGE ──────────────────────────────────────────────────────────────
const Badge = ({ label, bg, color }) => (
  <span
    style={{
      background: bg,
      color,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "3px 10px",
      borderRadius: "2px",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

// ── PRODUCTS TABLE ────────────────────────────────────────────────────────────
const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProductsAdmin();
      setProducts(data.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      // fail silently
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const discount = (product) =>
    product.basePrice > product.offerPrice
      ? Math.round(((product.basePrice - product.offerPrice) / product.basePrice) * 100)
      : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(28px, 3vw, 40px)",
              letterSpacing: "0.04em",
              color: "#1A1A1A",
              margin: "0 0 4px",
            }}
          >
            Products
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#9A9A9A",
              margin: 0,
            }}
          >
            {loading ? "Loading..." : `${products.length} products total`}
          </p>
        </div>

        <Link
          to="/admin/products/create"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "#1A1A1A",
            color: "#F5F4F0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#C9B99A";
            e.currentTarget.style.color = "#1A1A1A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1A1A1A";
            e.currentTarget.style.color = "#F5F4F0";
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* ── SEARCH ──────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", maxWidth: "400px" }}>
        <svg
          width="14" height="14"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9A9A9A",
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, brand, category..."
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            background: "#fff",
            border: "1px solid #F0EFEB",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#1A1A1A",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#C9B99A"}
          onBlur={(e) => e.target.style.borderColor = "#F0EFEB"}
        />
      </div>

      {/* ── TABLE ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #F0EFEB",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #F0EFEB" }}>
              {[
                "Product",
                "Category",
                "Brand",
                "Base Price",
                "Offer Price",
                "Cost Price",
                "Discount",
                "Status",
                "Created",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "14px 16px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#9A9A9A",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F8F8F7" }}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <td key={j} style={{ padding: "16px" }}>
                      <div
                        style={{
                          height: "12px",
                          background: "#F0EFEB",
                          borderRadius: "2px",
                          animation: "pulse 1.5s ease-in-out infinite",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    padding: "60px 24px",
                    textAlign: "center",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    color: "#9A9A9A",
                  }}
                >
                  {search ? `No products found for "${search}"` : "No products yet. Add your first product."}
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const disc = discount(product);
                const isDeleting = deletingId === product._id;
                const isConfirming = confirmDeleteId === product._id;

                return (
                  <tr
                    key={product._id}
                    style={{
                      borderBottom: "1px solid #F8F8F7",
                      opacity: isDeleting ? 0.4 : 1,
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAF9"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Product */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "44px",
                            height: "56px",
                            background: "#EDECEA",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}
                        >
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ fontSize: "10px", color: "#9A9A9A" }}>—</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#1A1A1A",
                              margin: "0 0 2px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.name}
                          </p>
                          <p
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "11px",
                              color: "#9A9A9A",
                              margin: 0,
                            }}
                          >
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          color: "#6B6B6B",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.category?.name || "—"}
                      </span>
                    </td>

                    {/* Brand */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          color: "#6B6B6B",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.brand || "—"}
                      </span>
                    </td>

                    {/* Base Price */}
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          color: "#6B6B6B",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{product.basePrice?.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Offer Price */}
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#1A1A1A",
                        }}
                      >
                        ₹{product.offerPrice?.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Cost Price */}
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          color: "#6B6B6B",
                        }}
                      >
                        ₹{product.costPrice?.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Discount */}
                    <td style={{ padding: "14px 16px" }}>
                      {disc ? (
                        <Badge label={`-${disc}%`} bg="#FFF8E6" color="#B7791F" />
                      ) : (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#C4C2BE" }}>—</span>
                      )}
                    </td>

                    {/* Featured Status */}
                    <td style={{ padding: "14px 16px" }}>
                      {product.isFeatured ? (
                        <Badge label="Featured" bg="#F0FFF4" color="#276749" />
                      ) : (
                        <Badge label="Standard" bg="#F5F4F0" color="#9A9A9A" />
                      )}
                    </td>

                    {/* Created */}
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          color: "#9A9A9A",
                        }}
                      >
                        {new Date(product.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* Edit */}
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          style={{
                            padding: "6px 12px",
                            background: "none",
                            border: "1px solid #E0DED8",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "#1A1A1A",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1A1A1A";
                            e.currentTarget.style.color = "#F5F4F0";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.color = "#1A1A1A";
                          }}
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={isDeleting}
                          style={{
                            padding: "6px 12px",
                            background: isConfirming ? "#E53E3E" : "none",
                            border: `1px solid ${isConfirming ? "#E53E3E" : "#E0DED8"}`,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: isConfirming ? "#fff" : "#E53E3E",
                            cursor: isDeleting ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                            transition: "all 0.15s",
                          }}
                        >
                          {isDeleting ? "..." : isConfirming ? "Confirm?" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default AdminProducts;