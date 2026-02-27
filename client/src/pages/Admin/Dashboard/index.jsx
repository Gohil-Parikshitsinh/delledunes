import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getDashboardStats, getDashboardChartData } from "../../../api/admin.js";
import { CardSkeleton, TextSkeleton } from "../../../components/ui/Skeleton.jsx";

// ── MONTH NAMES ───────────────────────────────────────────────────────────────
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, prefix = "", suffix = "", accent = false, loading }) => (
  <div
    style={{
      background: accent ? "#1A1A1A" : "#fff",
      border: accent ? "none" : "1px solid #F0EFEB",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    <p
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: accent ? "#9A9A9A" : "#6B6B6B",
        margin: 0,
      }}
    >
      {label}
    </p>
    {loading ? (
      <TextSkeleton width="60%" height="28px" />
    ) : (
      <p
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(24px, 3vw, 36px)",
          letterSpacing: "0.04em",
          color: accent ? "#F5F4F0" : "#1A1A1A",
          margin: 0,
          lineHeight: 1,
        }}
      >
        {prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}{suffix}
      </p>
    )}
  </div>
);

// ── CUSTOM TOOLTIP ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#1A1A1A",
        border: "none",
        padding: "12px 16px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#9A9A9A",
          marginBottom: "8px",
        }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: entry.color,
            margin: "4px 0",
          }}
        >
          {entry.name}: ₹{Number(entry.value).toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        console.log(data);
        
        setStats(data.data);
      } catch {
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchChart = async () => {
      try {
        const data = await getDashboardChartData();
        // Format for Recharts — add month name
        const formatted = (data.data || []).map((d) => ({
          ...d,
          name: `${MONTHS[d.month - 1]} ${d.year}`,
        }));
        setChartData(formatted);
      } catch {
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    };

    fetchStats();
    fetchChart();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── PAGE TITLE ──────────────────────────────────────────────────────── */}
      <div>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(28px, 3vw, 40px)",
            letterSpacing: "0.04em",
            color: "#1A1A1A",
            margin: "0 0 4px",
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#9A9A9A",
            margin: 0,
          }}
        >
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* ── STAT CARDS ROW 1 — Income, Sales, Profit ────────────────────────── */}
      <div className="stat-grid-3">
        <StatCard
          label="Total Income"
          value={stats?.totalIncome ?? 0}
          prefix="₹"
          accent
          loading={statsLoading}
        />
        <StatCard
          label="Total Profit"
          value={stats?.totalProfit ?? 0}
          prefix="₹"
          loading={statsLoading}
        />
        <StatCard
          label="Total Sales"
          value={stats?.totalSales ?? 0}
          loading={statsLoading}
        />
      </div>

      {/* ── STAT CARDS ROW 2 — New, Pending, Cancelled ──────────────────────── */}
      <div className="stat-grid-3">
        {/* <StatCard
          label="Delivered Orders"
          value={stats?.deliveredOrders ?? 0}
          loading={statsLoading}
        /> */}
        <StatCard
          label="New Orders"
          value={stats?.newOrders ?? 0}
          loading={statsLoading}
        />
        <StatCard
          label="Pending Orders"
          value={stats?.pendingOrders ?? 0}
          loading={statsLoading}
        />
        <StatCard
          label="Cancelled Orders"
          value={stats?.cancelOrders ?? 0}
          loading={statsLoading}
        />
      </div>

      {/* ── CHART ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #F0EFEB",
          padding: "24px",
        }}
      >
        {/* Chart header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
  <p
    style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: "22px",
      letterSpacing: "0.06em",
      color: "#1A1A1A",
      margin: "0 0 2px",
    }}
  >
    Revenue vs Profit
  </p>
  <p
    style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "12px",
      color: "#9A9A9A",
      margin: 0,
    }}
  >
    Delivered + Paid orders only
  </p>
</div>

          {/* Toggle income / profit / sales */}
          {/* <div style={{ display: "flex", gap: "4px" }}>
            {[
              { label: "Income", value: "income" },
              { label: "Profit", value: "profit" },
              { label: "Sales", value: "sales" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveBar(opt.value)}
                style={{
                  padding: "6px 14px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: activeBar === opt.value ? "#1A1A1A" : "#F5F4F0",
                  color: activeBar === opt.value ? "#F5F4F0" : "#6B6B6B",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div> */}
          {/* <Bar/> */}
        </div>

        {/* Chart */}
        
{chartLoading ? (
  <CardSkeleton height="300px" />
) : chartData.length === 0 ? (
  <div
    style={{
      height: "300px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <p
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px",
        color: "#9A9A9A",
      }}
    >
      No data yet — completed orders will appear here.
    </p>
  </div>
) : (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={chartData}
      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      barSize={20}
      barGap={4}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEB" vertical={false} />
      <XAxis
        dataKey="name"
        tick={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fill: "#9A9A9A",
        }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tick={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fill: "#9A9A9A",
        }}
        axisLine={false}
        tickLine={false}
        tickFormatter={(v) =>
          `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
        }
      />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F5F4F0" }} />
      <Legend
        wrapperStyle={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          paddingTop: "16px",
        }}
      />
      <Bar dataKey="totalIncome" name="Income" fill="#C9B99A" radius={[2, 2, 0, 0]} />
      <Bar dataKey="totalProfit" name="Profit" fill="#1A1A1A" radius={[2, 2, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)}
      </div>

      {/* Responsive grid styles */}
      <style>{`
        .stat-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .stat-grid-3 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .stat-grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;