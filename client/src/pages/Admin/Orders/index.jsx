import { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../../api/orders";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const ORDER_STATUSES = ["processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES = {
  processing: { bg: "#FFF8E6", color: "#B7791F" },
  shipped: { bg: "#EBF8FF", color: "#2B6CB0" },
  delivered: { bg: "#F0FFF4", color: "#276749" },
  cancelled: { bg: "#FFF5F5", color: "#E53E3E" },
  pending: { bg: "#F5F4F0", color: "#9A9A9A" },
};

const PAYMENT_STYLES = {
  pending: { bg: "#FFF8E6", color: "#B7791F" },
  paid: { bg: "#F0FFF4", color: "#276749" },
  failed: { bg: "#FFF5F5", color: "#E53E3E" },
};

// ── BADGE ─────────────────────────────────────────────────────────────────────
const Badge = ({ label, type = "order" }) => {
  const map = type === "payment" ? PAYMENT_STYLES : STATUS_STYLES;
  const style = map[label?.toLowerCase()] || {
    bg: "#F5F4F0",
    color: "#9A9A9A",
  };
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
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

// ── ORDER DETAIL DRAWER ───────────────────────────────────────────────────────
const OrderDrawer = ({ order, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(order.orderStatus);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleStatusUpdate = async () => {
    if (status === order.orderStatus) return;
    setUpdating(true);
    setError("");
    try {
      await onStatusUpdate(order._id, status);
    } catch {
      setError("Failed to update status");
      setStatus(order.orderStatus);
    } finally {
      setUpdating(false);
    }
  };

  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 100,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(520px, 100vw)",
          height: "100vh",
          background: "#fff",
          zIndex: 101,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F0EFEB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 1,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "20px",
                letterSpacing: "0.06em",
                color: "#1A1A1A",
                margin: "0 0 4px",
              }}
            >
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "#9A9A9A",
                margin: 0,
              }}
            >
              Placed on {date}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              background: "none",
              border: "1px solid #E0DED8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer body */}
        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flex: 1,
          }}
        >
          {/* Status badges */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Badge label={order.orderStatus} type="order" />
            <Badge label={order.paymentStatus} type="payment" />
          </div>

          {/* Status update */}
          <div
            style={{
              padding: "16px",
              background: "#F5F4F0",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#1A1A1A",
                margin: 0,
              }}
            >
              Update Order Status
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  style={{
                    padding: "6px 14px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    background: status === s ? "#1A1A1A" : "#fff",
                    color: status === s ? "#F5F4F0" : "#6B6B6B",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            {error && (
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "#E53E3E",
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}
            <button
              onClick={handleStatusUpdate}
              disabled={updating || status === order.orderStatus}
              style={{
                padding: "9px 20px",
                background: "#1A1A1A",
                color: "#F5F4F0",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "none",
                cursor:
                  updating || status === order.orderStatus
                    ? "not-allowed"
                    : "pointer",
                opacity: updating || status === order.orderStatus ? 0.5 : 1,
                alignSelf: "flex-start",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!updating && status !== order.orderStatus) {
                  e.currentTarget.style.background = "#C9B99A";
                  e.currentTarget.style.color = "#1A1A1A";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1A1A1A";
                e.currentTarget.style.color = "#F5F4F0";
              }}
            >
              {updating ? "Updating..." : "Save Status"}
            </button>
          </div>

          {/* Customer info */}
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
              Customer
            </p>
            <div
              style={{
                padding: "14px",
                border: "1px solid #F0EFEB",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1A1A1A",
                  margin: 0,
                }}
              >
                {order.userId?.name || "Guest"}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#9A9A9A",
                  margin: 0,
                }}
              >
                {order.userId?.email || "—"}
              </p>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
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
                Shipping Address
              </p>
              <div
                style={{
                  padding: "14px",
                  border: "1px solid #F0EFEB",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#6B6B6B",
                  lineHeight: 1.7,
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    color: "#1A1A1A",
                    margin: "0 0 4px",
                  }}
                >
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p style={{ margin: 0 }}>
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.zipcode}
                  <br />
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>
          )}

          {/* Order items */}
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
              Items ({order.items?.length})
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {order.items?.map((item, i) => {
                const name = item.product?.name || "Product";
                const image = item.product?.images?.[0] || null;
                const size = item.variant?.size || "—";
                const price = item.priceAtPurchase ?? 0;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px",
                      border: "1px solid #F0EFEB",
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "66px",
                        background: "#EDECEA",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
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
                          <span style={{ fontSize: "10px", color: "#9A9A9A" }}>
                            —
                          </span>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1A1A1A",
                          margin: "0 0 4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {name}
                      </p>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "11px",
                          color: "#9A9A9A",
                          margin: "0 0 6px",
                        }}
                      >
                        Size / {size} · Qty {item.quantity}
                      </p>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#1A1A1A",
                          margin: 0,
                        }}
                      >
                        ₹{(price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order summary */}
          <div
            style={{
              padding: "16px",
              background: "#1A1A1A",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#9A9A9A",
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#F5F4F0",
                  fontWeight: 600,
                }}
              >
                ₹{order.totalAmount?.toLocaleString("en-IN")}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#9A9A9A",
                }}
              >
                Shipping
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#C9B99A",
                  fontWeight: 600,
                }}
              >
                {order.totalAmount >= 2999 ? "FREE" : "₹199"}
              </span>
            </div>
            {order.couponCode && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "#9A9A9A",
                  }}
                >
                  Coupon ({order.couponCode})
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "#C9B99A",
                    fontWeight: 600,
                  }}
                >
                  -₹{order.discount?.toLocaleString("en-IN") || 0}
                </span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #333",
                paddingTop: "10px",
                marginTop: "4px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "16px",
                  letterSpacing: "0.06em",
                  color: "#F5F4F0",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "16px",
                  letterSpacing: "0.06em",
                  color: "#C9B99A",
                }}
              >
                ₹{order.totalAmount?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Order notes */}
          {order.notes && (
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#1A1A1A",
                  marginBottom: "8px",
                }}
              >
                Order Notes
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#6B6B6B",
                  lineHeight: 1.7,
                  padding: "12px",
                  border: "1px solid #F0EFEB",
                  margin: 0,
                }}
              >
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ── ADMIN ORDERS PAGE ─────────────────────────────────────────────────────────
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o))
    );
    setSelectedOrder((prev) =>
      prev?._id === orderId ? { ...prev, orderStatus: status } : prev
    );
  };

  const FILTERS = [
    { label: "All", value: "all" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const filtered = orders
    .filter((o) => filter === "all" || o.orderStatus === filter)
    .filter((o) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        o._id.toLowerCase().includes(q) ||
        o.userId?.name?.toLowerCase().includes(q) ||
        o.userId?.email?.toLowerCase().includes(q)
      );
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
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
            Orders
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#9A9A9A",
              margin: 0,
            }}
          >
            {loading ? "Loading..." : `${orders.length} orders total`}
          </p>
        </div>
      </div>

      {/* Filter + Search row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
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
                background: filter === f.value ? "#1A1A1A" : "#fff",
                color: filter === f.value ? "#F5F4F0" : "#6B6B6B",
              }}
            >
              {f.label}
              {f.value !== "all" && (
                <span style={{ marginLeft: "6px", opacity: 0.6 }}>
                  ({orders.filter((o) => o.orderStatus === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
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
            placeholder="Search by order ID or customer..."
            style={{
              padding: "9px 12px 9px 36px",
              background: "#fff",
              border: "1px solid #F0EFEB",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#1A1A1A",
              outline: "none",
              width: "280px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C9B99A")}
            onBlur={(e) => (e.target.style.borderColor = "#F0EFEB")}
          />
        </div>
      </div>

      {/* Table */}
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
                "Order ID",
                "Customer",
                "Items",
                "Total",
                "Order Status",
                "Payment",
                "Date",
                "Action",
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
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F8F8F7" }}>
                  {Array.from({ length: 8 }).map((_, j) => (
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
                  colSpan={8}
                  style={{
                    padding: "60px 24px",
                    textAlign: "center",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    color: "#9A9A9A",
                  }}
                >
                  {search
                    ? `No orders found for "${search}"`
                    : "No orders yet."}
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const date = new Date(order.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                );
                return (
                  <tr
                    key={order._id}
                    style={{
                      borderBottom: "1px solid #F8F8F7",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FAFAF9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Order ID */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "14px",
                          letterSpacing: "0.08em",
                          color: "#1A1A1A",
                        }}
                      >
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: "14px 16px" }}>
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
                        {order.userId?.name || "Guest"}
                      </p>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "11px",
                          color: "#9A9A9A",
                          margin: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.userId?.email || "—"}
                      </p>
                    </td>

                    {/* Items */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          color: "#6B6B6B",
                        }}
                      >
                        {order.items?.length} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </span>
                    </td>

                    {/* Total */}
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "16px",
                          letterSpacing: "0.04em",
                          color: "#1A1A1A",
                        }}
                      >
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Order Status */}
                    <td style={{ padding: "14px 16px" }}>
                      <Badge label={order.orderStatus} type="order" />
                    </td>

                    {/* Payment */}
                    <td style={{ padding: "14px 16px" }}>
                      <Badge label={order.paymentStatus} type="payment" />
                    </td>

                    {/* Date */}
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          color: "#9A9A9A",
                        }}
                      >
                        {date}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          padding: "6px 14px",
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
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order detail drawer */}
      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default AdminOrders;
