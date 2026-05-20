import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getOrderById } from "../../api/orders";

const styles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes checkDraw {
    from { stroke-dashoffset: 80; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes circleDraw {
    from { stroke-dashoffset: 220; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  .oc-fade-1 { animation: fadeUp 0.5s ease both; animation-delay: 0.1s; }
  .oc-fade-2 { animation: fadeUp 0.5s ease both; animation-delay: 0.25s; }
  .oc-fade-3 { animation: fadeUp 0.5s ease both; animation-delay: 0.4s; }
  .oc-fade-4 { animation: fadeUp 0.5s ease both; animation-delay: 0.55s; }
  .oc-fade-5 { animation: fadeUp 0.5s ease both; animation-delay: 0.7s; }
  .oc-circle { stroke-dasharray: 220; animation: circleDraw 0.6s ease 0.05s both; }
  .oc-check  { stroke-dasharray: 80;  animation: checkDraw  0.4s ease 0.55s both; }
  .skeleton  { background: #F0EFEB; animation: pulse 1.5s infinite; border-radius: 2px; }
`;

function SkeletonLine({ w = "100%", h = 12 }) {
  return (
    <div className="skeleton" style={{ width: w, height: h, marginBottom: 8 }} />
  );
}

function StatusBadge({ status }) {
  const map = {
    processing: { bg: "#EBF4FF", color: "#2B6CB0" },
    shipped:    { bg: "#FFFBEB", color: "#B7791F" },
    delivered:  { bg: "#F0FFF4", color: "#276749" },
    cancelled:  { bg: "#FFF5F5", color: "#E53E3E" },
  };
  const s = map[status] || map.processing;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontFamily: "DM Sans, sans-serif", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "3px 10px", borderRadius: 2,
    }}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const map = {
    pending: { bg: "#FFFBEB", color: "#B7791F" },
    paid:    { bg: "#F0FFF4", color: "#276749" },
    failed:  { bg: "#FFF5F5", color: "#E53E3E" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontFamily: "DM Sans, sans-serif", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "3px 10px", borderRadius: 2,
    }}>
      {status}
    </span>
  );
}

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }
    getOrderById(orderId)
      .then((res) => setOrder(res.data.order || res.data))
      .catch(() => setError("Could not load order details."))
      .finally(() => setLoading(false));
  }, [orderId]);

  const addr = order?.shippingAddress;

  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: "100vh", background: "#F5F4F0",
        fontFamily: "DM Sans, sans-serif", padding: "60px 16px 80px",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* SUCCESS ICON */}
          {!error && (
            <div className="oc-fade-1" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40 }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle className="oc-circle" cx="36" cy="36" r="34"
                  stroke="#1A1A1A" strokeWidth="2.5" fill="none" />
                <polyline className="oc-check" points="22,37 32,47 51,27"
                  stroke="#1A1A1A" strokeWidth="2.5"
                  strokeLinecap="square" strokeLinejoin="miter" fill="none" />
              </svg>
              <h1 style={{
                fontFamily: "Bebas Neue, sans-serif", fontSize: 42,
                letterSpacing: "0.04em", color: "#1A1A1A", margin: "20px 0 6px",
              }}>
                Order Confirmed
              </h1>
              <p style={{ color: "#6B6B6B", fontSize: 14, margin: 0 }}>
                Thank you for your purchase. We'll get it shipped soon.
              </p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div style={{
              background: "#FFF5F5", border: "1px solid #E53E3E", borderRadius: 2,
              padding: "20px 24px", color: "#E53E3E", fontSize: 14, textAlign: "center",
            }}>
              {error}
            </div>
          )}

          {/* SKELETON */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <SkeletonLine h={18} w="40%" />
              <SkeletonLine h={14} />
              <SkeletonLine h={14} w="80%" />
              <SkeletonLine h={14} w="60%" />
            </div>
          )}

          {/* ORDER CONTENT */}
          {order && (
            <>
              {/* Order Meta */}
              <div className="oc-fade-2" style={{
                background: "#fff", border: "1px solid #E0DED8", borderRadius: 2,
                padding: "20px 24px", marginBottom: 16,
                display: "flex", flexWrap: "wrap", gap: "16px 32px",
                alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <p style={{
                    fontFamily: "DM Sans, sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#9A9A9A", margin: "0 0 4px",
                  }}>
                    Order ID
                  </p>
                  <p style={{
                    fontFamily: "Bebas Neue, sans-serif", fontSize: 18,
                    letterSpacing: "0.06em", color: "#1A1A1A", margin: 0,
                  }}>
                    {order._id}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <StatusBadge status={order.orderStatus} />
                  <PaymentBadge status={order.paymentStatus} />
                </div>
              </div>

              {/* Items */}
              <div className="oc-fade-3" style={{
                background: "#fff", border: "1px solid #E0DED8",
                borderRadius: 2, marginBottom: 16, overflow: "hidden",
              }}>
                <div style={{ padding: "14px 24px", borderBottom: "2px solid #F0EFEB" }}>
                  <span style={{
                    fontFamily: "DM Sans, sans-serif", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase", color: "#9A9A9A",
                  }}>
                    Items Ordered
                  </span>
                </div>

                {order.items?.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "14px 24px",
                    borderBottom: i < order.items.length - 1 ? "1px solid #F8F8F7" : "none",
                  }}>
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product?.name}
                        style={{
                          width: 52, height: 70, objectFit: "cover",
                          borderRadius: 2, flexShrink: 0, border: "1px solid #E0DED8",
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 52, height: 70, background: "#F0EFEB",
                        borderRadius: 2, flexShrink: 0,
                      }} />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14,
                        color: "#1A1A1A", margin: "0 0 4px",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {item.product?.name || "Product"}
                      </p>
                      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#9A9A9A", margin: 0 }}>
                        Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}
                      </p>
                    </div>

                    <p style={{
                      fontFamily: "Bebas Neue, sans-serif", fontSize: 16,
                      letterSpacing: "0.04em", color: "#1A1A1A", margin: 0, flexShrink: 0,
                    }}>
                      ₹{((item.priceAtPurchase || 0) * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}

                {/* Total */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 24px", borderTop: "2px solid #E0DED8", background: "#FAFAF9",
                }}>
                  <span style={{
                    fontFamily: "DM Sans, sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase", color: "#1A1A1A",
                  }}>
                    Total
                  </span>
                  <span style={{
                    fontFamily: "Bebas Neue, sans-serif", fontSize: 22,
                    letterSpacing: "0.04em", color: "#1A1A1A",
                  }}>
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              {addr && (
                <div className="oc-fade-4" style={{
                  background: "#fff", border: "1px solid #E0DED8",
                  borderRadius: 2, marginBottom: 16, overflow: "hidden",
                }}>
                  <div style={{ padding: "14px 24px", borderBottom: "2px solid #F0EFEB" }}>
                    <span style={{
                      fontFamily: "DM Sans, sans-serif", fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.14em", textTransform: "uppercase", color: "#9A9A9A",
                    }}>
                      Shipping To
                    </span>
                  </div>
                  <div style={{ padding: "16px 24px" }}>
                    <p style={{
                      fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14,
                      color: "#1A1A1A", margin: "0 0 4px",
                    }}>
                      {addr.firstName} {addr.lastName}
                    </p>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#6B6B6B", margin: "0 0 2px", lineHeight: 1.6 }}>
                      {addr.street}
                    </p>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#6B6B6B", margin: "0 0 2px" }}>
                      {addr.city}, {addr.state} — {addr.zipcode}
                    </p>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#6B6B6B", margin: "0 0 8px" }}>
                      {addr.country}
                    </p>
                    {addr.phone && (
                      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#9A9A9A", margin: 0 }}>
                        {addr.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="oc-fade-5" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/orders"
                  style={{
                    fontFamily: "DM Sans, sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
                    background: "#1A1A1A", color: "#F5F4F0",
                    padding: "13px 28px", borderRadius: 2, border: "1px solid #1A1A1A",
                    display: "inline-block", transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#C9B99A";
                    e.currentTarget.style.color = "#1A1A1A";
                    e.currentTarget.style.borderColor = "#C9B99A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1A1A1A";
                    e.currentTarget.style.color = "#F5F4F0";
                    e.currentTarget.style.borderColor = "#1A1A1A";
                  }}
                >
                  View All Orders
                </Link>

                <Link to="/shop"
                  style={{
                    fontFamily: "DM Sans, sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
                    background: "transparent", color: "#1A1A1A",
                    padding: "13px 28px", borderRadius: 2, border: "1px solid #1A1A1A",
                    display: "inline-block", transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1A1A1A";
                    e.currentTarget.style.color = "#F5F4F0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#1A1A1A";
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}