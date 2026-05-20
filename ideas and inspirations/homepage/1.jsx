import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/products.js";
import { getAllCategories } from "../../api/categories.js";

// ── TICKER ────────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "FREE SHIPPING ABOVE ₹2999",
  "NEW DROP — DUNE COLLECTION SS25",
  "USE CODE DUNES10 FOR 10% OFF",
  "SUSTAINABLE STREETWEAR",
  "HANDCRAFTED IN INDIA",
];

const Ticker = () => (
  <div className="overflow-hidden bg-[#1A1A1A] py-2.5">
    <div
      className="flex whitespace-nowrap"
      style={{ animation: "ticker 30s linear infinite" }}
    >
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span
          key={i}
          className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#C9B99A] px-8"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {item}
          <span className="text-white ml-8">✦</span>
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
const Hero = () => (
  <section className="relative w-full h-screen overflow-hidden">
    {/* Background image */}
    <img
      src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=90"
      alt="Delle Dunes Hero"
      className="absolute inset-0 w-full h-full object-cover object-top"
    />

    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/40" />

    {/* Content */}
    <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-24">

      {/* Small label */}
      <p
        className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#C9B99A] mb-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        SS25 Collection — Now Live
      </p>

      {/* Big brand name over image — Clothingan style */}
      <h1
        className="text-white leading-none mb-6"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(72px, 14vw, 180px)",
          letterSpacing: "0.02em",
        }}
      >
        DELLE<br />DUNES
      </h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <p
          className="text-[14px] text-white/70 max-w-xs leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Streetwear born from the dunes. Raw textures, earthy tones, boundless expression.
        </p>
        <Link
          to="/shop"
          className="shrink-0 px-8 py-3.5 bg-[#C9B99A] text-[#1A1A1A] text-[11px] font-bold tracking-[0.18em] uppercase hover:bg-white transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Shop Now
        </Link>
      </div>

      {/* Bottom meta info — date stamp like Clothingan */}
      <div className="flex items-center justify-between mt-10 border-t border-white/10 pt-5">
        <p
          className="text-[11px] tracking-[0.14em] text-white/40 uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          In the whole new season, this is the designer's best look yet.
        </p>
        <p
          className="text-[11px] tracking-[0.14em] text-white/40"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          SS 2025
        </p>
      </div>
    </div>
  </section>
);

// ── SECTION HEADER — Clothingan style ────────────────────────────────────────
const SectionHeader = ({ title, to }) => (
  <div className="flex items-baseline justify-between mb-6 border-b border-[#E0DED8] pb-3">
    <h2
      className="text-[#1A1A1A]"
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(28px, 4vw, 48px)",
        letterSpacing: "0.04em",
      }}
    >
      {title}
    </h2>
    {to && (
      <Link
        to={to}
        className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#1A1A1A] hover:text-[#C9B99A] transition-colors flex items-center gap-1"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        See all
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </Link>
    )}
  </div>
);

// ── PRODUCT CARD — Clothingan minimal style ───────────────────────────────────
const ProductCard = ({ product }) => {
  const discount = product.basePrice && product.offerPrice
    ? Math.round(((product.basePrice - product.offerPrice) / product.basePrice) * 100)
    : null;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#EDECEA] aspect-[3/4] mb-3">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-[11px] tracking-[0.14em] uppercase text-[#9A9A9A]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              No Image
            </span>
          </div>
        )}

        {/* Add to cart overlay — Clothingan style */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            className="w-full py-3 bg-[#1A1A1A] text-[#F5F4F0] text-[11px] font-bold tracking-[0.14em] uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-[13px] text-[#1A1A1A] leading-snug"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {product.name}
        </p>
        <div className="flex flex-col items-end shrink-0">
          <span
            className="text-[14px] font-semibold text-[#1A1A1A]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            ₹{product.offerPrice?.toLocaleString("en-IN")}
          </span>
          {discount > 0 && (
            <span
              className="text-[11px] text-[#C9B99A] font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
const EmptyProducts = ({ message = "No products yet. Check back soon." }) => (
  <div className="py-16 text-center">
    <p
      className="text-[13px] text-[#9A9A9A] tracking-[0.1em] uppercase"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {message}
    </p>
  </div>
);

// ── BEST SELLERS ──────────────────────────────────────────────────────────────
const BestSellers = ({ products, loading }) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <SectionHeader title="Best Seller" to="/shop?sort=popular" />
    {loading ? (
      <ProductSkeletonRow count={3} />
    ) : products.length === 0 ? (
      <EmptyProducts />
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {products.slice(0, 3).map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    )}
  </section>
);

// ── LATEST ARRIVALS ───────────────────────────────────────────────────────────
const LatestArrivals = ({ products, loading }) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16">
    <SectionHeader title="Latest Arrivals" to="/shop?sort=new" />
    {loading ? (
      <ProductSkeletonRow count={2} />
    ) : products.length === 0 ? (
      <EmptyProducts />
    ) : (
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {products.slice(0, 2).map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    )}
  </section>
);

// ── SKELETON LOADER ───────────────────────────────────────────────────────────
const ProductSkeletonRow = ({ count = 3 }) => (
  <div className={`grid grid-cols-2 md:grid-cols-${count} gap-4 sm:gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-[#E8E6E2] aspect-[3/4] mb-3" />
        <div className="bg-[#E8E6E2] h-3 w-3/4 mb-2" />
        <div className="bg-[#E8E6E2] h-3 w-1/4" />
      </div>
    ))}
  </div>
);

// ── CAMPAIGN BANNER — full width, dark, magazine feel ────────────────────────
const CampaignBanner = () => (
  <section className="relative w-full overflow-hidden" style={{ height: "clamp(320px, 50vw, 600px)" }}>
    <img
      src="https://images.unsplash.com/photo-1529139574466-a303027614b?w=1600&q=85"
      alt="Campaign"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-black/60" />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      <p
        className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#C9B99A] mb-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        The Brand
      </p>
      <blockquote
        className="text-white max-w-3xl leading-tight"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(32px, 5vw, 72px)",
          letterSpacing: "0.02em",
        }}
      >
        "Delle Dunes is a streetwear brand with above average quality and a wide variety of styles born from the desert."
      </blockquote>
    </div>
  </section>
);

// ── FASHION CATEGORIES — Clothingan numbered grid ────────────────────────────
const FashionCategories = ({ categories, loading }) => {
  const navigate = useNavigate();

  // Placeholder images per category index
  const categoryImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    "https://images.unsplash.com/photo-1594938298603-c8148c4b1fad?w=600&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader title="Fashion Category" to="/shop" />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-[#E8E6E2] aspect-square" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyProducts message="No categories yet." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/shop?category=${cat.slug}`)}
              className="group relative overflow-hidden cursor-pointer aspect-square"
            >
              <img
                src={categoryImages[i % categoryImages.length]}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />

              {/* Number label — Clothingan style */}
              <span
                className="absolute top-3 left-3 text-white/60 leading-none"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(28px, 4vw, 48px)",
                  letterSpacing: "0.04em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Category name + explore */}
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex items-end justify-between">
                <span
                  className="text-white font-semibold tracking-[0.08em] uppercase leading-tight"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "clamp(12px, 1.4vw, 15px)",
                  }}
                >
                  {cat.name}
                </span>
                <span
                  className="text-[11px] text-[#C9B99A] font-semibold tracking-[0.12em] uppercase flex items-center gap-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Explore
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Sort products for each section
  const bestSellers = [...products].sort((a, b) => b.isFeatured - a.isFeatured);
  const latestArrivals = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="bg-[#F5F4F0]">
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