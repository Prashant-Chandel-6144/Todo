"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const fontLink = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');`;

const C = {
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
  text:      "#f0ece6",
  muted:     "#6b6560",
  dim:       "#333",
};

const priorityConfig = {
  HIGH:   { color: "#e05252", bg: "#e0525212", border: "#e0525238", dot: "#e05252" },
  MEDIUM: { color: "#D55210", bg: "#D5521012", border: "#D5521045", dot: "#D55210" },
  LOW:    { color: "#4ead72", bg: "#4ead7212", border: "#4ead7235", dot: "#4ead72" },
};

const statusConfig = {
  COMPLETED: { color: "#4ead72", bg: "#4ead7212", border: "#4ead7230" },
  TODO:      { color: "#7a9cc4", bg: "#7a9cc412", border: "#7a9cc430" },
  PENDING:   { color: "#c4a55a", bg: "#c4a55a12", border: "#c4a55a30" },
};

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(d) {
  if (!d) return false;
  return new Date(d) < new Date(new Date().toDateString());
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "18px 20px", flex: 1, minWidth: 110,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "12px 12px 0 0" }} />
      <p style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 500 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <p style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1, margin: 0 }}>{value}</p>
        <span style={{ fontSize: 18, marginBottom: 2 }}>{icon}</span>
      </div>
    </div>
  );
}

function ActionBtn({ label, onClick, hoverColor, hoverBorder, icon, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        fontSize: 11, padding: "5px 11px", borderRadius: 6, cursor: "pointer",
        fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.03em",
        transition: "all 0.15s",
        background: hov ? (danger ? C.dangerBg : C.accentDim) : C.surface3,
        color: hov ? hoverColor : C.muted,
        border: `1px solid ${hov ? hoverBorder : C.border}`,
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hov ? `0 4px 12px ${hoverColor}20` : "none",
      }}
    ><span style={{ fontSize: 11 }}>{icon}</span> {label}</button>
  );
}

function TaskRow({ todo, onEdit, onDelete, completed }) {
  const [hov, setHov] = useState(false);
  const pc   = priorityConfig[todo.priority] || priorityConfig.LOW;
  const sc   = statusConfig[todo.status]     || statusConfig.TODO;
  const over = isOverdue(todo.dueDate) && !completed;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 20px",
        background: hov ? C.surface2 : "transparent",
        borderBottom: `1px solid ${C.border}`,
        transition: "background 0.15s",
        opacity: completed ? 0.65 : 1,
      }}
    >
      <span style={{
        width: 9, height: 9, borderRadius: "50%", flexShrink: 0,
        background: completed ? C.muted : pc.dot,
        boxShadow: completed ? "none" : `0 0 7px ${pc.dot}99`,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 14, fontWeight: 600, color: C.text, margin: 0,
          textDecoration: completed ? "line-through" : "none",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{todo.title}</p>
        {todo.description && (
          <p style={{ fontSize: 12, color: C.muted, margin: "3px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {todo.description}
          </p>
        )}
      </div>
      {todo.dueDate && (
        <span style={{ fontSize: 11, flexShrink: 0, color: over ? C.danger : C.muted, display: "flex", alignItems: "center", gap: 4 }}>
          {over && <span style={{ fontSize: 10 }}>⚠</span>}
          {formatDate(todo.dueDate)}
        </span>
      )}
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        padding: "4px 9px", borderRadius: 6, flexShrink: 0,
        color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
      }}>{todo.status}</span>
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        padding: "4px 9px", borderRadius: 6, flexShrink: 0,
        color: pc.color, background: pc.bg, border: `1px solid ${pc.border}`,
      }}>{todo.priority}</span>
      <div style={{ display: "flex", gap: 8, flexShrink: 0, opacity: hov ? 1 : 0, transition: "opacity 0.15s" }}>
        <ActionBtn label="Edit"   onClick={() => onEdit(todo)}    hoverColor={C.accent} hoverBorder={C.accentMid} icon="✎" />
        <ActionBtn label="Delete" onClick={() => onDelete(todo._id)} hoverColor={C.danger} hoverBorder={C.dangerBdr} icon="✕" danger />
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, count, countColor, children, empty }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${C.border}` }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: C.text }}>{title}</h2>
          {subtitle && <p style={{ fontSize: 12, color: C.muted, margin: "3px 0 0" }}>{subtitle}</p>}
        </div>
        {count !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: countColor + "18", color: countColor, border: `1px solid ${countColor}40` }}>{count}</span>
        )}
      </div>
      {empty
        ? <div style={{ padding: "40px 24px", textAlign: "center" }}><p style={{ fontSize: 13, color: C.muted }}>{empty}</p></div>
        : children}
    </div>
  );
}

function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.72)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, backdropFilter: "blur(6px)",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 16, width: "100%", maxWidth: 520,
        boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${C.accentMid}`,
      }}>{children}</div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────
export default function Todos() {
  const router = useRouter();
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

  // ── Auth guard — read user from localStorage ──────────
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/login"); return; }
    setUser(JSON.parse(stored));
  }, []);

  // ── Core functions — unchanged ─────────────────────────
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
    if (!confirm("Are you sure")) return;
    try {
      const res = await fetch(`/api/todo/${id}?userId=${user._id}`, { method: "DELETE" });
      if (res.ok) fetchTodos();
    } catch (error) {
      alert("Error Deleting Todo");
    }
  };

  const fetchTodos = async () => {
    if (!user) return;
    try {
      setFetching(true);
      const res  = await fetch(`/api/todo?userId=${user._id}`);
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching todos:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { if (user) fetchTodos(); }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) { alert("Please fill the required fields"); return; }
    try {
      if (editingId) {
        const res = await fetch(`/api/todo/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, status, priority, dueDate, userId: user._id }),
        });
        if (res.ok) {
          setTitle(""); setDescription(""); setDueDate("");
          setEditingId(null); setShowModal(false); fetchTodos();
        }
      } else {
        setIsLoading(true);
        const res = await fetch("/api/todo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, status, priority, dueDate, userId: user._id }),
        });
        if (res.ok) {
          setTitle(""); setDescription(""); setDueDate("");
          setShowModal(false); fetchTodos();
        }
      }
    } catch (error) {
      alert("Error saving todo...");
    } finally {
      setIsLoading(false);
    }
  };
  // ──────────────────────────────────────────────────────

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const openAdd = () => {
    setEditingId(null); setTitle(""); setDescription("");
    setStatus("TODO"); setPriority("LOW"); setDueDate("");
    setShowModal(true);
  };

  const activeTodos    = todos.filter(t => t.status !== "COMPLETED");
  const completedTodos = todos.filter(t => t.status === "COMPLETED");
  const upcoming       = [...todos]
    .filter(t => t.dueDate && t.status !== "COMPLETED")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  const inp = (extra = {}) => ({
    width: "100%", background: C.bg, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "10px 13px", fontSize: 13,
    color: C.text, outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.2s, box-shadow 0.2s",
    ...extra,
  });

  if (!user) return null; // Auth guard — avoid flash

  return (
    <>
      <style>{fontLink}</style>
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Sora', sans-serif" }}>

        {/* ── Navbar ── */}
        <nav style={{
          background: C.surface, borderBottom: `1px solid ${C.border}`,
          padding: "0 32px", height: 62,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 40,
        }}>
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

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* User greeting */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.accent}, #e8621f)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 13, color: "#fff",
              }}>
                {user.fname?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: C.muted }}>
                Welcome back, <strong style={{ color: C.text, fontWeight: 600 }}>{user.fname}</strong>
              </span>
            </div>

            <button onClick={openAdd} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 18px", borderRadius: 9, cursor: "pointer",
              background: `linear-gradient(135deg, ${C.accent}, #e8621f)`,
              color: "#fff", border: "none", fontSize: 13, fontWeight: 700,
              boxShadow: `0 4px 16px ${C.accent}44`, transition: "all 0.2s", fontFamily: "inherit",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${C.accent}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 16px ${C.accent}44`; }}
            ><span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Task</button>

            {/* Logout */}
            <LogoutBtn onClick={handleLogout} />
          </div>
        </nav>

        {/* ── Content ── */}
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "36px 24px" }}>

          {/* Stats */}
          <div style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
            <StatCard label="Total Tasks" value={todos.length}           color={C.accent}   icon="📋" />
            <StatCard label="Active"      value={activeTodos.length}     color="#7a9cc4"    icon="⚡" />
            <StatCard label="Completed"   value={completedTodos.length}  color={C.success}  icon="✓" />
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: upcoming.length ? "1fr 268px" : "1fr", gap: 22, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

              {/* Active tasks */}
              <SectionCard
                title="Today's Tasks" subtitle="Active & pending tasks"
                count={activeTodos.length} countColor={C.accent}
                empty={!fetching && activeTodos.length === 0 ? "All caught up! No active tasks 🎉" : null}
              >
                {fetching
                  ? <div style={{ padding: "32px", textAlign: "center", color: C.muted, fontSize: 13 }}>Loading tasks...</div>
                  : activeTodos.map(todo => <TaskRow key={todo._id} todo={todo} onEdit={handleEdit} onDelete={handleDelete} />)
                }
              </SectionCard>

              {/* Completed tasks */}
              {completedTodos.length > 0 && (
                <div style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: 14, overflow: "hidden",
                  borderLeft: `3px solid ${C.success}`,
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 22px", borderBottom: `1px solid ${C.border}`,
                    background: C.successBg,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>✓</span>
                      <div>
                        <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: C.success }}>Completed</h2>
                        <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>Tasks you've finished</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: C.successBg, color: C.success, border: `1px solid ${C.successBdr}` }}>
                      {completedTodos.length}
                    </span>
                  </div>
                  {completedTodos.map(todo => <TaskRow key={todo._id} todo={todo} onEdit={handleEdit} onDelete={handleDelete} completed />)}
                </div>
              )}
            </div>

            {/* Upcoming sidebar */}
            {upcoming.length > 0 && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}` }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: C.text }}>Upcoming Deadlines</h2>
                  <p style={{ fontSize: 12, color: C.muted, margin: "3px 0 0" }}>Sorted by nearest date</p>
                </div>
                {upcoming.map(todo => {
                  const pc   = priorityConfig[todo.priority] || priorityConfig.LOW;
                  const over = isOverdue(todo.dueDate);
                  return (
                    <div key={todo._id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: pc.bg, border: `1px solid ${pc.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 15, flexShrink: 0,
                      }}>📌</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{todo.title}</p>
                        <p style={{ fontSize: 11, color: over ? C.danger : C.muted, margin: "4px 0 0" }}>
                          {over ? "⚠ Overdue · " : "📅 "}{formatDate(todo.dueDate)}
                        </p>
                        <span style={{ display: "inline-block", marginTop: 5, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, color: pc.color, background: pc.bg, border: `1px solid ${pc.border}`, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {todo.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Modal ── */}
        <Modal show={showModal} onClose={handleCancel}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 26px", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>{editingId ? "Edit Task" : "New Task"}</h3>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted }}>{editingId ? "Update task details" : "Fill in the details to create a task"}</p>
            </div>
            <button onClick={handleCancel} style={{
              background: C.surface2, border: `1px solid ${C.border}`,
              color: C.muted, fontSize: 16, cursor: "pointer",
              borderRadius: 8, width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.borderHov; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
            >✕</button>
          </div>
          <form onSubmit={onSubmit} style={{ padding: "22px 26px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 7, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Task Name</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Plan weekend trip" style={inp()}
                onFocus={e => { e.target.style.borderColor = C.accentMid; e.target.style.boxShadow = `0 0 0 3px ${C.accentDim}`; }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 7, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Notes</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add notes or description..." rows={3} style={inp({ resize: "none" })}
                onFocus={e => { e.target.style.borderColor = C.accentMid; e.target.style.boxShadow = `0 0 0 3px ${C.accentDim}`; }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 7, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inp()}
                  onFocus={e => { e.target.style.borderColor = C.accentMid; e.target.style.boxShadow = `0 0 0 3px ${C.accentDim}`; }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 7, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} style={inp()}
                  onFocus={e => e.target.style.borderColor = C.accentMid}
                  onBlur={e => e.target.style.borderColor = C.border}
                >
                  <option value="TODO">Todo</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 9, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Priority</label>
              <div style={{ display: "flex", borderRadius: 9, overflow: "hidden", border: `1px solid ${C.border}` }}>
                {[{ val: "LOW", color: C.success, label: "Low" }, { val: "MEDIUM", color: C.accent, label: "Medium" }, { val: "HIGH", color: C.danger, label: "High" }].map(({ val, color, label }, i) => {
                  const active = priority === val;
                  return (
                    <button key={val} type="button" onClick={() => setPriority(val)} style={{
                      flex: 1, padding: "10px 0", border: "none",
                      borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
                      background: active ? color : "transparent",
                      color: active ? "#fff" : C.muted,
                      fontSize: 13, fontWeight: 700, cursor: "pointer",
                      transition: "all 0.15s", fontFamily: "inherit",
                      boxShadow: active ? `0 4px 12px ${color}44` : "none",
                    }}>{label}</button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="button" onClick={handleCancel} style={{
                flex: 1, padding: "12px", borderRadius: 9, cursor: "pointer",
                background: "transparent", color: C.muted,
                border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surface2; e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.borderHov; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
              >Cancel</button>
              <button type="submit" disabled={isLoading} style={{
                flex: 2, padding: "12px", borderRadius: 9,
                cursor: isLoading ? "not-allowed" : "pointer",
                background: isLoading ? C.dim : `linear-gradient(135deg, ${C.accent}, #e8621f)`,
                color: isLoading ? C.muted : "#fff",
                border: "none", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                boxShadow: isLoading ? "none" : `0 4px 16px ${C.accent}44`, transition: "all 0.2s",
              }}
                onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${C.accent}66`; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isLoading ? "none" : `0 4px 16px ${C.accent}44`; }}
              >
                {isLoading ? "Saving..." : editingId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

function LogoutBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "9px 14px", borderRadius: 9, cursor: "pointer",
        background: hov ? C.dangerBg : "transparent",
        border: `1px solid ${hov ? C.dangerBdr : C.border}`,
        color: hov ? C.danger : C.muted,
        fontSize: 13, fontWeight: 600, fontFamily: "inherit",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 14 }}>⎋</span> Logout
    </button>
  );
}