import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart.js";
import useAuth from "../../hooks/useAuth.js";

// ── EMPTY CART MESSAGES — brand quotes, rotates randomly ─────────────────────
const EMPTY_CART_MESSAGES = [
  {
    quote: "The dunes await.",
    sub: "Your cart is empty — but your next favourite piece is one click away.",
  },
  {
    quote: "Every desert journey starts with a single step.",
    sub: "Fill your cart and let the collection speak for itself.",
  },
  {
    quote: "Dressed by the desert.",
    sub: "Nothing here yet. Go find something worth wearing.",
  },
  {
    quote: "Style is a form of self-expression.",
    sub: "Your cart is blank — make it anything but.",
  },
  {
    quote: "Good things take time. Great fits take one click.",
    sub: "Your cart is empty. The shop is full.",
  },
  {
    quote: "The best outfit you own is the one you haven't bought yet.",
    sub: "Start exploring the Delle Dunes collection.",
  },
  {
    quote: "Rare pieces. Raw energy.",
    sub: "Your cart is waiting for something worthy.",
  },
  {
    quote: "Built different. Worn louder.",
    sub: "Your cart is empty — but your identity isn’t. Choose pieces that speak.",
  },
  {
    quote: "Authenticity never goes out of style.",
    sub: "Start your collection with something that feels like you.",
  },
  {
    quote: "Not made for everyone. Made for you.",
    sub: "Your cart is waiting for something unapologetically real.",
  },
  {
    quote: "Community over conformity.",
    sub: "Find the pieces that connect you to the culture.",
  },
  {
    quote: "Wear your truth.",
    sub: "Your cart is blank — make it bold.",
  },
  {
    quote: "Rooted in the dunes. Raised by individuality.",
    sub: "Add something that tells your story.",
  },
  {
    quote: "Stand out without saying a word.",
    sub: "Your next statement piece is waiting.",
  },
  {
    quote: "For the ones who move different.",
    sub: "Start building your fit — one authentic piece at a time.",
  },
  {
    quote: "Style is personal. Make it powerful.",
    sub: "Your cart deserves something real.",
  },
  {
    quote: "Not trends. Truth.",
    sub: "Find pieces that reflect who you are — not who you're told to be.",
  },
  {
    quote: "From the dunes to the streets.",
    sub: "Join the movement. Start with your cart.",
  },
  {
    quote: "Confidence is the community uniform.",
    sub: "Pick something that feels like belonging.",
  },
  {
    quote: "Own your energy.",
    sub: "Your cart is empty — your presence isn’t.",
  },
  {
    quote: "Made for the bold-hearted.",
    sub: "Add something that carries your spirit.",
  },
  {
    quote: "Different isn’t risky. It’s real.",
    sub: "Your cart is the beginning of your statement.",
  },
  // LUXURY TONED

  {
    quote: "Exclusivity begins with intention.",
    sub: "Your cart is empty — curate it with purpose.",
  },
  {
    quote: "Refinement is a choice.",
    sub: "Select pieces that reflect who you truly are.",
  },
  {
    quote: "Crafted for the quietly confident.",
    sub: "Elevate your wardrobe with something exceptional.",
  },
  {
    quote: "True style is never accidental.",
    sub: "Begin building a collection that feels personal.",
  },
  {
    quote: "Presence is the ultimate luxury.",
    sub: "Choose garments that speak before you do.",
  },
  {
    quote: "Authenticity, tailored to perfection.",
    sub: "Your next signature piece awaits.",
  },
  {
    quote: "Where individuality meets craftsmanship.",
    sub: "Add something worthy of your story.",
  },
  {
    quote: "Timeless. Intentional. Unapologetic.",
    sub: "Your cart deserves more than ordinary.",
  },
  {
    quote: "Luxury is self-expression refined.",
    sub: "Curate your identity with precision.",
  },
  {
    quote: "Understated power. Undeniable presence.",
    sub: "Begin with one remarkable piece.",
  },
  // STREET / RAW / GEN-Z

{
  quote: "Different hits harder.",
  sub: "Your cart’s empty. Your vibe isn’t."
},
{
  quote: "Built outside the box.",
  sub: "Go add something that slaps."
},
{
  quote: "No clones. No copies.",
  sub: "Pick something that’s actually you."
},
{
  quote: "Energy speaks louder than labels.",
  sub: "Load up your cart and move bold."
},
{
  quote: "Stay rare.",
  sub: "Find a piece that matches your frequency."
},
{
  quote: "Main character only.",
  sub: "Your cart deserves main-character fits."
},
{
  quote: "We don’t do basic.",
  sub: "Go find something worth the double take."
},
{
  quote: "Community > conformity.",
  sub: "Add something that reps your tribe."
},
{
  quote: "Not for the quiet ones.",
  sub: "Start building your loud era."
},
{
  quote: "Authentic or nothing.",
  sub: "Your cart’s waiting. Don’t play safe."
},
// MINIMAL / SHARP

{
  quote: "Stay original.",
  sub: "Your cart is empty."
},
{
  quote: "Own it.",
  sub: "Start your collection."
},
{
  quote: "Be bold.",
  sub: "Add something real."
},
{
  quote: "Wear truth.",
  sub: "Find your piece."
},
{
  quote: "No copies.",
  sub: "Choose differently."
},
{
  quote: "Move distinct.",
  sub: "Begin with one."
},
{
  quote: "Authenticity wins.",
  sub: "Start here."
},
{
  quote: "Less noise. More you.",
  sub: "Pick wisely."
},
{
  quote: "Different matters.",
  sub: "Make it yours."
},
{
  quote: "Stand apart.",
  sub: "Build your fit."
},
];

const getRandomMessage = () =>
  EMPTY_CART_MESSAGES[Math.floor(Math.random() * EMPTY_CART_MESSAGES.length)];

// ── FREE SHIPPING PROGRESS BAR ────────────────────────────────────────────────
const FREE_SHIPPING_THRESHOLD = 2999;

const ShippingProgress = ({ total }) => {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const achieved = total >= FREE_SHIPPING_THRESHOLD;

  return (
    <div
      style={{
        background: "#1A1A1A",
        padding: "16px 20px",
        borderRadius: "2px",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          height: "4px",
          background: "#3A3A3A",
          borderRadius: "2px",
          marginBottom: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "#C9B99A",
            borderRadius: "2px",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px",
          color: "#F5F4F0",
          textAlign: "center",
          margin: 0,
        }}
      >
        {achieved ? (
          <span style={{ color: "#C9B99A", fontWeight: 700 }}>
            ✦ You've unlocked Free Shipping!
          </span>
        ) : (
          <>
            Add{" "}
            <span style={{ color: "#C9B99A", fontWeight: 700 }}>
              ₹{remaining.toLocaleString("en-IN")}
            </span>{" "}
            more to enjoy Free Shipping
          </>
        )}
      </p>
    </div>
  );
};

// ── CART ITEM ROW ─────────────────────────────────────────────────────────────
const CartItem = ({ item, onQuantityChange, onRemove, updating }) => {
  // Support both backend cart shape and guest cart shape
  const name = item.product?.name || item.name || "Product";
  const image = item.product?.images?.[0] || item.image || null;
  const size = item.variant?.size || item.size || "—";
  const price =
    item.priceSnapshot ?? item.priceAtPurchase ?? item.product?.offerPrice ?? 0;
  const variantId = item.variant?._id || item.variantId;
  const maxStock = item.variant?.stock ?? 99;
  const itemTotal = price * item.quantity;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr auto auto auto",
        alignItems: "center",
        gap: "16px",
        padding: "20px 0",
        borderBottom: "1px solid #E8E6E2",
        opacity: updating ? 0.5 : 1,
        transition: "opacity 0.2s",
      }}
      className="cart-item-row"
    >
      {/* Image */}
      <Link to={`/product/${item.product?.slug || "#"}`}>
        <div
          style={{
            width: "80px",
            height: "100px",
            background: "#EDECEA",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {image ? (
            <img
              src={image}
              alt={name}
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
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px",
                  color: "#9A9A9A",
                }}
              >
                No img
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Name + variant + remove */}
      <div>
        <Link
          to={`/product/${item.product?.slug || "#"}`}
          style={{ textDecoration: "none" }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#1A1A1A",
              marginBottom: "4px",
            }}
          >
            {name}
          </p>
        </Link>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            color: "#9A9A9A",
            marginBottom: "8px",
          }}
        >
          Size / {size}
        </p>
        <button
          onClick={() => onRemove(variantId)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textDecoration: "underline",
            color: "#9A9A9A",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#E53E3E")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9A9A9A")}
        >
          Remove
        </button>
      </div>

      {/* Price */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: "#1A1A1A",
          whiteSpace: "nowrap",
        }}
      >
        ₹{price.toLocaleString("en-IN")}
      </p>

      {/* Quantity */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1.5px solid #E0DED8",
        }}
      >
        <button
          onClick={() =>
            onQuantityChange(variantId, Math.max(1, item.quantity - 1))
          }
          disabled={item.quantity <= 1 || updating}
          style={{
            width: "32px",
            height: "32px",
            background: "none",
            border: "none",
            cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "16px",
            color: item.quantity <= 1 ? "#C4C2BE" : "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          −
        </button>
        <span
          style={{
            width: "36px",
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "#1A1A1A",
            borderLeft: "1.5px solid #E0DED8",
            borderRight: "1.5px solid #E0DED8",
            lineHeight: "32px",
          }}
        >
          {item.quantity}
        </span>
        <button
          onClick={() =>
            onQuantityChange(variantId, Math.min(maxStock, item.quantity + 1))
          }
          disabled={item.quantity >= maxStock || updating}
          style={{
            width: "32px",
            height: "32px",
            background: "none",
            border: "none",
            cursor: item.quantity >= maxStock ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "16px",
            color: item.quantity >= maxStock ? "#C4C2BE" : "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </button>
      </div>

      {/* Total */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          color: "#1A1A1A",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        ₹{itemTotal.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

// ── CART PAGE ─────────────────────────────────────────────────────────────────
const Cart = () => {
  const {
    items,
    cartTotal,
    updateCartItem,
    removeCartItem,
    clearCart,
    loading,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [updatingId, setUpdatingId] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [emptyMessage] = useState(getRandomMessage);
  const [clearConfirm, setClearConfirm] = useState(false);

  // Derived
  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 199;
  const grandTotal = cartTotal + shippingCost;

  const handleQuantityChange = async (variantId, quantity) => {
    setUpdatingId(variantId);
    try {
      await updateCartItem(variantId, quantity);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (variantId) => {
    setUpdatingId(variantId);
    try {
      await removeCartItem(variantId);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!clearConfirm) {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
      return;
    }
    await clearCart();
    setClearConfirm(false);
  };

  const handleCheckout = () => {
    if (!agreedToTerms) {
      setTermsError(true);
      return;
    }
    setTermsError(false);
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          background: "#F5F4F0",
          minHeight: "100vh",
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              height: "40px",
              width: "200px",
              background: "#E8E6E2",
              marginBottom: "40px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: "40px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: "100px",
                    background: "#E8E6E2",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                height: "400px",
                background: "#E8E6E2",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  // ── EMPTY CART ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div
        style={{
          background: "#F5F4F0",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        {/* Brand icon */}
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(14px, 2vw, 18px)",
            letterSpacing: "0.3em",
            color: "#C9B99A",
            marginBottom: "24px",
            textTransform: "uppercase",
          }}
        >
          ✦ Delle Dunes ✦
        </p>

        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(32px, 6vw, 64px)",
            letterSpacing: "0.04em",
            color: "#1A1A1A",
            lineHeight: 1.1,
            marginBottom: "16px",
            maxWidth: "600px",
          }}
        >
          {emptyMessage.quote}
        </h2>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            color: "#6B6B6B",
            marginBottom: "40px",
            maxWidth: "400px",
            lineHeight: 1.7,
          }}
        >
          {emptyMessage.sub}
        </p>

        <Link
          to="/shop"
          style={{
            padding: "14px 40px",
            background: "#1A1A1A",
            color: "#F5F4F0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.2s",
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
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ── CART WITH ITEMS ───────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: "#F5F4F0",
        minHeight: "100vh",
        padding: "40px 24px 80px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Page title */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              letterSpacing: "0.04em",
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            Shopping Cart
          </h1>
          <button
            onClick={handleClearCart}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: clearConfirm ? "#E53E3E" : "#9A9A9A",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {clearConfirm ? "Tap again to confirm" : "Clear Cart"}
          </button>
        </div>

        {/* Two column layout */}
        <div className="cart-layout">
          {/* ── LEFT — Cart Items ───────────────────────────────────────── */}
          <div>
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr auto auto auto",
                gap: "16px",
                paddingBottom: "12px",
                borderBottom: "2px solid #1A1A1A",
              }}
              className="cart-item-row"
            >
              {["Product", "Price", "Quantity", "Total"].map((h, i) => (
                <p
                  key={h}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#1A1A1A",
                    gridColumn: i === 0 ? "1 / 3" : "auto",
                    margin: 0,
                  }}
                >
                  {h}
                </p>
              ))}
            </div>

            {/* Items */}
            {items.map((item) => {
              const variantId = item.variant?._id || item.variantId;
              return (
                <CartItem
                  key={variantId}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  updating={updatingId === variantId}
                />
              );
            })}

            {/* Order note */}
            <div style={{ marginTop: "32px" }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#1A1A1A",
                  marginBottom: "10px",
                }}
              >
                Order Notes{" "}
                <span
                  style={{
                    fontWeight: 400,
                    color: "#9A9A9A",
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (Optional)
                </span>
              </p>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Add a note about your order — special instructions, gift messages, etc."
                rows={4}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#fff",
                  border: "1.5px solid #E0DED8",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#1A1A1A",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1A1A1A")}
                onBlur={(e) => (e.target.style.borderColor = "#E0DED8")}
              />
            </div>

            {/* Continue shopping */}
            <Link
              to="/shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "20px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#1A1A1A",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C9B99A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1A1A1A")}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* ── RIGHT — Order Summary ───────────────────────────────────── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Shipping progress */}
            <ShippingProgress total={cartTotal} />

            {/* Summary card */}
            <div
              style={{
                background: "#1A1A1A",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "24px",
                  letterSpacing: "0.1em",
                  color: "#F5F4F0",
                  margin: 0,
                }}
              >
                Order Summary
              </h2>

              {/* Line items */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: "#9A9A9A",
                    }}
                  >
                    Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#F5F4F0",
                    }}
                  >
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: "#9A9A9A",
                    }}
                  >
                    Shipping
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: shippingCost === 0 ? "#C9B99A" : "#F5F4F0",
                    }}
                  >
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #2A2A2A",
                    paddingTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "18px",
                      letterSpacing: "0.08em",
                      color: "#F5F4F0",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "18px",
                      letterSpacing: "0.08em",
                      color: "#F5F4F0",
                    }}
                  >
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Terms checkbox */}
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    onClick={() => {
                      setAgreedToTerms((p) => !p);
                      setTermsError(false);
                    }}
                    style={{
                      width: "16px",
                      height: "16px",
                      border: termsError
                        ? "1.5px solid #E53E3E"
                        : agreedToTerms
                        ? "1.5px solid #C9B99A"
                        : "1.5px solid #4A4A4A",
                      background: agreedToTerms ? "#C9B99A" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                      transition: "all 0.15s",
                      cursor: "pointer",
                    }}
                  >
                    {agreedToTerms && (
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M1.5 5L4 7.5L8.5 2.5"
                          stroke="#1A1A1A"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      color: termsError ? "#E53E3E" : "#9A9A9A",
                      lineHeight: 1.5,
                    }}
                  >
                    I agree with the{" "}
                    <Link
                      to="/terms"
                      style={{ color: "#C9B99A", textDecoration: "underline" }}
                    >
                      terms and conditions
                    </Link>
                  </span>
                </label>
                {termsError && (
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px",
                      color: "#E53E3E",
                      marginTop: "6px",
                      marginLeft: "26px",
                    }}
                  >
                    Please agree to continue.
                  </p>
                )}
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#C9B99A",
                  border: "none",
                  color: "#1A1A1A",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F5F4F0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#C9B99A";
                }}
              >
                {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
              </button>

              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "#6B6B6B",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Taxes and shipping calculated at checkout
              </p>

              {/* Safe checkout strip */}
              <div
                style={{
                  borderTop: "1px solid #2A2A2A",
                  paddingTop: "16px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#6B6B6B",
                    marginBottom: "10px",
                  }}
                >
                  Guaranteed Safe Checkout
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {["Razorpay", "UPI", "Visa", "Mastercard", "NetBanking"].map(
                    (method) => (
                      <span
                        key={method}
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "9px",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#4A4A4A",
                          border: "1px solid #2A2A2A",
                          padding: "4px 8px",
                          borderRadius: "2px",
                        }}
                      >
                        {method}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 40px;
          align-items: start;
        }
        .cart-item-row {
          display: grid;
          grid-template-columns: 80px 1fr auto auto auto;
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .cart-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .cart-item-row { grid-template-columns: 64px 1fr auto; }
          .cart-item-row > *:nth-child(3),
          .cart-item-row > *:nth-child(4) { display: none; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default Cart;
