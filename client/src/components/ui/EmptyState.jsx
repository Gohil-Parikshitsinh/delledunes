import { Link } from "react-router-dom";

const EmptyState = ({
  title = "Nothing here yet.",
  message = "Check back soon.",
  actionLabel,
  actionTo,
  onAction,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "64px 24px",
      textAlign: "center",
      gap: "12px",
    }}
  >
    {/* Decorative mark */}
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "14px",
        letterSpacing: "0.3em",
        color: "#C9B99A",
      }}
    >
      ✦ DELLE DUNES ✦
    </span>

    <h3
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(28px, 4vw, 44px)",
        letterSpacing: "0.04em",
        color: "#1A1A1A",
        margin: 0,
        lineHeight: 1.1,
      }}
    >
      {title}
    </h3>

    <p
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "14px",
        color: "#6B6B6B",
        maxWidth: "360px",
        lineHeight: 1.7,
        margin: 0,
      }}
    >
      {message}
    </p>

    {/* CTA — either a Link or a button */}
    {actionLabel && actionTo && (
      <Link
        to={actionTo}
        style={{
          marginTop: "8px",
          padding: "12px 32px",
          background: "#1A1A1A",
          color: "#F5F4F0",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#C9B99A";
          e.currentTarget.style.color = "#1A1A1A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#1A1A1A";
          e.currentTarget.style.color = "#F5F4F0";
        }}
      >
        {actionLabel}
      </Link>
    )}

    {actionLabel && onAction && (
      <button
        onClick={onAction}
        style={{
          marginTop: "8px",
          padding: "12px 32px",
          background: "#1A1A1A",
          color: "#F5F4F0",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#C9B99A";
          e.currentTarget.style.color = "#1A1A1A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#1A1A1A";
          e.currentTarget.style.color = "#F5F4F0";
        }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;