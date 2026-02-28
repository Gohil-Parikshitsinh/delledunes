import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getOrderById } from "../../api/orders";
import useCart from "../../hooks/useCart.js";

const styles = `
  @keyframes fadeLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeRight {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
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
  .col-left  { animation: fadeLeft  0.55s ease both; animation-delay: 0.1s; }
  .col-right { animation: fadeRight 0.55s ease both; animation-delay: 0.2s; }
  .oc-circle { stroke-dasharray: 220; animation: circleDraw 0.6s ease 0.05s both; }
  .oc-check  { stroke-dasharray: 80;  animation: checkDraw  0.4s ease 0.6s both; }
  .skeleton  { background: #F0EFEB; animation: pulse 1.5s infinite; border-radius: 2px; }

  .track-btn {
    font-family: "DM Sans", sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    background: #1A1A1A;
    color: #F5F4F0;
    padding: 13px 32px;
    border-radius: 2px;
    border: 1px solid #1A1A1A;
    display: inline-block;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .track-btn:hover {
    background: #C9B99A;
    color: #1A1A1A;
    border-color: #C9B99A;
  }

  .shop-btn {
    font-family: "DM Sans", sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    background: transparent;
    color: #1A1A1A;
    padding: 13px 32px;
    border-radius: 2px;
    border: 1px solid #1A1A1A;
    display: inline-block;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .shop-btn:hover {
    background: #1A1A1A;
    color: #F5F4F0;
  }

  .item-row:last-child {
    border-bottom: none !important;
  }

  @media (max-width: 768px) {
    .oc-grid {
      flex-direction: column !important;
    }
    .col-left, .col-right {
      width: 100% !important;
    }
  }
`;

function SkeletonLine({ w = "100%", h = 12 }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, marginBottom: 8 }}
    />
  );
}

function StatusBadge({ status }) {
  const map = {
    processing: { bg: "#EBF4FF", color: "#2B6CB0" },
    shipped: { bg: "#FFFBEB", color: "#B7791F" },
    delivered: { bg: "#F0FFF4", color: "#276749" },
    cancelled: { bg: "#FFF5F5", color: "#E53E3E" },
  };
  const s = map[status] || map.processing;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontFamily: "DM Sans, sans-serif",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: 2,
      }}
    >
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const map = {
    pending: { bg: "#FFFBEB", color: "#B7791F" },
    paid: { bg: "#F0FFF4", color: "#276749" },
    failed: { bg: "#FFF5F5", color: "#E53E3E" },
  };
  const s = map[status] || map.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontFamily: "DM Sans, sans-serif",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: 2,
      }}
    >
      {status}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
      <span
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: "#1A1A1A",
          minWidth: 72,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: 12,
          color: "#6B6B6B",
          lineHeight: 1.5,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("No order ID provided.");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);
  useEffect(() => {
    clearCart();
  }, []);

  // Countdown redirect
  useEffect(() => {
    if (!orderId || !order) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/shop");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [orderId, order]);
  const addr = order?.shippingAddress;

  const shipping = order?.totalAmount >= 2999 ? 0 : 199;
  const subtotal =
    order?.items?.reduce(
      (acc, item) => acc + (item.priceAtPurchase || 0) * item.quantity,
      0
    ) ?? 0;

  const createdAt = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          minHeight: "100vh",
          background: "#F5F4F0",
          fontFamily: "DM Sans, sans-serif",
          padding: "56px 24px 80px",
        }}
      >
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          {/* ERROR */}
          {error && (
            <div
              style={{
                background: "#FFF5F5",
                border: "1px solid #E53E3E",
                borderRadius: 2,
                padding: "20px 24px",
                color: "#E53E3E",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* SKELETON */}
          {loading && (
            <div style={{ display: "flex", gap: 32 }}>
              <div style={{ flex: 1 }}>
                <SkeletonLine h={40} w="70%" />
                <SkeletonLine h={14} w="90%" />
                <SkeletonLine h={14} w="60%" />
              </div>
              <div style={{ flex: 1 }}>
                <SkeletonLine h={200} />
              </div>
            </div>
          )}

          {/* MAIN LAYOUT */}
          {order && (
            <div
              className="oc-grid"
              style={{ display: "flex", gap: 48, alignItems: "flex-start" }}
            >
              {/* ── LEFT COLUMN ── */}
              <div
                className="col-left"
                style={{ flex: "0 0 380px", width: 380 }}
              >
                {/* Animated check */}
                <div style={{ marginBottom: 28 }}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 72 72"
                    fill="none"
                    style={{ marginBottom: 20 }}
                  >
                    <circle
                      className="oc-circle"
                      cx="36"
                      cy="36"
                      r="34"
                      stroke="#1A1A1A"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    <polyline
                      className="oc-check"
                      points="22,37 32,47 51,27"
                      stroke="#1A1A1A"
                      strokeWidth="2.5"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      fill="none"
                    />
                  </svg>

                  <h1
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: 52,
                      letterSpacing: "0.03em",
                      color: "#1A1A1A",
                      margin: "0 0 12px",
                      lineHeight: 1.05,
                    }}
                  >
                    Thank you for
                    <br />
                    your purchase!
                  </h1>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 13,
                      color: "#6B6B6B",
                      margin: "0 0 32px",
                      lineHeight: 1.6,
                      maxWidth: 300,
                    }}
                  >
                    Your order will be processed within 24 hours during working
                    days. We will notify you once your order has been shipped.
                  </p>
                </div>

                {/* Billing / Shipping Address */}
                {addr && (
                  <div style={{ marginBottom: 32 }}>
                    <p
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#1A1A1A",
                        margin: "0 0 14px",
                      }}
                    >
                      Shipping Address
                    </p>

                    <InfoRow
                      label="Name"
                      value={`${addr.firstName} ${addr.lastName}`}
                    />
                    <InfoRow
                      label="Address"
                      value={`${addr.street}, ${addr.city}, ${addr.state} ${addr.zipcode}, ${addr.country}`}
                    />
                    {addr.phone && <InfoRow label="Phone" value={addr.phone} />}
                    {addr.email && <InfoRow label="Email" value={addr.email} />}
                  </div>
                )}

                {/* CTA buttons */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link to="/orders" className="track-btn">
                    Track Your Order
                  </Link>
                  <Link to="/shop" className="shop-btn">
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* ── RIGHT COLUMN — Order Summary ── */}
              <div className="col-right" style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #E0DED8",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: "20px 24px",
                      borderBottom: "2px solid #F0EFEB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: 22,
                        letterSpacing: "0.06em",
                        color: "#1A1A1A",
                        margin: 0,
                      }}
                    >
                      Order Summary
                    </h2>
                    <div style={{ display: "flex", gap: 8 }}>
                      <StatusBadge status={order.orderStatus} />
                      <PaymentBadge status={order.paymentStatus} />
                    </div>
                  </div>

                  {/* Meta row — date / order ID / payment */}
                  <div
                    style={{
                      display: "flex",
                      gap: 0,
                      borderBottom: "1px solid #F0EFEB",
                      background: "#FAFAF9",
                    }}
                  >
                    {[
                      { label: "Date", value: createdAt || "—" },
                      {
                        label: "Order Number",
                        value: order._id.slice(-10).toUpperCase(),
                      },
                      {
                        label: "Payment",
                        value:
                          order.paymentStatus === "paid"
                            ? "Paid"
                            : "COD / Pending",
                      },
                    ].map((col, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          padding: "14px 20px",
                          borderRight: i < 2 ? "1px solid #F0EFEB" : "none",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "#9A9A9A",
                            margin: "0 0 4px",
                          }}
                        >
                          {col.label}
                        </p>
                        <p
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#1A1A1A",
                            margin: 0,
                          }}
                        >
                          {col.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Items */}
                  {order.items?.map((item, i) => (
                    <div
                      key={i}
                      className="item-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "16px 24px",
                        borderBottom: "1px solid #F8F8F7",
                      }}
                    >
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product?.name}
                          style={{
                            width: 56,
                            height: 74,
                            objectFit: "cover",
                            borderRadius: 2,
                            flexShrink: 0,
                            border: "1px solid #E0DED8",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 56,
                            height: 74,
                            background: "#F0EFEB",
                            borderRadius: 2,
                            flexShrink: 0,
                          }}
                        />
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#1A1A1A",
                            margin: "0 0 4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.product?.name || "Product"}
                        </p>
                        <p
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: 12,
                            color: "#9A9A9A",
                            margin: "0 0 2px",
                          }}
                        >
                          Size: {item.size}
                        </p>
                        <p
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: 12,
                            color: "#9A9A9A",
                            margin: 0,
                          }}
                        >
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p
                        style={{
                          fontFamily: "Bebas Neue, sans-serif",
                          fontSize: 17,
                          letterSpacing: "0.04em",
                          color: "#1A1A1A",
                          margin: 0,
                          flexShrink: 0,
                        }}
                      >
                        ₹
                        {(
                          (item.priceAtPurchase || 0) * item.quantity
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}

                  {/* Totals */}
                  <div
                    style={{
                      padding: "16px 24px",
                      background: "#FAFAF9",
                      borderTop: "1px solid #F0EFEB",
                    }}
                  >
                    {[
                      {
                        label: "Sub Total",
                        value: `₹${subtotal.toLocaleString("en-IN")}`,
                      },
                      {
                        label: "Shipping",
                        value: shipping === 0 ? "Free" : `₹${shipping}`,
                      },
                      ...(order.discountAmount > 0
                        ? [
                            {
                              label: `Discount (${order.couponCode})`,
                              value: `− ₹${order.discountAmount.toLocaleString(
                                "en-IN"
                              )}`,
                              green: true,
                            },
                          ]
                        : []),
                    ].map((row) => (
                      <div
                        key={row.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: 13,
                            color: row.green ? "#276749" : "#6B6B6B",
                          }}
                        >
                          {row.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: 13,
                            color: row.green ? "#276749" : "#6B6B6B",
                            fontWeight: row.green ? 700 : 400,
                          }}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 24px",
                      borderTop: "2px solid #E0DED8",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#1A1A1A",
                      }}
                    >
                      Order Total
                    </span>
                    <span
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: 26,
                        letterSpacing: "0.04em",
                        color: "#1A1A1A",
                      }}
                    >
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <p
        style={{
          fontFamily: "DM Sans,sans-serif",
          fontSize: 12,
          color: "#9A9A9A",
          marginTop: 16,
        }}
      >
        Redirecting to shop in {countdown}s...
      </p>
    </>
  );
}
