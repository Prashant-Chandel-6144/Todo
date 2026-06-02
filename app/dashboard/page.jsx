"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Themes ─────────────────────────────────────────────────
const DARK = {
  bg: "#0b0b0b", surface: "#141414", surface2: "#1c1c1c", surface3: "#252525",
  border: "#2c2c2c", borderHov: "#3a3a3a",
  accent: "#D55210", accentDim: "#D5521015", accentMid: "#D5521050",
  success: "#4ead72", successBg: "#4ead7215", successBdr: "#4ead7240",
  danger: "#e05252", dangerBg: "#e0525215", dangerBdr: "#e0525240",
  warn: "#c4a55a", warnBg: "#c4a55a15", warnBdr: "#c4a55a40",
  blue: "#7a9cc4", blueBg: "#7a9cc415", blueBdr: "#7a9cc440",
  text: "#f0ece6", muted: "#6b6560",
};
const LIGHT = {
  bg: "#f5f3f0", surface: "#ffffff", surface2: "#f0ede8", surface3: "#e8e4dd",
  border: "#ddd8d0", borderHov: "#c8c0b4",
  accent: "#D55210", accentDim: "#D5521012", accentMid: "#D5521040",
  success: "#2e9e58", successBg: "#2e9e5812", successBdr: "#2e9e5835",
  danger: "#d03030", dangerBg: "#d0303012", dangerBdr: "#d0303035",
  warn: "#a07820", warnBg: "#a0782012", warnBdr: "#a0782035",
  blue: "#3a6ea8", blueBg: "#3a6ea812", blueBdr: "#3a6ea835",
  text: "#1a1410", muted: "#8a8078",
};

const makeCSS = (C) => `
  @keyframes fadeUp    { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn   { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes slideLeft { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
  @keyframes spin      { to { transform:rotate(360deg); } }
  @keyframes shimmer   { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
  @keyframes ringDraw  { from { stroke-dashoffset:var(--full); } to { stroke-dashoffset:var(--off); } }
  @keyframes barRise   { from { height:0; } to { height:var(--h); } }
  @keyframes pulse-glow { 0%,100% { box-shadow:0 0 0 0 ${C.accent}40; } 50% { box-shadow:0 0 12px 4px ${C.accent}30; } }
  * { box-sizing:border-box; margin:0; padding:0; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:${C.bg}; }
  ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px; }
  .stat-card { transition:all 0.22s ease; }
  .stat-card:hover { transform:translateY(-4px) !important; box-shadow:0 16px 40px rgba(0,0,0,0.3) !important; }
  .dash-card { transition:border-color 0.2s; }
  .dash-card:hover { border-color:${C.borderHov} !important; }
  .row-hover { transition:background 0.12s; cursor:default; }
  .row-hover:hover { background:${C.surface2} !important; }
  .heat-cell { transition:transform 0.12s, opacity 0.12s; }
  .heat-cell:hover { transform:scale(1.35) !important; z-index:10; }
  .nav-link { transition:all 0.15s; }
  .nav-link:hover { color:${C.text} !important; background:${C.surface2} !important; }
  .period-btn { transition:all 0.15s; }
  .period-btn:hover { border-color:${C.borderHov} !important; }
  .back-btn { transition:all 0.15s; }
  .back-btn:hover { background:${C.surface2} !important; border-color:${C.borderHov} !important; color:${C.text} !important; }
  .theme-toggle { transition:all 0.25s ease; }
  .theme-toggle:hover { transform:rotate(20deg) scale(1.1); }
  .quick-action { transition:all 0.18s ease; }
  .quick-action:hover { transform:translateY(-2px) !important; box-shadow:0 8px 20px rgba(0,0,0,0.2) !important; }
`;

const fmt      = (d) => d ? new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "—";
const fmtShort = (d) => d ? new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric" }) : "—";
const isOver   = (d) => d && new Date(d) < new Date(new Date().toDateString());
const dayLabel = (d) => new Date(d).toLocaleDateString("en-US", { weekday:"short" });
const moLabel  = (d) => new Date(d).toLocaleDateString("en-US", { month:"short" });

// ── Skeleton ───────────────────────────────────────────────
function Skel({ C }) {
  const b = (w,h=14) => (
    <div style={{ width:w, height:h, borderRadius:6,
      background:`linear-gradient(90deg,${C.surface2} 25%,${C.surface3} 50%,${C.surface2} 75%)`,
      backgroundSize:"600px 100%", animation:"shimmer 1.5s ease infinite" }} />
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", gap:12 }}>
        {[1,2,3,4,5].map(i => <div key={i} style={{ flex:1, height:96, borderRadius:14,
          background:`linear-gradient(90deg,${C.surface2} 25%,${C.surface3} 50%,${C.surface2} 75%)`,
          backgroundSize:"600px 100%", animation:`shimmer 1.5s ease ${i*0.1}s infinite` }} />)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
        {[1,2,3].map(i => <div key={i} style={{ height:200, borderRadius:16,
          background:`linear-gradient(90deg,${C.surface2} 25%,${C.surface3} 50%,${C.surface2} 75%)`,
          backgroundSize:"600px 100%", animation:`shimmer 1.5s ease ${i*0.15}s infinite` }} />)}
      </div>
    </div>
  );
}

// ── Donut chart ────────────────────────────────────────────
function Donut({ segments, center, sub, size=130, stroke=11, C }) {
  const r = (size/2) - stroke;
  const cx = size/2, cy = size/2;
  const circ = 2*Math.PI*r;
  const total = segments.reduce((s,x) => s+x.value, 0);
  let off = 0;
  const arcs = segments.map(seg => {
    const pct = total===0 ? 0 : seg.value/total;
    const arc = { ...seg, dash:pct*circ, offset:-off*circ };
    off += pct;
    return arc;
  });
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.surface3} strokeWidth={stroke} />
        {arcs.map((a,i) => a.dash > 0 && (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={a.color} strokeWidth={stroke}
            strokeDasharray={`${a.dash} ${circ}`}
            strokeDashoffset={a.offset}
            strokeLinecap="round"
            style={{ transition:"stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1), stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
          />
        ))}
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2 }}>
        <span style={{ fontSize:size<110?17:21, fontWeight:900, color:C.text, lineHeight:1 }}>{center}</span>
        {sub && <span style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em" }}>{sub}</span>}
      </div>
    </div>
  );
}

// ── Legend ─────────────────────────────────────────────────
function Legend({ items, C }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
      {items.map(({ label, value, color, pct }) => (
        <div key={label} style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:9, height:9, borderRadius:"50%", background:color, flexShrink:0, boxShadow:`0 0 5px ${color}80` }} />
          <span style={{ fontSize:12, color:C.muted, flex:1 }}>{label}</span>
          <span style={{ fontSize:13, fontWeight:700, color }}>{value}</span>
          {pct != null && <span style={{ fontSize:10, color:C.muted }}>({pct}%)</span>}
        </div>
      ))}
    </div>
  );
}

// ── HBar ───────────────────────────────────────────────────
function HBar({ label, value, max, color, C }) {
  const pct = max===0 ? 0 : Math.round((value/max)*100);
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:700, color }}>{value} <span style={{ color:C.muted, fontWeight:400 }}>({pct}%)</span></span>
      </div>
      <div style={{ height:7, background:C.surface3, borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:99, background:color, width:`${pct}%`,
          transition:"width 1.1s cubic-bezier(0.22,1,0.36,1)", boxShadow:`0 0 8px ${color}55` }} />
      </div>
    </div>
  );
}

// ── Bar chart (7 days) ─────────────────────────────────────
function BarChart({ todos, C }) {
  const days = Array.from({length:7}, (_,i) => {
    const d = new Date(); d.setDate(d.getDate()-(6-i)); return d;
  });
  const counts = days.map(d => todos.filter(t => new Date(t.created_at||0).toDateString()===d.toDateString()).length);
  const doneCounts = days.map(d => todos.filter(t => t.status==="COMPLETED" && new Date(t.updated_at||t.created_at||0).toDateString()===d.toDateString()).length);
  const max = Math.max(...counts, ...doneCounts, 1);
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:14 }}>
        {[{color:C.accent,label:"Created"},{color:C.success,label:"Completed"}].map(l=>(
          <div key={l.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:l.color }} />
            <span style={{ fontSize:11, color:C.muted }}>{l.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:110 }}>
        {days.map((d,i) => {
          const isToday = d.toDateString()===new Date().toDateString();
          const ch = Math.max(Math.round((counts[i]/max)*90), counts[i]>0?3:0);
          const dh = Math.max(Math.round((doneCounts[i]/max)*90), doneCounts[i]>0?3:0);
          return (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, height:"100%" }}>
              <div style={{ flex:1, display:"flex", alignItems:"flex-end", gap:2, width:"100%" }}>
                <div title={`Created: ${counts[i]}`} style={{ flex:1, borderRadius:"4px 4px 0 0", height:ch,
                  background:isToday?`linear-gradient(180deg,${C.accent},${C.accent}99)`:C.accent+"55",
                  boxShadow:isToday?`0 0 10px ${C.accent}55`:"none",
                  transition:"height 0.9s cubic-bezier(0.22,1,0.36,1)" }} />
                <div title={`Completed: ${doneCounts[i]}`} style={{ flex:1, borderRadius:"4px 4px 0 0", height:dh,
                  background:isToday?`linear-gradient(180deg,${C.success},${C.success}99)`:C.success+"55",
                  transition:"height 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s" }} />
              </div>
              <span style={{ fontSize:10, color:isToday?C.accent:C.muted, fontWeight:isToday?700:400 }}>{dayLabel(d)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Heatmap ────────────────────────────────────────────────
function HeatMap({ todos, C }) {
  const WEEKS=12, TOTAL=WEEKS*7;
  const grid = Array.from({length:TOTAL}, (_,i) => {
    const d=new Date(); d.setDate(d.getDate()-(TOTAL-1-i));
    const ds=d.toDateString();
    const count=todos.filter(t=>t.status==="COMPLETED"&&new Date(t.updated_at||t.created_at||0).toDateString()===ds).length;
    return {d,count};
  });
  const maxC=Math.max(...grid.map(g=>g.count),1);
  const CELL=14, GAP=3;
  // month labels
  const moLabels=[];
  for(let wi=0;wi<WEEKS;wi++){
    const cell=grid[wi*7];
    if(cell){
      const mo=moLabel(cell.d);
      if(!moLabels.length||moLabels[moLabels.length-1].label!==mo) moLabels.push({wi,label:mo});
    }
  }
  return (
    <div>
      <div style={{ display:"flex", gap:GAP, marginBottom:5, paddingLeft:20 }}>
        {Array.from({length:WEEKS},(_,wi)=>{
          const ml=moLabels.find(m=>m.wi===wi);
          return <div key={wi} style={{ width:CELL, flexShrink:0, fontSize:9, color:ml?C.muted:"transparent" }}>{ml?ml.label:"·"}</div>;
        })}
      </div>
      <div style={{ display:"flex", gap:GAP }}>
        <div style={{ display:"flex", flexDirection:"column", gap:GAP, marginRight:4 }}>
          {["M","T","W","T","F","S","S"].map((d,i)=>(
            <div key={i} style={{ width:14, height:CELL, fontSize:9, color:C.muted, display:"flex", alignItems:"center", justifyContent:"flex-end" }}>{d}</div>
          ))}
        </div>
        {Array.from({length:WEEKS},(_,wi)=>(
          <div key={wi} style={{ display:"flex", flexDirection:"column", gap:GAP }}>
            {Array.from({length:7},(_,di)=>{
              const cell=grid[wi*7+di];
              if(!cell) return <div key={di} style={{ width:CELL, height:CELL }} />;
              const {d,count}=cell;
              const isToday=d.toDateString()===new Date().toDateString();
              const alpha=count===0?0:0.18+(count/maxC)*0.82;
              return (
                <div key={di} className="heat-cell"
                  title={`${fmtShort(d)}: ${count} completed`}
                  style={{ width:CELL, height:CELL, borderRadius:3, cursor:"default",
                    background:count===0?C.surface3:`rgba(213,82,16,${alpha})`,
                    border:isToday?`1.5px solid ${C.accent}`:"1px solid transparent",
                    boxShadow:count>0?`0 0 4px rgba(213,82,16,${alpha*0.5})`:"none" }} />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:10 }}>
        <span style={{ fontSize:10, color:C.muted }}>Less</span>
        {[0.12,0.3,0.5,0.72,1].map((a,i)=>(
          <div key={i} style={{ width:12, height:12, borderRadius:3, background:`rgba(213,82,16,${a})` }} />
        ))}
        <span style={{ fontSize:10, color:C.muted }}>More</span>
      </div>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────
function StatCard({ label, value, color, icon, sub, delay=0, C }) {
  return (
    <div className="stat-card" style={{
      background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:14, padding:"20px 22px", flex:1,
      borderTop:`3px solid ${color}`,
      animation:`fadeUp 0.45s ease ${delay}ms both`,
      position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:-18, right:-18, width:70, height:70, borderRadius:"50%", background:color+"12", pointerEvents:"none" }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <p style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:"0.09em", fontWeight:500 }}>{label}</p>
        <span style={{ fontSize:20 }}>{icon}</span>
      </div>
      <p style={{ fontSize:34, fontWeight:900, color, lineHeight:1, marginBottom:sub?5:0 }}>{value}</p>
      {sub && <p style={{ fontSize:11, color:C.muted }}>{sub}</p>}
    </div>
  );
}

// ── Card wrapper ───────────────────────────────────────────
function Card({ title, sub, action, children, delay=0, style={} }) {
  return (
    <div className="dash-card" style={{
      background:"var(--surface)", border:"1px solid var(--border)",
      borderRadius:16, overflow:"hidden",
      animation:`scaleIn 0.5s ease ${delay}ms both`,
      ...style,
    }}>
      {title && (
        <div style={{ padding:"18px 22px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h3 style={{ fontSize:14, fontWeight:700, color:"var(--text)", margin:0 }}>{title}</h3>
            {sub && <p style={{ fontSize:12, color:"var(--muted)", margin:"3px 0 0" }}>{sub}</p>}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding: title ? "20px 22px" : 0 }}>{children}</div>
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────
function Navbar({ user, theme, toggleTheme, onLogout, C }) {
  return (
    <nav style={{ background:C.surface, borderBottom:`1px solid ${C.border}`,
      padding:"0 32px", height:62,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      position:"sticky", top:0, zIndex:40,
      transition:"background 0.3s, border-color 0.3s",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:20 }}>
        {/* Back */}
        <a href="/todos" className="back-btn" style={{
          display:"flex", alignItems:"center", gap:7, padding:"7px 13px",
          borderRadius:9, cursor:"pointer",
          background:"transparent", border:`1px solid ${C.border}`,
          color:C.muted, fontSize:13, fontWeight:600, textDecoration:"none",
          transition:"all 0.15s",
        }}>← Tasks</a>
        <div style={{ width:1, height:22, background:C.border }} />
        {/* Logo */}
        <a href="/" style={{ display:"flex", alignItems:"center", gap:9, textDecoration:"none" }}>
          <div style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${C.accent},#ff7c3a)`,
            display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, color:"#fff",
            boxShadow:`0 4px 12px ${C.accent}55` }}>T</div>
          <span style={{ fontWeight:800, fontSize:16, letterSpacing:"-0.03em", color:C.text }}>
            Task<span style={{ color:C.accent }}>Board</span>
            <span style={{ fontSize:12, color:C.muted, fontWeight:500, marginLeft:6 }}>/ Analytics</span>
          </span>
        </a>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {/* User pill */}
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px 6px 6px",
          borderRadius:10, background:C.surface2, border:`1px solid ${C.border}` }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${C.accent},#e8621f)`,
            display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, color:"#fff" }}>
            {user?.fname?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{user?.fname} {user?.lname}</span>
        </div>
        {/* Theme toggle */}
        <button className="theme-toggle" onClick={toggleTheme} style={{
          width:38, height:38, borderRadius:10,
          background:C.surface2, border:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", fontSize:17,
        }} title={`Switch to ${theme==="dark"?"light":"dark"} mode`}>
          {theme==="dark" ? "☀️" : "🌙"}
        </button>
        {/* Logout */}
        <button onClick={onLogout} style={{
          display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
          borderRadius:9, cursor:"pointer",
          background:"transparent", border:`1px solid ${C.border}`,
          color:C.muted, fontSize:13, fontWeight:600, fontFamily:"inherit", transition:"all 0.15s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.background=C.dangerBg;e.currentTarget.style.borderColor=C.dangerBdr;e.currentTarget.style.color=C.danger;}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}
        >⎋ Logout</button>
      </div>
    </nav>
  );
}

// ── MAIN ──────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [user,    setUser]    = useState(null);
  const [todos,   setTodos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme,   setTheme]   = useState("dark");
  const [period,  setPeriod]  = useState("week");

  const C = theme==="dark" ? DARK : LIGHT;

  const toggleTheme = useCallback(() => {
    setTheme(t => { const n=t==="dark"?"light":"dark"; localStorage.setItem("theme",n); return n; });
  }, []);

  useEffect(() => {
    const saved=localStorage.getItem("theme"); if(saved) setTheme(saved);
    const stored=localStorage.getItem("user");
    if(!stored) { router.push("/login"); return; }
    setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if(!user) return;
    fetch(`/api/todo?userId=${user._id}`)
      .then(r=>r.json())
      .then(d=>{ setTodos(Array.isArray(d)?d:[]); setLoading(false); })
      .catch(()=>setLoading(false));
  }, [user]);

  if(!user) return null;

  // ── Derived ──────────────────────────────────────────────
  const total      = todos.length;
  const completed  = todos.filter(t=>t.status==="COMPLETED").length;
  const pending    = todos.filter(t=>t.status==="PENDING").length;
  const todoCount  = todos.filter(t=>t.status==="TODO").length;
  const overdue    = todos.filter(t=>isOver(t.dueDate)&&t.status!=="COMPLETED").length;
  const onTime     = todos.filter(t=>t.status==="COMPLETED"&&t.dueDate&&!isOver(t.dueDate)).length;
  const late       = todos.filter(t=>t.status==="COMPLETED"&&t.dueDate&&isOver(t.dueDate)).length;
  const highCount  = todos.filter(t=>t.priority==="HIGH").length;
  const medCount   = todos.filter(t=>t.priority==="MEDIUM").length;
  const lowCount   = todos.filter(t=>t.priority==="LOW").length;
  const highDone   = todos.filter(t=>t.priority==="HIGH"&&t.status==="COMPLETED").length;
  const medDone    = todos.filter(t=>t.priority==="MEDIUM"&&t.status==="COMPLETED").length;
  const lowDone    = todos.filter(t=>t.priority==="LOW"&&t.status==="COMPLETED").length;
  const compRate   = total===0 ? 0 : Math.round((completed/total)*100);
  const onTimeRate = completed===0 ? 0 : Math.round((onTime/completed)*100);
  const msDay=86400000, now=new Date();

  const dueThisWeek=todos.filter(t=>{
    if(!t.dueDate||t.status==="COMPLETED") return false;
    const d=new Date(t.dueDate), wk=new Date(); wk.setDate(wk.getDate()+7);
    return d>=now&&d<=wk;
  }).length;

  const dayMap={};
  todos.filter(t=>t.status==="COMPLETED").forEach(t=>{
    const d=new Date(t.updated_at||t.created_at||0).toLocaleDateString("en-US",{weekday:"long"});
    dayMap[d]=(dayMap[d]||0)+1;
  });
  const bestDay=Object.entries(dayMap).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—";

  const upcoming=[...todos].filter(t=>t.dueDate&&t.status!=="COMPLETED")
    .sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)).slice(0,5);
  const recent=[...todos].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,6);
  const recentDone=[...todos].filter(t=>t.status==="COMPLETED")
    .sort((a,b)=>new Date(b.updated_at||0)-new Date(a.updated_at||0)).slice(0,5);

  const PC = {
    HIGH:   {color:C.danger,  bg:C.dangerBg,  border:C.dangerBdr },
    MEDIUM: {color:C.accent,  bg:C.accentDim, border:C.accentMid },
    LOW:    {color:C.success, bg:C.successBg, border:C.successBdr},
  };
  const SC = {
    COMPLETED:{color:C.success,bg:C.successBg},
    TODO:     {color:C.blue,  bg:C.blueBg   },
    PENDING:  {color:C.warn,  bg:C.warnBg   },
  };

  const p = (n,d) => d===0 ? 0 : Math.round((n/d)*100);

  return (
    <>
      <style>{makeCSS(C)}</style>
      {/* CSS vars for Card component */}
      <style>{`:root { --surface:${C.surface}; --border:${C.border}; --text:${C.text}; --muted:${C.muted}; }`}</style>
      <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'Sora',sans-serif", transition:"background 0.3s,color 0.3s" }}>

        <Navbar user={user} theme={theme} toggleTheme={toggleTheme} onLogout={()=>{localStorage.removeItem("user");router.push("/login");}} C={C} />

        <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 24px" }}>

          {/* Page title */}
          <div style={{ marginBottom:28, animation:"slideLeft 0.5s ease" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
              <div>
                <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:"-0.035em", color:C.text, margin:0 }}>
                  Analytics <span style={{ color:C.accent }}>Dashboard</span>
                </h1>
                <p style={{ fontSize:13, color:C.muted, margin:"5px 0 0" }}>
                  Complete performance overview · {total} tasks tracked
                </p>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {[["week","7 Days"],["month","4 Weeks"],["all","All Time"]].map(([v,l])=>(
                  <button key={v} className="period-btn" onClick={()=>setPeriod(v)} style={{
                    padding:"7px 14px", borderRadius:8, cursor:"pointer", fontFamily:"inherit",
                    fontSize:12, fontWeight:600,
                    border:`1px solid ${period===v?C.accentMid:C.border}`,
                    background: period===v?C.accentDim:"transparent",
                    color: period===v?C.accent:C.muted,
                  }}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          {loading ? <Skel C={C} /> : (
            <>
              {/* ── KPI row 1 ── */}
              <div style={{ display:"flex", gap:12, marginBottom:14, flexWrap:"wrap" }}>
                <StatCard label="Total Tasks"   value={total}     color={C.accent}  icon="📋" sub="All time"                         delay={0}   C={C} />
                <StatCard label="Completed"     value={completed} color={C.success} icon="✅" sub={`${compRate}% completion rate`}   delay={60}  C={C} />
                <StatCard label="Active"        value={todoCount+pending} color={C.blue} icon="⚡" sub={`${todoCount} todo · ${pending} pending`} delay={120} C={C} />
                <StatCard label="Overdue"       value={overdue}   color={overdue>0?C.danger:C.muted} icon="⚠️" sub={overdue>0?"Needs attention":"All on track ✓"} delay={180} C={C} />
                <StatCard label="Due This Week" value={dueThisWeek} color={C.warn}  icon="📅" sub="Upcoming deadlines"              delay={240} C={C} />
              </div>

              {/* ── KPI row 2 ── */}
              <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
                <StatCard label="High Priority" value={highCount}  color={C.danger}  icon="🔥" sub={`${highDone} completed`}         delay={0}   C={C} />
                <StatCard label="On-Time Done"  value={onTime}     color={C.success} icon="🎯" sub={`${onTimeRate}% of completed`}   delay={60}  C={C} />
                <StatCard label="Completed Late" value={late}      color={C.warn}    icon="⏰" sub="Past deadline"                  delay={120} C={C} />
                <StatCard label="Pending"       value={pending}    color={C.warn}    icon="⏳" sub="In progress"                    delay={180} C={C} />
                <StatCard label="Best Day"      value={bestDay.slice(0,3)} color={C.blue} icon="🏆" sub="Most productive"           delay={240} C={C} />
              </div>

              {/* ── 3 Donut charts ── */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:14 }}>
                {/* Status donut */}
                <div className="dash-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px", animation:"scaleIn 0.5s ease 80ms both" }}>
                  <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:"0 0 4px" }}>Status Overview</p>
                  <p style={{ fontSize:12, color:C.muted, margin:"0 0 16px" }}>Tasks by current status</p>
                  <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                    <Donut size={120} C={C}
                      center={`${compRate}%`} sub="done"
                      segments={[
                        {value:completed,color:C.success},
                        {value:pending,  color:C.warn   },
                        {value:todoCount,color:C.blue   },
                      ]}
                    />
                    <Legend C={C} items={[
                      {label:"Completed",value:completed,color:C.success,pct:p(completed,total)},
                      {label:"Pending",  value:pending,  color:C.warn,   pct:p(pending,total)  },
                      {label:"Todo",     value:todoCount, color:C.blue,   pct:p(todoCount,total) },
                    ]} />
                  </div>
                </div>

                {/* Priority donut */}
                <div className="dash-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px", animation:"scaleIn 0.5s ease 130ms both" }}>
                  <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:"0 0 4px" }}>Priority Split</p>
                  <p style={{ fontSize:12, color:C.muted, margin:"0 0 16px" }}>Distribution by priority</p>
                  <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                    <Donut size={120} C={C}
                      center={highCount} sub="high"
                      segments={[
                        {value:highCount,color:C.danger },
                        {value:medCount, color:C.accent },
                        {value:lowCount, color:C.success},
                      ]}
                    />
                    <Legend C={C} items={[
                      {label:"High",  value:highCount,color:C.danger, pct:p(highCount,total)},
                      {label:"Medium",value:medCount, color:C.accent, pct:p(medCount,total) },
                      {label:"Low",   value:lowCount, color:C.success,pct:p(lowCount,total) },
                    ]} />
                  </div>
                </div>

                {/* Delivery donut */}
                <div className="dash-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px", animation:"scaleIn 0.5s ease 180ms both" }}>
                  <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:"0 0 4px" }}>Delivery Quality</p>
                  <p style={{ fontSize:12, color:C.muted, margin:"0 0 16px" }}>On-time vs late completions</p>
                  <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                    <Donut size={120} C={C}
                      center={completed===0?"—":`${onTimeRate}%`} sub="on time"
                      segments={[
                        {value:onTime,           color:C.success},
                        {value:late,             color:C.danger },
                        {value:todoCount+pending,color:C.surface3},
                      ]}
                    />
                    <Legend C={C} items={[
                      {label:"On Time",  value:onTime,           color:C.success},
                      {label:"Late",     value:late,             color:C.danger },
                      {label:"Remaining",value:todoCount+pending,color:C.muted  },
                    ]} />
                  </div>
                </div>
              </div>

              {/* ── Priority completion + Bar chart ── */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                <div className="dash-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px", animation:"scaleIn 0.5s ease 100ms both" }}>
                  <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:"0 0 4px" }}>Priority Completion</p>
                  <p style={{ fontSize:12, color:C.muted, margin:"0 0 18px" }}>Tasks done per priority level</p>
                  <HBar label="🔴 High"   value={highDone} max={highCount||1} color={C.danger}  C={C} />
                  <HBar label="🟠 Medium" value={medDone}  max={medCount||1}  color={C.accent}  C={C} />
                  <HBar label="🟢 Low"    value={lowDone}  max={lowCount||1}  color={C.success} C={C} />
                  <div style={{ padding:"12px 14px", background:C.surface2, borderRadius:10, display:"flex", alignItems:"center", gap:12, marginTop:8, border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:20 }}>🏆</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:11, color:C.muted, margin:0 }}>Most productive day</p>
                      <p style={{ fontSize:14, fontWeight:700, color:C.accent, margin:0 }}>{bestDay}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:11, color:C.muted, margin:0 }}>Total done</p>
                      <p style={{ fontSize:14, fontWeight:700, color:C.success, margin:0 }}>{completed}</p>
                    </div>
                  </div>
                </div>

                <div className="dash-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px", animation:"scaleIn 0.5s ease 140ms both" }}>
                  <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:"0 0 4px" }}>Daily Activity</p>
                  <p style={{ fontSize:12, color:C.muted, margin:"0 0 16px" }}>Tasks created & completed last 7 days</p>
                  {total===0
                    ? <div style={{ height:110, display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ fontSize:13, color:C.muted }}>No data yet</p></div>
                    : <BarChart todos={todos} C={C} />
                  }
                  <div style={{ display:"flex", gap:18, marginTop:14, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
                    {[
                      {label:"7-day avg", value:(total/7).toFixed(1)+"/day", color:C.accent},
                      {label:"Due soon",  value:`${dueThisWeek} tasks`,      color:C.warn  },
                      {label:"Overdue",   value:overdue,                      color:overdue>0?C.danger:C.muted},
                    ].map(({label,value,color})=>(
                      <div key={label}>
                        <p style={{ fontSize:10, color:C.muted, margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</p>
                        <p style={{ fontSize:15, fontWeight:700, color, margin:0 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Heatmap full width ── */}
              <div className="dash-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px", marginBottom:14, animation:"fadeUp 0.5s ease 160ms both" }}>
                <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:"0 0 4px" }}>Completion Heatmap</p>
                <p style={{ fontSize:12, color:C.muted, margin:"0 0 18px" }}>Daily completed tasks — last 12 weeks (hover for details)</p>
                {total===0
                  ? <p style={{ fontSize:13, color:C.muted, textAlign:"center", padding:"20px 0" }}>Complete tasks to see your heatmap</p>
                  : <HeatMap todos={todos} C={C} />
                }
              </div>

              {/* ── Upcoming + Insights ── */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                {/* Upcoming */}
                <div className="dash-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", animation:"scaleIn 0.5s ease 180ms both" }}>
                  <div style={{ padding:"18px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div>
                      <h3 style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>Upcoming Deadlines</h3>
                      <p style={{ fontSize:12, color:C.muted, margin:"3px 0 0" }}>Active · nearest first</p>
                    </div>
                    <a href="/todos" style={{ fontSize:12, color:C.accent, textDecoration:"none", fontWeight:600 }}>View all →</a>
                  </div>
                  {upcoming.length===0
                    ? <div style={{ padding:"32px", textAlign:"center" }}><p style={{ fontSize:22 }}>🎉</p><p style={{ fontSize:13, color:C.muted, marginTop:8 }}>No upcoming deadlines</p></div>
                    : upcoming.map((t,i)=>{
                        const pc=PC[t.priority]||PC.LOW, over=isOver(t.dueDate);
                        return (
                          <div key={t._id} className="row-hover" style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 22px", borderBottom:i<upcoming.length-1?`1px solid ${C.border}`:"none", background:"transparent" }}>
                            <span style={{ width:8, height:8, borderRadius:"50%", background:over?C.danger:pc.color, flexShrink:0, boxShadow:`0 0 5px ${over?C.danger:pc.color}70` }} />
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ fontSize:13, fontWeight:600, color:C.text, margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.title}</p>
                            </div>
                            <span style={{ fontSize:11, color:over?C.danger:C.muted, flexShrink:0, fontWeight:over?600:400 }}>{over?"⚠ ":""}{fmtShort(t.dueDate)}</span>
                            <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:600, textTransform:"uppercase", color:pc.color, background:pc.bg, flexShrink:0 }}>{t.priority}</span>
                          </div>
                        );
                      })
                  }
                </div>

                {/* Quick insights */}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {[
                    {icon:"🎯",label:"Completion Rate", value:`${compRate}%`,    color:compRate>=70?C.success:compRate>=40?C.warn:C.danger, sub:compRate>=70?"Excellent!":compRate>=40?"Keep going":"Needs focus"},
                    {icon:"⏰",label:"On-Time Rate",    value:`${onTimeRate}%`,  color:C.success, sub:`${onTime} of ${completed} on time`},
                    {icon:"📅",label:"Due This Week",   value:dueThisWeek,       color:C.warn,    sub:"Upcoming deadlines"},
                    {icon:"🔥",label:"Overdue Tasks",   value:overdue,           color:overdue>0?C.danger:C.muted, sub:overdue>0?"Take action!":"All on track ✓"},
                    {icon:"⚡",label:"Active Right Now",value:todoCount+pending, color:C.blue,    sub:`${todoCount} todo · ${pending} pending`},
                  ].map(({icon,label,value,color,sub})=>(
                    <div key={label} className="dash-card" style={{
                      background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
                      padding:"12px 16px", display:"flex", alignItems:"center", gap:12,
                      animation:"fadeUp 0.4s ease 200ms both",
                    }}>
                      <div style={{ width:38, height:38, borderRadius:9, background:C.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{icon}</div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:11, color:C.muted, margin:0, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</p>
                        <p style={{ fontSize:11, color:C.muted, margin:"1px 0 0" }}>{sub}</p>
                      </div>
                      <p style={{ fontSize:22, fontWeight:900, color, margin:0, flexShrink:0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Recent completions + Task table ── */}
              <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:14, marginBottom:14 }}>
                {/* Recent completions */}
                <div className="dash-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", animation:"scaleIn 0.5s ease 200ms both" }}>
                  <div style={{ padding:"16px 18px", borderBottom:`1px solid ${C.border}` }}>
                    <h3 style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>Recently Completed</h3>
                    <p style={{ fontSize:11, color:C.muted, margin:"3px 0 0" }}>Latest wins 🏆</p>
                  </div>
                  {recentDone.length===0
                    ? <div style={{ padding:"24px", textAlign:"center" }}><p style={{ fontSize:13, color:C.muted }}>No completed tasks yet</p></div>
                    : recentDone.map((t,i)=>{
                        const pc=PC[t.priority]||PC.LOW;
                        return (
                          <div key={t._id} className="row-hover" style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 18px", borderBottom:i<recentDone.length-1?`1px solid ${C.border}`:"none", background:"transparent" }}>
                            <span style={{ color:C.success, fontSize:14, flexShrink:0 }}>✓</span>
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ fontSize:12, fontWeight:600, color:C.text, margin:0, textDecoration:"line-through", opacity:0.65, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.title}</p>
                              <p style={{ fontSize:10, color:C.muted, margin:"2px 0 0" }}>{t.updated_at?fmtShort(t.updated_at):"recently"}</p>
                            </div>
                            <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, fontWeight:600, textTransform:"uppercase", color:pc.color, background:pc.bg, flexShrink:0 }}>{t.priority}</span>
                          </div>
                        );
                      })
                  }
                </div>

                {/* Recent tasks table */}
                <div className="dash-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", animation:"scaleIn 0.5s ease 220ms both" }}>
                  <div style={{ padding:"18px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div>
                      <h3 style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>Recent Tasks</h3>
                      <p style={{ fontSize:12, color:C.muted, margin:"3px 0 0" }}>6 most recently created</p>
                    </div>
                    <a href="/todos" style={{ fontSize:12, color:C.accent, textDecoration:"none", fontWeight:600 }}>Manage →</a>
                  </div>
                  {recent.length===0
                    ? <div style={{ padding:"40px", textAlign:"center" }}><p style={{ fontSize:13, color:C.muted }}>No tasks yet. <a href="/todos" style={{ color:C.accent, textDecoration:"none" }}>Create one →</a></p></div>
                    : (
                      <table style={{ width:"100%", borderCollapse:"collapse" }}>
                        <thead>
                          <tr style={{ background:C.surface2 }}>
                            {["Task","Status","Priority","Due Date"].map(h=>(
                              <th key={h} style={{ padding:"9px 16px", textAlign:"left", fontSize:10, color:C.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", borderBottom:`1px solid ${C.border}` }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {recent.map((t,i)=>{
                            const pc=PC[t.priority]||PC.LOW, sc=SC[t.status]||SC.TODO;
                            const over=isOver(t.dueDate)&&t.status!=="COMPLETED";
                            return (
                              <tr key={t._id} className="row-hover" style={{ background:"transparent", borderBottom:i<recent.length-1?`1px solid ${C.border}`:"none" }}>
                                <td style={{ padding:"11px 16px" }}>
                                  <p style={{ fontSize:13, fontWeight:600, color:C.text, margin:0, textDecoration:t.status==="COMPLETED"?"line-through":"none", opacity:t.status==="COMPLETED"?0.55:1, maxWidth:200, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.title}</p>
                                </td>
                                <td style={{ padding:"11px 16px" }}>
                                  <span style={{ fontSize:10, padding:"3px 8px", borderRadius:5, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", color:sc.color, background:sc.bg }}>{t.status}</span>
                                </td>
                                <td style={{ padding:"11px 16px" }}>
                                  <span style={{ fontSize:10, padding:"3px 8px", borderRadius:5, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", color:pc.color, background:pc.bg }}>{t.priority}</span>
                                </td>
                                <td style={{ padding:"11px 16px" }}>
                                  <span style={{ fontSize:12, color:over?C.danger:C.muted, fontWeight:over?600:400 }}>{over?"⚠ ":""}{fmt(t.dueDate)}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )
                  }
                </div>
              </div>

              {/* ── Summary banner ── */}
              <div style={{
                background:`linear-gradient(135deg,${C.accentDim},${C.surface})`,
                border:`1px solid ${C.accentMid}`, borderRadius:16, padding:"22px 28px",
                display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16,
                animation:"fadeUp 0.5s ease 250ms both",
              }}>
                <div>
                  <p style={{ fontSize:17, fontWeight:800, color:C.text, margin:0 }}>
                    {compRate>=80?"🚀 Outstanding work!":compRate>=50?"💪 Good momentum!":compRate>0?"📈 Keep pushing!":"🌱 Let's get started!"}
                  </p>
                  <p style={{ fontSize:13, color:C.muted, margin:"4px 0 0" }}>
                    {compRate}% completion · {total} tasks total{overdue>0?` · ${overdue} overdue`:" · No overdue 🎉"}
                  </p>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <a href="/todos" className="quick-action" style={{
                    padding:"10px 20px", borderRadius:10, cursor:"pointer",
                    background:`linear-gradient(135deg,${C.accent},#e8621f)`,
                    color:"#fff", border:"none", fontSize:13, fontWeight:700, textDecoration:"none",
                    boxShadow:`0 4px 16px ${C.accent}44`,
                  }}>+ Add Task</a>
                  <a href="/todos" className="quick-action" style={{
                    padding:"10px 20px", borderRadius:10, cursor:"pointer",
                    background:C.surface2, border:`1px solid ${C.border}`,
                    color:C.text, fontSize:13, fontWeight:600, textDecoration:"none",
                  }}>View Tasks →</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}