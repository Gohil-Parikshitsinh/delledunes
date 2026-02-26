import { Link } from "react-router-dom";

const SectionHeader = ({ title, to }) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      borderBottom: "2px solid #1A1A1A",
      paddingBottom: "8px",
      marginBottom: "24px",
    }}
  >
    <h2
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(24px, 3.5vw, 44px)",
        letterSpacing: "0.04em",
        color: "#1A1A1A",
        margin: 0,
        lineHeight: 1,
      }}
    >
      {title}
    </h2>

    {to && (
      <Link
        to={to}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#1A1A1A",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#C9B99A"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#1A1A1A"}
      >
        See all
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </Link>
    )}
  </div>
);

export default SectionHeader;