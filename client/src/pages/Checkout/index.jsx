import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart.js";
// import useAuth from "../../hooks/useAuth.js";
import { getAddresses, createAddress } from "../../api/address.js";
import { createOrder } from "../../api/orders.js";
import { applyCoupon } from "../../api/coupons.js";

const SHIPPING_FEE = 199;
const FREE_SHIPPING_THRESHOLD = 2999;

const styles = `
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; } 50% { opacity:0.4; }
  }
  .skeleton { background:#F0EFEB; animation:pulse 1.5s infinite; border-radius:2px; }
  .fade-in  { animation:fadeUp 0.4s ease both; }

  .addr-card {
    border:1px solid #E0DED8; border-radius:2px;
    padding:16px; cursor:pointer;
    transition:border-color 0.15s, background 0.15s;
    font-family:"DM Sans",sans-serif;
  }
  .addr-card:hover { border-color:#1A1A1A; }
  .addr-card.selected { border-color:#1A1A1A; background:#FAFAF9; }

  .btn-primary {
    font-family:"DM Sans",sans-serif; font-size:11px; font-weight:700;
    letter-spacing:0.1em; text-transform:uppercase;
    background:#1A1A1A; color:#F5F4F0;
    padding:13px 28px; border-radius:2px; border:1px solid #1A1A1A;
    cursor:pointer; width:100%;
    transition:background 0.2s, color 0.2s, border-color 0.2s;
  }
  .btn-primary:hover:not(:disabled) {
    background:#C9B99A; color:#1A1A1A; border-color:#C9B99A;
  }
  .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }

  .btn-ghost {
    font-family:"DM Sans",sans-serif; font-size:11px; font-weight:700;
    letter-spacing:0.1em; text-transform:uppercase;
    background:transparent; color:#1A1A1A;
    padding:10px 20px; border-radius:2px; border:1px solid #1A1A1A;
    cursor:pointer; transition:background 0.2s, color 0.2s;
  }
  .btn-ghost:hover { background:#1A1A1A; color:#F5F4F0; }

  .form-input {
    width:100%; padding:9px 12px; box-sizing:border-box;
    font-family:"DM Sans",sans-serif; font-size:13px; color:#1A1A1A;
    border:1px solid #E0DED8; border-radius:2px; background:#fff;
    outline:none; transition:border-color 0.15s;
  }
  .form-input:focus { border-color:#1A1A1A; }

  .coupon-input {
    flex:1; padding:9px 12px;
    font-family:"DM Sans",sans-serif; font-size:13px; color:#1A1A1A;
    border:1px solid #E0DED8; border-radius:2px; background:#fff;
    outline:none; transition:border-color 0.15s;
    text-transform:uppercase;
  }
  .coupon-input:focus { border-color:#1A1A1A; }

  .coupon-btn {
    font-family:"DM Sans",sans-serif; font-size:11px; font-weight:700;
    letter-spacing:0.1em; text-transform:uppercase;
    background:#1A1A1A; color:#F5F4F0;
    padding:9px 20px; border-radius:2px; border:1px solid #1A1A1A;
    cursor:pointer; white-space:nowrap; flex-shrink:0;
    transition:background 0.2s, color 0.2s, border-color 0.2s;
  }
  .coupon-btn:hover:not(:disabled) {
    background:#C9B99A; color:#1A1A1A; border-color:#C9B99A;
  }
  .coupon-btn:disabled { opacity:0.5; cursor:not-allowed; }

  .form-label {
    font-family:"DM Sans",sans-serif; font-size:11px; font-weight:700;
    letter-spacing:0.14em; text-transform:uppercase;
    color:#1A1A1A; display:block; margin-bottom:6px;
  }

  @media (max-width:768px) {
    .checkout-grid { flex-direction:column !important; }
    .checkout-right { width:100% !important; }
  }
`;

const EMPTY_ADDR = {
  firstName: "", lastName: "", email: "",
  street: "", city: "", state: "",
  zipcode: "", country: "India", phone: "",
};

function SectionTitle({ children }) {
  return (
    <p style={{
      fontFamily: "DM Sans,sans-serif", fontSize: 11, fontWeight: 700,
      letterSpacing: "0.14em", textTransform: "uppercase",
      color: "#1A1A1A", margin: "0 0 14px",
    }}>
      {children}
    </p>
  );
}

function FormInput({ label, ...props }) {
  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <input className="form-input" {...props} />
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  // const { user } = useAuth();

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR);
  const [addrSaving, setAddrSaving] = useState(false);
  const [addrError, setAddrError] = useState("");

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponData, setCouponData] = useState(null); // { code, discountAmount, discountType }
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Order
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  // ── Fetch addresses ───────────────────────────────────────────────────────
  useEffect(() => {
    getAddresses()
      .then((res) => {
        const list = res.data || [];
        setAddresses(list);
        if (list.length > 0) setSelectedAddr(list[0]._id);
        else setShowAddrForm(true);
      })
      .catch(() => setShowAddrForm(true))
      .finally(() => setAddrLoading(false));
  }, []);

  // ── Redirect if cart empty ────────────────────────────────────────────────
  useEffect(() => {
    if (!addrLoading && items.length === 0) {
      navigate("/cart");
    }
  }, [items, addrLoading]);

  // ── Pricing ───────────────────────────────────────────────────────────────
  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discountAmount = couponData?.discountAmount || 0;
  const total = Math.max(cartTotal + shipping - discountAmount, 0);

  // ── Address form ──────────────────────────────────────────────────────────
  const handleAddrChange = (e) => {
    setAddrForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSaveAddress = async () => {
    const { firstName, lastName, email, street, city, state, zipcode, country, phone } = addrForm;
    if (!firstName || !lastName || !email || !street || !city || !state || !zipcode|| !country || !phone) {
      setAddrError("All fields are required");
      return;
    }
    try {
      setAddrSaving(true);
      setAddrError("");
      const res = await createAddress(addrForm);
      const newAddr = res.data;
      setAddresses((p) => [...p, newAddr]);
      setSelectedAddr(newAddr._id);
      setShowAddrForm(false);
      setAddrForm(EMPTY_ADDR);
    } catch (err) {
      setAddrError(err?.response?.data?.message || "Failed to save address");
    } finally {
      setAddrSaving(false);
    }
  };

  // ── Coupon ────────────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      setCouponApplying(true);
      setCouponError("");
      setCouponSuccess("");
      const res = await applyCoupon(couponInput.trim(), cartTotal);
      const data = res.data.data;
      setCouponData(data);
      setCouponSuccess(`Coupon applied! You save ₹${data.discountAmount}`);
    } catch (err) {
      setCouponData(null);
      setCouponError(err?.response?.data?.message || "Invalid coupon code");
    } finally {
      setCouponApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponData(null);
    setCouponInput("");
    setCouponError("");
    setCouponSuccess("");
  };

  // ── Place order ───────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!selectedAddr) {
      setOrderError("Please select a shipping address");
      return;
    }
    try {
      setPlacing(true);
      setOrderError("");
      const res = await createOrder({
        shippingAddress: selectedAddr,
        couponCode: couponData?.code || undefined,
      });
      const order = res.data;
      await clearCart();
      navigate(`/order-confirmation?orderId=${order._id}`);
    } catch (err) {
      setOrderError(err?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: "100vh", background: "#F5F4F0",
        fontFamily: "DM Sans,sans-serif", padding: "48px 24px 80px",
      }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>

          {/* Page title */}
          <h1 style={{
            fontFamily: "Bebas Neue,sans-serif", fontSize: 36,
            letterSpacing: "0.04em", color: "#1A1A1A",
            margin: "0 0 32px",
          }}>
            Checkout
          </h1>

          <div className="checkout-grid fade-in" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>

            {/* ── LEFT — Address ── */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Address list */}
              <div style={{
                background: "#fff", border: "1px solid #E0DED8",
                borderRadius: 2, marginBottom: 16, overflow: "hidden",
              }}>
                <div style={{ padding: "16px 20px", borderBottom: "2px solid #F0EFEB" }}>
                  <SectionTitle>Shipping Address</SectionTitle>
                </div>

                <div style={{ padding: "16px 20px" }}>
                  {addrLoading && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[1, 2].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 80 }} />
                      ))}
                    </div>
                  )}

                  {!addrLoading && addresses.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: showAddrForm ? 16 : 0 }}>
                      {addresses.map((addr) => (
                        <div
                          key={addr._id}
                          className={`addr-card${selectedAddr === addr._id ? " selected" : ""}`}
                          onClick={() => {
                            setSelectedAddr(addr._id);
                            setShowAddrForm(false);
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            {/* Radio */}
                            <div style={{
                              width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                              border: `2px solid ${selectedAddr === addr._id ? "#1A1A1A" : "#E0DED8"}`,
                              background: selectedAddr === addr._id ? "#1A1A1A" : "transparent",
                              position: "relative",
                            }}>
                              {selectedAddr === addr._id && (
                                <div style={{
                                  width: 6, height: 6, borderRadius: "50%",
                                  background: "#F5F4F0",
                                  position: "absolute", top: "50%", left: "50%",
                                  transform: "translate(-50%, -50%)",
                                }} />
                              )}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A", margin: "0 0 2px" }}>
                                {addr.firstName} {addr.lastName}
                              </p>
                              <p style={{ fontSize: 12, color: "#6B6B6B", margin: "0 0 2px" }}>
                                {addr.street}, {addr.city}, {addr.state} — {addr.zipcode}
                              </p>
                              <p style={{ fontSize: 12, color: "#9A9A9A", margin: 0 }}>
                                {addr.country} · {addr.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new address toggle */}
                  {!addrLoading && !showAddrForm && (
                    <button
                      className="btn-ghost"
                      style={{ marginTop: addresses.length > 0 ? 12 : 0 }}
                      onClick={() => setShowAddrForm(true)}
                    >
                      + Add New Address
                    </button>
                  )}

                  {/* Address form */}
                  {showAddrForm && (
                    <div style={{ marginTop: 16 }}>
                      <p style={{
                        fontFamily: "DM Sans,sans-serif", fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.14em", textTransform: "uppercase",
                        color: "#9A9A9A", margin: "0 0 14px",
                      }}>
                        New Address
                      </p>

                      {addrError && (
                        <div style={{
                          background: "#FFF5F5", border: "1px solid #E53E3E",
                          borderRadius: 2, padding: "10px 14px", color: "#E53E3E",
                          fontSize: 13, marginBottom: 14,
                        }}>
                          {addrError}
                        </div>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <FormInput label="First Name" name="firstName" value={addrForm.firstName} onChange={handleAddrChange} placeholder="Jane" />
                        <FormInput label="Last Name"  name="lastName"  value={addrForm.lastName}  onChange={handleAddrChange} placeholder="Smith" />
                        <div style={{ gridColumn: "1 / -1" }}>
                          <FormInput label="Email" name="email" type="email" value={addrForm.email} onChange={handleAddrChange} placeholder="jane@example.com" />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <FormInput label="Street Address" name="street" value={addrForm.street} onChange={handleAddrChange} placeholder="456 Oak St" />
                        </div>
                        <FormInput label="City"    name="city"    value={addrForm.city}    onChange={handleAddrChange} placeholder="Mumbai" />
                        <FormInput label="State"   name="state"   value={addrForm.state}   onChange={handleAddrChange} placeholder="Maharashtra" />
                        <FormInput label="Zipcode" name="zipcode" type="number" value={addrForm.zipcode} onChange={handleAddrChange} placeholder="400001" />
                        <FormInput label="Country" name="country" value={addrForm.country} onChange={handleAddrChange} placeholder="India" />
                        <div style={{ gridColumn: "1 / -1" }}>
                          <FormInput label="Phone" name="phone" value={addrForm.phone} onChange={handleAddrChange} placeholder="+91 98765 43210" />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                        <button className="btn-primary" style={{ width: "auto", padding: "10px 24px" }} onClick={handleSaveAddress} disabled={addrSaving}>
                          {addrSaving ? "Saving..." : "Save Address"}
                        </button>
                        {addresses.length > 0 && (
                          <button className="btn-ghost" onClick={() => { setShowAddrForm(false); setAddrError(""); }}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order error */}
              {orderError && (
                <div style={{
                  background: "#FFF5F5", border: "1px solid #E53E3E",
                  borderRadius: 2, padding: "12px 16px", color: "#E53E3E",
                  fontSize: 13, marginBottom: 16,
                }}>
                  {orderError}
                </div>
              )}

              {/* Place order button — visible on mobile below left col */}
              <div style={{ display: "none" }} className="mobile-place-order" />
            </div>

            {/* ── RIGHT — Order Summary ── */}
            <div className="checkout-right" style={{ width: 360, flexShrink: 0 }}>

              {/* Items */}
              <div style={{
                background: "#fff", border: "1px solid #E0DED8",
                borderRadius: 2, marginBottom: 16, overflow: "hidden",
              }}>
                <div style={{ padding: "16px 20px", borderBottom: "2px solid #F0EFEB" }}>
                  <SectionTitle>Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})</SectionTitle>
                </div>

                {items.map((item, i) => {
                  const price = item.priceSnapshot ?? item.priceAtPurchase ?? 0;
                  const name = item.product?.name || item.name || "Product";
                  const image = item.product?.images?.[0] || item.image || null;
                  const size = item.variant?.size || item.size || "—";

                  return (
                    <div key={i} style={{
                      display: "flex", gap: 12, padding: "14px 20px",
                      borderBottom: i < items.length - 1 ? "1px solid #F8F8F7" : "none",
                      alignItems: "center",
                    }}>
                      {image ? (
                        <img src={image} alt={name} style={{
                          width: 48, height: 64, objectFit: "cover",
                          borderRadius: 2, flexShrink: 0, border: "1px solid #E0DED8",
                        }} />
                      ) : (
                        <div style={{
                          width: 48, height: 64, background: "#F0EFEB",
                          borderRadius: 2, flexShrink: 0,
                        }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontWeight: 600, fontSize: 13, color: "#1A1A1A",
                          margin: "0 0 3px", overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {name}
                        </p>
                        <p style={{ fontSize: 12, color: "#9A9A9A", margin: "0 0 2px" }}>
                          Size: {size} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p style={{
                        fontFamily: "Bebas Neue,sans-serif", fontSize: 15,
                        letterSpacing: "0.04em", color: "#1A1A1A",
                        margin: 0, flexShrink: 0,
                      }}>
                        ₹{(price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div style={{
                background: "#fff", border: "1px solid #E0DED8",
                borderRadius: 2, padding: "16px 20px", marginBottom: 16,
              }}>
                <SectionTitle>Coupon Code</SectionTitle>

                {!couponData ? (
                  <>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        className="coupon-input"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        placeholder="Enter coupon code"
                        disabled={couponApplying}
                      />
                      <button
                        className="coupon-btn"
                        onClick={handleApplyCoupon}
                        disabled={couponApplying || !couponInput.trim()}
                      >
                        {couponApplying ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p style={{
                        fontFamily: "DM Sans,sans-serif", fontSize: 12,
                        color: "#E53E3E", margin: "8px 0 0",
                      }}>
                        {couponError}
                      </p>
                    )}
                  </>
                ) : (
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    background: "#F0FFF4", border: "1px solid #276749",
                    borderRadius: 2, padding: "10px 14px",
                  }}>
                    <div>
                      <p style={{
                        fontFamily: "Bebas Neue,sans-serif", fontSize: 14,
                        letterSpacing: "0.06em", color: "#276749", margin: "0 0 2px",
                      }}>
                        {couponData.code}
                      </p>
                      <p style={{
                        fontFamily: "DM Sans,sans-serif", fontSize: 12,
                        color: "#276749", margin: 0,
                      }}>
                        {couponSuccess}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#276749", fontSize: 18, lineHeight: 1, padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div style={{
                background: "#fff", border: "1px solid #E0DED8",
                borderRadius: 2, overflow: "hidden", marginBottom: 16,
              }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0EFEB" }}>
                  {[
                    { label: "Subtotal", value: `₹${cartTotal.toLocaleString("en-IN")}` },
                    {
                      label: "Shipping",
                      value: shipping === 0 ? "Free" : `₹${shipping}`,
                      sub: shipping > 0
                        ? `Free above ₹${FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}`
                        : null,
                    },
                    ...(couponData
                      ? [{
                          label: `Discount (${couponData.code})`,
                          value: `− ₹${discountAmount.toLocaleString("en-IN")}`,
                          green: true,
                        }]
                      : []),
                  ].map((row) => (
                    <div key={row.label} style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", marginBottom: 10,
                    }}>
                      <div>
                        <span style={{
                          fontFamily: "DM Sans,sans-serif", fontSize: 13,
                          color: row.green ? "#276749" : "#6B6B6B",
                        }}>
                          {row.label}
                        </span>
                        {row.sub && (
                          <p style={{
                            fontFamily: "DM Sans,sans-serif", fontSize: 11,
                            color: "#9A9A9A", margin: "2px 0 0",
                          }}>
                            {row.sub}
                          </p>
                        )}
                      </div>
                      <span style={{
                        fontFamily: "DM Sans,sans-serif", fontSize: 13,
                        color: row.green ? "#276749" : "#6B6B6B",
                        fontWeight: row.green ? 700 : 400,
                      }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 20px",
                }}>
                  <span style={{
                    fontFamily: "DM Sans,sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase", color: "#1A1A1A",
                  }}>
                    Total
                  </span>
                  <span style={{
                    fontFamily: "Bebas Neue,sans-serif", fontSize: 26,
                    letterSpacing: "0.04em", color: "#1A1A1A",
                  }}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Place order */}
              <button
                className="btn-primary"
                onClick={handlePlaceOrder}
                disabled={placing || !selectedAddr || items.length === 0}
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>

              <p style={{
                fontFamily: "DM Sans,sans-serif", fontSize: 11,
                color: "#9A9A9A", textAlign: "center", margin: "12px 0 0",
              }}>
                By placing your order you agree to our terms and conditions.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}