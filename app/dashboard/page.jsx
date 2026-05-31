"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const C = {
  bg:        "#0b0b0b",
  surface:   "#141414",
  surface2:  "#1c1c1c",
  surface3:  "#252525",
  border:    "#2c2c2c",
  borderHov: "#3a3a3a",
  accent:    "#D55210",
  accentDim: "#D5521015",
  accentMid: "#D5521050",
  success:   "#4ead72",
  successBg: "#4ead7215",
  danger:    "#e05252",
  dangerBg:  "#e0525215",
  warn:      "#c4a55a",
  warnBg:    "#c4a55a15",
  blue:      "#7a9cc4",
  blueBg:    "#7a9cc415",
  purple:    "#a47cc4",
  purpleBg:  "#a47cc415",
  text:      "#f0ece6",
  muted:     "#6b6560",
};

const PC = {
  HIGH:   { color: C.danger,  bg: C.dangerBg  },
  MEDIUM: { color: C.accent,  bg: C.accentDim },
  LOW:    { color: C.success, bg: C.successBg },
};
const SC = {
  COMPLETED: { color: C.success, bg: C.successBg },
  TODO:      { color: C.blue,    bg: C.blueBg    },
  PENDING:   { color: C.warn,    bg: C.warnBg    },
};

const fmt      = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtShort = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";
const isOver   = (d) => d && new Date(d) < new Date(new Date().toDateString());
const dayName  = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short" });
const monthName= (d) => new Date(d).toLocaleDateString("en-US", { month: "short" });

const CSS = `
  @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
  @keyframes spin    { to { transform:rotate(360deg); } }
  @keyframes fillBar { from { width:0; } to { width:var(--pct); } }
  * { box-sizing:border-box; margin:0; padding:0; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:#0b0b0b; }
  ::-webkit-scrollbar-thumb { background:#2a2a2a; border-radius:3px; }
  .dash-card { transition:border-color 0.2s ease; }
  .dash-card:hover { border-color:#3a3a3a !important; }
  .stat-card { transition:all 0.2s ease; }
  .stat-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.45) !important; }
  .row-hover { transition:background 0.12s; }
  .row-hover:hover { background:#1c1c1c !important; }
  .heat-cell { transition:opacity 0.15s, transform 0.15s; }
  .heat-cell:hover { opacity:0.85 !important; transform:scale(1.25); z-index:10; }
  .nav-link:hover { color:#f0ece6 !important; }
  .quick-btn:hover { transform:translateY(-2px) !important; }
`;

// ─────────────────────────────────────────────────────────────
// SVG Donut — generic, accepts array of { value, color, label }
// ─────────────────────────────────────────────────────────────
function DonutChart({ segments, centerLabel, centerSub, size = 130 }) {
  const r    = (size / 2) - 14;
  const cx   = size / 2;
  const cy   = size / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);

  let offset = 0;
  const arcs = segments.map(seg => {
    const pct  = total === 0 ? 0 : seg.value / total;
    const dash = pct * circ;
    const arc  = { ...seg, dash, offset: -offset * circ, pct };
    offset += pct;
    return arc;
  });

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.surface3} strokeWidth="11" />
        {arcs.map((arc, i) => arc.dash > 0 && (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={arc.color} strokeWidth="11"
            strokeDasharray={`${arc.dash} ${circ}`}
            strokeDashoffset={arc.offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease, stroke-dashoffset 1s ease" }}
          />
        ))}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: size < 120 ? 18 : 22, fontWeight: 800, color: C.text, lineHeight: 1, margin: 0 }}>{centerLabel}</p>
        {centerSub && <p style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>{centerSub}</p>}
      </div>
    </div>
  );
}

// Legend row for donut charts
function Legend({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(({ label, value, color, sub }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 5px ${color}70` }} />
          <span style={{ fontSize: 12, color: C.muted, flex: 1 }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
          {sub && <span style={{ fontSize: 11, color: C.muted }}>({sub})</span>}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bar chart — last 7 days
// ─────────────────────────────────────────────────────────────
function BarChart({ todos }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const counts = days.map(d => {
    const ds = d.toDateString();
    return todos.filter(t => new Date(t.created_at || 0).toDateString() === ds).length;
  });
  const max = Math.max(...counts, 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
      {days.map((d, i) => {
        const h = Math.max(Math.round((counts[i] / max) * 76), 4);
        const isToday = d.toDateString() === new Date().toDateString();
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 10, color: C.muted, fontWeight: 600, minHeight: 14 }}>{counts[i] || ""}</span>
            <div style={{
              width: "100%", height: h, borderRadius: 5,
              background: isToday
                ? `linear-gradient(to top, ${C.accent}, #e8621f)`
                : C.surface3,
              boxShadow: isToday ? `0 0 12px ${C.accent}55` : "none",
              transition: "height 0.8s cubic-bezier(0.22,1,0.36,1)",
            }} />
            <span style={{ fontSize: 10, color: isToday ? C.accent : C.muted, fontWeight: isToday ? 700 : 400 }}>
              {dayName(d)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Heatmap — FIXED: proper 7-column grid (Mon–Sun columns)
// ─────────────────────────────────────────────────────────────
function HeatMap({ todos }) {
  const WEEKS   = 12; // show 12 weeks
  const TOTAL   = WEEKS * 7;

  // Build day grid — oldest first
  const grid = Array.from({ length: TOTAL }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (TOTAL - 1 - i));
    const ds    = d.toDateString();
    const count = todos.filter(t =>
      t.status === "COMPLETED" &&
      new Date(t.updated_at || t.created_at || 0).toDateString() === ds
    ).length;
    return { d, count, ds };
  });

  const maxC = Math.max(...grid.map(g => g.count), 1);

  // Day-of-week labels (Mon→Sun across 7 columns)
  const DOW = ["M", "T", "W", "T", "F", "S", "S"];

  // Month labels — find first cell of each new month
  const monthLabels = [];
  grid.forEach((g, i) => {
    const col = i % 7 === 0 ? i / 7 : null; // only on Monday
    if (col !== null) {
      const mo = monthName(g.d);
      if (monthLabels.length === 0 || monthLabels[monthLabels.length - 1].label !== mo) {
        monthLabels.push({ col, label: mo });
      }
    }
  });

  const CELL = 14;
  const GAP  = 4;

  return (
    <div>
      {/* Month labels row */}
      <div style={{ display: "flex", gap: GAP, marginBottom: 4, paddingLeft: 22 }}>
        {Array.from({ length: WEEKS }, (_, wi) => {
          const ml = monthLabels.find(m => m.col === wi);
          return (
            <div key={wi} style={{ width: CELL, flexShrink: 0, fontSize: 9, color: ml ? C.muted : "transparent", letterSpacing: "0.04em" }}>
              {ml ? ml.label : "."}
            </div>
          );
        })}
      </div>

      {/* Grid: 7 rows (days) × 12 cols (weeks) */}
      <div style={{ display: "flex", gap: 4 }}>
        {/* Day-of-week labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: GAP, marginRight: 4 }}>
          {DOW.map((d, i) => (
            <div key={i} style={{ width: 12, height: CELL, fontSize: 9, color: C.muted, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>{d}</div>
          ))}
        </div>

        {/* Week columns */}
        {Array.from({ length: WEEKS }, (_, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
            {Array.from({ length: 7 }, (_, di) => {
              const idx   = di * WEEKS + wi; // map row×col to grid index
              // Reindex: grid goes oldest→newest left-to-right, top-to-bottom by week
              // We want: col = week index, row = day of week
              // grid[wi * 7 + di]
              const cell  = grid[wi * 7 + di];
              if (!cell) return <div key={di} style={{ width: CELL, height: CELL }} />;
              const { d, count } = cell;
              const isToday = d.toDateString() === new Date().toDateString();
              const alpha   = count === 0 ? 0 : 0.18 + (count / maxC) * 0.82;
              return (
                <div
                  key={di}
                  className="heat-cell"
                  title={`${fmtShort(d)}: ${count} task${count !== 1 ? "s" : ""} completed`}
                  style={{
                    width: CELL, height: CELL, borderRadius: 3,
                    background: count === 0 ? C.surface3 : `rgba(213,82,16,${alpha})`,
                    border: isToday ? `1.5px solid ${C.accent}` : "1px solid transparent",
                    cursor: "default", position: "relative",
                    boxShadow: count > 0 ? `0 0 4px rgba(213,82,16,${alpha * 0.6})` : "none",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: 11, color: C.muted }}>Less</span>
        {[0.12, 0.3, 0.5, 0.72, 1].map((a, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: `rgba(213,82,16,${a})` }} />
        ))}
        <span style={{ fontSize: 11, color: C.muted }}>More</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Horizontal bar
// ─────────────────────────────────────────────────────────────
function HBar({ label, value, max, color }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, color, fontWeight: 700 }}>
          {value} <span style={{ color: C.muted, fontWeight: 400 }}>({pct}%)</span>
        </span>
      </div>
      <div style={{ height: 6, background: C.surface3, borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: color,
          width: `${pct}%`, transition: "width 1s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: `0 0 8px ${color}55`,
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon, sub, delay = 0 }) {
  return (
    <div className="dash-card stat-card" style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: "20px 22px", flex: 1, minWidth: 120,
      borderTop: `3px solid ${color}`,
      animation: `fadeUp 0.4s ease ${delay}ms both`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 500 }}>{label}</p>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <p style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1, marginBottom: sub ? 4 : 0 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Card wrapper
// ─────────────────────────────────────────────────────────────
function Card({ title, sub, action, children, delay = 0, style = {} }) {
  return (
    <div className="dash-card" style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 16, overflow: "hidden",
      animation: `scaleIn 0.45s ease ${delay}ms both`,
      ...style,
    }}>
      {title && (
        <div style={{ padding: "20px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{title}</h3>
            {sub && <p style={{ fontSize: 12, color: C.muted, margin: "3px 0 0" }}>{sub}</p>}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding: title ? "20px 22px" : 0 }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────
function Navbar({ user, onLogout }) {
  const [hov, setHov] = useState(false);
  return (
    <nav style={{
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      padding: "0 32px", height: 62,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 40,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.accent}, #ff7c3a)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 900, color: "#fff",
            boxShadow: `0 4px 12px ${C.accent}55`,
          }}>T</div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em", color: C.text }}>
            Task<span style={{ color: C.accent }}>Board</span>
          </span>
        </a>
        <div style={{ display: "flex", gap: 4 }}>
          {[["📋 Tasks", "/todos"], ["📊 Dashboard", "/dashboard"]].map(([label, href]) => {
            const active = typeof window !== "undefined" && window.location.pathname === href;
            return (
              <a key={href} href={href} className="nav-link" style={{
                fontSize: 13, fontWeight: 600, textDecoration: "none",
                padding: "6px 14px", borderRadius: 8,
                color: active ? C.accent : C.muted,
                background: active ? C.accentDim : "transparent",
                border: `1px solid ${active ? C.accentMid : "transparent"}`,
                transition: "all 0.15s",
              }}>{label}</a>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.accent}, #e8621f)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14, color: "#fff",
            boxShadow: `0 2px 8px ${C.accent}44`,
          }}>{user?.fname?.[0]?.toUpperCase()}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0, lineHeight: 1.2 }}>{user?.fname} {user?.lname}</p>
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={onLogout}
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
            borderRadius: 9, cursor: "pointer",
            background: hov ? C.dangerBg : "transparent",
            border: `1px solid ${hov ? "#e0525235" : C.border}`,
            color: hov ? C.danger : C.muted,
            fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s",
          }}>⎋ Logout</button>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [todos, setTodos]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/login"); return; }
    setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        const res  = await fetch(`/api/todo?userId=${user._id}`);
        const data = await res.json();
        setTodos(Array.isArray(data) ? data : []);
      } catch { console.log("Fetch error"); }
      finally { setLoading(false); }
    })();
  }, [user]);

  if (!user) return null;

  // ── Analytics ────────────────────────────────────────────
  const total     = todos.length;
  const completed = todos.filter(t => t.status === "COMPLETED").length;
  const pending   = todos.filter(t => t.status === "PENDING").length;
  const todoCount = todos.filter(t => t.status === "TODO").length;
  const overdue   = todos.filter(t => isOver(t.dueDate) && t.status !== "COMPLETED").length;
  const onTime    = todos.filter(t => t.status === "COMPLETED" && !isOver(t.dueDate)).length;
  const late      = todos.filter(t => t.status === "COMPLETED" && isOver(t.dueDate)).length;

  const highCount = todos.filter(t => t.priority === "HIGH").length;
  const medCount  = todos.filter(t => t.priority === "MEDIUM").length;
  const lowCount  = todos.filter(t => t.priority === "LOW").length;

  const highDone  = todos.filter(t => t.priority === "HIGH"   && t.status === "COMPLETED").length;
  const medDone   = todos.filter(t => t.priority === "MEDIUM" && t.status === "COMPLETED").length;
  const lowDone   = todos.filter(t => t.priority === "LOW"    && t.status === "COMPLETED").length;

  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const dueThisWeek = todos.filter(t => {
    if (!t.dueDate || t.status === "COMPLETED") return false;
    const d = new Date(t.dueDate), now = new Date(), week = new Date();
    week.setDate(now.getDate() + 7);
    return d >= now && d <= week;
  }).length;

  // Most productive day
  const dayMap = {};
  todos.filter(t => t.status === "COMPLETED").forEach(t => {
    const d = new Date(t.updated_at || t.created_at || 0).toLocaleDateString("en-US", { weekday: "long" });
    dayMap[d] = (dayMap[d] || 0) + 1;
  });
  const bestDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const upcoming = [...todos]
    .filter(t => t.dueDate && t.status !== "COMPLETED")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recent = [...todos]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 6);

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "inherit" }}>
        <Navbar user={user} onLogout={() => { localStorage.removeItem("user"); router.push("/login"); }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>

          {/* Header */}
          <div style={{ marginBottom: 28, animation: "fadeUp 0.4s ease" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: C.muted }}>
              Analytics for <strong style={{ color: C.text }}>{user.fname} {user.lname}</strong>
              <span style={{ marginLeft: 12, fontSize: 12, padding: "2px 10px", borderRadius: 20, background: C.accentDim, color: C.accent, border: `1px solid ${C.accentMid}` }}>
                {total} total tasks
              </span>
            </p>
          </div>

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12 }}>
              <div style={{ width: 20, height: 20, border: `2px solid ${C.accent}40`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ color: C.muted, fontSize: 14 }}>Loading analytics...</span>
            </div>
          ) : (
            <>
              {/* ── Stat cards ── */}
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <StatCard label="Total"       value={total}           color={C.accent}  icon="📋" sub="All time"                    delay={0}   />
                <StatCard label="Completed"   value={completed}       color={C.success} icon="✓"  sub={`${completionRate}% rate`}   delay={50}  />
                <StatCard label="In Progress" value={todoCount+pending} color={C.blue}  icon="⚡" sub={`${todoCount} todo · ${pending} pending`} delay={100} />
                <StatCard label="Overdue"     value={overdue}         color={overdue > 0 ? C.danger : C.muted} icon="⚠" sub={overdue > 0 ? "Needs attention" : "All on track"} delay={150} />
                <StatCard label="Due Soon"    value={dueThisWeek}     color={C.warn}    icon="📅" sub="Next 7 days"                delay={200} />
              </div>

              {/* ── Row 1: 3 Donut charts ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>

                {/* Donut 1 — Status */}
                <Card title="Status Overview" sub="All tasks by status" delay={80}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <DonutChart
                      size={130}
                      centerLabel={`${completionRate}%`}
                      centerSub="done"
                      segments={[
                        { value: completed, color: C.success, label: "Completed" },
                        { value: pending,   color: C.warn,    label: "Pending"   },
                        { value: todoCount, color: C.blue,    label: "Todo"      },
                      ]}
                    />
                    <Legend items={[
                      { label: "Completed", value: completed, color: C.success, sub: `${total===0?0:Math.round(completed/total*100)}%` },
                      { label: "Pending",   value: pending,   color: C.warn,    sub: `${total===0?0:Math.round(pending/total*100)}%`   },
                      { label: "Todo",      value: todoCount, color: C.blue,    sub: `${total===0?0:Math.round(todoCount/total*100)}%` },
                    ]} />
                  </div>
                </Card>

                {/* Donut 2 — Priority distribution */}
                <Card title="Priority Split" sub="Tasks by priority level" delay={130}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <DonutChart
                      size={130}
                      centerLabel={highCount}
                      centerSub="high"
                      segments={[
                        { value: highCount, color: C.danger,  label: "High"   },
                        { value: medCount,  color: C.accent,  label: "Medium" },
                        { value: lowCount,  color: C.success, label: "Low"    },
                      ]}
                    />
                    <Legend items={[
                      { label: "High",   value: highCount, color: C.danger,  sub: `${total===0?0:Math.round(highCount/total*100)}%` },
                      { label: "Medium", value: medCount,  color: C.accent,  sub: `${total===0?0:Math.round(medCount/total*100)}%`  },
                      { label: "Low",    value: lowCount,  color: C.success, sub: `${total===0?0:Math.round(lowCount/total*100)}%`  },
                    ]} />
                  </div>
                </Card>

                {/* Donut 3 — On-time vs late completions */}
                <Card title="Delivery Quality" sub="Completed on-time vs overdue" delay={180}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <DonutChart
                      size={130}
                      centerLabel={completed === 0 ? "—" : `${Math.round(onTime/completed*100)}%`}
                      centerSub="on time"
                      segments={[
                        { value: onTime, color: C.success, label: "On time" },
                        { value: late,   color: C.danger,  label: "Late"    },
                        { value: todoCount + pending, color: C.surface3, label: "Remaining" },
                      ]}
                    />
                    <Legend items={[
                      { label: "On time",   value: onTime,             color: C.success },
                      { label: "Late",      value: late,               color: C.danger  },
                      { label: "Remaining", value: todoCount + pending, color: C.muted   },
                    ]} />
                  </div>
                </Card>
              </div>

              {/* ── Row 2: Priority completion + Bar chart ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

                {/* Priority completion rates */}
                <Card title="Priority Completion Rates" sub="How many done per priority" delay={100}>
                  <div style={{ marginBottom: 6 }}>
                    <HBar label="🔴 High"   value={highDone} max={highCount || 1} color={C.danger}  />
                    <HBar label="🟠 Medium" value={medDone}  max={medCount  || 1} color={C.accent}  />
                    <HBar label="🟢 Low"    value={lowDone}  max={lowCount  || 1} color={C.success} />
                  </div>
                  <div style={{ padding: "14px", background: C.surface2, borderRadius: 10, display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <span style={{ fontSize: 20 }}>🔥</span>
                    <div>
                      <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Most productive day</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.accent, margin: 0 }}>{bestDay}</p>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Total completed</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.success, margin: 0 }}>{completed} tasks</p>
                    </div>
                  </div>
                </Card>

                {/* Bar chart */}
                <Card title="Tasks Created" sub="Last 7 days — today highlighted" delay={140}>
                  {total === 0
                    ? <div style={{ height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ fontSize: 13, color: C.muted }}>No data yet</p></div>
                    : <BarChart todos={todos} />
                  }
                  <div style={{ display: "flex", gap: 16, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                    {[
                      { label: "Avg/day", value: total === 0 ? "0" : (total / 7).toFixed(1), color: C.accent },
                      { label: "This week", value: dueThisWeek + " due", color: C.warn },
                      { label: "Overdue", value: overdue, color: overdue > 0 ? C.danger : C.muted },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <p style={{ fontSize: 11, color: C.muted, margin: "0 0 3px" }}>{label}</p>
                        <p style={{ fontSize: 16, fontWeight: 700, color, margin: 0 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* ── Row 3: Heatmap full width ── */}
              <Card title="Completion Activity" sub="Tasks completed per day — last 12 weeks" delay={160} style={{ marginBottom: 16 }}>
                {total === 0 ? (
                  <p style={{ fontSize: 13, color: C.muted, textAlign: "center", padding: "24px 0" }}>Complete some tasks to see your activity heatmap</p>
                ) : (
                  <HeatMap todos={todos} />
                )}
              </Card>

              {/* ── Row 4: Upcoming + Recent side by side ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

                {/* Upcoming deadlines */}
                <div className="dash-card" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", animation: "scaleIn 0.45s ease 180ms both" }}>
                  <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>Upcoming Deadlines</h3>
                      <p style={{ fontSize: 12, color: C.muted, margin: "3px 0 0" }}>Active tasks sorted by due date</p>
                    </div>
                    <a href="/todos" style={{ fontSize: 12, color: C.accent, textDecoration: "none", fontWeight: 600 }}>View all →</a>
                  </div>
                  {upcoming.length === 0 ? (
                    <div style={{ padding: "32px 22px", textAlign: "center" }}>
                      <p style={{ fontSize: 22, marginBottom: 8 }}>🎉</p>
                      <p style={{ fontSize: 13, color: C.muted }}>No upcoming deadlines</p>
                    </div>
                  ) : upcoming.map((todo, i) => {
                    const pc   = PC[todo.priority] || PC.LOW;
                    const over = isOver(todo.dueDate);
                    return (
                      <div key={todo._id} className="row-hover" style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 22px", borderBottom: i < upcoming.length - 1 ? `1px solid ${C.border}` : "none",
                        background: "transparent",
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: over ? C.danger : pc.color, flexShrink: 0, boxShadow: `0 0 5px ${over ? C.danger : pc.color}70` }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{todo.title}</p>
                        </div>
                        <span style={{ fontSize: 11, color: over ? C.danger : C.muted, flexShrink: 0, fontWeight: over ? 600 : 400 }}>
                          {over ? "⚠ " : ""}{fmtShort(todo.dueDate)}
                        </span>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 600, textTransform: "uppercase", color: pc.color, background: pc.bg, flexShrink: 0 }}>
                          {todo.priority}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Quick insight cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { icon: "🎯", label: "Completion Rate",  value: `${completionRate}%`,     color: completionRate >= 70 ? C.success : completionRate >= 40 ? C.warn : C.danger, sub: completionRate >= 70 ? "Excellent work!" : completionRate >= 40 ? "Keep pushing" : "Needs focus" },
                    { icon: "⚡", label: "Active Right Now", value: `${todoCount + pending}`,  color: C.blue,   sub: `${todoCount} todo · ${pending} pending` },
                    { icon: "📅", label: "Due This Week",    value: `${dueThisWeek}`,         color: C.warn,   sub: "Upcoming deadlines" },
                    { icon: "🏆", label: "On-time Rate",     value: completed===0?"—":`${Math.round(onTime/completed*100)}%`, color: C.success, sub: `${onTime} of ${completed} completed` },
                  ].map(({ icon, label, value, color, sub }) => (
                    <div key={label} className="dash-card" style={{
                      background: C.surface, border: `1px solid ${C.border}`,
                      borderRadius: 12, padding: "14px 18px",
                      display: "flex", alignItems: "center", gap: 14,
                      animation: "fadeUp 0.4s ease 200ms both",
                    }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 11, color: C.muted, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
                        <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{sub}</p>
                      </div>
                      <p style={{ fontSize: 22, fontWeight: 800, color, margin: 0, flexShrink: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Recent tasks table ── */}
              <div className="dash-card" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", animation: "fadeUp 0.5s ease 220ms both", marginBottom: 16 }}>
                <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>Recent Tasks</h3>
                    <p style={{ fontSize: 12, color: C.muted, margin: "3px 0 0" }}>Your 6 most recently created tasks</p>
                  </div>
                  <a href="/todos" style={{ fontSize: 12, color: C.accent, textDecoration: "none", fontWeight: 600 }}>Manage all →</a>
                </div>
                {recent.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    <p style={{ fontSize: 13, color: C.muted }}>No tasks yet. <a href="/todos" style={{ color: C.accent, textDecoration: "none" }}>Create your first →</a></p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: C.surface2 }}>
                        {["Task", "Status", "Priority", "Due Date", "Created"].map(h => (
                          <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((todo, i) => {
                        const pc   = PC[todo.priority] || PC.LOW;
                        const sc   = SC[todo.status]   || SC.TODO;
                        const over = isOver(todo.dueDate) && todo.status !== "COMPLETED";
                        return (
                          <tr key={todo._id} className="row-hover" style={{ background: "transparent", borderBottom: i < recent.length - 1 ? `1px solid ${C.border}` : "none" }}>
                            <td style={{ padding: "12px 18px" }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0, textDecoration: todo.status === "COMPLETED" ? "line-through" : "none", opacity: todo.status === "COMPLETED" ? 0.55 : 1, maxWidth: 240, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{todo.title}</p>
                              {todo.description && <p style={{ fontSize: 11, color: C.muted, margin: "2px 0 0", maxWidth: 240, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{todo.description}</p>}
                            </td>
                            <td style={{ padding: "12px 18px" }}>
                              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: sc.color, background: sc.bg }}>{todo.status}</span>
                            </td>
                            <td style={{ padding: "12px 18px" }}>
                              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: pc.color, background: pc.bg }}>{todo.priority}</span>
                            </td>
                            <td style={{ padding: "12px 18px" }}>
                              <span style={{ fontSize: 12, color: over ? C.danger : C.muted, fontWeight: over ? 600 : 400 }}>{over ? "⚠ " : ""}{fmt(todo.dueDate)}</span>
                            </td>
                            <td style={{ padding: "12px 18px" }}>
                              <span style={{ fontSize: 12, color: C.muted }}>{fmt(todo.created_at)}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* ── Quick actions ── */}
              <div className="dash-card" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px", animation: "fadeUp 0.5s ease 240ms both" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Quick Actions</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { label: "➕ Add New Task",      href: "/todos", primary: true  },
                    { label: "📋 View All Tasks",     href: "/todos", primary: false },
                    { label: "🔴 High Priority",      href: "/todos", primary: false },
                    { label: "⚠ Overdue Tasks",       href: "/todos", primary: false },
                  ].map(({ label, href, primary }) => (
                    <a key={label} href={href} className="quick-btn" style={{
                      padding: "10px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600,
                      textDecoration: "none", transition: "all 0.15s",
                      background: primary ? `linear-gradient(135deg, ${C.accent}, #e8621f)` : C.surface2,
                      color: primary ? "#fff" : C.muted,
                      border: `1px solid ${primary ? "transparent" : C.border}`,
                      boxShadow: primary ? `0 4px 14px ${C.accent}40` : "none",
                    }}>{label}</a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}