import { useState, useEffect } from "react";
import {
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../api/admin.js";

// ── CATEGORY FORM MODAL ───────────────────────────────────────────────────────
const CategoryModal = ({ category, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!category;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    try {
      await onSave(form, category?._id);
      onClose();
    } catch (err) {
      setErrors({ submit: err?.response?.data?.message || "Failed to save category" });
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
          background: "rgba(0,0,0,0.4)",
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(480px, calc(100vw - 48px))",
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
            {isEdit ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px",
              background: "none", border: "1px solid #E0DED8",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
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

        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: errors.name ? "#E53E3E" : "#1A1A1A",
          }}>
            Name <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => {
              setForm((p) => ({ ...p, name: e.target.value }));
              if (errors.name) setErrors((p) => ({ ...p, name: "" }));
            }}
            placeholder="e.g. T-Shirts"
            style={{
              padding: "10px 12px",
              border: `1.5px solid ${errors.name ? "#E53E3E" : "#E0DED8"}`,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#1A1A1A",
              outline: "none",
              background: "#fff",
            }}
            onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
            onBlur={(e) => e.target.style.borderColor = errors.name ? "#E53E3E" : "#E0DED8"}
            autoFocus
          />
          {errors.name && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#E53E3E", margin: 0 }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#1A1A1A",
          }}>
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Optional description..."
            rows={3}
            style={{
              padding: "10px 12px",
              border: "1.5px solid #E0DED8",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#1A1A1A",
              outline: "none",
              resize: "vertical",
              background: "#fff",
            }}
            onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
            onBlur={(e) => e.target.style.borderColor = "#E0DED8"}
          />
        </div>

        {/* Slug preview */}
        {form.name && (
          <div style={{
            padding: "10px 14px",
            background: "#F5F4F0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9A9A9A",
            }}>
              Slug:
            </span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#1A1A1A",
              letterSpacing: "0.04em",
            }}>
              {form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              flex: 1,
              padding: "11px",
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
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Category"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "11px 20px",
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
      </div>
    </>
  );
};

// ── ADMIN CATEGORIES PAGE ─────────────────────────────────────────────────────
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | category object
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategoriesAdmin();
      setCategories(data.data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form, id) => {
    if (id) {
      const data = await updateCategory(id, form);
      setCategories((prev) =>
        prev.map((c) => c._id === id ? data.data : c)
      );
    } else {
      const data = await createCategory(form);
      setCategories((prev) => [data.data, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }
    setDeletingId(id);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      // fail silently
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(28px, 3vw, 40px)",
            letterSpacing: "0.04em",
            color: "#1A1A1A",
            margin: "0 0 4px",
          }}>
            Categories
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#9A9A9A",
            margin: 0,
          }}>
            {loading ? "Loading..." : `${categories.length} categories total`}
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
          Add Category
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: "360px" }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9A9A9A" }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            background: "#fff",
            border: "1px solid #F0EFEB",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#1A1A1A",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#C9B99A"}
          onBlur={(e) => e.target.style.borderColor = "#F0EFEB"}
        />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #F0EFEB", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #F0EFEB" }}>
              {["Name", "Slug", "Description", "Created", "Actions"].map((h) => (
                <th key={h} style={{
                  padding: "14px 16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#9A9A9A",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F8F8F7" }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} style={{ padding: "16px" }}>
                      <div style={{
                        height: "12px",
                        background: "#F0EFEB",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{
                  padding: "60px 24px",
                  textAlign: "center",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "#9A9A9A",
                }}>
                  {search ? `No categories found for "${search}"` : "No categories yet. Add your first one."}
                </td>
              </tr>
            ) : (
              filtered.map((cat) => {
                const isDeleting = deletingId === cat._id;
                const isConfirming = confirmDeleteId === cat._id;

                return (
                  <tr
                    key={cat._id}
                    style={{
                      borderBottom: "1px solid #F8F8F7",
                      opacity: isDeleting ? 0.4 : 1,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAF9"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Name */}
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#1A1A1A",
                        whiteSpace: "nowrap",
                      }}>
                        {cat.name}
                      </span>
                    </td>

                    {/* Slug */}
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "#9A9A9A",
                        letterSpacing: "0.04em",
                      }}>
                        {cat.slug}
                      </span>
                    </td>

                    {/* Description */}
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "#6B6B6B",
                        maxWidth: "300px",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {cat.description || "—"}
                      </span>
                    </td>

                    {/* Created */}
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "#9A9A9A",
                      }}>
                        {new Date(cat.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => setModal(cat)}
                          style={{
                            padding: "6px 12px",
                            background: "none",
                            border: "1px solid #E0DED8",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "#1A1A1A",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
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
                          onClick={() => handleDelete(cat._id)}
                          disabled={isDeleting}
                          style={{
                            padding: "6px 12px",
                            background: isConfirming ? "#E53E3E" : "none",
                            border: `1px solid ${isConfirming ? "#E53E3E" : "#E0DED8"}`,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: isConfirming ? "#fff" : "#E53E3E",
                            cursor: isDeleting ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                            transition: "all 0.15s",
                          }}
                        >
                          {isDeleting ? "..." : isConfirming ? "Confirm?" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <CategoryModal
          category={modal === "create" ? null : modal}
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

export default AdminCategories;