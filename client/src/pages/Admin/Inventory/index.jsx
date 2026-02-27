import { useState, useEffect } from "react";
import { getInventoryStats, getLowStockProducts } from "../../../api/admin.js";
import { getAllVariants, updateVariant } from "../../../api/admin.js";

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, prefix = "", suffix = "", accent = false, loading }) => (
  <div style={{
    background: accent ? "#1A1A1A" : "#fff",
    border: accent ? "none" : "1px solid #F0EFEB",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  }}>
    <p style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: accent ? "#9A9A9A" : "#6B6B6B",
      margin: 0,
    }}>
      {label}
    </p>
    {loading ? (
      <div style={{ height: "28px", width: "60%", background: accent ? "#333" : "#F0EFEB", animation: "pulse 1.5s ease-in-out infinite" }} />
    ) : (
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(22px, 2.5vw, 32px)",
        letterSpacing: "0.04em",
        color: accent ? "#F5F4F0" : "#1A1A1A",
        margin: 0,
        lineHeight: 1,
      }}>
        {prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}{suffix}
      </p>
    )}
  </div>
);

// ── STOCK STATUS BADGE ────────────────────────────────────────────────────────
const StockBadge = ({ stock }) => {
  const style =
    stock === 0
      ? { bg: "#FFF5F5", color: "#E53E3E", label: "Out of Stock" }
      : stock <= 5
      ? { bg: "#FFF8E6", color: "#B7791F", label: "Low Stock" }
      : { bg: "#F0FFF4", color: "#276749", label: "In Stock" };

  return (
    <span style={{
      background: style.bg,
      color: style.color,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "3px 10px",
      borderRadius: "2px",
      whiteSpace: "nowrap",
    }}>
      {style.label}
    </span>
  );
};

// ── INLINE STOCK EDITOR ───────────────────────────────────────────────────────
const StockEditor = ({ variant, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [stock, setStock] = useState(variant.stock);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (Number(stock) === variant.stock) { setEditing(false); return; }
    setSaving(true);
    try {
      await onUpdate(variant._id, Number(stock));
      setEditing(false);
    } catch {
      setStock(variant.stock);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          min={0}
          autoFocus
          style={{
            width: "70px",
            padding: "5px 8px",
            border: "1.5px solid #1A1A1A",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#1A1A1A",
            outline: "none",
          }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "5px 10px",
            background: "#1A1A1A",
            color: "#F5F4F0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "..." : "Save"}
        </button>
        <button
          onClick={() => { setEditing(false); setStock(variant.stock); }}
          style={{
            padding: "5px 10px",
            background: "none",
            color: "#6B6B6B",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            border: "1px solid #E0DED8",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px",
        fontWeight: 700,
        color: stock === 0 ? "#E53E3E" : stock <= 5 ? "#B7791F" : "#1A1A1A",
      }}>
        {stock}
      </span>
      <button
        onClick={() => setEditing(true)}
        style={{
          padding: "3px 10px",
          background: "none",
          border: "1px solid #E0DED8",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#6B6B6B",
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
        Edit
      </button>
    </div>
  );
};

// ── INVENTORY PAGE ────────────────────────────────────────────────────────────
const AdminInventory = () => {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(true);
  const [lowStock, setLowStock] = useState([]);
  const [lowStockLoading, setLowStockLoading] = useState(true);
  const [threshold, setThreshold] = useState(5);
  const [thresholdInput, setThresholdInput] = useState("5");
  const [activeTab, setActiveTab] = useState("all"); // all | low | out
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStats();
    fetchVariants();
  }, []);

  useEffect(() => {
    fetchLowStock(threshold);
  }, [threshold]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await getInventoryStats();
      setStats(data.data);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchVariants = async () => {
    setVariantsLoading(true);
    try {
      const data = await getAllVariants();
      setVariants(data.data || []);
    } catch {
      setVariants([]);
    } finally {
      setVariantsLoading(false);
    }
  };

  const fetchLowStock = async (t) => {
    setLowStockLoading(true);
    try {
      const data = await getLowStockProducts(t);
      setLowStock(data.data || []);
    } catch {
      setLowStock([]);
    } finally {
      setLowStockLoading(false);
    }
  };

  const handleStockUpdate = async (variantId, newStock) => {
    await updateVariant(variantId, { stock: newStock });
    setVariants((prev) =>
      prev.map((v) => v._id === variantId ? { ...v, stock: newStock } : v)
    );
    setLowStock((prev) =>
      prev.map((v) => v._id === variantId ? { ...v, stock: newStock } : v)
    );
    // Refresh stats
    fetchStats();
  };

  const handleThresholdApply = () => {
    const val = parseInt(thresholdInput);
    if (!isNaN(val) && val > 0) setThreshold(val);
  };

  // Filter variants based on active tab + search
  const filteredVariants = variants.filter((v) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "out" && v.stock === 0) ||
      (activeTab === "low" && v.stock > 0 && v.stock <= threshold);

    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      v.product?.name?.toLowerCase().includes(q) ||
      v.skuCode?.toLowerCase().includes(q) ||
      v.size?.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  const TABS = [
    { label: "All", value: "all" },
    { label: "Low Stock", value: "low" },
    { label: "Out of Stock", value: "out" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Page title */}
      <div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(28px, 3vw, 40px)",
          letterSpacing: "0.04em",
          color: "#1A1A1A",
          margin: "0 0 4px",
        }}>
          Inventory
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: "#9A9A9A",
          margin: 0,
        }}>
          Track stock levels, inventory value and low stock alerts
        </p>
      </div>

      {/* Stats grid */}
      <div className="inv-stats-grid">
        <StatCard label="Total Products" value={stats?.totalProducts ?? 0} loading={statsLoading} accent />
        <StatCard label="Total Variants" value={stats?.totalVariants ?? 0} loading={statsLoading} />
        <StatCard label="Total Stock" value={stats?.totalStock ?? 0} suffix=" units" loading={statsLoading} />
        <StatCard label="Out of Stock" value={stats?.outOfStockProducts ?? 0} loading={statsLoading} />
        <StatCard label="Low Stock" value={stats?.lowStockProducts ?? 0} loading={statsLoading} />
        <StatCard label="Inventory Value" value={stats?.totalInventoryValue ?? 0} prefix="₹" loading={statsLoading} />
        <StatCard label="Potential Revenue" value={stats?.potentialRevenueValue ?? 0} prefix="₹" loading={statsLoading} />
      </div>

      {/* Low stock threshold control */}
      <div style={{
        background: "#fff",
        border: "1px solid #F0EFEB",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#1A1A1A",
          margin: 0,
        }}>
          Low Stock Threshold
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="number"
            value={thresholdInput}
            onChange={(e) => setThresholdInput(e.target.value)}
            min={1}
            style={{
              width: "70px",
              padding: "7px 10px",
              border: "1.5px solid #E0DED8",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#1A1A1A",
              outline: "none",
            }}
            onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
            onBlur={(e) => e.target.style.borderColor = "#E0DED8"}
            onKeyDown={(e) => e.key === "Enter" && handleThresholdApply()}
          />
          <button
            onClick={handleThresholdApply}
            style={{
              padding: "7px 16px",
              background: "#1A1A1A",
              color: "#F5F4F0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
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
            Apply
          </button>
        </div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px",
          color: "#9A9A9A",
          margin: 0,
        }}>
          Currently showing variants with stock ≤ {threshold} as low stock
        </p>
      </div>

      {/* Tabs + Search */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                padding: "7px 16px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                background: activeTab === tab.value ? "#1A1A1A" : "#fff",
                color: activeTab === tab.value ? "#F5F4F0" : "#6B6B6B",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
              {tab.value === "low" && (
                <span style={{ marginLeft: "6px", opacity: 0.6 }}>
                  ({variants.filter((v) => v.stock > 0 && v.stock <= threshold).length})
                </span>
              )}
              {tab.value === "out" && (
                <span style={{ marginLeft: "6px", opacity: 0.6 }}>
                  ({variants.filter((v) => v.stock === 0).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9A9A9A" }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, SKU or size..."
            style={{
              padding: "9px 12px 9px 36px",
              background: "#fff",
              border: "1px solid #F0EFEB",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#1A1A1A",
              outline: "none",
              width: "280px",
            }}
            onFocus={(e) => e.target.style.borderColor = "#C9B99A"}
            onBlur={(e) => e.target.style.borderColor = "#F0EFEB"}
          />
        </div>
      </div>

      {/* Variants table */}
      <div style={{ background: "#fff", border: "1px solid #F0EFEB", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #F0EFEB" }}>
              {["Product", "Size", "SKU Code", "Stock", "Status", "Offer Price", "Cost Price"].map((h) => (
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
            {variantsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F8F8F7" }}>
                  {Array.from({ length: 7 }).map((_, j) => (
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
            ) : filteredVariants.length === 0 ? (
              <tr>
                <td colSpan={7} style={{
                  padding: "60px 24px",
                  textAlign: "center",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "#9A9A9A",
                }}>
                  {search
                    ? `No variants found for "${search}"`
                    : activeTab === "low"
                    ? `No variants with stock ≤ ${threshold}`
                    : activeTab === "out"
                    ? "No out of stock variants"
                    : "No variants yet."}
                </td>
              </tr>
            ) : (
              filteredVariants.map((variant) => (
                <tr
                  key={variant._id}
                  style={{
                    borderBottom: "1px solid #F8F8F7",
                    transition: "background 0.15s",
                    background: variant.stock === 0 ? "#FFFAFA" : "transparent",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAF9"}
                  onMouseLeave={(e) => e.currentTarget.style.background = variant.stock === 0 ? "#FFFAFA" : "transparent"}
                >
                  {/* Product */}
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1A1A1A",
                      margin: "0 0 2px",
                      whiteSpace: "nowrap",
                    }}>
                      {variant.product?.name || "—"}
                    </p>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px",
                      color: "#9A9A9A",
                      margin: 0,
                    }}>
                      {variant.product?.slug || ""}
                    </p>
                  </td>

                  {/* Size */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                    }}>
                      {variant.size}
                    </span>
                  </td>

                  {/* SKU */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px",
                      color: "#9A9A9A",
                      letterSpacing: "0.08em",
                    }}>
                      {variant.skuCode}
                    </span>
                  </td>

                  {/* Stock — inline editable */}
                  <td style={{ padding: "14px 16px" }}>
                    <StockEditor
                      variant={variant}
                      onUpdate={handleStockUpdate}
                    />
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 16px" }}>
                    <StockBadge stock={variant.stock} />
                  </td>

                  {/* Offer Price */}
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1A1A1A",
                    }}>
                      ₹{variant.product?.offerPrice?.toLocaleString("en-IN") || "—"}
                    </span>
                  </td>

                  {/* Cost Price */}
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: "#6B6B6B",
                    }}>
                      ₹{variant.product?.costPrice?.toLocaleString("en-IN") || "—"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .inv-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .inv-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .inv-stats-grid { grid-template-columns: 1fr; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default AdminInventory;