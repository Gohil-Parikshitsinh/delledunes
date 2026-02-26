import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const Login = () => {
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const IMAGES = [
    "https://plus.unsplash.com/premium_photo-1669704098960-7d630127733e?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1761430335744-a4a03c7e49dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1614788404413-ca65466f81f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHVyYmFuJTIwc3RyZWV0d2VhcnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1508216310976-c518daae0cdc?q=80&w=703&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1643818657882-3dc8b30ce436?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  // ── VALIDATE ────────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email.";
    if (!form.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  // ── SUBMIT ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      // redirect handled by AuthProvider
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid email or password.";
      setBanner(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setBanner("");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#F5F4F0", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── LEFT SIDE ──────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between"
        style={{
          width: "42%",
          padding: "60px 56px",
          borderRight: "1px solid #E0DED8",
        }}
      >
        {/* Top — brand statement */}
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C9B99A",
              marginBottom: "20px",
            }}
          >
            Delle Dunes
          </p>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(42px, 5vw, 72px)",
              lineHeight: 0.95,
              color: "#1A1A1A",
              letterSpacing: "0.02em",
              marginBottom: "24px",
            }}
          >
            STREETWEAR<br />
            BORN FROM<br />
            THE{" "}
            <span style={{ color: "#C9B99A" }}>DESERT.</span>
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#6B6B6B",
              lineHeight: 1.7,
              maxWidth: "320px",
            }}
          >
            Sign in to access your orders, wishlist, and exclusive member drops.
          </p>
        </div>

        {/* Middle — register CTA */}
        <div>
          <p
            style={{
              fontSize: "14px",
              color: "#6B6B6B",
              marginBottom: "10px",
            }}
          >
            Don't have an account?
          </p>
          <Link
            to="/register"
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1A1A1A",
              textDecoration: "none",
              borderBottom: "1px solid #1A1A1A",
              paddingBottom: "2px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Create account
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Bottom — editorial image card */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            height: "220px",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80"
            alt="Delle Dunes"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
            }}
          >
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "18px",
                letterSpacing: "0.1em",
                color: "#fff",
                marginBottom: "4px",
              }}
            >
              About Us
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.7)",
                maxWidth: "220px",
                lineHeight: 1.5,
              }}
            >
              Shop new streetwear at the best quality and reach new heights with your style.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE — image with floating form card ─────────────────────── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {/* Background image */}
        <img
          src={IMAGES[currentImage]}
          alt="Delle Dunes Fashion"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            transition: "opacity 0.4s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
          }}
        />

        {/* Floating form card */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "clamp(20px, 6vw, 80px)",
            transform: "translateY(-50%)",
            background: "#fff",
            padding: "40px 36px",
            width: "100%",
            maxWidth: "360px",
            zIndex: 10,
          }}
        >
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "24px",
              letterSpacing: "0.1em",
              color: "#1A1A1A",
              textAlign: "center",
              marginBottom: "28px",
            }}
          >
            Login to your account
          </h2>

          {/* Banner error */}
          {banner && (
            <div
              style={{
                background: "#FEE2E2",
                border: "1px solid #FECACA",
                color: "#DC2626",
                fontSize: "12px",
                padding: "10px 14px",
                marginBottom: "20px",
                fontWeight: 500,
              }}
            >
              {banner}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#1A1A1A",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  padding: "0 0 10px 0",
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${errors.email ? "#DC2626" : "#D4D0C8"}`,
                  outline: "none",
                  fontSize: "14px",
                  color: "#1A1A1A",
                  fontFamily: "'DM Sans', sans-serif",
                  boxSizing: "border-box",
                }}
              />
              {errors.email && (
                <p style={{ color: "#DC2626", fontSize: "11px", marginTop: "5px" }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#1A1A1A",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "0 0 10px 0",
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${errors.password ? "#DC2626" : "#D4D0C8"}`,
                  outline: "none",
                  fontSize: "14px",
                  color: "#1A1A1A",
                  fontFamily: "'DM Sans', sans-serif",
                  boxSizing: "border-box",
                }}
              />
              {errors.password && (
                <p style={{ color: "#DC2626", fontSize: "11px", marginTop: "5px" }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#6B6B6B" : "#1A1A1A",
                color: "#F5F4F0",
                border: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "8px",
                transition: "background 0.2s",
              }}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* Mobile register link */}
            <p
              className="lg:hidden"
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontSize: "13px",
                color: "#6B6B6B",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#1A1A1A",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
              >
                Register
              </Link>
            </p>
          </form>
        </div>

        {/* Image counter + arrows — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "18px",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {String(currentImage + 1).padStart(2, "0")}/{String(IMAGES.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => setCurrentImage((p) => (p === 0 ? IMAGES.length - 1 : p - 1))}
            style={{
              width: "32px",
              height: "32px",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentImage((p) => (p === IMAGES.length - 1 ? 0 : p + 1))}
            style={{
              width: "32px",
              height: "32px",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;