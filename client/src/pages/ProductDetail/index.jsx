import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductBySlug } from "../../api/products.js";
import { getAllProducts } from "../../api/products.js";
import useCart from "../../hooks/useCart.js";
import useAuth from "../../hooks/useAuth.js";

// ── IMAGE GALLERY ─────────────────────────────────────────────────────────────
const ImageGallery = ({ images, name }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          aspectRatio: "3/4",
          background: "#EDECEA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#9A9A9A",
          }}
        >
          No Image
        </span>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div
        style={{
          aspectRatio: "3/4",
          overflow: "hidden",
          background: "#EDECEA",
          marginBottom: "10px",
        }}
      >
        <img
          src={images[activeIndex]}
          alt={`${name} - view ${activeIndex + 1}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.25s ease",
          }}
        />
      </div>

      {/* Thumbnail strip — below main image */}
      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                flexShrink: 0,
                width: "72px",
                height: "90px",
                overflow: "hidden",
                border: i === activeIndex
                  ? "2px solid #1A1A1A"
                  : "2px solid transparent",
                padding: 0,
                cursor: "pointer",
                background: "#EDECEA",
                transition: "border-color 0.15s",
              }}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: i === activeIndex ? 1 : 0.6,
                  transition: "opacity 0.15s",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── SIZE SELECTOR ─────────────────────────────────────────────────────────────
const SizeSelector = ({ variants, selectedVariant, onSelect }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#1A1A1A",
          }}
        >
          Size
          {selectedVariant && (
            <span
              style={{
                fontWeight: 400,
                color: "#6B6B6B",
                marginLeft: "8px",
                letterSpacing: "0.06em",
              }}
            >
              — {selectedVariant.size}
            </span>
          )}
        </p>
        <Link
          to="/size-guide"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            color: "#9A9A9A",
            textDecoration: "underline",
            letterSpacing: "0.06em",
          }}
        >
          Size Guide
        </Link>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {variants.map((variant) => {
          const isSelected = selectedVariant?._id === variant._id;
          const isOutOfStock = variant.stock === 0;

          return (
            <button
              key={variant._id}
              onClick={() => !isOutOfStock && onSelect(variant)}
              disabled={isOutOfStock}
              title={isOutOfStock ? "Out of Stock" : `${variant.stock} left`}
              style={{
                padding: "8px 16px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                border: isSelected
                  ? "1.5px solid #1A1A1A"
                  : "1.5px solid #E0DED8",
                background: isSelected ? "#1A1A1A" : "transparent",
                color: isOutOfStock
                  ? "#C4C2BE"
                  : isSelected
                  ? "#F5F4F0"
                  : "#1A1A1A",
                position: "relative",
                transition: "all 0.15s",
                // Diagonal strike through for out of stock
                ...(isOutOfStock && {
                  background: "#F8F7F5",
                }),
              }}
            >
              {variant.size}
              {isOutOfStock && (
                <span
                  style={{
                    display: "block",
                    fontSize: "9px",
                    fontWeight: 400,
                    color: "#C4C2BE",
                    letterSpacing: "0.06em",
                    marginTop: "1px",
                  }}
                >
                  Out of stock
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── QUANTITY SELECTOR ─────────────────────────────────────────────────────────
const QuantitySelector = ({ quantity, onchange, max }) => (
  <div>
    <p
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#1A1A1A",
        marginBottom: "10px",
      }}
    >
      Quantity
    </p>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: "1.5px solid #E0DED8",
      }}
    >
      <button
        onClick={() => onchange(Math.max(1, quantity - 1))}
        style={{
          width: "40px",
          height: "40px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "18px",
          color: "#1A1A1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        −
      </button>
      <span
        style={{
          width: "44px",
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: "#1A1A1A",
          borderLeft: "1.5px solid #E0DED8",
          borderRight: "1.5px solid #E0DED8",
          lineHeight: "40px",
        }}
      >
        {quantity}
      </span>
      <button
        onClick={() => onchange(Math.min(max, quantity + 1))}
        style={{
          width: "40px",
          height: "40px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "18px",
          color: "#1A1A1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +
      </button>
    </div>
    {max <= 5 && max > 0 && (
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px",
          color: "#C9B99A",
          marginTop: "6px",
          fontWeight: 600,
        }}
      >
        Only {max} left in stock
      </p>
    )}
  </div>
);

// ── ACCORDION ─────────────────────────────────────────────────────────────────
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderTop: "1px solid #E0DED8" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#1A1A1A",
          }}
        >
          {title}
        </span>
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: "#6B6B6B",
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            paddingBottom: "16px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "#6B6B6B",
            lineHeight: 1.7,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// ── RELATED PRODUCTS ──────────────────────────────────────────────────────────
const RelatedProducts = ({ currentSlug, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllProducts();
        
        const all = data.data || [];
        // Filter same category, exclude current product
        const related = all
          .filter(
            (p) =>
              p.slug !== currentSlug &&
              (p.category?._id === categoryId ||
                p.category === categoryId)
          )
          .slice(0, 4);
        setProducts(related);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) fetch();
    else setLoading(false);
  }, [currentSlug, categoryId]);

  if (!loading && products.length === 0) return null;

  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "48px 24px",
        borderTop: "1px solid #E0DED8",
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          borderBottom: "2px solid #1A1A1A",
          paddingBottom: "8px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            letterSpacing: "0.04em",
            color: "#1A1A1A",
          }}
        >
          You Might Also Like
        </h2>
        <Link
          to="/shop"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#1A1A1A",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          See all
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
              <div style={{ aspectRatio: "3/4", background: "#E8E6E2", marginBottom: "12px" }} />
              <div style={{ background: "#E8E6E2", height: "12px", width: "75%", marginBottom: "8px" }} />
              <div style={{ background: "#E8E6E2", height: "12px", width: "35%" }} />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
          className="related-grid"
        >
          {products.map((p) => {
            const discount =
              p.basePrice && p.offerPrice && p.basePrice > p.offerPrice
                ? Math.round(((p.basePrice - p.offerPrice) / p.basePrice) * 100)
                : null;

            return (
              <Link
                key={p._id}
                to={`/product/${p.slug}`}
                style={{ textDecoration: "none" }}
                className="related-card"
              >
                <div
                  style={{
                    aspectRatio: "3/4",
                    overflow: "hidden",
                    background: "#EDECEA",
                    marginBottom: "10px",
                    position: "relative",
                  }}
                >
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
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
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9A9A9A" }}>
                        No Image
                      </span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "#C9B99A",
                        color: "#1A1A1A",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 7px",
                      }}
                    >
                      -{discount}%
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1A1A1A", marginBottom: "4px" }}>
                  {p.name}
                </p>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
                    ₹{p.offerPrice?.toLocaleString("en-IN")}
                  </span>
                  {discount > 0 && (
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#9A9A9A", textDecoration: "line-through" }}>
                      ₹{p.basePrice?.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        .related-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1024px) { .related-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .related-grid { grid-template-columns: repeat(2, 1fr); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </section>
  );
};

// ── PRODUCT DETAIL PAGE ───────────────────────────────────────────────────────
const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null); // { type: "success"|"error", text }
  const [sizeError, setSizeError] = useState(false);

  // ── FETCH PRODUCT ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getProductBySlug(slug);
        setProduct(data.data);
        // Auto-select first in-stock variant
        const firstInStock = data.data?.variants?.find((v) => v.stock > 0);
        if (firstInStock) setSelectedVariant(firstInStock);
      } catch (err) {
        if (err?.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
    setSizeError(false);
  }, [selectedVariant]);

  // ── ADD TO CART ────────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setAddingToCart(true);
    try {
      await addToCart({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity,
        priceSnapshot: product.offerPrice,
        name: product.name,
        image: product.images?.[0],
      });
      setCartMessage({ type: "success", text: "Added to cart successfully!" });
    } catch {
      setCartMessage({ type: "error", text: "Failed to add to cart. Please try again." });
    } finally {
      setAddingToCart(false);
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  // ── BUY NOW ────────────────────────────────────────────────────────────────
  const handleBuyNow = async () => {
    if (!selectedVariant) {
      setSizeError(true);
      return;
    }
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSizeError(false);
    setAddingToCart(true);
    try {
      await addToCart({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity,
        priceSnapshot: product.offerPrice,
        name: product.name,
        image: product.images?.[0],
      });
      navigate("/checkout");
    } catch {
      setCartMessage({ type: "error", text: "Something went wrong. Please try again." });
      setAddingToCart(false);
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  const discount =
    product?.basePrice && product?.offerPrice && product.basePrice > product.offerPrice
      ? Math.round(((product.basePrice - product.offerPrice) / product.basePrice) * 100)
      : null;

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ background: "#F5F4F0", minHeight: "100vh", padding: "40px 24px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
          }}
        >
          <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
            <div style={{ aspectRatio: "3/4", background: "#E8E6E2" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "20px", animation: "pulse 1.5s ease-in-out infinite" }}>
            <div style={{ height: "16px", width: "40%", background: "#E8E6E2" }} />
            <div style={{ height: "32px", width: "80%", background: "#E8E6E2" }} />
            <div style={{ height: "24px", width: "30%", background: "#E8E6E2" }} />
          </div>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  // ── NOT FOUND ──────────────────────────────────────────────────────────────
  if (notFound || !product) {
    return (
      <div
        style={{
          background: "#F5F4F0",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            letterSpacing: "0.04em",
            color: "#1A1A1A",
          }}
        >
          Product Not Found
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "#9A9A9A",
          }}
        >
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/shop"
          style={{
            padding: "12px 32px",
            background: "#1A1A1A",
            color: "#F5F4F0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  // ── PRODUCT DETAIL ─────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh" }}>

      {/* Breadcrumb */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 24px 0",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            color: "#9A9A9A",
            letterSpacing: "0.06em",
          }}
        >
          <Link to="/" style={{ color: "#9A9A9A", textDecoration: "none" }}>Home</Link>
          {" / "}
          <Link to="/shop" style={{ color: "#9A9A9A", textDecoration: "none" }}>Shop</Link>
          {" / "}
          <span style={{ color: "#1A1A1A" }}>{product.name}</span>
        </p>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <div className="product-layout">

          {/* LEFT — Image gallery */}
          <div>
            <ImageGallery images={product.images} name={product.name} />
          </div>

          {/* RIGHT — Product info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Brand + Name */}
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#C9B99A",
                  marginBottom: "8px",
                }}
              >
                {product.brand || "Delle Dunes"}
              </p>
              <h1
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  letterSpacing: "0.04em",
                  color: "#1A1A1A",
                  lineHeight: 1.1,
                  marginBottom: "16px",
                }}
              >
                {product.name}
              </h1>

              {/* Price row */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(24px, 3vw, 32px)",
                    letterSpacing: "0.04em",
                    color: "#1A1A1A",
                  }}
                >
                  ₹{product.offerPrice?.toLocaleString("en-IN")}
                </span>
                {discount > 0 && (
                  <>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "16px",
                        color: "#9A9A9A",
                        textDecoration: "line-through",
                      }}
                    >
                      ₹{product.basePrice?.toLocaleString("en-IN")}
                    </span>
                    <span
                      style={{
                        background: "#C9B99A",
                        color: "#1A1A1A",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        padding: "3px 10px",
                      }}
                    >
                      -{discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <SizeSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={(v) => {
                  setSelectedVariant(v);
                  setSizeError(false);
                }}
              />
              {sizeError && (
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "#E53E3E",
                    marginTop: "8px",
                    fontWeight: 600,
                  }}
                >
                  Please select a size to continue.
                </p>
              )}
            </div>

            {/* Quantity */}
            {selectedVariant && (
              <QuantitySelector
                quantity={quantity}
                onchange={setQuantity}
                max={selectedVariant.stock}
              />
            )}

            {/* Cart message banner */}
            {cartMessage && (
              <div
                style={{
                  padding: "12px 16px",
                  background: cartMessage.type === "success" ? "#F0FFF4" : "#FFF5F5",
                  border: `1px solid ${cartMessage.type === "success" ? "#C6F6D5" : "#FED7D7"}`,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: cartMessage.type === "success" ? "#276749" : "#E53E3E",
                }}
              >
                {cartMessage.text}
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "transparent",
                  border: "1.5px solid #1A1A1A",
                  color: "#1A1A1A",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: addingToCart ? "not-allowed" : "pointer",
                  opacity: addingToCart ? 0.7 : 1,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!addingToCart) {
                    e.currentTarget.style.background = "#1A1A1A";
                    e.currentTarget.style.color = "#F5F4F0";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#1A1A1A";
                }}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={addingToCart}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#1A1A1A",
                  border: "1.5px solid #1A1A1A",
                  color: "#F5F4F0",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: addingToCart ? "not-allowed" : "pointer",
                  opacity: addingToCart ? 0.7 : 1,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!addingToCart) {
                    e.currentTarget.style.background = "#C9B99A";
                    e.currentTarget.style.borderColor = "#C9B99A";
                    e.currentTarget.style.color = "#1A1A1A";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1A1A1A";
                  e.currentTarget.style.borderColor = "#1A1A1A";
                  e.currentTarget.style.color = "#F5F4F0";
                }}
              >
                Buy Now
              </button>
            </div>

            {/* Accordions */}
            <div style={{ borderBottom: "1px solid #E0DED8" }}>
              <Accordion title="Description" defaultOpen>
                {product.description || "No description available for this product."}
              </Accordion>

              <Accordion title="Shipping & Delivery">
                <ul style={{ paddingLeft: "16px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <li>Free shipping on orders above ₹2,999</li>
                  <li>Standard delivery: 5–7 business days</li>
                  <li>Express delivery: 2–3 business days (₹199)</li>
                  <li>Ships from our warehouse in India</li>
                </ul>
              </Accordion>

              <Accordion title="Return Policy">
                <ul style={{ paddingLeft: "16px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <li>Easy 7-day returns from delivery date</li>
                  <li>Item must be unused and in original packaging</li>
                  <li>Sale items are not eligible for returns</li>
                  <li>Refund processed within 5–7 business days</li>
                </ul>
              </Accordion>

              <Accordion title="Product Details">
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {product.brand && (
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontWeight: 600, minWidth: "80px" }}>Brand</span>
                      <span>{product.brand}</span>
                    </div>
                  )}
                  {product.category?.name && (
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontWeight: 600, minWidth: "80px" }}>Category</span>
                      <span>{product.category.name}</span>
                    </div>
                  )}
                  {selectedVariant && (
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontWeight: 600, minWidth: "80px" }}>SKU</span>
                      <span>{selectedVariant.skuCode}</span>
                    </div>
                  )}
                </div>
              </Accordion>
            </div>

          </div>
        </div>
      </div>

      {/* Related products */}
      <RelatedProducts
        currentSlug={slug}
        categoryId={product.category?._id || product.category}
      />

      {/* Responsive layout styles */}
      <style>{`
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;