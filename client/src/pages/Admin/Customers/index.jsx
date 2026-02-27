import { useState, useEffect } from "react";
import { getAllUsers, getUserById, deleteUser } from "../../../api/admin.js";

// ── BADGE ─────────────────────────────────────────────────────────────────────
const Badge = ({ label, bg, color }) => (
  <span style={{
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
  }}>
    {label}
  </span>
);

// ── CUSTOMER DRAWER ───────────────────────────────────────────────────────────
const CustomerDrawer = ({ customer, onClose, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoadingOrders(true);
      try {
        const data = await getUserById(customer._id);
        setOrders(data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchCustomerDetails();
  }, [customer._id]);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      await onDelete(customer._id);
      onClose();
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const joinDate = new Date(customer.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const totalSpent = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 100,
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed",
        top: 0, right: 0,
        width: "min(480px, 100vw)",
        height: "100vh",
        background: "#fff",
        zIndex: 101,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #F0EFEB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 1,
        }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "20px",
            letterSpacing: "0.06em",
            color: "#1A1A1A",
            margin: 0,
          }}>
            Customer Details
          </h2>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px",
              background: "none", border: "1px solid #E0DED8",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Avatar + info */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "56px", height: "56px",
              background: "#1A1A1A",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "22px",
                color: "#C9B99A",
                letterSpacing: "0.04em",
              }}>
                {customer.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#1A1A1A",
                margin: "0 0 4px",
              }}>
                {customer.name}
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#9A9A9A",
                margin: "0 0 6px",
              }}>
                {customer.email}
              </p>
              <Badge
                label={customer.role === "admin" ? "Admin" : "Customer"}
                bg={customer.role === "admin" ? "#1A1A1A" : "#F5F4F0"}
                color={customer.role === "admin" ? "#C9B99A" : "#6B6B6B"}
              />
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
          }}>
            {[
              { label: "Total Orders", value: orders.length },
              { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}` },
              { label: "Member Since", value: new Date(customer.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) },
            ].map((stat) => (
              <div key={stat.label} style={{
                padding: "14px",
                background: "#F5F4F0",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9A9A9A",
                  margin: 0,
                }}>
                  {stat.label}
                </p>
                <p style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "18px",
                  letterSpacing: "0.04em",
                  color: "#1A1A1A",
                  margin: 0,
                }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Account info */}
          <div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#1A1A1A",
              marginBottom: "10px",
            }}>
              Account Info
            </p>
            <div style={{
              border: "1px solid #F0EFEB",
              display: "flex",
              flexDirection: "column",
            }}>
              {[
                { label: "Full Name", value: customer.name },
                { label: "Email", value: customer.email },
                { label: "Role", value: customer.role || "customer" },
                { label: "Joined", value: joinDate },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  borderBottom: i < arr.length - 1 ? "1px solid #F0EFEB" : "none",
                }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "#9A9A9A",
                    fontWeight: 600,
                  }}>
                    {row.label}
                  </span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "#1A1A1A",
                    fontWeight: 500,
                    textAlign: "right",
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent orders */}
          <div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#1A1A1A",
              marginBottom: "10px",
            }}>
              Recent Orders
            </p>

            {loadingOrders ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{
                    height: "56px",
                    background: "#F0EFEB",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }} />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#9A9A9A",
                padding: "16px",
                border: "1px solid #F0EFEB",
                margin: 0,
                textAlign: "center",
              }}>
                No orders yet.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    border: "1px solid #F0EFEB",
                  }}>
                    <div>
                      <p style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "13px",
                        letterSpacing: "0.08em",
                        color: "#1A1A1A",
                        margin: "0 0 3px",
                      }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "11px",
                        color: "#9A9A9A",
                        margin: 0,
                      }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#1A1A1A",
                      }}>
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </span>
                      <Badge
                        label={order.orderStatus}
                        bg={
                          order.orderStatus === "delivered" ? "#F0FFF4" :
                          order.orderStatus === "shipped" ? "#EBF8FF" :
                          order.orderStatus === "cancelled" ? "#FFF5F5" : "#FFF8E6"
                        }
                        color={
                          order.orderStatus === "delivered" ? "#276749" :
                          order.orderStatus === "shipped" ? "#2B6CB0" :
                          order.orderStatus === "cancelled" ? "#E53E3E" : "#B7791F"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger zone */}
          {customer.role !== "admin" && (
            <div style={{
              padding: "16px",
              border: "1px solid #FED7D7",
              background: "#FFF5F5",
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#E53E3E",
                marginBottom: "8px",
              }}>
                Danger Zone
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "#6B6B6B",
                marginBottom: "12px",
              }}>
                Deleting this customer will permanently remove their account and all associated data.
              </p>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: "8px 20px",
                  background: confirmDelete ? "#E53E3E" : "none",
                  color: confirmDelete ? "#fff" : "#E53E3E",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: "1.5px solid #E53E3E",
                  cursor: deleting ? "not-allowed" : "pointer",
                  transition: "all 0.15s",
                }}
              >
                {deleting ? "Deleting..." : confirmDelete ? "Confirm Delete?" : "Delete Customer"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ── ADMIN CUSTOMERS PAGE ──────────────────────────────────────────────────────
const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();      
      setCustomers(data.users || []);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    setCustomers((prev) => prev.filter((c) => c._id !== id));
  };

  const FILTERS = [
    { label: "All", value: "all" },
    { label: "Customers", value: "customer" },
    { label: "Admins", value: "admin" },
  ];

  const filtered = customers
    .filter((c) => filter === "all" || c.role === filter)
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(28px, 3vw, 40px)",
          letterSpacing: "0.04em",
          color: "#1A1A1A",
          margin: "0 0 4px",
        }}>
          Customers
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: "#9A9A9A",
          margin: 0,
        }}>
          {loading ? "Loading..." : `${customers.length} customers total`}
        </p>
      </div>

      {/* Filter + Search */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div style={{ display: "flex", gap: "4px" }}>
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
                transition: "all 0.15s",
                background: filter === f.value ? "#1A1A1A" : "#fff",
                color: filter === f.value ? "#F5F4F0" : "#6B6B6B",
              }}
            >
              {f.label}
              {f.value !== "all" && (
                <span style={{ marginLeft: "6px", opacity: 0.6 }}>
                  ({customers.filter((c) => c.role === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9A9A9A" }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              padding: "9px 12px 9px 36px",
              background: "#fff",
              border: "1px solid #F0EFEB",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#1A1A1A",
              outline: "none",
              width: "260px",
            }}
            onFocus={(e) => e.target.style.borderColor = "#C9B99A"}
            onBlur={(e) => e.target.style.borderColor = "#F0EFEB"}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #F0EFEB", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #F0EFEB" }}>
              {["Customer", "Email", "Role", "Joined", "Action"].map((h) => (
                <th key={h} style={{
                  padding: "14px 16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#9A9A9A",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F8F8F7" }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} style={{ padding: "16px" }}>
                      <div style={{
                        height: "12px",
                        background: "#F0EFEB",
                        borderRadius: "2px",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{
                  padding: "60px 24px",
                  textAlign: "center",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "#9A9A9A",
                }}>
                  {search ? `No customers found for "${search}"` : "No customers yet."}
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr
                  key={customer._id}
                  style={{ borderBottom: "1px solid #F8F8F7", transition: "background 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAF9"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  {/* Customer */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "34px", height: "34px",
                        background: "#1A1A1A",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <span style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "14px",
                          color: "#C9B99A",
                        }}>
                          {customer.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1A1A1A",
                        whiteSpace: "nowrap",
                      }}>
                        {customer.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: "#6B6B6B",
                    }}>
                      {customer.email}
                    </span>
                  </td>

                  {/* Role */}
                  <td style={{ padding: "14px 16px" }}>
                    <Badge
                      label={customer.role || "customer"}
                      bg={customer.role === "admin" ? "#1A1A1A" : "#F5F4F0"}
                      color={customer.role === "admin" ? "#C9B99A" : "#6B6B6B"}
                    />
                  </td>

                  {/* Joined */}
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      color: "#9A9A9A",
                    }}>
                      {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: "14px 16px" }}>
                    <button
                      onClick={() => setSelectedCustomer(customer)}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer drawer */}
      {selectedCustomer && (
        <CustomerDrawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onDelete={handleDelete}
        />
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default AdminCustomers;