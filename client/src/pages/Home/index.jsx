import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/products.js";
import { getAllCategories } from "../../api/categories.js";
import ProductCard from "../../components/ui/ProductCard.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import {ProductSkeleton } from "../../components/ui/Skeleton.jsx";
// ── TICKER ────────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "FREE SHIPPING ABOVE ₹2999",
  "NEW DROP — DUNE COLLECTION SS25",
  "USE CODE DUNES10 FOR 10% OFF",
  "SUSTAINABLE STREETWEAR",
  "HANDCRAFTED IN INDIA",
];

const Ticker = () => (
  <div className="overflow-hidden bg-[#1A1A1A] py-2">
    <div
      className="flex whitespace-nowrap"
      style={{ animation: "ticker 30s linear infinite" }}
    >
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span
          key={i}
          className="px-8"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#C9B99A",
          }}
        >
          {item}
          <span style={{ color: "#fff", marginLeft: "32px" }}>✦</span>
        </span>
      ))}
    </div>
    <style>{`
      @keyframes ticker {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

// ── HERO ──────────────────────────────────────────────────────────────────────
// Clothingan style — giant brand name ABOVE the image, not on it
// date stamp top right, small caption top left
const Hero = () => (
  <section className="bg-[#F5F4F0] px-4 sm:px-8 lg:px-12 pt-8 pb-0">
    {/* Top meta row — caption left, date right */}
    <div className="flex items-start justify-between mb-2">
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px",
          color: "#6B6B6B",
          maxWidth: "200px",
          lineHeight: 1.5,
          fontStyle: "italic",
        }}
      >
        In the whole new season, this is the designer's best look yet.
      </p>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px",
          color: "#6B6B6B",
          letterSpacing: "0.1em",
        }}
      >
        SS 2025
      </p>
    </div>

    {/* Giant brand name — sits above image */}
    <h1
      className="leading-none mb-0 text-[#1A1A1A]"
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(80px, 18vw, 198px)",
        letterSpacing: "0.02em",
        lineHeight: 0.9,
      }}
    >
      DELLE DUNES
    </h1>

    {/* Hero image — full width, no overlay */}
    <div className="w-full mt-2 overflow-hidden" style={{ height: "clamp(320px, 55vw, 680px)" }}>
      <img
        src="https://images.unsplash.com/photo-1635650805023-f2529440b5aa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Delle Dunes SS25"
        className="w-full h-full object-cover object-top"
        style={{ display: "block" }}
      />
    </div>
  </section>
);

// ── SECTION HEADER — Clothingan exact style ───────────────────────────────────
// const SectionHeader = ({ title, to, filter, onFilterChange, filterOptions }) => (
//   <div
//     className="flex items-baseline justify-between mb-0 pb-2"
//     style={{ borderBottom: "2px solid #1A1A1A" }}
//   >
//     <h2
//       className="text-[#1A1A1A]"
//       style={{
//         fontFamily: "'Bebas Neue', sans-serif",
//         fontSize: "clamp(24px, 3.5vw, 44px)",
//         letterSpacing: "0.04em",
//         lineHeight: 1,
//       }}
//     >
//       {title}
//     </h2>

//     <div className="flex items-center gap-4">
//       {/* Optional filter dropdown — used in Fashion Category */}
//       {filterOptions && (
//         <select
//           value={filter}
//           onChange={(e) => onFilterChange(e.target.value)}
//           className="text-[11px] font-semibold tracking-[0.1em] uppercase bg-transparent border border-[#D4D0C8] px-3 py-1 outline-none cursor-pointer"
//           style={{ fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" }}
//         >
//           {filterOptions.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>
//       )}

//       {to && (
//         <Link
//           to={to}
//           className="flex items-center gap-1 hover:text-[#C9B99A] transition-colors"
//           style={{
//             fontFamily: "'DM Sans', sans-serif",
//             fontSize: "11px",
//             fontWeight: 700,
//             letterSpacing: "0.14em",
//             textTransform: "uppercase",
//             color: "#1A1A1A",
//           }}
//         >
//           See all
//           <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//             <path d="M7 17L17 7M17 7H7M17 7v10" />
//           </svg>
//         </Link>
//       )}
//     </div>
//   </div>
// );

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
// Clothingan style — image, name, price below. Hover shows "Add to cart"
// const ProductCard = ({ product }) => {
//   const [hovered, setHovered] = useState(false);

//   const discount =
//     product.basePrice && product.offerPrice && product.basePrice > product.offerPrice
//       ? Math.round(((product.basePrice - product.offerPrice) / product.basePrice) * 100)
//       : null;

//   return (
//     <Link
//       to={`/product/${product.slug}`}
//       className="block group"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Image container */}
//       <div
//         className="relative overflow-hidden"
//         style={{
//           aspectRatio: "3/4",
//           background: "#EDECEA",
//         }}
//       >
//         {product.images?.[0] ? (
//           <img
//             src={product.images[0]}
//             alt={product.name}
//             className="w-full h-full object-cover transition-transform duration-500"
//             style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-[#E8E6E2]">
//             <span
//               style={{
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: "11px",
//                 letterSpacing: "0.12em",
//                 textTransform: "uppercase",
//                 color: "#9A9A9A",
//               }}
//             >
//               No Image
//             </span>
//           </div>
//         )}

//         {/* Add to cart — slides up on hover */}
//         <div
//           className="absolute bottom-0 left-0 right-0 transition-transform duration-300"
//           style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
//         >
//           <button
//             className="w-full py-3 bg-[#1A1A1A] text-[#F5F4F0]"
//             style={{
//               fontFamily: "'DM Sans', sans-serif",
//               fontSize: "11px",
//               fontWeight: 700,
//               letterSpacing: "0.14em",
//               textTransform: "uppercase",
//             }}
//           >
//             Add to cart
//           </button>
//         </div>
//       </div>

//       {/* Info below image */}
//       <div className="mt-2.5 flex items-start justify-between gap-2">
//         <p
//           style={{
//             fontFamily: "'DM Sans', sans-serif",
//             fontSize: "13px",
//             color: "#1A1A1A",
//             lineHeight: 1.4,
//           }}
//         >
//           {product.name}
//         </p>
//         <div className="flex items-center gap-2 shrink-0">
//           {discount > 0 && (
//             <span
//               style={{
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: "11px",
//                 color: "#C9B99A",
//                 fontWeight: 700,
//               }}
//             >
//               -{discount}%
//             </span>
//           )}
//           <span
//             style={{
//               fontFamily: "'DM Sans', sans-serif",
//               fontSize: "14px",
//               fontWeight: 600,
//               color: "#1A1A1A",
//             }}
//           >
//             ₹{product.offerPrice?.toLocaleString("en-IN")}
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// };

// ── SKELETON ──────────────────────────────────────────────────────────────────
// const ProductSkeleton = ({ count = 3 }) => (
//   <div className={`grid gap-4 sm:gap-6`} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
//     {Array.from({ length: count }).map((_, i) => (
//       <div key={i} className="animate-pulse">
//         <div className="bg-[#E0DED8]" style={{ aspectRatio: "3/4" }} />
//         <div className="mt-3 bg-[#E0DED8] h-3 w-3/4" />
//         <div className="mt-2 bg-[#E0DED8] h-3 w-1/3" />
//       </div>
//     ))}
//   </div>
// );

// ── EmptyState STATE ───────────────────────────────────────────────────────────────
// const EmptyState = ({ message = "Products coming soon." }) => (
//   <div className="py-20 text-center">
//     <p
//       style={{
//         fontFamily: "'DM Sans', sans-serif",
//         fontSize: "12px",
//         letterSpacing: "0.12em",
//         textTransform: "uppercase",
//         color: "#9A9A9A",
//       }}
//     >
//       {message}
//     </p>
//   </div>
// );

// ── BEST SELLERS ──────────────────────────────────────────────────────────────
const BestSellers = ({ products, loading }) => (
  <section className="px-4 sm:px-8 lg:px-12 py-12">
    <SectionHeader title="Best Seller" to="/shop?sort=popular" />
    <div className="mt-5">
      {loading ? (
        <ProductSkeleton count={3} />
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {products.slice(0, 3).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  </section>
);

// ── LATEST ARRIVALS ───────────────────────────────────────────────────────────
// Clothingan shows only 2 products, wider cards
const LatestArrivals = ({ products, loading }) => (
  <section className="px-4 sm:px-8 lg:px-12 pb-12">
    <SectionHeader title="Latest Arrivals" to="/shop?sort=new" />
    <div className="mt-5">
      {loading ? (
        <ProductSkeleton count={2} />
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          {products.slice(0, 2).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  </section>
);

// ── CAMPAIGN BANNER ───────────────────────────────────────────────────────────
// Full width, dark image, centered brand statement — Clothingan style
const CampaignBanner = () => (
  <section
    className="relative w-full overflow-hidden"
    style={{ height: "clamp(280px, 45vw, 560px)" }}
  >
    <img
      src="https://plus.unsplash.com/premium_photo-1727529723289-62fb65580bd1?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Delle Dunes Campaign"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.62)" }} />
    <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-16">
      <blockquote
        className="text-center text-white"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(24px, 4vw, 58px)",
          letterSpacing: "0.02em",
          lineHeight: 1.15,
          maxWidth: "900px",
        }}
      >
        "Delle Dunes is a streetwear brand with premium quality and a wide variety of styles born from the desert."
      </blockquote>
    </div>
  </section>
);

// ── FASHION CATEGORIES ────────────────────────────────────────────────────────
// Clothingan numbered asymmetric grid
const FashionCategories = ({ categories, loading }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    "https://images.unsplash.com/photo-1594938298603-c8148c4b1fad?w=600&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  ];

  const filterOptions = [
    { label: "All Fashion", value: "all" },
    { label: "Men's Fashion", value: "men" },
    { label: "Women's Fashion", value: "women" },
  ];

  return (
    <section className="px-4 sm:px-8 lg:px-12 py-12">
      <SectionHeader
        title="Fashion Category"
        to="/shop"
        filter={activeFilter}
        onFilterChange={setActiveFilter}
        filterOptions={filterOptions}
      />

      <div className="mt-5">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-[#E0DED8] aspect-square" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState message="Categories coming soon." />
        ) : (
          // Clothingan uses a 2-column grid where items alternate sizes
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat, i) => (
              <div
                key={cat._id}
                onClick={() => navigate(`/shop?category=${cat.slug}`)}
                className="relative overflow-hidden cursor-pointer group"
                style={{ aspectRatio: "1/1" }}
              >
                <img
                  src={PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                  }}
                />

                {/* Number — top left, Clothingan style */}
                <span
                  className="absolute top-3 left-3 text-white/50"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(22px, 3vw, 38px)",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Category name + Explore — bottom row */}
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 flex items-end justify-between">
                  <span
                    className="text-white font-semibold uppercase"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "clamp(11px, 1.2vw, 14px)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {cat.name}
                  </span>
                  <span
                    className="text-[#C9B99A] font-bold uppercase flex items-center gap-1"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                    }}
                  >
                    Explore
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ── HOME ──────────────────────────────────────────────────────────────────────
const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();        
        setProducts(data.data || []);
      } catch {
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.data || []);
      } catch {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const bestSellers = [...products].sort((a, b) => b.isFeatured - a.isFeatured);
  const latestArrivals = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div style={{ background: "#F5F4F0" }}>
      <Ticker />
      <Hero />
      <BestSellers products={bestSellers} loading={productsLoading} />
      <LatestArrivals products={latestArrivals} loading={productsLoading} />
      <CampaignBanner />
      <FashionCategories categories={categories} loading={categoriesLoading} />
    </div>
  );
};

export default Home;