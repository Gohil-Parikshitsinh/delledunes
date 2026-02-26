import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import { FEATURES } from "../../constants/index.js";

// ── NAV ITEMS ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    section: "Main",
    items: [
      {
        label: "Dashboard",
        to: "/admin",
        icon: (
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Catalogue",
    items: [
      {
        label: "Products",
        to: "/admin/products",
        icon: (
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          </svg>
        ),
      },
      {
        label: "Categories",
        to: "/admin/categories",
        icon: (
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
          </svg>
        ),
      },
      {
        label: "Inventory",
        to: "/admin/inventory",
        icon: (
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Sales",
    items: [
      {
        label: "Orders",
        to: "/admin/orders",
        icon: (
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
      },
      {
        label: "Customers",
        to: "/admin/customers",
        icon: (
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Analytics",
    items: [
      {
        label: "Reports",
        to: "/admin/reports",
        icon: (
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
        ),
      },
      ...(FEATURES.mlPredictions
        ? [
            {
              label: "Predictions",
              to: "/admin/predictions",
              icon: (
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
            },
          ]
        : []),
    ],
  },
];

// ── SIDEBAR CONTENT ───────────────────────────────────────────────────────────
const SidebarContent = ({ onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to) => {
    if (to === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(to);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#fff",
      }}
    >
      {/* ── LOGO ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid #F5F5F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/admin"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "18px",
            letterSpacing: "0.16em",
            color: "#1A1A1A",
            textDecoration: "none",
          }}
        >
          DELLE DUNES
        </Link>

        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9A9A9A",
              padding: "4px",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            {/* Section label */}
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#ADADAD",
                padding: "0 8px",
                marginBottom: "6px",
              }}
            >
              {group.section}
            </p>

            {/* Nav items */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              {group.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 10px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: active ? 600 : 500,
                      color: active ? "#1A1A1A" : "#6B6B6B",
                      background: active ? "#F5F4F0" : "transparent",
                      transition: "all 0.15s",
                      borderLeft: active
                        ? "2px solid #C9B99A"
                        : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "#FAFAFA";
                        e.currentTarget.style.color = "#1A1A1A";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#6B6B6B";
                      }
                    }}
                  >
                    <span style={{ color: active ? "#C9B99A" : "#9A9A9A" }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── USER PROFILE ─────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #F5F5F5",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          {/* Avatar placeholder */}
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "#F5F4F0",
              border: "1px solid #E8E6E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "14px",
              color: "#1A1A1A",
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#1A1A1A",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name}
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "#9A9A9A",
                margin: 0,
                textTransform: "capitalize",
              }}
            >
              {user?.role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            borderRadius: "6px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: "#6B6B6B",
            letterSpacing: "0.04em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FFF0F0";
            e.currentTarget.style.color = "#E53E3E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#6B6B6B";
          }}
        >
          <svg
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

// ── ADMIN LAYOUT ──────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8F8F7" }}>
      {/* ── DESKTOP SIDEBAR — fixed, always visible ────────────────────────── */}
      <aside
        className="hidden lg:block"
        style={{
          width: "240px",
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          borderRight: "1px solid #F0EFEB",
          zIndex: 50,
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── MOBILE/TABLET DRAWER ───────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        className="lg:hidden"
        onClick={() => setDrawerOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 100,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      />

      {/* Drawer panel */}
      <div
        className="lg:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "260px",
          zIndex: 110,
          borderRight: "1px solid #F0EFEB",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <SidebarContent onClose={() => setDrawerOpen(false)} />
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          marginLeft: 0,
        }}
        className="lg:ml-[240px]"
      >
         <style>{`
    @media (min-width: 1024px) {
      .admin-main { margin-left: 240px; }
    }
  `}</style>
        <div
          className="admin-main"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 40,
              background: "#fff",
              borderBottom: "1px solid #F0EFEB",
              padding: "14px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            {/* Mobile hamburger */}
            <button
              className="lg:hidden"
              onClick={() => setDrawerOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#1A1A1A",
                padding: "4px",
                flexShrink: 0,
              }}
              aria-label="Open menu"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Search */}
            <div
              style={{
                flex: 1,
                maxWidth: "380px",
                position: "relative",
              }}
            >
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
                placeholder="Search..."
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 36px",
                  background: "#F8F8F7",
                  border: "1px solid #F0EFEB",
                  borderRadius: "6px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#1A1A1A",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C9B99A")}
                onBlur={(e) => (e.target.style.borderColor = "#F0EFEB")}
              />
            </div>

            {/* Right — notification + view store */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Notification bell */}
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6B6B6B",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F8F8F7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </button>

              {/* View store link */}
              <Link
                to="/"
                target="_blank"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#1A1A1A",
                  textDecoration: "none",
                  padding: "7px 14px",
                  border: "1px solid #1A1A1A",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
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
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                <span className="hidden sm:inline">View Store</span>
              </Link>
            </div>
          </header>

          {/* ── PAGE CONTENT ───────────────────────────────────────────────── */}
          <main style={{ flex: 1, padding: "24px" }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
