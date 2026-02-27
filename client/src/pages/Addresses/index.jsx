import { useState, useEffect } from "react";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../api/address.js";

// ── INDIAN STATES ─────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep",
  "Puducherry",
];

// ── EMPTY FORM ────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zipcode: "",
  country: "India",
};

// ── FORM FIELD ────────────────────────────────────────────────────────────────
const FormField = ({ label, required, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: error ? "#E53E3E" : "#1A1A1A",
    }}>
      {label}
      {required && <span style={{ color: "#E53E3E", marginLeft: "3px" }}>*</span>}
    </label>
    {children}
    {error && (
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "11px",
        color: "#E53E3E",
        margin: 0,
      }}>
        {error}
      </p>
    )}
  </div>
);

const inputStyle = (error) => ({
  width: "100%",
  padding: "10px 12px",
  background: "#fff",
  border: `1.5px solid ${error ? "#E53E3E" : "#E0DED8"}`,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  color: "#1A1A1A",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
});

// ── ADDRESS FORM MODAL ────────────────────────────────────────────────────────
const AddressModal = ({ address, onClose, onSave }) => {
  const [form, setForm] = useState(
    address
      ? {
          firstName: address.firstName || "",
          lastName: address.lastName || "",
          email: address.email || "",
          phone: address.phone || "",
          street: address.street || "",
          city: address.city || "",
          state: address.state || "",
          zipcode: address.zipcode?.toString() || "",
          country: address.country || "India",
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEdit = !!address;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Required";
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit number";
    if (!form.street.trim()) e.street = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state) e.state = "Required";
    if (!form.zipcode.trim()) e.zipcode = "Required";
    if (!/^[0-9]{6}$/.test(form.zipcode)) e.zipcode = "Enter valid 6-digit pincode";
    if (!form.country.trim()) e.country = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    try {
      await onSave(form, address?._id);
      onClose();
    } catch (err) {
      setErrors({ submit: err?.response?.data?.message || "Failed to save address" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(600px, calc(100vw - 32px))",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#fff",
        zIndex: 101,
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "24px",
            letterSpacing: "0.06em",
            color: "#1A1A1A",
            margin: 0,
          }}>
            {isEdit ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px",
              background: "none", border: "1px solid #E0DED8",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Submit error */}
        {errors.submit && (
          <div style={{
            padding: "10px 14px",
            background: "#FFF5F5",
            border: "1px solid #FED7D7",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#E53E3E",
          }}>
            {errors.submit}
          </div>
        )}

        {/* Name row */}
        <div className="addr-grid-2">
          <FormField label="First Name" required error={errors.firstName}>
            <input name="firstName" value={form.firstName} onChange={handleChange}
              placeholder="Arjun" style={inputStyle(errors.firstName)}
              onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
              onBlur={(e) => e.target.style.borderColor = errors.firstName ? "#E53E3E" : "#E0DED8"}
            />
          </FormField>
          <FormField label="Last Name" required error={errors.lastName}>
            <input name="lastName" value={form.lastName} onChange={handleChange}
              placeholder="Sharma" style={inputStyle(errors.lastName)}
              onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
              onBlur={(e) => e.target.style.borderColor = errors.lastName ? "#E53E3E" : "#E0DED8"}
            />
          </FormField>
        </div>

        {/* Email + Phone */}
        <div className="addr-grid-2">
          <FormField label="Email" required error={errors.email}>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="arjun@email.com" style={inputStyle(errors.email)}
              onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
              onBlur={(e) => e.target.style.borderColor = errors.email ? "#E53E3E" : "#E0DED8"}
            />
          </FormField>
          <FormField label="Phone" required error={errors.phone}>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: "12px", top: "50%",
                transform: "translateY(-50%)",
                fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#9A9A9A",
              }}>
                +91
              </span>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                placeholder="9876543210" maxLength={10}
                style={{ ...inputStyle(errors.phone), paddingLeft: "44px" }}
                onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
                onBlur={(e) => e.target.style.borderColor = errors.phone ? "#E53E3E" : "#E0DED8"}
              />
            </div>
          </FormField>
        </div>

        {/* Street */}
        <FormField label="Street Address" required error={errors.street}>
          <input name="street" value={form.street} onChange={handleChange}
            placeholder="House no., building, street, area"
            style={inputStyle(errors.street)}
            onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
            onBlur={(e) => e.target.style.borderColor = errors.street ? "#E53E3E" : "#E0DED8"}
          />
        </FormField>

        {/* City + State */}
        <div className="addr-grid-2">
          <FormField label="City" required error={errors.city}>
            <input name="city" value={form.city} onChange={handleChange}
              placeholder="Mumbai" style={inputStyle(errors.city)}
              onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
              onBlur={(e) => e.target.style.borderColor = errors.city ? "#E53E3E" : "#E0DED8"}
            />
          </FormField>
          <FormField label="State" required error={errors.state}>
            <select name="state" value={form.state} onChange={handleChange}
              style={{ ...inputStyle(errors.state), cursor: "pointer" }}
              onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
              onBlur={(e) => e.target.style.borderColor = errors.state ? "#E53E3E" : "#E0DED8"}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Pincode + Country */}
        <div className="addr-grid-2">
          <FormField label="Pincode" required error={errors.zipcode}>
            <input name="zipcode" value={form.zipcode} onChange={handleChange}
              placeholder="400001" maxLength={6}
              style={inputStyle(errors.zipcode)}
              onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
              onBlur={(e) => e.target.style.borderColor = errors.zipcode ? "#E53E3E" : "#E0DED8"}
            />
          </FormField>
          <FormField label="Country" required error={errors.country}>
            <input name="country" value={form.country} onChange={handleChange}
              placeholder="India" style={inputStyle(errors.country)}
              onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
              onBlur={(e) => e.target.style.borderColor = errors.country ? "#E53E3E" : "#E0DED8"}
            />
          </FormField>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              flex: 1,
              padding: "12px",
              background: "#1A1A1A",
              color: "#F5F4F0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.background = "#C9B99A";
                e.currentTarget.style.color = "#1A1A1A";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1A1A1A";
              e.currentTarget.style.color = "#F5F4F0";
            }}
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Address"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "12px 20px",
              background: "none",
              color: "#6B6B6B",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              border: "1px solid #E0DED8",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#1A1A1A";
              e.currentTarget.style.color = "#1A1A1A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E0DED8";
              e.currentTarget.style.color = "#6B6B6B";
            }}
          >
            Cancel
          </button>
        </div>

        <style>{`
          .addr-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          @media (max-width: 480px) { .addr-grid-2 { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    </>
  );
};

// ── ADDRESS CARD ──────────────────────────────────────────────────────────────
const AddressCard = ({ address, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      await onDelete(address._id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #F0EFEB",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      opacity: deleting ? 0.4 : 1,
      transition: "opacity 0.2s",
    }}>
      {/* Name */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "16px",
          letterSpacing: "0.06em",
          color: "#1A1A1A",
          margin: 0,
        }}>
          {address.firstName} {address.lastName}
        </p>
      </div>

      {/* Address details */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px",
        color: "#6B6B6B",
        lineHeight: 1.8,
      }}>
        <p style={{ margin: 0 }}>{address.street}</p>
        <p style={{ margin: 0 }}>{address.city}, {address.state} - {address.zipcode}</p>
        <p style={{ margin: 0 }}>{address.country}</p>
      </div>

      {/* Contact */}
      <div style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        paddingTop: "4px",
        borderTop: "1px solid #F0EFEB",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: "#9A9A9A", flexShrink: 0 }}>
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6B6B6B" }}>
            +91 {address.phone}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: "#9A9A9A", flexShrink: 0 }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6B6B6B" }}>
            {address.email}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => onEdit(address)}
          style={{
            padding: "7px 16px",
            background: "none",
            border: "1px solid #E0DED8",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#1A1A1A",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1A1A1A";
            e.currentTarget.style.color = "#F5F4F0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#1A1A1A";
          }}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            padding: "7px 16px",
            background: confirmDelete ? "#E53E3E" : "none",
            border: `1px solid ${confirmDelete ? "#E53E3E" : "#E0DED8"}`,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: confirmDelete ? "#fff" : "#E53E3E",
            cursor: deleting ? "not-allowed" : "pointer",
            transition: "all 0.15s",
          }}
        >
          {deleting ? "..." : confirmDelete ? "Confirm?" : "Delete"}
        </button>
      </div>
    </div>
  );
};

// ── ADDRESSES PAGE ────────────────────────────────────────────────────────────
const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | address object

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(data.data || []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form, id) => {
    if (id) {
      const data = await updateAddress(id, form);
      setAddresses((prev) =>
        prev.map((a) => a._id === id ? data.data : a)
      );
    } else {
      const data = await createAddress(form);
      setAddresses((prev) => [...prev, data.data]);
    }
  };

  const handleDelete = async (id) => {
    await deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F4F0",
      paddingTop: "80px",
    }}>
      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              letterSpacing: "0.04em",
              color: "#1A1A1A",
              margin: "0 0 4px",
            }}>
              My Addresses
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#9A9A9A",
              margin: 0,
            }}>
              {loading ? "Loading..." : `${addresses.length} saved address${addresses.length !== 1 ? "es" : ""}`}
            </p>
          </div>

          <button
            onClick={() => setModal("create")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#1A1A1A",
              color: "#F5F4F0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s",
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
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Address
          </button>
        </div>

        {/* Address list */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1, 2].map((i) => (
              <div key={i} style={{
                height: "180px",
                background: "#fff",
                border: "1px solid #F0EFEB",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div style={{
            background: "#fff",
            border: "1px solid #F0EFEB",
            padding: "60px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            textAlign: "center",
          }}>
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ color: "#C4C2BE" }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <div>
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "20px",
                letterSpacing: "0.06em",
                color: "#1A1A1A",
                margin: "0 0 6px",
              }}>
                No Addresses Yet
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#9A9A9A",
                margin: "0 0 20px",
              }}>
                Add a delivery address to use during checkout
              </p>
              <button
                onClick={() => setModal("create")}
                style={{
                  padding: "10px 24px",
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
                Add First Address
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={(a) => setModal(a)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <AddressModal
          address={modal === "create" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default AddressesPage;