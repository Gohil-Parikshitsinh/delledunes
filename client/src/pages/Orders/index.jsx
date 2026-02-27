import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/orders.js";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { CardSkeleton } from "../../components/ui/Skeleton.jsx";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const ORDER_STATUS_COLORS = {
  processing: { bg: "#FFF8E6", color: "#B7791F" },
  shipped:    { bg: "#EBF8FF", color: "#2B6CB0" },
  delivered:  { bg: "#F0FFF4", color: "#276749" },
  cancelled:  { bg: "#FFF5F5", color: "#E53E3E" },
};

const PAYMENT_STATUS_COLORS = {
  pending: { bg: "#FFF8E6", color: "#B7791F" },
  paid:    { bg: "#F0FFF4", color: "#276749" },
  failed:  { bg: "#FFF5F5", color: "#E53E3E" },
};

// ── STATUS BADGE ──────────────────────────────────────────────────────────────
const Badge = ({ label, type = "order" }) => {
  const map = type === "payment" ? PAYMENT_STATUS_COLORS : ORDER_STATUS_COLORS;
  const style = map[label?.toLowerCase()] || { bg: "#F5F4F0", color: "#6B6B6B" };

  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: "2px",
      }}
    >
      {label}
    </span>
  );
};

// ── ORDER CARD ────────────────────────────────────────────────────────────────
const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E6E2",
        marginBottom: "16px",
      }}
    >
      {/* ── ORDER HEADER ───────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: expanded ? "1px solid #E8E6E2" : "none",
          cursor: "pointer",
        }}
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Left — order info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "16px",
                letterSpacing: "0.08em",
                color: "#1A1A1A",
                margin: 0,
              }}
            >
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <Badge label={order.orderStatus} type="order" />
            <Badge label={order.paymentStatus} type="payment" />
          </div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#9A9A9A",
              margin: 0,
            }}
          >
            Placed on {date} · {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Right — total + expand */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "20px",
              letterSpacing: "0.06em",
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            ₹{order.totalAmount?.toLocaleString("en-IN")}
          </p>
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{
              color: "#6B6B6B",
              transition: "transform 0.2s",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              flexShrink: 0,
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ── ORDER ITEMS — expanded ──────────────────────────────────────────── */}
      {expanded && (
        <div style={{ padding: "20px 24px" }}>

          {/* Items list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
            {order.items?.map((item, i) => {
              const name = item.product?.name || "Product";
              const image = item.product?.images?.[0] || null;
              const size = item.variant?.size || "—";
              const price = item.priceSnapshot ?? 0;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                  className="order-item-row"
                >
                  {/* Image */}
                  <div
                    style={{
                      width: "64px",
                      height: "80px",
                      background: "#EDECEA",
                      flexShrink: 0,
                      overflow: "hidden",
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
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9A9A9A" }}>
                          No img
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#1A1A1A",
                        margin: "0 0 4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {name}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "#9A9A9A",
                        margin: 0,
                      }}
                    >
                      Size / {size} · Qty {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1A1A1A",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ₹{(price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #E8E6E2", paddingTop: "16px" }}>

            {/* Shipping address */}
            {order.shippingAddress && (
              <div style={{ marginBottom: "16px" }}>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#1A1A1A",
                    marginBottom: "6px",
                  }}
                >
                  Shipped To
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "#6B6B6B",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                  {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                  {order.shippingAddress.state} - {order.shippingAddress.zipcode}<br />
                  {order.shippingAddress.phone}
                </p>
              </div>
            )}

            {/* Order summary */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#9A9A9A" }}>
                  Subtotal
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1A1A1A", fontWeight: 600 }}>
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#9A9A9A" }}>
                  Shipping
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#C9B99A", fontWeight: 600 }}>
                  {order.totalAmount >= 2999 ? "FREE" : "₹199"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #E8E6E2",
                  paddingTop: "8px",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "16px",
                    letterSpacing: "0.06em",
                    color: "#1A1A1A",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "16px",
                    letterSpacing: "0.06em",
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
  );
};

// ── ORDERS PAGE ───────────────────────────────────────────────────────────────
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const FILTER_OPTIONS = [
    { label: "All Orders", value: "all" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.orderStatus === filter);

  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: "2px solid #1A1A1A",
            paddingBottom: "8px",
            marginBottom: "32px",
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
            My Orders
          </h1>

          {!loading && orders.length > 0 && (
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#9A9A9A",
                marginBottom: "6px",
              }}
            >
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Filter tabs */}
        {!loading && orders.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "24px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                style={{
                  padding: "7px 16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                  background: filter === opt.value ? "#1A1A1A" : "#fff",
                  color: filter === opt.value ? "#F5F4F0" : "#6B6B6B",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} height="100px" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet."
            message="Looks like you haven't placed any orders. Start shopping and your orders will appear here."
            actionLabel="Start Shopping"
            actionTo="/shop"
          />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            title={`No ${filter} orders.`}
            message="No orders found for this filter."
            actionLabel="View All Orders"
            onAction={() => setFilter("all")}
          />
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .order-item-row { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
};

export default Orders;