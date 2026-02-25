import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import { getAllCategories } from "../../api/categories.js";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const categoryRef = useRef(null);
  const userRef = useRef(null);

  // ── FETCH CATEGORIES ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.categories || []);
      } catch {
        // fail silently — navbar still works without categories
      }
    };
    fetchCategories();
  }, []);

  // ── SCROLL EFFECT ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── CLOSE DROPDOWNS ON OUTSIDE CLICK ──────────────────────────────────────
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ── LOCK BODY SCROLL WHEN DRAWER IS OPEN ──────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleLogout = async () => {
    setDrawerOpen(false);
    setUserDropdownOpen(false);
    await logout();
  };

  const handleCategoryClick = (slug) => {
    navigate(`/shop?category=${slug}`);
    setCategoryDropdownOpen(false);
    setDrawerOpen(false);
    setMobileCategoryOpen(false);
  };

  // ── CART ITEM COUNT ────────────────────────────────────────────────────────
  // Replace 0 with cartCount from CartContext once built
  const cartCount = 0;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-[#F5F4F0]/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── LEFT — Desktop Nav Links ──────────────────────── */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/shop"
                className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#1A1A1A] hover:text-[#C9B99A] transition-colors"
              >
                Shop
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={categoryRef}>
                <button
                  onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#1A1A1A] hover:text-[#C9B99A] transition-colors"
                >
                  Categories
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${
                      categoryDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-3 w-48 bg-white border border-[#EBEBEB] shadow-lg z-50">
                    {categories.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-[#9A9A9A]">
                        No categories found
                      </div>
                    ) : (
                      categories.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="w-full text-left px-4 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1A1A1A] hover:bg-[#F5F4F0] hover:text-[#C9B99A] transition-colors border-b border-[#F5F4F0] last:border-0"
                        >
                          {cat.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── CENTER — Logo ─────────────────────────────────── */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
            >
              <span
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                className="text-xl tracking-[0.2em] text-[#1A1A1A]"
              >
                DELLE DUNES
              </span>
            </Link>

            {/* ── RIGHT — Actions ───────────────────────────────── */}
            <div className="hidden md:flex items-center gap-6">

              {/* Cart */}
              <Link to="/cart" className="relative text-[#1A1A1A] hover:text-[#C9B99A] transition-colors">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#C9B99A] text-[#1A1A1A] text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {isAuthenticated ? (
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1A1A1A] hover:text-[#C9B99A] transition-colors"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {user?.name?.split(" ")[0]}
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-3 w-44 bg-white border border-[#EBEBEB] shadow-lg z-50">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1A1A1A] hover:bg-[#F5F4F0] hover:text-[#C9B99A] transition-colors border-b border-[#F5F4F0]"
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1A1A1A] hover:bg-[#F5F4F0] hover:text-[#C9B99A] transition-colors border-b border-[#F5F4F0]"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1A1A1A] hover:bg-[#F5F4F0] hover:text-[#C9B99A] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#1A1A1A] hover:text-[#C9B99A] transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* ── MOBILE — Right side icons ─────────────────────── */}
            <div className="flex md:hidden items-center gap-4">
              {/* Cart */}
              <Link to="/cart" className="relative text-[#1A1A1A]">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#C9B99A] text-[#1A1A1A] text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-[#1A1A1A] p-1"
                aria-label="Open menu"
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ─────────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 md:hidden ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEBEB]">
          <span
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-lg tracking-[0.2em] text-[#1A1A1A]"
          >
            DELLE DUNES
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-[#1A1A1A]"
            aria-label="Close menu"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
          <Link
            to="/shop"
            onClick={() => setDrawerOpen(false)}
            className="py-3 text-[12px] font-semibold tracking-[0.14em] uppercase text-[#1A1A1A] border-b border-[#F5F4F0]"
          >
            Shop
          </Link>

          {/* Mobile Categories Accordion */}
          <div className="border-b border-[#F5F4F0]">
            <button
              onClick={() => setMobileCategoryOpen((prev) => !prev)}
              className="w-full flex items-center justify-between py-3 text-[12px] font-semibold tracking-[0.14em] uppercase text-[#1A1A1A]"
            >
              Categories
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${
                  mobileCategoryOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {mobileCategoryOpen && (
              <div className="pb-2 flex flex-col gap-1 pl-3">
                {categories.length === 0 ? (
                  <span className="py-2 text-xs text-[#9A9A9A]">No categories found</span>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="text-left py-2 text-[11px] font-medium tracking-[0.1em] uppercase text-[#6B6B6B] hover:text-[#C9B99A] transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <Link
              to="/orders"
              onClick={() => setDrawerOpen(false)}
              className="py-3 text-[12px] font-semibold tracking-[0.14em] uppercase text-[#1A1A1A] border-b border-[#F5F4F0]"
            >
              My Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setDrawerOpen(false)}
              className="py-3 text-[12px] font-semibold tracking-[0.14em] uppercase text-[#1A1A1A] border-b border-[#F5F4F0]"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-6 border-t border-[#EBEBEB]">
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <span className="text-[11px] text-[#9A9A9A] tracking-[0.1em] uppercase">
                Signed in as {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-[#1A1A1A] text-[#F5F4F0] text-[11px] font-semibold tracking-[0.14em] uppercase hover:bg-[#C9B99A] hover:text-[#1A1A1A] transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setDrawerOpen(false)}
                className="w-full py-3 bg-[#1A1A1A] text-[#F5F4F0] text-[11px] font-semibold tracking-[0.14em] uppercase text-center hover:bg-[#C9B99A] hover:text-[#1A1A1A] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setDrawerOpen(false)}
                className="w-full py-3 border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-semibold tracking-[0.14em] uppercase text-center hover:bg-[#1A1A1A] hover:text-[#F5F4F0] transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Spacer so page content doesn't hide under fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;