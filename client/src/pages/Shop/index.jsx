import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllProducts } from "../../api/products.js";
import { getAllCategories } from "../../api/categories.js";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const SORT_OPTIONS = [
  { label: "New Arrivals", value: "new" },
  { label: "Popular", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const PRICE_RANGES = [
  { label: "Under ₹999", min: 0, max: 999 },
  { label: "₹999 – ₹1,999", min: 999, max: 1999 },
  { label: "₹1,999 – ₹4,999", min: 1999, max: 4999 },
  { label: "Above ₹4,999", min: 4999, max: Infinity },
];

// ── SORT PRODUCTS ─────────────────────────────────────────────────────────────
const sortProducts = (products, sort) => {
  const sorted = [...products];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.offerPrice - b.offerPrice);
    case "price_desc":
      return sorted.sort((a, b) => b.offerPrice - a.offerPrice);
    case "popular":
      return sorted.sort((a, b) => b.isFeatured - a.isFeatured);
    case "new":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

// ── FILTER PRODUCTS ───────────────────────────────────────────────────────────
const filterProducts = (products, filters, filterMode) => {
  const { categories, sizes, priceRanges, search } = filters;

  const hasCategories = categories.length > 0;
  const hasSizes = sizes.length > 0;
  const hasPriceRanges = priceRanges.length > 0;
  const hasSearch = search.trim().length > 0;

  // No filters applied — return all
  if (!hasCategories && !hasSizes && !hasPriceRanges && !hasSearch) {
    return products;
  }

  return products.filter((product) => {
    const matchesSearch = hasSearch
      ? product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesCategory = hasCategories
      ? categories.includes(product.category?.slug || product.category)
      : true;

    const matchesSize = hasSizes
      ? product.variants?.some((v) => sizes.includes(v.size) && v.stock > 0)
      : true;

    const matchesPriceRange = hasPriceRanges
      ? priceRanges.some((rangeLabel) => {
          const range = PRICE_RANGES.find((r) => r.label === rangeLabel);
          if (!range) return false;
          return product.offerPrice >= range.min && product.offerPrice < range.max;
        })
      : true;

    if (filterMode === "OR") {
      // OR — match any active filter
      const checks = [];
      if (hasSearch) checks.push(matchesSearch);
      if (hasCategories) checks.push(matchesCategory);
      if (hasSizes) checks.push(matchesSize);
      if (hasPriceRanges) checks.push(matchesPriceRange);
      return checks.some(Boolean);
    }

    // AND — match all active filters (default)
    return matchesSearch && matchesCategory && matchesSize && matchesPriceRange;
  });
};

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  const discount =
    product.basePrice && product.offerPrice && product.basePrice > product.offerPrice
      ? Math.round(((product.basePrice - product.offerPrice) / product.basePrice) * 100)
      : null;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="block group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: "none" }}
    >
      {/* Image */}
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

        {/* Add to cart hover */}
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
            style={{
              width: "100%",
              padding: "12px",
              background: "#1A1A1A",
              color: "#F5F4F0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
            }}
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#1A1A1A",
            marginBottom: "4px",
            lineHeight: 1.4,
          }}
        >
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                fontSize: "12px",
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

// ── SKELETON ──────────────────────────────────────────────────────────────────
const ProductSkeleton = () => (
  <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
    <div
      style={{
        aspectRatio: "3/4",
        background: "#E8E6E2",
        marginBottom: "12px",
      }}
    />
    <div style={{ background: "#E8E6E2", height: "12px", width: "75%", marginBottom: "8px" }} />
    <div style={{ background: "#E8E6E2", height: "12px", width: "35%" }} />
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
  </div>
);

// ── FILTER CHECKBOX ───────────────────────────────────────────────────────────
const FilterCheckbox = ({ label, checked, onChange }) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "13px",
      color: checked ? "#1A1A1A" : "#6B6B6B",
      fontWeight: checked ? 600 : 400,
      padding: "3px 0",
    }}
  >
    <div
      style={{
        width: "14px",
        height: "14px",
        border: checked ? "2px solid #1A1A1A" : "1.5px solid #C4C2BE",
        background: checked ? "#1A1A1A" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.15s",
      }}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#F5F4F0" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{ display: "none" }}
    />
    {label}
  </label>
);

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const Sidebar = ({
  categories,
  filters,
  filterMode,
  onFilterChange,
  onFilterModeChange,
  onClearAll,
  onClose,
}) => {
  const activeFilterCount =
    filters.categories.length +
    filters.sizes.length +
    filters.priceRanges.length;

  const toggleItem = (key, value) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange(key, updated);
  };

  return (
    <div
      style={{
        background: "#fff",
        height: "100%",
        overflowY: "auto",
        padding: "0",
      }}
    >
      {/* Sidebar header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #EBEBEB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "18px",
              letterSpacing: "0.08em",
              color: "#1A1A1A",
            }}
          >
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span
              style={{
                background: "#C9B99A",
                color: "#1A1A1A",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: "10px",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#9A9A9A",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#1A1A1A"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#9A9A9A"}
            >
              Clear All
            </button>
          )}

          {/* Mobile close */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6B6B6B",
                padding: "2px",
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* ── AND / OR TOGGLE ─────────────────────────────────────────────── */}
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
            Filter Mode
          </p>
          <div
            style={{
              display: "flex",
              background: "#F5F4F0",
              padding: "3px",
              gap: "3px",
            }}
          >
            {["AND", "OR"].map((mode) => (
              <button
                key={mode}
                onClick={() => onFilterModeChange(mode)}
                style={{
                  flex: 1,
                  padding: "7px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: filterMode === mode ? "#1A1A1A" : "transparent",
                  color: filterMode === mode ? "#F5F4F0" : "#6B6B6B",
                }}
              >
                {mode}
              </button>
            ))}
          </div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              color: "#9A9A9A",
              marginTop: "6px",
              lineHeight: 1.5,
            }}
          >
            {filterMode === "AND"
              ? "Show products matching ALL selected filters"
              : "Show products matching ANY selected filter"}
          </p>
        </div>

        {/* ── CATEGORIES ──────────────────────────────────────────────────── */}
        {categories.length > 0 && (
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
              Category
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {categories.map((cat) => (
                <FilterCheckbox
                  key={cat._id}
                  label={cat.name}
                  checked={filters.categories.includes(cat.slug)}
                  onChange={() => toggleItem("categories", cat.slug)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── SIZE ────────────────────────────────────────────────────────── */}
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
            Size
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {SIZES.map((size) => {
              const selected = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleItem("sizes", size)}
                  style={{
                    padding: "6px 12px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    border: selected ? "1.5px solid #1A1A1A" : "1.5px solid #E0DED8",
                    background: selected ? "#1A1A1A" : "transparent",
                    color: selected ? "#F5F4F0" : "#6B6B6B",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PRICE RANGE ─────────────────────────────────────────────────── */}
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
            Price Range
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {PRICE_RANGES.map((range) => (
              <FilterCheckbox
                key={range.label}
                label={range.label}
                checked={filters.priceRanges.includes(range.label)}
                onChange={() => toggleItem("priceRanges", range.label)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// ── SHOP PAGE ─────────────────────────────────────────────────────────────────
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── STATE ──────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Read initial values from URL params
  const [filters, setFilters] = useState({
    categories: searchParams.get("category") ? [searchParams.get("category")] : [],
    sizes: [],
    priceRanges: [],
    search: searchParams.get("search") || "",
  });

  const [sort, setSort] = useState(searchParams.get("sort") || "new");
  const [filterMode, setFilterMode] = useState("AND");

  // ── SYNC FILTERS TO URL ────────────────────────────────────────────────────
  useEffect(() => {
    const params = {};
    if (filters.categories.length === 1) params.category = filters.categories[0];
    if (filters.search) params.search = filters.search;
    if (sort !== "new") params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [filters, sort, setSearchParams]);

  // ── FETCH DATA ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      } catch {
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── FILTER + SORT ──────────────────────────────────────────────────────────
  const filteredAndSorted = sortProducts(
    filterProducts(products, filters, filterMode),
    sort
  );

  // ── HANDLERS ──────────────────────────────────────────────────────────────
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({ categories: [], sizes: [], priceRanges: [], search: "" });
    setFilterMode("AND");
  }, []);

  const activeFilterCount =
    filters.categories.length + filters.sizes.length + filters.priceRanges.length;

  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ─────────────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid #E0DED8",
          background: "#F5F4F0",
          padding: "32px 24px 20px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Breadcrumb */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#9A9A9A",
              marginBottom: "8px",
              letterSpacing: "0.06em",
            }}
          >
            <Link to="/" style={{ color: "#9A9A9A", textDecoration: "none" }}>Home</Link>
            {" / "}
            <span style={{ color: "#1A1A1A" }}>Shop</span>
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
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
              {filters.categories.length === 1
                ? categories.find((c) => c.slug === filters.categories[0])?.name || "Shop"
                : "All Products"}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {/* Result count */}
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#9A9A9A",
                }}
              >
                {loading ? "Loading..." : `${filteredAndSorted.length} products`}
              </span>

              {/* Sort dropdown */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "#1A1A1A",
                  background: "#fff",
                  border: "1px solid #E0DED8",
                  padding: "8px 12px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Mobile filter button */}
              <button
                className="lg:hidden"
                onClick={() => setFilterDrawerOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: "#1A1A1A",
                  color: "#F5F4F0",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="20" y2="12" />
                  <line x1="12" y1="18" x2="20" y2="18" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span
                    style={{
                      background: "#C9B99A",
                      color: "#1A1A1A",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ marginTop: "16px", maxWidth: "400px" }}>
            <div style={{ position: "relative" }}>
              <svg
                width="14" height="14"
                fill="none" stroke="currentColor" strokeWidth="1.5"
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
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search products..."
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  background: "#fff",
                  border: "1px solid #E0DED8",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#1A1A1A",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
                onBlur={(e) => e.target.style.borderColor = "#E0DED8"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ─────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          gap: "0",
        }}
      >
        {/* ── DESKTOP SIDEBAR ──────────────────────────────────────────────── */}
        <aside
          className="hidden lg:block"
          style={{
            width: "260px",
            flexShrink: 0,
            borderRight: "1px solid #E0DED8",
            position: "sticky",
            top: "0",
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <Sidebar
            categories={categories}
            filters={filters}
            filterMode={filterMode}
            onFilterChange={handleFilterChange}
            onFilterModeChange={setFilterMode}
            onClearAll={handleClearAll}
          />
        </aside>

        {/* ── PRODUCT GRID ─────────────────────────────────────────────────── */}
        <main style={{ flex: 1, padding: "24px" }}>

          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              {filters.categories.map((slug) => {
                const cat = categories.find((c) => c.slug === slug);
                return (
                  <button
                    key={slug}
                    onClick={() =>
                      handleFilterChange(
                        "categories",
                        filters.categories.filter((c) => c !== slug)
                      )
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 12px",
                      background: "#1A1A1A",
                      color: "#F5F4F0",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {cat?.name || slug}
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                );
              })}
              {filters.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    handleFilterChange(
                      "sizes",
                      filters.sizes.filter((s) => s !== size)
                    )
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 12px",
                    background: "#1A1A1A",
                    color: "#F5F4F0",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Size: {size}
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ))}
              {filters.priceRanges.map((range) => (
                <button
                  key={range}
                  onClick={() =>
                    handleFilterChange(
                      "priceRanges",
                      filters.priceRanges.filter((r) => r !== range)
                    )
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 12px",
                    background: "#1A1A1A",
                    color: "#F5F4F0",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {range}
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 20px",
                gap: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "32px",
                  letterSpacing: "0.04em",
                  color: "#1A1A1A",
                }}
              >
                No Products Found
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "#9A9A9A",
                  textAlign: "center",
                }}
              >
                Try adjusting your filters or switch from AND to OR mode.
              </p>
              <button
                onClick={handleClearAll}
                style={{
                  padding: "12px 28px",
                  background: "#1A1A1A",
                  color: "#F5F4F0",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
                className="shop-grid"
              >
                {filteredAndSorted.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {/* Responsive grid styles */}
              <style>{`
                @media (max-width: 1024px) {
                  .shop-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 640px) {
                  .shop-grid { grid-template-columns: repeat(1, 1fr) !important; }
                }
              `}</style>
            </>
          )}
        </main>
      </div>

      {/* ── MOBILE FILTER DRAWER ─────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        className="lg:hidden"
        onClick={() => setFilterDrawerOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 100,
          opacity: filterDrawerOpen ? 1 : 0,
          pointerEvents: filterDrawerOpen ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      />

      {/* Drawer */}
      <div
        className="lg:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "300px",
          background: "#fff",
          zIndex: 110,
          transform: filterDrawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          overflowY: "auto",
        }}
      >
        <Sidebar
          categories={categories}
          filters={filters}
          filterMode={filterMode}
          onFilterChange={handleFilterChange}
          onFilterModeChange={setFilterMode}
          onClearAll={handleClearAll}
          onClose={() => setFilterDrawerOpen(false)}
        />
      </div>

    </div>
  );
};

export default Shop;