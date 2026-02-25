import { useState } from "react";
import { Link } from "react-router-dom";

// ── SOCIAL ICONS ──────────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
  </svg>
);

// ── DATA ──────────────────────────────────────────────────────────────────────
const FOOTER_COLUMNS = [
  {
    heading: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Store Locations", to: "/stores" },
      { label: "Blog", to: "/blog" },
      { label: "Sustainability", to: "/sustainability" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "FAQ", to: "/faq" },
      { label: "Shipping & Delivery", to: "/shipping" },
      { label: "Return Policy", to: "/returns" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login / Register", to: "/login" },
      { label: "Order Status", to: "/orders" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Gift Cards", to: "/gift-cards" },
      { label: "Size Guide", to: "/size-guide" },
    ],
  },
  {
    heading: "Shop",
    links: [
      { label: "New Arrivals", to: "/shop?sort=new" },
      { label: "Best Sellers", to: "/shop?sort=popular" },
      { label: "Sale", to: "/shop?sort=sale" },
      { label: "Tops", to: "/shop?category=tops" },
      { label: "Outerwear", to: "/shop?category=outerwear" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "TikTok", href: "https://tiktok.com", Icon: TikTokIcon },
];

// ── NEWSLETTER ────────────────────────────────────────────────────────────────
const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <div>
      <p className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[#F5F4F0] mb-3">
        Newsletter
      </p>
      <p className="text-[15px] text-[#6B6B6B] leading-relaxed mb-4">
        Early access to drops and exclusive offers.
      </p>

      {status === "success" ? (
        <div className="border border-[#C9B99A] px-4 py-3 text-[12px] text-[#C9B99A] font-semibold tracking-[0.08em]">
          ✦ You're in. Welcome to the Dunes.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus("idle");
            }}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 bg-[#242424] text-[13px] text-[#F5F4F0] placeholder-[#4A4A4A] outline-none border transition-colors ${
              status === "error"
                ? "border-red-500"
                : "border-[#2A2A2A] focus:border-[#C9B99A]"
            }`}
          />
          {status === "error" && (
            <p className="text-[11px] text-red-400">
              Please enter a valid email.
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-[#C9B99A] text-[#1A1A1A] text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-[#F5F4F0] transition-colors"
          >
            Subscribe
          </button>
        </form>
      )}

      {/* Socials */}
      <div className="flex items-center gap-3 mt-6">
        {SOCIAL_LINKS.map((social) => {
          const { label, href, Icon } = social;

          return (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors"
            >
              <Icon />
            </a>
          );
        })}
      </div>
    </div>
  );
};

// ── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] overflow-hidden relative">
      {/* ── BACKGROUND BRAND NAME — left-aligned, crops off right edge ─────── */}
      {/* <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 select-none pointer-events-none"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(100px, 22vw, 280px)",
          lineHeight: 0.85,
          letterSpacing: "0.03em",
          color: "#242424",
          whiteSpace: "nowrap",
          // Crops naturally — text starts at left edge and bleeds off right
        }}
      >
        DELLE DUNES
      </div> */}
      {/* ── OPTION B — left-aligned, two lines, crops off right edge ─────────*/}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-0 select-none pointer-events-none leading-none"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(140px, 28vw, 415px)",
          lineHeight: 0.82,
          letterSpacing: "0.02em",
          color: "#242424",
        }}
      >
        <div>DELLE</div>
        <div>DUNES</div>
      </div>
      {/* ── CONTENT — sits above the background text via z-index ───────────── */}
      <div className="relative z-10">
        {/* Contact strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
          <div className="flex flex-wrap gap-6 mb-10">
            <a
              href="tel:+911234567890"
              className="flex items-center gap-2 text-[15px] text-[#6B6B6B] hover:text-[#C9B99A] transition-colors"
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.022 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              +91 12345 67890
            </a>
            <a
              href="mailto:hello@delledunes.com"
              className="flex items-center gap-2 text-[15px] text-[#6B6B6B] hover:text-[#C9B99A] transition-colors"
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              hello@delledunes.com
            </a>
          </div>
        </div>

        {/* Main columns grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <p className="text-[16px] font-semibold tracking-[0.16em] uppercase text-[#F5F4F0] mb-1">
                  {col.heading}
                </p>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-[16px] text-[#6B6B6B] hover:text-[#C9B99A] transition-colors leading-relaxed"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}

            {/* Newsletter column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-[#2A2A2A]" />
        </div>

        {/* Legal bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[#4A4A4A] tracking-[0.06em]">
            © {new Date().getFullYear()} Delle Dunes. All rights reserved.  
            <span className="flex flex-col text-yellow-700">
            Made with ♥ by PargoTechnologies
              </span> 
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[13px] text-[#4A4A4A] hover:text-[#C9B99A] transition-colors tracking-[0.06em]"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>

        {/* Spacer so brand name background has room to show at the bottom */}
        <div className="h-24 sm:h-32 lg:h-40" />
      </div>
    </footer>
  );
};

export default Footer;
