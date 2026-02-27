import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  getRevenueAnalytics,
  getMonthlyRevenue,
  getSalesReports,
  getUserReports,
  getTopProducts,
} from "../../../api/admin.js";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i);

// ── HELPERS ───────────────────────────────────────────────────────────────────
const formatCurrency = (val) =>
  val >= 100000
    ? `₹${(val / 100000).toFixed(1)}L`
    : val >= 1000
    ? `₹${(val / 1000).toFixed(1)}k`
    : `₹${val}`;

const formatNum = (val) =>
  val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val;

// ── CUSTOM TOOLTIP ────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label, currency = false }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1A1A1A",
      border: "1px solid #333",
      padding: "10px 14px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <p style={{ fontSize: "11px", color: "#9A9A9A", margin: "0 0 6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ fontSize: "13px", fontWeight: 700, color: entry.color, margin: "2px 0" }}>
          {entry.name}: {currency ? `₹${Number(entry.value).toLocaleString("en-IN")}` : entry.value}
        </p>
      ))}
    </div>
  );
};

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent, loading }) => (
  <div style={{
    background: accent ? "#1A1A1A" : "#fff",
    border: accent ? "none" : "1px solid #F0EFEB",
    padding: "20px 24px",
  }}>
    <p style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: accent ? "#9A9A9A" : "#6B6B6B",
      margin: "0 0 8px",
    }}>
      {label}
    </p>
    {loading ? (
      <div style={{ height: "28px", background: accent ? "#333" : "#F0EFEB", animation: "pulse 1.5s ease-in-out infinite" }} />
    ) : (
      <>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(22px, 2.5vw, 30px)",
          letterSpacing: "0.04em",
          color: accent ? "#F5F4F0" : "#1A1A1A",
          margin: "0 0 4px",
          lineHeight: 1,
        }}>
          {value}
        </p>
        {sub && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            color: accent ? "#C9B99A" : "#9A9A9A",
            margin: 0,
          }}>
            {sub}
          </p>
        )}
      </>
    )}
  </div>
);

// ── SECTION HEADER ────────────────────────────────────────────────────────────
const SectionTitle = ({ title, subtitle }) => (
  <div style={{ marginBottom: "16px" }}>
    <h2 style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: "22px",
      letterSpacing: "0.06em",
      color: "#1A1A1A",
      margin: "0 0 4px",
    }}>
      {title}
    </h2>
    {subtitle && (
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "12px",
        color: "#9A9A9A",
        margin: 0,
      }}>
        {subtitle}
      </p>
    )}
  </div>
);

// ── CHART CARD ────────────────────────────────────────────────────────────────
const ChartCard = ({ children, loading, empty }) => (
  <div style={{
    background: "#fff",
    border: "1px solid #F0EFEB",
    padding: "24px",
  }}>
    {loading ? (
      <div style={{ height: "260px", background: "#F5F4F0", animation: "pulse 1.5s ease-in-out infinite" }} />
    ) : empty ? (
      <div style={{
        height: "260px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px",
        color: "#9A9A9A",
      }}>
        No data for selected period
      </div>
    ) : children}
  </div>
);

// ── DATE RANGE PICKER ─────────────────────────────────────────────────────────
const DateRangeFilter = ({ startDate, endDate, onStartChange, onEndChange, onApply, onClear }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    padding: "14px 18px",
    background: "#fff",
    border: "1px solid #F0EFEB",
  }}>
    <p style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#1A1A1A",
      margin: 0,
      whiteSpace: "nowrap",
    }}>
      Date Range
    </p>
    <input
      type="date"
      value={startDate}
      onChange={(e) => onStartChange(e.target.value)}
      style={{
        padding: "7px 10px",
        border: "1.5px solid #E0DED8",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "12px",
        color: "#1A1A1A",
        outline: "none",
        background: "#fff",
      }}
      onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
      onBlur={(e) => e.target.style.borderColor = "#E0DED8"}
    />
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#9A9A9A" }}>to</span>
    <input
      type="date"
      value={endDate}
      onChange={(e) => onEndChange(e.target.value)}
      style={{
        padding: "7px 10px",
        border: "1.5px solid #E0DED8",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "12px",
        color: "#1A1A1A",
        outline: "none",
        background: "#fff",
      }}
      onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
      onBlur={(e) => e.target.style.borderColor = "#E0DED8"}
    />
    <button
      onClick={onApply}
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
      onMouseEnter={(e) => { e.currentTarget.style.background = "#C9B99A"; e.currentTarget.style.color = "#1A1A1A"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#1A1A1A"; e.currentTarget.style.color = "#F5F4F0"; }}
    >
      Apply
    </button>
    {(startDate || endDate) && (
      <button
        onClick={onClear}
        style={{
          padding: "7px 14px",
          background: "none",
          color: "#9A9A9A",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          border: "1px solid #E0DED8",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1A1A1A"; e.currentTarget.style.color = "#1A1A1A"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E0DED8"; e.currentTarget.style.color = "#9A9A9A"; }}
      >
        Clear
      </button>
    )}
  </div>
);

// ── REPORTS PAGE ──────────────────────────────────────────────────────────────
const AdminReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStart, setAppliedStart] = useState("");
  const [appliedEnd, setAppliedEnd] = useState("");
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [monthly, setMonthly] = useState([]);
  const [monthlyLoading, setMonthlyLoading] = useState(true);

  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);

  const [userGrowth, setUserGrowth] = useState([]);
  const [userGrowthLoading, setUserGrowthLoading] = useState(true);

  const [topProducts, setTopProducts] = useState([]);
  const [topProductsLoading, setTopProductsLoading] = useState(true);

  // ── Fetch all on load ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchAll(appliedStart, appliedEnd);
  }, []);

  useEffect(() => {
    fetchMonthly(selectedYear);
  }, [selectedYear]);

  const fetchAll = async (start, end) => {
    fetchAnalytics(start, end);
    fetchSales(start, end);
    fetchUserGrowth(start, end);
    fetchTopProducts(start, end);
  };

  const fetchAnalytics = async (start, end) => {
    setAnalyticsLoading(true);
    try {
      const data = await getRevenueAnalytics(start, end);
      setAnalytics(data.data);
    } catch { setAnalytics(null); }
    finally { setAnalyticsLoading(false); }
  };

  const fetchMonthly = async (year) => {
    setMonthlyLoading(true);
    try {
      const data = await getMonthlyRevenue(year);
      // Fill all 12 months
      const filled = Array.from({ length: 12 }, (_, i) => {
        const found = data.data?.find((d) => d.month === i + 1);
        return {
          month: MONTHS[i],
          Revenue: found?.totalRevenue || 0,
          Profit: found?.totalProfit || 0,
          Orders: found?.totalOrders || 0,
        };
      });
      setMonthly(filled);
    } catch { setMonthly([]); }
    finally { setMonthlyLoading(false); }
  };

  const fetchSales = async (start, end) => {
    setSalesLoading(true);
    try {
      const data = await getSalesReports(start, end);
      const formatted = (data.data || []).map((d) => ({
        date: `${d.day}/${d.month}`,
        Orders: d.totalOrders,
      }));
      setSales(formatted);
    } catch { setSales([]); }
    finally { setSalesLoading(false); }
  };

  const fetchUserGrowth = async (start, end) => {
    setUserGrowthLoading(true);
    try {
      const data = await getUserReports(start, end);
      const formatted = (data.data || []).map((d) => ({
        period: `${MONTHS[d.month - 1]} ${d.year}`,
        "New Users": d.newUsers,
      }));
      setUserGrowth(formatted);
    } catch { setUserGrowth([]); }
    finally { setUserGrowthLoading(false); }
  };

  const fetchTopProducts = async (start, end) => {
    setTopProductsLoading(true);
    try {
      const data = await getTopProducts(start, end);
      setTopProducts(data.data || []);
    } catch { setTopProducts([]); }
    finally { setTopProductsLoading(false); }
  };

  const handleApply = () => {
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
    fetchAll(startDate, endDate);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setAppliedStart("");
    setAppliedEnd("");
    fetchAll("", "");
  };

  const maxSold = Math.max(...topProducts.map((p) => p.totalSold), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      {/* Header */}
      <div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(28px, 3vw, 40px)",
          letterSpacing: "0.04em",
          color: "#1A1A1A",
          margin: "0 0 4px",
        }}>
          Reports
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: "#9A9A9A",
          margin: 0,
        }}>
          Revenue, sales, user growth and product performance
        </p>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        onApply={handleApply}
        onClear={handleClear}
      />

      {/* ── REVENUE ANALYTICS ───────────────────────────────────────────────── */}
      <div>
        <SectionTitle
          title="Revenue Overview"
          subtitle={appliedStart && appliedEnd
            ? `${appliedStart} → ${appliedEnd}`
            : "All time — delivered & paid orders only"}
        />
        <div className="rep-stats-grid">
          <StatCard
            label="Total Revenue"
            value={`₹${(analytics?.totalRevenue || 0).toLocaleString("en-IN")}`}
            accent
            loading={analyticsLoading}
          />
          <StatCard
            label="Total Profit"
            value={`₹${(analytics?.totalProfit || 0).toLocaleString("en-IN")}`}
            sub={`Margin: ${analytics?.profitMargin || 0}%`}
            loading={analyticsLoading}
          />
          <StatCard
            label="Total Orders"
            value={analytics?.totalOrders || 0}
            loading={analyticsLoading}
          />
          <StatCard
            label="Avg Order Value"
            value={`₹${(analytics?.averageOrderValue || 0).toLocaleString("en-IN")}`}
            loading={analyticsLoading}
          />
          <StatCard
            label="Total Cost"
            value={`₹${(analytics?.totalCost || 0).toLocaleString("en-IN")}`}
            loading={analyticsLoading}
          />
        </div>
      </div>

      {/* ── MONTHLY REVENUE CHART ────────────────────────────────────────────── */}
      <div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <SectionTitle
            title="Monthly Revenue & Profit"
            subtitle="Revenue vs Profit per month"
          />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              padding: "7px 12px",
              border: "1.5px solid #E0DED8",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#1A1A1A",
              outline: "none",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <ChartCard loading={monthlyLoading} empty={monthly.every((m) => m.Revenue === 0)}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEB" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: "#9A9A9A" }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: "#9A9A9A" }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<DarkTooltip currency />} />
              <Legend
                wrapperStyle={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", paddingTop: "16px" }}
              />
              <Bar dataKey="Revenue" fill="#C9B99A" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Profit" fill="#1A1A1A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── DAILY SALES + USER GROWTH ────────────────────────────────────────── */}
      <div className="rep-chart-grid">

        {/* Daily Sales */}
        <div>
          <SectionTitle
            title="Daily Sales"
            subtitle="Orders per day"
          />
          <ChartCard loading={salesLoading} empty={sales.length === 0}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={sales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEB" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fill: "#9A9A9A" }}
                  axisLine={false} tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={formatNum}
                  tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: "#9A9A9A" }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<DarkTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Orders"
                  stroke="#1A1A1A"
                  strokeWidth={2}
                  dot={{ fill: "#1A1A1A", r: 3 }}
                  activeDot={{ r: 5, fill: "#C9B99A" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* User Growth */}
        <div>
          <SectionTitle
            title="User Growth"
            subtitle="New registrations per month"
          />
          <ChartCard loading={userGrowthLoading} empty={userGrowth.length === 0}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEB" vertical={false} />
                <XAxis
                  dataKey="period"
                  tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fill: "#9A9A9A" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: "#9A9A9A" }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="New Users" fill="#C9B99A" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* ── TOP PRODUCTS ─────────────────────────────────────────────────────── */}
      <div>
        <SectionTitle
          title="Top Products"
          subtitle="Best selling products by units sold — delivered & paid orders only"
        />
        <div style={{ background: "#fff", border: "1px solid #F0EFEB", padding: "24px" }}>
          {topProductsLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: "36px", background: "#F0EFEB", animation: "pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#9A9A9A", textAlign: "center", padding: "40px 0", margin: 0 }}>
              No data for selected period
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {topProducts.map((product, i) => {
                const pct = (product.totalSold / maxSold) * 100;
                return (
                  <div key={product.productId} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {/* Rank */}
                    <span style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "16px",
                      letterSpacing: "0.06em",
                      color: i === 0 ? "#C9B99A" : "#9A9A9A",
                      width: "24px",
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>

                    {/* Bar + Name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1A1A1A",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {product.name}
                        </span>
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#1A1A1A",
                          flexShrink: 0,
                          marginLeft: "12px",
                        }}>
                          {product.totalSold} sold
                        </span>
                      </div>
                      <div style={{ height: "6px", background: "#F0EFEB", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: i === 0 ? "#C9B99A" : "#1A1A1A",
                          borderRadius: "3px",
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .rep-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        .rep-chart-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .rep-stats-grid { grid-template-columns: repeat(3, 1fr); }
          .rep-chart-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .rep-stats-grid { grid-template-columns: 1fr 1fr; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default AdminReports;