import { useEffect, useState } from "react";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../../api/coupons";

const EMPTY_FORM = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  startDate: "",
  expiryDate: "",
  usageLimit: "",
  perUserLimit: "1",
  minOrderAmount: "",
  isFirstOrderOnly: false,
  isActive: true,
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; } 50% { opacity:0.4; }
  }
  .skeleton { background:#F0EFEB; animation:pulse 1.5s infinite; border-radius:2px; }
  .modal-overlay {
    position:fixed; inset:0; background:rgba(26,26,26,0.4);
    display:flex; align-items:center; justify-content:center;
    z-index:1000; padding:16px;
  }
  .modal {
    background:#fff; border:1px solid #E0DED8; border-radius:2px;
    width:min(600px, calc(100vw - 32px)); max-height:90vh;
    overflow-y:auto; animation:fadeIn 0.2s ease;
  }
  .row-hover:hover { background:#FAFAF9; }
  .btn-primary {
    font-family:"DM Sans",sans-serif; font-size:11px; font-weight:700;
    letter-spacing:0.1em; text-transform:uppercase;
    background:#1A1A1A; color:#F5F4F0;
    padding:10px 20px; border-radius:2px; border:1px solid #1A1A1A;
    cursor:pointer; transition:background 0.2s,color 0.2s,border-color 0.2s;
  }
  .btn-primary:hover { background:#C9B99A; color:#1A1A1A; border-color:#C9B99A; }
  .btn-ghost {
    font-family:"DM Sans",sans-serif; font-size:11px; font-weight:700;
    letter-spacing:0.1em; text-transform:uppercase;
    background:transparent; color:#1A1A1A;
    padding:10px 20px; border-radius:2px; border:1px solid #1A1A1A;
    cursor:pointer; transition:background 0.2s,color 0.2s;
  }
  .btn-ghost:hover { background:#1A1A1A; color:#F5F4F0; }
  .btn-danger {
    font-family:"DM Sans",sans-serif; font-size:11px; font-weight:700;
    letter-spacing:0.1em; text-transform:uppercase;
    background:transparent; color:#E53E3E;
    padding:7px 14px; border-radius:2px; border:1px solid #E53E3E;
    cursor:pointer; transition:background 0.2s,color 0.2s;
  }
  .btn-danger:hover { background:#E53E3E; color:#fff; }
  .btn-danger.confirm { background:#E53E3E; color:#fff; }
  .form-input {
    width:100%; padding:9px 12px;
    font-family:"DM Sans",sans-serif; font-size:13px; color:#1A1A1A;
    border:1px solid #E0DED8; border-radius:2px; background:#fff;
    outline:none; box-sizing:border-box;
    transition:border-color 0.15s;
  }
  .form-input:focus { border-color:#1A1A1A; }
  .form-label {
    font-family:"DM Sans",sans-serif; font-size:11px; font-weight:700;
    letter-spacing:0.14em; text-transform:uppercase;
    color:#1A1A1A; display:block; margin-bottom:6px;
  }
`;

function Label({ children }) {
  return <label className="form-label">{children}</label>;
}

function Input({ ...props }) {
  return <input className="form-input" {...props} />;
}

function Select({ children, ...props }) {
  return (
    <select className="form-input" {...props}>
      {children}
    </select>
  );
}

function Badge({ active }) {
  return (
    <span
      style={{
        fontFamily: "DM Sans,sans-serif",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: 2,
        background: active ? "#F0FFF4" : "#FFF5F5",
        color: active ? "#276749" : "#E53E3E",
      }}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function TypeBadge({ type }) {
  const map = {
    percentage: { bg: "#EBF4FF", color: "#2B6CB0", label: "%" },
    fixed: { bg: "#FAF5FF", color: "#6B46C1", label: "Fixed" },
    freeshipping: { bg: "#F0FFF4", color: "#276749", label: "Free Ship" },
  };
  const s = map[type] || map.percentage;
  return (
    <span
      style={{
        fontFamily: "DM Sans,sans-serif",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: 2,
        background: s.bg,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // coupon object or null
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({}); // { [id]: timeout }

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await getAllCoupons();
      setCoupons(res.data.data || []);
    } catch {
      setError("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue || "",
      startDate: coupon.startDate
        ? new Date(coupon.startDate).toISOString().split("T")[0]
        : "",
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
      usageLimit: coupon.usageLimit ?? "",
      perUserLimit: coupon.perUserLimit ?? 1,
      minOrderAmount: coupon.minOrderAmount ?? "",
      isFirstOrderOnly: coupon.isFirstOrderOnly || false,
      isActive: coupon.isActive,
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setFormError("");

    if (!form.code.trim()) {
      return setFormError("Coupon code is required");
    }
    if (!form.discountType) {
      return setFormError("Discount type is required");
    }
    if (
      form.discountType !== "freeshipping" &&
      (!form.discountValue || Number(form.discountValue) <= 0)
    ) {
      return setFormError("Discount value is required");
    }
    if (
      form.discountType === "percentage" &&
      Number(form.discountValue) > 100
    ) {
      return setFormError("Percentage cannot exceed 100");
    }

    const payload = {
      code: form.code.toUpperCase().trim(),
      discountType: form.discountType,
      discountValue:
        form.discountType === "freeshipping" ? 0 : Number(form.discountValue),
      startDate: form.startDate || undefined,
      expiryDate: form.expiryDate || undefined,
      usageLimit: form.usageLimit !== "" ? Number(form.usageLimit) : null,
      perUserLimit: Number(form.perUserLimit) || 1,
      minOrderAmount:
        form.minOrderAmount !== "" ? Number(form.minOrderAmount) : 0,
      isFirstOrderOnly: form.isFirstOrderOnly,
      isActive: form.isActive,
    };

    try {
      setSubmitting(true);
      if (editing) {
        await updateCoupon(editing._id, payload);
      } else {
        await createCoupon(payload);
      }
      await fetchCoupons();
      closeModal();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!deleteConfirm[id]) {
      const timeout = setTimeout(() => {
        setDeleteConfirm((prev) => {
          const n = { ...prev };
          delete n[id];
          return n;
        });
      }, 3000);
      setDeleteConfirm((prev) => ({ ...prev, [id]: timeout }));
      return;
    }
    clearTimeout(deleteConfirm[id]);
    setDeleteConfirm((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
    try {
      await deleteCoupon(id);
      await fetchCoupons();
    } catch {
      setError("Failed to delete coupon");
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const thStyle = {
    fontFamily: "DM Sans,sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#9A9A9A",
    padding: "12px 16px",
    textAlign: "left",
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    fontFamily: "DM Sans,sans-serif",
    fontSize: 13,
    color: "#1A1A1A",
    padding: "14px 16px",
    verticalAlign: "middle",
  };

  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          padding: "32px 32px 80px",
          background: "#F5F4F0",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "Bebas Neue,sans-serif",
                fontSize: 32,
                letterSpacing: "0.04em",
                color: "#1A1A1A",
                margin: 0,
              }}
            >
              Coupons
            </h1>
            <p
              style={{
                fontFamily: "DM Sans,sans-serif",
                fontSize: 13,
                color: "#6B6B6B",
                margin: "4px 0 0",
              }}
            >
              {coupons.length} coupon{coupons.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            + New Coupon
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#FFF5F5",
              border: "1px solid #E53E3E",
              borderRadius: 2,
              padding: "12px 16px",
              color: "#E53E3E",
              fontFamily: "DM Sans,sans-serif",
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {/* Table */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #F0EFEB",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #F0EFEB" }}>
                <th style={thStyle}>Code</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>Min Order</th>
                <th style={thStyle}>Usage</th>
                <th style={thStyle}>Per User</th>
                <th style={thStyle}>Expiry</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} style={tdStyle}>
                        <div
                          className="skeleton"
                          style={{ height: 12, width: "80%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      padding: "48px 16px",
                      color: "#9A9A9A",
                    }}
                  >
                    No coupons yet. Create your first one.
                  </td>
                </tr>
              )}

              {!loading &&
                coupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="row-hover"
                    style={{ borderBottom: "1px solid #F8F8F7" }}
                  >
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontFamily: "Bebas Neue,sans-serif",
                          fontSize: 15,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {coupon.code}
                      </span>
                      {coupon.isFirstOrderOnly && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontFamily: "DM Sans,sans-serif",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            background: "#FFFBEB",
                            color: "#B7791F",
                            padding: "2px 6px",
                            borderRadius: 2,
                          }}
                        >
                          1st Order
                        </span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <TypeBadge type={coupon.discountType} />
                    </td>
                    <td style={tdStyle}>
                      {coupon.discountType === "freeshipping"
                        ? "—"
                        : coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </td>
                    <td style={tdStyle}>
                      {coupon.minOrderAmount > 0
                        ? `₹${coupon.minOrderAmount}`
                        : "—"}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: "#6B6B6B" }}>
                        {coupon.usageCount}
                        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
                      </span>
                    </td>
                    <td style={tdStyle}>{coupon.perUserLimit}x</td>
                    <td style={{ ...tdStyle, color: "#6B6B6B", fontSize: 12 }}>
                      {formatDate(coupon.expiryDate)}
                    </td>
                    <td style={tdStyle}>
                      <Badge active={coupon.isActive} />
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn-ghost"
                          style={{ padding: "7px 14px" }}
                          onClick={() => openEdit(coupon)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn-danger${
                            deleteConfirm[coupon._id] ? " confirm" : ""
                          }`}
                          onClick={() => handleDelete(coupon._id)}
                        >
                          {deleteConfirm[coupon._id] ? "Sure?" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "2px solid #F0EFEB",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontFamily: "Bebas Neue,sans-serif",
                  fontSize: 22,
                  letterSpacing: "0.04em",
                  color: "#1A1A1A",
                  margin: 0,
                }}
              >
                {editing ? "Edit Coupon" : "New Coupon"}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "DM Sans,sans-serif",
                  fontSize: 20,
                  color: "#9A9A9A",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "24px" }}>
              {formError && (
                <div
                  style={{
                    background: "#FFF5F5",
                    border: "1px solid #E53E3E",
                    borderRadius: 2,
                    padding: "10px 14px",
                    color: "#E53E3E",
                    fontFamily: "DM Sans,sans-serif",
                    fontSize: 13,
                    marginBottom: 20,
                  }}
                >
                  {formError}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {/* Code */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <Label>Coupon Code</Label>
                  <Input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. SAVE20"
                    style={{ textTransform: "uppercase" }}
                    disabled={!!editing}
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <Label>Discount Type</Label>
                  <Select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="freeshipping">Free Shipping</option>
                  </Select>
                </div>

                {/* Discount Value */}
                <div>
                  <Label>
                    {form.discountType === "percentage"
                      ? "Discount (%)"
                      : form.discountType === "fixed"
                      ? "Discount Amount (₹)"
                      : "Value (auto 0)"}
                  </Label>
                  <Input
                    name="discountValue"
                    type="number"
                    value={
                      form.discountType === "freeshipping"
                        ? "0"
                        : form.discountValue
                    }
                    onChange={handleChange}
                    placeholder={
                      form.discountType === "percentage"
                        ? "e.g. 10"
                        : "e.g. 200"
                    }
                    disabled={form.discountType === "freeshipping"}
                    min="0"
                    max={form.discountType === "percentage" ? "100" : undefined}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <Label>Start Date</Label>
                  <Input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <Label>Expiry Date</Label>
                  <Input
                    name="expiryDate"
                    type="date"
                    value={form.expiryDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Usage Limit */}
                <div>
                  <Label>Total Usage Limit</Label>
                  <Input
                    name="usageLimit"
                    type="number"
                    value={form.usageLimit}
                    onChange={handleChange}
                    placeholder="Leave blank for unlimited"
                    min="1"
                  />
                </div>

                {/* Per User Limit */}
                <div>
                  <Label>Uses Per Customer</Label>
                  <Input
                    name="perUserLimit"
                    type="number"
                    value={form.perUserLimit}
                    onChange={handleChange}
                    placeholder="e.g. 1"
                    min="1"
                  />
                </div>

                {/* Min Order Amount */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <Label>Minimum Order Amount (₹)</Label>
                  <Input
                    name="minOrderAmount"
                    type="number"
                    value={form.minOrderAmount}
                    onChange={handleChange}
                    placeholder="e.g. 999 (leave blank for no minimum)"
                    min="0"
                  />
                </div>

                {/* Checkboxes */}
                <div style={{ gridColumn: "1 / -1", display: "flex", gap: 24 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "DM Sans,sans-serif",
                      fontSize: 13,
                      color: "#1A1A1A",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="isFirstOrderOnly"
                      checked={form.isFirstOrderOnly}
                      onChange={handleChange}
                      style={{ width: 14, height: 14, accentColor: "#1A1A1A" }}
                    />
                    First order only
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "DM Sans,sans-serif",
                      fontSize: 13,
                      color: "#1A1A1A",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      style={{ width: 14, height: 14, accentColor: "#1A1A1A" }}
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #F0EFEB",
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                className="btn-ghost"
                onClick={closeModal}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editing
                  ? "Save Changes"
                  : "Create Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
