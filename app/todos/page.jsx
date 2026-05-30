"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// ── Theme ──────────────────────────────────────────────────
const DARK = {
  bg:        "#0b0b0b",
  surface:   "#141414",
  surface2:  "#1c1c1c",
  surface3:  "#222222",
  border:    "#2c2c2c",
  borderHov: "#3a3a3a",
  accent:    "#D55210",
  accentHov: "#e8621f",
  accentDim: "#D5521018",
  accentMid: "#D5521050",
  success:   "#4ead72",
  successBg: "#4ead7212",
  successBdr:"#4ead7235",
  danger:    "#e05252",
  dangerBg:  "#e0525212",
  dangerBdr: "#e0525235",
  warn:      "#c4a55a",
  text:      "#f0ece6",
  muted:     "#6b6560",
  dim:       "#333",
  overlay:   "rgba(0,0,0,0.75)",
  chartGrid: "#1e1e1e",
};

const LIGHT = {
  bg:        "#f5f3f0",
  surface:   "#ffffff",
  surface2:  "#f0ede8",
  surface3:  "#e8e4dd",
  border:    "#ddd8d0",
  borderHov: "#c8c0b4",
  accent:    "#D55210",
  accentHov: "#e8621f",
  accentDim: "#D5521012",
  accentMid: "#D5521040",
  success:   "#2e9e58",
  successBg: "#2e9e5812",
  successBdr:"#2e9e5835",
  danger:    "#d03030",
  dangerBg:  "#d0303012",
  dangerBdr: "#d0303035",
  warn:      "#a07820",
  text:      "#1a1410",
  muted:     "#8a8078",
  dim:       "#ccc",
  overlay:   "rgba(0,0,0,0.45)",
  chartGrid: "#ece8e2",
};

const CSS = (C) => `
  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(120px); } to { opacity:1; transform:translateX(0); } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes spin     { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes shimmer  { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
  @keyframes popIn    { 0% { opacity:0; transform:scale(0.7); } 60% { transform:scale(1.15); } 100% { opacity:1; transform:scale(1); } }
  @keyframes checkPulse { 0% { box-shadow:0 0 0 0 #4ead7260; } 100% { box-shadow:0 0 0 10px #4ead7200; } }
  * { box-sizing:border-box; margin:0; padding:0; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:${C.bg}; }
  ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px; }
  .task-row { transition: background 0.12s ease; }
  .task-row:hover { background: ${C.surface2} !important; }
  .action-btn { transition: all 0.15s ease; }
  .action-btn:hover { transform: translateY(-1px); }
  .filter-btn { transition: all 0.15s ease; }
  .complete-btn { transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1); }
  .complete-btn:hover { transform: scale(1.15) !important; }
  .profile-btn { transition: all 0.15s ease; }
  .profile-btn:hover { opacity: 0.85; }
  .tab-btn { transition: all 0.15s ease; }
  .theme-toggle { transition: all 0.25s ease; }
  .theme-toggle:hover { transform: rotate(20deg) scale(1.1); }
`;

const PC = (C) => ({
  HIGH:   { color:"#e05252", bg:"#e0525212", border:"#e0525238", dot:"#e05252" },
  MEDIUM: { color:C.accent,  bg:"#D5521012", border:"#D5521045", dot:C.accent  },
  LOW:    { color:C.success, bg:C.successBg, border:C.successBdr, dot:C.success },
});
const SC = (C) => ({
  COMPLETED: { color:C.success, bg:C.successBg,  border:C.successBdr },
  TODO:      { color:"#7a9cc4", bg:"#7a9cc412",  border:"#7a9cc430"  },
  PENDING:   { color:C.warn,   bg:"#c4a55a12", border:"#c4a55a30"   },
});

const fmt  = (d) => d ? new Date(d).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" }) : null;
const isOver = (d) => d && new Date(d) < new Date(new Date().toDateString());

// ── Toast ──────────────────────────────────────────────────
function Toast({ toasts, remove, C }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:200, display:"flex", flexDirection:"column", gap:10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display:"flex", alignItems:"center", gap:12,
          padding:"13px 18px", borderRadius:12, minWidth:280,
          background: t.type==="success" ? C.successBg : t.type==="error" ? C.dangerBg : C.surface2,
          border:`1px solid ${t.type==="success" ? C.successBdr : t.type==="error" ? C.dangerBdr : C.border}`,
          boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
          animation:"slideIn 0.3s ease",
        }}>
          <span style={{ fontSize:18, color: t.type==="success"? C.success : t.type==="error"? C.danger : C.text }}>
            {t.type==="success" ? "✓" : t.type==="error" ? "⚠" : "ℹ"}
          </span>
          <span style={{ fontSize:13, fontWeight:600, color:C.text, flex:1 }}>{t.msg}</span>
          <button onClick={() => remove(t.id)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
      ))}
    </div>
  );
}
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add    = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  const remove = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, add, remove };
}

// ── Progress bar ───────────────────────────────────────────
function ProgressBar({ value, max, C }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <span style={{ fontSize:13, fontWeight:600, color:C.text }}>Today's Progress</span>
        <span style={{ fontSize:13, fontWeight:700, color:C.accent }}>{pct}% complete</span>
      </div>
      <div style={{ height:8, background:C.surface2, borderRadius:999, overflow:"hidden", border:`1px solid ${C.border}` }}>
        <div style={{
          height:"100%", borderRadius:999,
          background:`linear-gradient(90deg, ${C.accent}, #e8621f)`,
          width:`${pct}%`, transition:"width 0.8s cubic-bezier(0.22,1,0.36,1)",
          boxShadow:`0 0 12px ${C.accent}60`,
        }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
        <span style={{ fontSize:11, color:C.muted }}>{value} of {max} tasks done</span>
        {pct === 100 && <span style={{ fontSize:11, color:C.success, fontWeight:600 }}>🎉 All done!</span>}
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────
function Skeleton({ C }) {
  const bar = (w, h=14, mb=0) => (
    <div style={{
      width:w, height:h, borderRadius:6, marginBottom:mb,
      background:`linear-gradient(90deg, ${C.surface2} 25%, ${C.surface3} 50%, ${C.surface2} 75%)`,
      backgroundSize:"400px 100%", animation:"shimmer 1.4s ease infinite",
    }} />
  );
  return (
    <div style={{ display:"flex", flexDirection:"column" }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ width:9, height:9, borderRadius:"50%", background:C.surface3 }} />
          <div style={{ flex:1 }}>{bar("60%",13,6)}{bar("40%",11)}</div>
          {bar(70,22)}{bar(60,22)}
        </div>
      ))}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────
function EmptyState({ filter, onAdd, C }) {
  const msgs = {
    all:       { icon:"📋", title:"No tasks yet",          sub:"Hit '+ Add Task' or press N to create your first task." },
    active:    { icon:"⚡", title:"No active tasks",       sub:"All your tasks are completed. Great job!" },
    completed: { icon:"🏆", title:"No completed tasks",    sub:"Start checking off your to-do list." },
    overdue:   { icon:"🎉", title:"No overdue tasks",      sub:"You're all caught up with your deadlines!" },
  };
  const m = msgs[filter] || msgs.all;
  return (
    <div style={{ padding:"56px 24px", textAlign:"center", animation:"fadeIn 0.4s ease" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>{m.icon}</div>
      <p style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:8 }}>{m.title}</p>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24, lineHeight:1.6 }}>{m.sub}</p>
      {filter === "all" && (
        <button onClick={onAdd} style={{
          padding:"10px 22px", borderRadius:9, cursor:"pointer",
          background:`linear-gradient(135deg, ${C.accent}, #e8621f)`,
          color:"#fff", border:"none", fontSize:13, fontWeight:700, fontFamily:"inherit",
          boxShadow:`0 4px 16px ${C.accent}44`, transition:"all 0.2s",
        }}>+ Add your first task</button>
      )}
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────
function StatCard({ label, value, color, icon, onClick, active, C }) {
  return (
    <div onClick={onClick} style={{
      background: active ? color+"18" : C.surface,
      border:`1px solid ${active ? color+"60" : C.border}`,
      borderRadius:12, padding:"18px 20px", flex:1, minWidth:110,
      position:"relative", overflow:"hidden", cursor:onClick?"pointer":"default",
      transition:"all 0.2s ease",
      transform: active ? "translateY(-2px)" : "none",
      boxShadow: active ? `0 6px 20px ${color}20` : "none",
    }}
      onMouseEnter={e => { if(!active) { e.currentTarget.style.background=color+"10"; e.currentTarget.style.borderColor=color+"40"; }}}
      onMouseLeave={e => { if(!active) { e.currentTarget.style.background=C.surface; e.currentTarget.style.borderColor=C.border; }}}
    >
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:color, borderRadius:"12px 12px 0 0" }} />
      <p style={{ fontSize:11, color:C.muted, marginBottom:8, letterSpacing:"0.09em", textTransform:"uppercase", fontWeight:500 }}>{label}</p>
      <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
        <p style={{ fontSize:30, fontWeight:800, color, lineHeight:1, margin:0 }}>{value}</p>
        <span style={{ fontSize:18, marginBottom:2 }}>{icon}</span>
      </div>
    </div>
  );
}

// ── Action button ──────────────────────────────────────────
function ActionBtn({ label, onClick, hoverColor, hoverBorder, icon, danger, C }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} className="action-btn"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:5,
        fontSize:11, padding:"5px 10px", borderRadius:6, cursor:"pointer",
        fontFamily:"inherit", fontWeight:600, letterSpacing:"0.03em",
        background: hov ? (danger ? C.dangerBg : C.accentDim) : C.surface3,
        color: hov ? hoverColor : C.muted,
        border:`1px solid ${hov ? hoverBorder : C.border}`,
        boxShadow: hov ? `0 4px 12px ${hoverColor}20` : "none",
      }}
    ><span style={{ fontSize:12 }}>{icon}</span>{label}</button>
  );
}

// ── Quick-complete button ──────────────────────────────────
function CompleteBtn({ completed, onClick, C }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      className="complete-btn"
      onClick={onClick}
      title={completed ? "Mark as Todo" : "Mark as Completed"}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:26, height:26, borderRadius:"50%", flexShrink:0,
        border:`2px solid ${completed ? C.success : hov ? C.success : C.border}`,
        background: completed ? C.success : hov ? C.successBg : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center",
        cursor:"pointer", transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: completed ? `0 0 0 0 ${C.success}00` : hov ? `0 0 8px ${C.success}50` : "none",
        animation: completed ? "checkPulse 0.4s ease" : "none",
      }}
    >
      {(completed || hov) && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L5 9L10 3" stroke={completed ? "#fff" : C.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

// ── Task row ───────────────────────────────────────────────
function TaskRow({ todo, onEdit, onDelete, onComplete, completed, idx, C }) {
  const pc   = PC(C)[todo.priority] || PC(C).LOW;
  const sc   = SC(C)[todo.status]   || SC(C).TODO;
  const over = isOver(todo.dueDate) && !completed;
  return (
    <div className="task-row" style={{
      display:"flex", alignItems:"center", gap:12,
      padding:"14px 20px", borderBottom:`1px solid ${C.border}`,
      opacity: completed ? 0.65 : 1,
      animation:`fadeUp 0.3s ease ${idx * 40}ms both`,
      background: "transparent",
    }}>
      {/* Quick complete */}
      <CompleteBtn completed={completed} onClick={() => onComplete(todo)} C={C} />
      {/* Dot */}
      <span style={{
        width:8, height:8, borderRadius:"50%", flexShrink:0,
        background: completed ? C.muted : pc.dot,
        boxShadow: completed ? "none" : `0 0 7px ${pc.dot}99`,
      }} />
      {/* Title */}
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{
          fontSize:14, fontWeight:600, color:C.text, margin:0,
          textDecoration: completed ? "line-through" : "none",
          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
          opacity: completed ? 0.7 : 1,
        }}>{todo.title}</p>
        {todo.description && (
          <p style={{ fontSize:12, color:C.muted, margin:"3px 0 0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {todo.description}
          </p>
        )}
      </div>
      {todo.dueDate && (
        <span style={{
          fontSize:11, flexShrink:0,
          color: over ? C.danger : C.muted,
          display:"flex", alignItems:"center", gap:4,
          padding:"3px 8px", borderRadius:5,
          background: over ? C.dangerBg : "transparent",
          border: over ? `1px solid ${C.dangerBdr}` : "none",
        }}>{over && "⚠ "}{fmt(todo.dueDate)}</span>
      )}
      <span style={{
        fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase",
        padding:"4px 9px", borderRadius:6, flexShrink:0,
        color:sc.color, background:sc.bg, border:`1px solid ${sc.border}`,
      }}>{todo.status}</span>
      <span style={{
        fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase",
        padding:"4px 9px", borderRadius:6, flexShrink:0,
        color:pc.color, background:pc.bg, border:`1px solid ${pc.border}`,
      }}>{todo.priority}</span>
      <div style={{ display:"flex", gap:6, flexShrink:0 }}>
        <ActionBtn label="Edit"   onClick={() => onEdit(todo)}      hoverColor={C.accent} hoverBorder={C.accentMid} icon="✎" C={C} />
        <ActionBtn label="Delete" onClick={() => onDelete(todo._id)} hoverColor={C.danger} hoverBorder={C.dangerBdr} icon="✕" danger C={C} />
      </div>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────
function Modal({ show, onClose, children, C }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (show) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [show, onClose]);
  if (!show) return null;
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:50,
      background:C.overlay,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24, backdropFilter:"blur(8px)",
      animation:"fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:C.surface, border:`1px solid ${C.border}`,
        borderRadius:16, width:"100%", maxWidth:520,
        boxShadow:`0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px ${C.accentMid}`,
        animation:"scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}>{children}</div>
    </div>
  );
}

// ── Analytics Dashboard ────────────────────────────────────
function AnalyticsDashboard({ todos, C }) {
  const now   = new Date();
  const msDay = 86400000;

  // Build last 7 days data
  const last7 = Array.from({ length:7 }, (_, i) => {
    const d    = new Date(now - (6-i) * msDay);
    const key  = d.toDateString();
    const day  = d.toLocaleDateString("en-US", { weekday:"short" });
    const created   = todos.filter(t => t.created_at && new Date(t.created_at).toDateString() === key).length;
    const completed = todos.filter(t => t.status === "COMPLETED" && t.updated_at && new Date(t.updated_at).toDateString() === key).length;
    return { day, created, completed };
  });

  const last30 = Array.from({ length:4 }, (_, i) => {
    const start = new Date(now - (3-i)*7*msDay);
    const end   = new Date(now - (2-i)*7*msDay);
    const label = `W${i+1}`;
    const created   = todos.filter(t => { const d = new Date(t.created_at||0); return d >= start && d < end; }).length;
    const completed = todos.filter(t => { const d = new Date(t.updated_at||0); return t.status==="COMPLETED" && d >= start && d < end; }).length;
    return { day:label, created, completed };
  });

  const [period, setPeriod] = useState("week");
  const chartData = period === "week" ? last7 : last30;
  const maxVal    = Math.max(...chartData.flatMap(d => [d.created, d.completed]), 1);

  const total     = todos.length;
  const completed = todos.filter(t => t.status === "COMPLETED").length;
  const overdue   = todos.filter(t => isOver(t.dueDate) && t.status !== "COMPLETED").length;
  const onTime    = todos.filter(t => t.status === "COMPLETED" && t.dueDate && !isOver(t.dueDate)).length;
  const pending   = todos.filter(t => t.status === "PENDING").length;
  const high      = todos.filter(t => t.priority === "HIGH" && t.status !== "COMPLETED").length;
  const compRate  = total ? Math.round((completed/total)*100) : 0;

  const kpis = [
    { label:"Total Tasks",    value:total,     color:C.accent,  icon:"📋" },
    { label:"Completed",      value:completed, color:C.success, icon:"✓"  },
    { label:"Overdue",        value:overdue,   color:C.danger,  icon:"⚠"  },
    { label:"On-time Done",   value:onTime,    color:"#7a9cc4", icon:"🎯" },
    { label:"Pending",        value:pending,   color:C.warn,    icon:"⏳" },
    { label:"High Priority",  value:high,      color:"#e05252", icon:"🔥" },
  ];

  // Priority breakdown
  const priBreak = [
    { label:"High",   val:todos.filter(t=>t.priority==="HIGH").length,   color:"#e05252" },
    { label:"Medium", val:todos.filter(t=>t.priority==="MEDIUM").length, color:C.accent  },
    { label:"Low",    val:todos.filter(t=>t.priority==="LOW").length,    color:C.success },
  ];
  const priTotal = priBreak.reduce((a,b) => a+b.val, 0) || 1;

  return (
    <div style={{ padding:"24px", display:"flex", flexDirection:"column", gap:22, maxHeight:"70vh", overflowY:"auto" }}>

      {/* KPI grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            background:C.surface2, border:`1px solid ${C.border}`,
            borderRadius:12, padding:"14px 16px",
            borderTop:`3px solid ${k.color}`,
          }}>
            <p style={{ fontSize:10, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>{k.label}</p>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:22, fontWeight:900, color:k.color }}>{k.value}</span>
              <span style={{ fontSize:16 }}>{k.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Completion rate ring */}
      <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px", display:"flex", alignItems:"center", gap:24 }}>
        <div style={{ position:"relative", width:90, height:90, flexShrink:0 }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke={C.border} strokeWidth="10"/>
            <circle cx="45" cy="45" r="36" fill="none"
              stroke={C.accent} strokeWidth="10"
              strokeDasharray={`${2*Math.PI*36}`}
              strokeDashoffset={`${2*Math.PI*36*(1 - compRate/100)}`}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
              style={{ transition:"stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:18, fontWeight:900, color:C.accent }}>{compRate}%</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:6 }}>Completion Rate</p>
          <p style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>
            You've completed <strong style={{ color:C.success }}>{completed}</strong> out of <strong style={{ color:C.text }}>{total}</strong> tasks.
            {overdue > 0 && <> <strong style={{ color:C.danger }}>{overdue}</strong> overdue.</>}
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <p style={{ fontSize:14, fontWeight:700, color:C.text }}>Activity</p>
          <div style={{ display:"flex", gap:6 }}>
            {[["week","7 Days"],["month","4 Weeks"]].map(([v,l]) => (
              <button key={v} onClick={() => setPeriod(v)} style={{
                padding:"4px 12px", borderRadius:6, cursor:"pointer", fontFamily:"inherit",
                fontSize:11, fontWeight:600, border:`1px solid ${period===v ? C.accentMid : C.border}`,
                background: period===v ? C.accentDim : "transparent",
                color: period===v ? C.accent : C.muted,
              }}>{l}</button>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div style={{ display:"flex", gap:16, marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:C.accent }} />
            <span style={{ fontSize:11, color:C.muted }}>Created</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:C.success }} />
            <span style={{ fontSize:11, color:C.muted }}>Completed</span>
          </div>
        </div>
        {/* Bars */}
        <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, height:"100%" }}>
              <div style={{ flex:1, display:"flex", alignItems:"flex-end", gap:3, width:"100%" }}>
                <div style={{
                  flex:1, borderRadius:"4px 4px 0 0",
                  background: `linear-gradient(180deg, ${C.accent}, ${C.accent}99)`,
                  height: `${(d.created/maxVal)*100}%`,
                  minHeight: d.created > 0 ? 4 : 0,
                  transition:"height 0.6s cubic-bezier(0.22,1,0.36,1)",
                }} title={`Created: ${d.created}`} />
                <div style={{
                  flex:1, borderRadius:"4px 4px 0 0",
                  background: `linear-gradient(180deg, ${C.success}, ${C.success}99)`,
                  height: `${(d.completed/maxVal)*100}%`,
                  minHeight: d.completed > 0 ? 4 : 0,
                  transition:"height 0.6s cubic-bezier(0.22,1,0.36,1)",
                }} title={`Completed: ${d.completed}`} />
              </div>
              <span style={{ fontSize:10, color:C.muted, fontWeight:500 }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority breakdown */}
      <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px" }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:16 }}>Priority Breakdown</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {priBreak.map(p => (
            <div key={p.label}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>{p.label}</span>
                <span style={{ fontSize:12, color:p.color, fontWeight:700 }}>{p.val} tasks</span>
              </div>
              <div style={{ height:7, background:C.border, borderRadius:999, overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:999,
                  background:p.color,
                  width:`${(p.val/priTotal)*100}%`,
                  transition:"width 0.8s cubic-bezier(0.22,1,0.36,1)",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status breakdown */}
      <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px" }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:16 }}>Status Breakdown</p>
        <div style={{ display:"flex", gap:10 }}>
          {[
            { label:"Todo",      val:todos.filter(t=>t.status==="TODO").length,      color:"#7a9cc4" },
            { label:"Pending",   val:todos.filter(t=>t.status==="PENDING").length,   color:C.warn    },
            { label:"Completed", val:todos.filter(t=>t.status==="COMPLETED").length, color:C.success },
          ].map(s => (
            <div key={s.label} style={{
              flex:1, background:s.color+"15", border:`1px solid ${s.color}30`,
              borderRadius:10, padding:"14px", textAlign:"center",
            }}>
              <p style={{ fontSize:22, fontWeight:900, color:s.color, margin:"0 0 4px" }}>{s.val}</p>
              <p style={{ fontSize:11, color:C.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Profile Dropdown ───────────────────────────────────────
function ProfileDropdown({ user, todos, onLogout, onClose, C, theme, toggleTheme }) {
  const [tab, setTab] = useState("overview"); // overview | analytics
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const completed = todos.filter(t => t.status === "COMPLETED").length;
  const active    = todos.filter(t => t.status !== "COMPLETED").length;

  return (
    <div ref={ref} style={{
      position:"absolute", top:"calc(100% + 12px)", right:0,
      width:420, background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:18, boxShadow:`0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px ${C.accentMid}`,
      animation:"scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      zIndex:100, overflow:"hidden",
    }}>
      {/* Header */}
      <div style={{ padding:"22px 22px 0", background:`linear-gradient(160deg, ${C.accentDim}, transparent)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
          <div style={{
            width:50, height:50, borderRadius:"50%",
            background:`linear-gradient(135deg, ${C.accent}, #e8621f)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:800, fontSize:20, color:"#fff",
            boxShadow:`0 4px 16px ${C.accent}50`,
          }}>{user.fname?.[0]?.toUpperCase()}</div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:16, fontWeight:700, color:C.text, margin:0 }}>{user.fname} {user.lname}</p>
            <p style={{ fontSize:12, color:C.muted, margin:"3px 0 0" }}>{user.email}</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:18, padding:4 }}>✕</button>
        </div>
        {/* Quick stats */}
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          {[
            { label:"Total",     val:todos.length, color:C.accent  },
            { label:"Active",    val:active,       color:"#7a9cc4" },
            { label:"Completed", val:completed,    color:C.success },
          ].map(s => (
            <div key={s.label} style={{
              flex:1, background:C.surface2, border:`1px solid ${C.border}`,
              borderRadius:10, padding:"10px", textAlign:"center",
            }}>
              <p style={{ fontSize:18, fontWeight:900, color:s.color, margin:0 }}>{s.val}</p>
              <p style={{ fontSize:10, color:C.muted, marginTop:2, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</p>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div style={{ display:"flex", gap:2, background:C.surface2, borderRadius:10, padding:4 }}>
          {[["overview","Overview"],["analytics","Analytics 📊"]].map(([v,l]) => (
            <button key={v} className="tab-btn" onClick={() => setTab(v)} style={{
              flex:1, padding:"8px", borderRadius:7, cursor:"pointer",
              fontFamily:"inherit", fontSize:12, fontWeight:700,
              border:"none",
              background: tab===v ? C.surface : "transparent",
              color: tab===v ? C.text : C.muted,
              boxShadow: tab===v ? `0 2px 8px rgba(0,0,0,0.15)` : "none",
              transition:"all 0.15s ease",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === "overview" ? (
        <div style={{ padding:"16px 22px 22px" }}>
          {/* Theme toggle */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"14px 16px", background:C.surface2, border:`1px solid ${C.border}`,
            borderRadius:12, marginBottom:12,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:18 }}>{theme === "dark" ? "🌙" : "☀️"}</span>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:C.text, margin:0 }}>{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
                <p style={{ fontSize:11, color:C.muted, margin:0 }}>Switch appearance</p>
              </div>
            </div>
            <button onClick={toggleTheme} style={{
              width:44, height:24, borderRadius:12, border:"none", cursor:"pointer",
              background: theme === "dark" ? C.accent : C.border,
              position:"relative", transition:"background 0.25s",
            }}>
              <div style={{
                position:"absolute", top:3, left: theme === "dark" ? 23 : 3,
                width:18, height:18, borderRadius:"50%", background:"#fff",
                transition:"left 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow:"0 2px 6px rgba(0,0,0,0.25)",
              }} />
            </button>
          </div>
          {/* Logout */}
          <button onClick={onLogout} style={{
            width:"100%", padding:"12px", borderRadius:10, cursor:"pointer",
            background:C.dangerBg, border:`1px solid ${C.dangerBdr}`,
            color:C.danger, fontSize:13, fontWeight:700,
            fontFamily:"inherit", transition:"all 0.15s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}
            onMouseEnter={e => { e.currentTarget.style.background=C.danger; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background=C.dangerBg; e.currentTarget.style.color=C.danger; }}
          ><span>⎋</span> Sign Out</button>
        </div>
      ) : (
        <AnalyticsDashboard todos={todos} C={C} />
      )}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────
export default function Todos() {
  const router = useRouter();
  const { toasts, add: toast, remove: removeToast } = useToast();

  // Theme
  const [theme, setTheme] = useState("dark");
  const C = theme === "dark" ? DARK : LIGHT;
  const toggleTheme = useCallback(() => {
    setTheme(t => { const next = t === "dark" ? "light" : "dark"; localStorage.setItem("theme", next); return next; });
  }, []);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  const [user, setUser]               = useState(null);
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [todos, setTodos]             = useState([]);
  const [status, setStatus]           = useState("TODO");
  const [priority, setPriority]       = useState("LOW");
  const [dueDate, setDueDate]         = useState("");
  const [editingId, setEditingId]     = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [fetching, setFetching]       = useState(true);
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("all");
  const [sortBy, setSortBy]           = useState("newest");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/login"); return; }
    setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "n" && !showModal && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault(); openAdd();
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [showModal]);

  const handleCancel = () => {
    setTitle(""); setDescription(""); setDueDate("");
    setEditingId(null); setShowModal(false);
  };
  const handleEdit = (todo) => {
    setEditingId(todo._id); setTitle(todo.title);
    setDescription(todo.description); setStatus(todo.status);
    setPriority(todo.priority);
    setDueDate(todo.dueDate ? todo.dueDate.split("T")[0] : "");
    setShowModal(true);
  };
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/todo/${id}?userId=${user._id}`, { method:"DELETE" });
      if (res.ok) { fetchTodos(); toast("Task deleted", "error"); }
    } catch { toast("Error deleting task", "error"); }
  };

  // ── Quick complete toggle ────────────────────────────────
  const handleComplete = async (todo) => {
    const newStatus = todo.status === "COMPLETED" ? "TODO" : "COMPLETED";
    try {
      const res = await fetch(`/api/todo/${todo._id}`, {
        method:"PUT", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          title: todo.title, description: todo.description,
          status: newStatus, priority: todo.priority,
          dueDate: todo.dueDate, userId: user._id,
        }),
      });
      if (res.ok) {
        fetchTodos();
        toast(newStatus === "COMPLETED" ? "Task completed! 🎉" : "Task reopened", newStatus === "COMPLETED" ? "success" : "info");
      }
    } catch { toast("Error updating task", "error"); }
  };

  const fetchTodos = async () => {
    if (!user) return;
    try {
      setFetching(true);
      const res  = await fetch(`/api/todo?userId=${user._id}`);
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch { console.log("Error fetching"); }
    finally { setFetching(false); }
  };
  useEffect(() => { if (user) fetchTodos(); }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) { toast("Please fill all required fields", "error"); return; }
    try {
      if (editingId) {
        const res = await fetch(`/api/todo/${editingId}`, {
          method:"PUT", headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ title, description, status, priority, dueDate, userId:user._id }),
        });
        if (res.ok) { handleCancel(); fetchTodos(); toast("Task updated successfully"); }
      } else {
        setIsLoading(true);
        const res = await fetch("/api/todo", {
          method:"POST", headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ title, description, status, priority, dueDate, userId:user._id }),
        });
        if (res.ok) { handleCancel(); fetchTodos(); toast("Task created successfully"); }
      }
    } catch { toast("Error saving task", "error"); }
    finally { setIsLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); router.push("/login"); };
  const openAdd = () => {
    setEditingId(null); setTitle(""); setDescription("");
    setStatus("TODO"); setPriority("LOW"); setDueDate("");
    setShowModal(true);
  };

  const priorityOrder = { HIGH:0, MEDIUM:1, LOW:2 };
  const sorted = [...todos].sort((a, b) => {
    if (sortBy === "priority") return (priorityOrder[a.priority]||0) - (priorityOrder[b.priority]||0);
    if (sortBy === "dueDate")  return new Date(a.dueDate||"9999") - new Date(b.dueDate||"9999");
    return new Date(b.created_at||0) - new Date(a.created_at||0);
  });
  const searched = sorted.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.description||"").toLowerCase().includes(search.toLowerCase())
  );
  const filtered = searched.filter(t => {
    if (filter === "active")    return t.status !== "COMPLETED";
    if (filter === "completed") return t.status === "COMPLETED";
    if (filter === "overdue")   return isOver(t.dueDate) && t.status !== "COMPLETED";
    return true;
  });

  const activeTodos    = todos.filter(t => t.status !== "COMPLETED");
  const completedTodos = todos.filter(t => t.status === "COMPLETED");
  const overdueTodos   = todos.filter(t => isOver(t.dueDate) && t.status !== "COMPLETED");
  const upcoming       = [...todos].filter(t => t.dueDate && t.status !== "COMPLETED").sort((a,b) => new Date(a.dueDate)-new Date(b.dueDate)).slice(0,4);

  const inp = (extra={}) => ({
    width:"100%", background:C.bg, border:`1px solid ${C.border}`,
    borderRadius:8, padding:"10px 13px", fontSize:13,
    color:C.text, outline:"none", boxSizing:"border-box",
    fontFamily:"inherit", transition:"border-color 0.2s, box-shadow 0.2s",
    ...extra,
  });

  if (!user) return null;

  return (
    <>
      <style>{CSS(C)}</style>
      <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'Sora', sans-serif", transition:"background 0.3s, color 0.3s" }}>

        {/* ── Navbar ── */}
        <nav style={{
          background:C.surface, borderBottom:`1px solid ${C.border}`,
          padding:"0 32px", height:62,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:40,
        }}>
          <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
            <div style={{
              width:32, height:32, borderRadius:9,
              background:`linear-gradient(135deg, ${C.accent}, #ff7c3a)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:15, fontWeight:900, color:"#fff",
              boxShadow:`0 4px 12px ${C.accent}55`,
            }}>T</div>
            <span style={{ fontWeight:800, fontSize:17, letterSpacing:"-0.03em", color:C.text }}>
              Task<span style={{ color:C.accent }}>Board</span>
            </span>
          </a>

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Theme toggle in navbar */}
            <button className="theme-toggle" onClick={toggleTheme} style={{
              width:38, height:38, borderRadius:10,
              background:C.surface2, border:`1px solid ${C.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", fontSize:17, transition:"all 0.2s",
            }} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Keyboard hint */}
            <div style={{ padding:"5px 10px", borderRadius:6, border:`1px solid ${C.border}`, background:C.surface2 }}>
              <span style={{ fontSize:11, color:C.muted }}>Press </span>
              <kbd style={{ fontSize:11, color:C.accent, fontWeight:700, fontFamily:"inherit" }}>N</kbd>
              <span style={{ fontSize:11, color:C.muted }}> to add</span>
            </div>

            <button onClick={openAdd} style={{
              display:"flex", alignItems:"center", gap:7,
              padding:"9px 18px", borderRadius:9, cursor:"pointer",
              background:`linear-gradient(135deg, ${C.accent}, #e8621f)`,
              color:"#fff", border:"none", fontSize:13, fontWeight:700,
              boxShadow:`0 4px 16px ${C.accent}44`, transition:"all 0.2s", fontFamily:"inherit",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; }}
            ><span style={{ fontSize:18, lineHeight:1 }}>+</span> Add Task</button>

            {/* Profile button */}
            <div style={{ position:"relative" }}>
              <button className="profile-btn" onClick={() => setShowProfile(p => !p)} style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"6px 12px 6px 6px", borderRadius:10,
                background: showProfile ? C.accentDim : C.surface2,
                border:`1px solid ${showProfile ? C.accentMid : C.border}`,
                cursor:"pointer", transition:"all 0.15s",
              }}>
                <div style={{
                  width:30, height:30, borderRadius:"50%",
                  background:`linear-gradient(135deg, ${C.accent}, #e8621f)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:800, fontSize:13, color:"#fff",
                }}>{user.fname?.[0]?.toUpperCase()}</div>
                <div style={{ textAlign:"left" }}>
                  <p style={{ fontSize:12, fontWeight:600, color:C.text, margin:0, lineHeight:1.2 }}>{user.fname}</p>
                  <p style={{ fontSize:10, color:C.muted, margin:0 }}>View profile</p>
                </div>
                <span style={{ fontSize:12, color:C.muted, marginLeft:2, transform: showProfile ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}>▾</span>
              </button>

              {showProfile && (
                <ProfileDropdown
                  user={user} todos={todos}
                  onLogout={handleLogout}
                  onClose={() => setShowProfile(false)}
                  C={C} theme={theme} toggleTheme={toggleTheme}
                />
              )}
            </div>
          </div>
        </nav>

        {/* ── Content ── */}
        <div style={{ maxWidth:1060, margin:"0 auto", padding:"36px 24px" }}>

          {/* Stats */}
          <div style={{ display:"flex", gap:14, marginBottom:24, flexWrap:"wrap" }}>
            <StatCard label="Total"     value={todos.length}          color={C.accent}  icon="📋" onClick={() => setFilter("all")}       active={filter==="all"} C={C} />
            <StatCard label="Active"    value={activeTodos.length}    color="#7a9cc4"   icon="⚡" onClick={() => setFilter("active")}    active={filter==="active"} C={C} />
            <StatCard label="Completed" value={completedTodos.length} color={C.success} icon="✓"  onClick={() => setFilter("completed")} active={filter==="completed"} C={C} />
            {overdueTodos.length > 0 && (
              <StatCard label="Overdue" value={overdueTodos.length}   color={C.danger}  icon="⚠"  onClick={() => setFilter("overdue")}  active={filter==="overdue"} C={C} />
            )}
          </div>

          {/* Progress bar */}
          {todos.length > 0 && <ProgressBar value={completedTodos.length} max={todos.length} C={C} />}

          {/* Search + Sort */}
          <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
            <div style={{ flex:1, minWidth:200, position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.muted, fontSize:15 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
                style={{ ...inp({ paddingLeft:36 }), background:C.surface, border:`1px solid ${C.border}` }}
                onFocus={e => { e.target.style.borderColor=C.accentMid; e.target.style.boxShadow=`0 0 0 3px ${C.accentDim}`; }}
                onBlur={e => { e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:14 }}>✕</button>
              )}
            </div>
            {[["all","All"],["active","Active"],["completed","Done"],["overdue","Overdue"]].map(([val,label]) => (
              <button key={val} className="filter-btn" onClick={() => setFilter(val)} style={{
                padding:"8px 14px", borderRadius:8, cursor:"pointer", fontFamily:"inherit",
                fontSize:12, fontWeight:600, border:`1px solid ${filter===val ? C.accentMid : C.border}`,
                background: filter===val ? C.accentDim : "transparent",
                color: filter===val ? C.accent : C.muted,
              }}>{label}</button>
            ))}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inp({ width:"auto", padding:"8px 12px", background:C.surface, fontSize:12 }), cursor:"pointer" }}>
              <option value="newest">Newest first</option>
              <option value="priority">By priority</option>
              <option value="dueDate">By due date</option>
            </select>
          </div>

          {search && (
            <p style={{ fontSize:12, color:C.muted, marginBottom:14 }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
            </p>
          )}

          {/* Main grid */}
          <div style={{ display:"grid", gridTemplateColumns: upcoming.length && filter==="all" ? "1fr 268px" : "1fr", gap:22, alignItems:"start" }}>
            <div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px", borderBottom:`1px solid ${C.border}` }}>
                  <div>
                    <h2 style={{ fontSize:15, fontWeight:700, margin:0, color:C.text }}>
                      {filter==="all" ? "All Tasks" : filter==="active" ? "Active Tasks" : filter==="completed" ? "Completed Tasks" : "Overdue Tasks"}
                    </h2>
                    <p style={{ fontSize:12, color:C.muted, margin:"3px 0 0" }}>
                      {fetching ? "Loading..." : `${filtered.length} task${filtered.length!==1?"s":""}`}
                    </p>
                  </div>
                  <span style={{
                    fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20,
                    background:C.accentDim, color:C.accent, border:`1px solid ${C.accentMid}`,
                  }}>{filtered.length}</span>
                </div>
                {fetching
                  ? <Skeleton C={C} />
                  : filtered.length === 0
                    ? <EmptyState filter={search ? "all" : filter} onAdd={openAdd} C={C} />
                    : filtered.map((todo, i) => (
                        <TaskRow key={todo._id} todo={todo} onEdit={handleEdit} onDelete={handleDelete} onComplete={handleComplete} completed={todo.status==="COMPLETED"} idx={i} C={C} />
                      ))
                }
              </div>
            </div>

            {/* Upcoming sidebar */}
            {upcoming.length > 0 && filter === "all" && (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
                <div style={{ padding:"16px 18px", borderBottom:`1px solid ${C.border}` }}>
                  <h2 style={{ fontSize:14, fontWeight:700, margin:0, color:C.text }}>Upcoming Deadlines</h2>
                  <p style={{ fontSize:12, color:C.muted, margin:"3px 0 0" }}>Sorted by nearest date</p>
                </div>
                {upcoming.map(todo => {
                  const pc   = PC(C)[todo.priority] || PC(C).LOW;
                  const over = isOver(todo.dueDate);
                  return (
                    <div key={todo._id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 18px", borderBottom:`1px solid ${C.border}`, transition:"background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background=C.surface2}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}
                    >
                      <div style={{ width:34, height:34, borderRadius:9, flexShrink:0, background:pc.bg, border:`1px solid ${pc.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>📌</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:13, fontWeight:600, color:C.text, margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{todo.title}</p>
                        <p style={{ fontSize:11, color:over ? C.danger : C.muted, margin:"4px 0 0" }}>{over ? "⚠ Overdue · " : "📅 "}{fmt(todo.dueDate)}</p>
                        <span style={{ display:"inline-block", marginTop:5, fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:4, color:pc.color, background:pc.bg, border:`1px solid ${pc.border}`, textTransform:"uppercase", letterSpacing:"0.06em" }}>{todo.priority}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Modal ── */}
        <Modal show={showModal} onClose={handleCancel} C={C}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"22px 26px", borderBottom:`1px solid ${C.border}` }}>
            <div>
              <h3 style={{ margin:0, fontSize:18, fontWeight:800, letterSpacing:"-0.02em", color:C.text }}>{editingId ? "Edit Task" : "New Task"}</h3>
              <p style={{ margin:"3px 0 0", fontSize:12, color:C.muted }}>{editingId ? "Update task details" : "Fill in the details to create a task"}</p>
            </div>
            <button onClick={handleCancel} style={{ background:C.surface2, border:`1px solid ${C.border}`, color:C.muted, fontSize:16, cursor:"pointer", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
          <form onSubmit={onSubmit} style={{ padding:"22px 26px", display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:7, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>Task Name *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Plan weekend trip" style={inp()}
                onFocus={e => { e.target.style.borderColor=C.accentMid; e.target.style.boxShadow=`0 0 0 3px ${C.accentDim}`; }}
                onBlur={e => { e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}
              />
            </div>
            <div>
              <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:7, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>Notes *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add notes..." rows={3} style={inp({ resize:"none" })}
                onFocus={e => { e.target.style.borderColor=C.accentMid; e.target.style.boxShadow=`0 0 0 3px ${C.accentDim}`; }}
                onBlur={e => { e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}
              />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:7, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inp()}
                  onFocus={e => { e.target.style.borderColor=C.accentMid; e.target.style.boxShadow=`0 0 0 3px ${C.accentDim}`; }}
                  onBlur={e => { e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}
                />
              </div>
              <div>
                <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:7, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} style={inp()}
                  onFocus={e => e.target.style.borderColor=C.accentMid}
                  onBlur={e => e.target.style.borderColor=C.border}
                >
                  <option value="TODO">Todo</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:9, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>Priority</label>
              <div style={{ display:"flex", borderRadius:9, overflow:"hidden", border:`1px solid ${C.border}` }}>
                {[{ val:"LOW", color:C.success, label:"Low" }, { val:"MEDIUM", color:C.accent, label:"Medium" }, { val:"HIGH", color:C.danger, label:"High" }].map(({ val, color, label }, i) => {
                  const active = priority === val;
                  return (
                    <button key={val} type="button" onClick={() => setPriority(val)} style={{
                      flex:1, padding:"10px 0", border:"none",
                      borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
                      background: active ? color : "transparent",
                      color: active ? "#fff" : C.muted,
                      fontSize:13, fontWeight:700, cursor:"pointer",
                      transition:"all 0.15s", fontFamily:"inherit",
                      boxShadow: active ? `0 4px 12px ${color}44` : "none",
                    }}>{label}</button>
                  );
                })}
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button type="button" onClick={handleCancel} style={{
                flex:1, padding:"12px", borderRadius:9, cursor:"pointer",
                background:"transparent", color:C.muted,
                border:`1px solid ${C.border}`, fontSize:13, fontWeight:600, fontFamily:"inherit",
              }}
                onMouseEnter={e => { e.currentTarget.style.background=C.surface2; e.currentTarget.style.color=C.text; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.muted; }}
              >Cancel</button>
              <button type="submit" disabled={isLoading} style={{
                flex:2, padding:"12px", borderRadius:9,
                cursor: isLoading ? "not-allowed" : "pointer",
                background: isLoading ? C.dim : `linear-gradient(135deg, ${C.accent}, #e8621f)`,
                color: isLoading ? C.muted : "#fff",
                border:"none", fontSize:13, fontWeight:700, fontFamily:"inherit",
                boxShadow: isLoading ? "none" : `0 4px 16px ${C.accent}44`,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>
                {isLoading && <span style={{ width:14, height:14, border:"2px solid #ffffff40", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" }} />}
                {isLoading ? "Saving..." : editingId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </Modal>

        <Toast toasts={toasts} remove={removeToast} C={C} />
      </div>
    </>
  );
}