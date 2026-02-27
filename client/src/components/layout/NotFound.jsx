import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap');

  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glitch1 {
    0%, 100% { clip-path: inset(0 0 95% 0); transform: translate(-4px, 0); }
    20%       { clip-path: inset(30% 0 50% 0); transform: translate(4px, 0); }
    40%       { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 0); }
    60%       { clip-path: inset(10% 0 80% 0); transform: translate(3px, 0); }
    80%       { clip-path: inset(80% 0 5% 0);  transform: translate(-3px, 0); }
  }
  @keyframes glitch2 {
    0%, 100% { clip-path: inset(50% 0 30% 0); transform: translate(4px, 0); }
    25%       { clip-path: inset(10% 0 70% 0); transform: translate(-4px, 0); }
    50%       { clip-path: inset(70% 0 10% 0); transform: translate(2px, 0); }
    75%       { clip-path: inset(25% 0 55% 0); transform: translate(-2px, 0); }
  }

  .fade-1 { animation: fadeUp 0.5s ease both 0.1s; }
  .fade-2 { animation: fadeUp 0.5s ease both 0.25s; }
  .fade-3 { animation: fadeUp 0.5s ease both 0.4s; }

  .glitch-wrap {
    position: relative;
    display: inline-block;
    line-height: 0.85;
  }
  .glitch-base {
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(160px, 22vw, 280px);
    letter-spacing: -0.02em;
    color: #1A1A1A;
    display: block;
    line-height: 0.85;
  }
  .glitch-layer {
    position: absolute;
    inset: 0;
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(160px, 22vw, 280px);
    letter-spacing: -0.02em;
    line-height: 0.85;
  }
  .glitch-layer-1 {
    color: #C9B99A;
    animation: glitch1 3s infinite steps(1);
  }
  .glitch-layer-2 {
    color: #1A1A1A;
    opacity: 0.6;
    animation: glitch2 3s infinite steps(1);
    animation-delay: 0.15s;
  }

  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee 18s linear infinite;
  }
  .marquee-track:hover { animation-play-state: paused; }

  .back-btn {
    font-family: "DM Sans", sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    background: #1A1A1A;
    color: #F5F4F0;
    padding: 14px 36px;
    border-radius: 2px;
    border: 1px solid #1A1A1A;
    display: inline-block;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .back-btn:hover {
    background: #C9B99A;
    color: #1A1A1A;
    border-color: #C9B99A;
  }
  .shop-btn {
    font-family: "DM Sans", sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    background: transparent;
    color: #1A1A1A;
    padding: 14px 36px;
    border-radius: 2px;
    border: 1px solid #1A1A1A;
    display: inline-block;
    transition: background 0.2s, color 0.2s;
  }
  .shop-btn:hover {
    background: #1A1A1A;
    color: #F5F4F0;
  }
`;

const marqueeItems = [
  "PAGE NOT FOUND",
  "404 ERROR",
  "LOST IN THE DUNES",
  "PAGE NOT FOUND",
  "404 ERROR",
  "LOST IN THE DUNES",
  "PAGE NOT FOUND",
  "404 ERROR",
  "LOST IN THE DUNES",
  "PAGE NOT FOUND",
  "404 ERROR",
  "LOST IN THE DUNES",
];

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(7);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          minHeight: "100vh",
          background: "#F5F4F0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── HERO SECTION ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 24px 40px",
            position: "relative",
          }}
        >
          {/* Glitch 404 */}
          <div className="glitch-wrap fade-1">
            <span className="glitch-base">404</span>
            <span className="glitch-layer glitch-layer-1" aria-hidden="true">
              404
            </span>
            <span className="glitch-layer glitch-layer-2" aria-hidden="true">
              404
            </span>
          </div>

          {/* Divider line */}
          <div
            className="fade-2"
            style={{
              width: "100%",
              maxWidth: 700,
              height: 1,
              background: "#1A1A1A",
              margin: "24px 0 28px",
            }}
          />

          {/* Message */}
          <div
            className="fade-2"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: 700,
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "clamp(28px, 4vw, 42px)",
                  letterSpacing: "0.03em",
                  color: "#1A1A1A",
                  margin: "0 0 10px",
                  lineHeight: 1.1,
                }}
              >
                We lost this page
                <br />
                in the dunes.
              </h2>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 13,
                  color: "#6B6B6B",
                  margin: 0,
                  maxWidth: 320,
                  lineHeight: 1.65,
                }}
              >
                The page you're looking for doesn't exist, was moved, or maybe
                never existed in the first place.{" "}
                <span style={{ color: "#1A1A1A", fontWeight: 700 }}>
                  Redirecting to home in {countdown}s...
                </span>
              </p>
            </div>

            {/* Buttons */}
            <div
              className="fade-3"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignSelf: "center",
              }}
            >
              <Link to="/" className="back-btn">
                Go Home
              </Link>
              <Link to="/shop" className="shop-btn">
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* ── MARQUEE STRIP ── */}
        <div
          style={{
            background: "#1A1A1A",
            padding: "14px 0",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          <div className="marquee-track">
            {marqueeItems.map((text, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: 15,
                  letterSpacing: "0.2em",
                  color: i % 3 === 1 ? "#C9B99A" : "#F5F4F0",
                  paddingRight: 56,
                  whiteSpace: "nowrap",
                }}
              >
                {text}
                {i % 3 !== 2 && (
                  <span style={{ color: "#C9B99A", paddingLeft: 56 }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
