import { useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart.js";

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const discount =
    product.basePrice &&
    product.offerPrice &&
    product.basePrice > product.offerPrice
      ? Math.round(
          ((product.basePrice - product.offerPrice) / product.basePrice) * 100
        )
      : null;

  // Quick add — adds first in-stock variant
  const handleQuickAdd = async (e) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation();

    const firstInStock = product.variants?.find((v) => v.stock > 0);
    if (!firstInStock) return;

    setAdding(true);
    try {
      await addToCart({
        productId: product._id,
        variantId: firstInStock._id,
        quantity: 1,
        priceSnapshot: product.offerPrice,
        name: product.name,
        image: product.images?.[0],
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch(err) {
      // fail silently — user can still go to product page
      console.log("Quick add failed:", err);
    } finally {
      setAdding(false);
    }
  };

  const allOutOfStock =
    product.variants?.length > 0 &&
    product.variants.every((v) => v.stock === 0);

  return (
    <Link
      to={`/product/${product.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: "3/4",
          background: "#EDECEA",
          marginBottom: "12px",
        }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
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
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9A9A9A",
              }}
            >
              No Image
            </span>
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "#C9B99A",
              color: "#1A1A1A",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "3px 8px",
            }}
          >
            -{discount}%
          </div>
        )}

        {/* Featured badge */}
        {product.isFeatured && (
          <div
            style={{
              position: "absolute",
              top: discount ? "36px" : "12px",
              left: "12px",
              background: "#1A1A1A",
              color: "#F5F4F0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "3px 8px",
            }}
          >
            FEATURED
          </div>
        )}

        {/* Out of stock overlay */}
        {allOutOfStock && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(245,244,240,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#1A1A1A",
              }}
            >
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick add — slides up on hover */}
        {!allOutOfStock && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              transform: hovered ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.3s ease",
            }}
          >
            <button
              onClick={handleQuickAdd}
              disabled={adding}
              style={{
                width: "100%",
                padding: "12px",
                background: added ? "#C9B99A" : "#1A1A1A",
                color: added ? "#1A1A1A" : "#F5F4F0",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                border: "none",
                cursor: adding ? "not-allowed" : "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {adding ? "Adding..." : added ? "✦ Added!" : "Quick Add"}
            </button>
          </div>
        )}
      </div>

      {/* Product info */}
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#1A1A1A",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {product.name}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "2px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1A1A1A",
            }}
          >
            ₹{product.offerPrice?.toLocaleString("en-IN")}
          </span>
          {discount > 0 && (
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "#9A9A9A",
                textDecoration: "line-through",
              }}
            >
              ₹{product.basePrice?.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;