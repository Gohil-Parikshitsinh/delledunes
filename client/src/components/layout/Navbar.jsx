import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import { getAllCategories } from "../../api/categories.js";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categoryRef = useRef(null);
  const searchRef = useRef(null);

  // Cart count — replace with CartContext later
  const cartCount = 0;

  // ── FETCH CATEGORIES ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.data || []);
      } catch {
        // fail silently
      }
    };
    fetchCategories();
  }, []);

  // ── CLOSE ON OUTSIDE CLICK ──────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── LOCK BODY SCROLL ─────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleCategoryClick = (slug) => {
    navigate(`/shop?category=${slug}`);
    setCategoryDropdownOpen(false);
    setDrawerOpen(false);
    setMobileCategoryOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery.trim()}`);
      setSearchQuery("");
      setSearchOpen(false);
      setDrawerOpen(false);
    }
  };

  const handleLogout = async () => {
    setDrawerOpen(false);
    await logout();
  };

  // ── NAV LINK STYLE ──────────────────────────────────────────────────────────
  const navLink = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#1A1A1A",
    textDecoration: "none",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  };

  return (
    <>
      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav
        style={{
          background: "#F5F4F0",
          borderBottom: "1px solid #1A1A1A",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "14px 24px",
            maxWidth: "100%",
          }}
        >
          {/* ── LEFT — Categories ─────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
            }}
          >
            {/* Desktop left links */}
            <div className="hidden md:flex items-center gap-7">
              {/* Categories dropdown */}
              <div ref={categoryRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setCategoryDropdownOpen((p) => !p)}
                  style={{
                    ...navLink,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Categories
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{
                      transition: "transform 0.2s",
                      transform: categoryDropdownOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                {categoryDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 14px)",
                      left: 0,
                      background: "#F5F4F0",
                      border: "1px solid #1A1A1A",
                      minWidth: "160px",
                      zIndex: 200,
                    }}
                  >
                    {categories.length === 0 ? (
                      <div
                        style={{
                          padding: "12px 16px",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          color: "#9A9A9A",
                        }}
                      >
                        No categories
                      </div>
                    ) : (
                      categories.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => handleCategoryClick(cat.slug)}
                          style={{
                            ...navLink,
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "11px 16px",
                            borderBottom: "1px solid #E8E6E2",
                            fontSize: "12px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#C9B99A")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#1A1A1A")
                          }
                        >
                          {cat.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/shop"
                style={navLink}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9B99A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1A1A1A")}
              >
                Shop
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setDrawerOpen(true)}
              style={{ ...navLink, padding: "4px" }}
              aria-label="Open menu"
            >
              <svg
                width="22"
                height="22"
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
          </div>

          {/* ── CENTER — Brand Wordmark ────────────────────────────────────── */}
          <Link
            to="/"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(22px, 3vw, 32px)",
              letterSpacing: "0.16em",
              color: "#1A1A1A",
              textDecoration: "none",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            DELLE DUNES
          </Link>

          {/* ── RIGHT — Search, Account, Wishlist, Cart ───────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "24px",
            }}
          >
            {/* Desktop right links */}
            <div
              className="hidden md:flex"
              style={{ alignItems: "center", gap: "24px" }}
            >
              {/* Search — inline expanding input */}
              <form
                onSubmit={handleSearch}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: searchOpen
                    ? "1px solid #1A1A1A"
                    : "1px solid transparent",
                  transition: "border-color 0.2s",
                }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                  placeholder="Search..."
                  style={{
                    width: searchOpen ? "160px" : "0px",
                    opacity: searchOpen ? 1 : 0,
                    padding: searchOpen ? "4px 8px 4px 0" : "0",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "#1A1A1A",
                    transition:
                      "width 0.3s ease, opacity 0.3s ease, padding 0.3s ease",
                    overflow: "hidden",
                  }}
                />
                <button
                  type={searchOpen ? "submit" : "button"}
                  onClick={() => !searchOpen && setSearchOpen(true)}
                  style={{
                    ...navLink,
                    padding: "4px 0",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#C9B99A")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#1A1A1A")
                  }
                >
                  Search
                </button>
              </form>

              {/* Account */}
              {isAuthenticated ? (
                <div style={{ position: "relative" }} className="group">
                  <button
                    style={navLink}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#C9B99A")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#1A1A1A")
                    }
                  >
                    {user?.name?.split(" ")[0]}
                  </button>

                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 14px)",
                      right: 0,
                      background: "#F5F4F0",
                      border: "1px solid #1A1A1A",
                      minWidth: "160px",
                      zIndex: 200,
                      display: "none",
                    }}
                    className="group-hover:!block"
                  >
                    {isAdmin && (
                      <Link
                        to="/admin"
                        style={{
                          ...navLink,
                          display: "block",
                          padding: "11px 16px",
                          borderBottom: "1px solid #E8E6E2",
                          fontSize: "12px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#C9B99A")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#1A1A1A")
                        }
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      style={{
                        ...navLink,
                        display: "block",
                        padding: "11px 16px",
                        borderBottom: "1px solid #E8E6E2",
                        fontSize: "12px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#C9B99A")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#1A1A1A")
                      }
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        ...navLink,
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "11px 16px",
                        fontSize: "12px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#C9B99A")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#1A1A1A")
                      }
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  style={navLink}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#C9B99A")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#1A1A1A")
                  }
                >
                  Account
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                style={navLink}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9B99A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1A1A1A")}
              >
                Wishlist
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                style={navLink}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9B99A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1A1A1A")}
              >
                Cart ({cartCount})
              </Link>
            </div>

            {/* Mobile — cart only */}
            <Link to="/cart" className="md:hidden" style={navLink}>
              Cart ({cartCount})
            </Link>
          </div>
        </div>
      </nav>

      {/* Remove old h-16 spacer — navbar is sticky not fixed */}

      {/* ── MOBILE DRAWER ──────────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 150,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "280px",
          background: "#F5F4F0",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          borderRight: "1px solid #1A1A1A",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #1A1A1A",
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "20px",
              letterSpacing: "0.16em",
              color: "#1A1A1A",
            }}
          >
            DELLE DUNES
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ ...navLink, padding: "4px" }}
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer links */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 0",
          }}
        >
          {/* Shop */}
          <Link
            to="/shop"
            onClick={() => setDrawerOpen(false)}
            style={{
              ...navLink,
              display: "block",
              padding: "14px 20px",
              borderBottom: "1px solid #E8E6E2",
              fontSize: "13px",
            }}
          >
            Shop
          </Link>

          {/* Categories accordion */}
          <div style={{ borderBottom: "1px solid #E8E6E2" }}>
            <button
              onClick={() => setMobileCategoryOpen((p) => !p)}
              style={{
                ...navLink,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "14px 20px",
                fontSize: "13px",
              }}
            >
              Categories
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{
                  transition: "transform 0.2s",
                  transform: mobileCategoryOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {mobileCategoryOpen && (
              <div style={{ padding: "4px 0 8px 0" }}>
                {categories.length === 0 ? (
                  <p
                    style={{
                      padding: "8px 32px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      color: "#9A9A9A",
                    }}
                  >
                    No categories
                  </p>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      style={{
                        ...navLink,
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 32px",
                        fontSize: "12px",
                        color: "#6B6B6B",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#C9B99A")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#6B6B6B")
                      }
                    >
                      {cat.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Search in drawer */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              borderBottom: "1px solid #E8E6E2",
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              style={{
                flex: 1,
                padding: "14px 20px",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#1A1A1A",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "14px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#1A1A1A",
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </form>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            onClick={() => setDrawerOpen(false)}
            style={{
              ...navLink,
              display: "block",
              padding: "14px 20px",
              borderBottom: "1px solid #E8E6E2",
              fontSize: "13px",
            }}
          >
            Wishlist
          </Link>

          {/* Orders */}
          {isAuthenticated && (
            <Link
              to="/orders"
              onClick={() => setDrawerOpen(false)}
              style={{
                ...navLink,
                display: "block",
                padding: "14px 20px",
                borderBottom: "1px solid #E8E6E2",
                fontSize: "13px",
              }}
            >
              My Orders
            </Link>
          )}

          {/* Admin */}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setDrawerOpen(false)}
              style={{
                ...navLink,
                display: "block",
                padding: "14px 20px",
                borderBottom: "1px solid #E8E6E2",
                fontSize: "13px",
              }}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Drawer footer — login/logout */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1A1A1A" }}>
          {isAuthenticated ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9A9A9A",
                }}
              >
                Signed in as {user?.name}
              </p>
              <button
                onClick={handleLogout}
                style={{
                  ...navLink,
                  padding: "12px",
                  background: "#1A1A1A",
                  color: "#F5F4F0",
                  textAlign: "center",
                  width: "100%",
                  fontSize: "12px",
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Link
                to="/login"
                onClick={() => setDrawerOpen(false)}
                style={{
                  ...navLink,
                  padding: "12px",
                  background: "#1A1A1A",
                  color: "#F5F4F0",
                  textAlign: "center",
                  display: "block",
                  fontSize: "12px",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setDrawerOpen(false)}
                style={{
                  ...navLink,
                  padding: "12px",
                  border: "1px solid #1A1A1A",
                  textAlign: "center",
                  display: "block",
                  fontSize: "12px",
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
