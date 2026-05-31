"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const C = {
  bg:        "#0b0b0b",
  surface:   "#141414",
  surface2:  "#1c1c1c",
  border:    "#242424",
  borderHov: "#333",
  accent:    "#D55210",
  accentDim: "#D5521015",
  accentMid: "#D5521050",
  text:      "#f0ece6",
  muted:     "#6b6560",
  danger:    "#e05252",
};

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function Field({ label, type = "text", placeholder, value, onChange, error, rightLabel }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow]       = useState(false);
  const isPassword = type === "password";
  const inputType  = isPassword ? (show ? "text" : "password") : type;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
        <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>
        {rightLabel}
      </div>
      <div style={{ position: "relative" }}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", background: C.bg,
            border: `1px solid ${error ? C.danger : focused ? C.accentMid : C.border}`,
            borderRadius: 9, padding: isPassword ? "11px 42px 11px 14px" : "11px 14px",
            fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box",
            fontFamily: "inherit", transition: "all 0.2s",
            boxShadow: focused ? `0 0 0 3px ${error ? "#e0525218" : C.accentDim}` : "none",
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)} style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: show ? C.accent : C.muted, padding: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = C.accent}
            onMouseLeave={e => e.currentTarget.style.color = show ? C.accent : C.muted}
          >{show ? <EyeOff /> : <EyeOpen />}</button>
        )}
      </div>
      {error && <p style={{ fontSize: 11, color: C.danger, marginTop: 5 }}>{error}</p>}
    </div>
  );
}

function OAuthBtn({ icon, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => alert(`${label} OAuth coming soon!`)}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, padding: "11px", borderRadius: 9, cursor: "pointer",
        background: hov ? C.surface2 : C.bg, border: `1px solid ${hov ? C.borderHov : C.border}`,
        color: C.text, fontSize: 13, fontWeight: 600, fontFamily: "inherit",
        transition: "all 0.15s", transform: hov ? "translateY(-1px)" : "none",
      }}
    ><span style={{ fontSize: 16 }}>{icon}</span> {label}</button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]           = useState({ email: "", password: "" });
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [serverError, setServerError] = useState("");

  const update = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: "" })); setServerError(""); };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setServerError("");
    try {
      const res = await fetch("/api/user/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.message || "Login failed"); return; }
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/todos");
    } catch { setServerError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 62, borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${C.accent}, #ff7c3a)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: "#fff", boxShadow: `0 4px 14px ${C.accent}55` }}>T</div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em", color: C.text }}>Task<span style={{ color: C.accent }}>Board</span></span>
        </a>
        <p style={{ fontSize: 13, color: C.muted }}>Don't have an account?{" "}<a href="/signup" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Sign up free</a></p>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, borderRadius: 15, margin: "0 auto 18px", background: `linear-gradient(135deg, ${C.accent}, #ff7c3a)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: `0 8px 24px ${C.accent}44` }}>T</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>Log in to your TaskBoard account</p>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "32px 32px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
              <OAuthBtn icon="G" label="Google" />
              <OAuthBtn icon="⌥" label="GitHub" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontSize: 12, color: C.muted }}>or continue with email</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>

            {serverError && (
              <div style={{ background: "#e0525212", border: `1px solid #e0525240`, borderRadius: 9, padding: "12px 14px", marginBottom: 18, fontSize: 13, color: C.danger, display: "flex", alignItems: "center", gap: 8 }}>
                <span>⚠</span> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Email" type="email" placeholder="alex@example.com" value={form.email} onChange={update("email")} error={errors.email} />
              <Field label="Password" type="password" placeholder="Enter your password" value={form.password} onChange={update("password")} error={errors.password}
                rightLabel={<a href="#" style={{ fontSize: 12, color: C.accent, textDecoration: "none", fontWeight: 500 }}>Forgot password?</a>}
              />
              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "13px", marginTop: 4, borderRadius: 10,
                cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "#222" : `linear-gradient(135deg, ${C.accent}, #e8621f)`,
                color: loading ? C.muted : "#fff", border: "none",
                fontSize: 14, fontWeight: 700, fontFamily: "inherit",
                boxShadow: loading ? "none" : `0 4px 18px ${C.accent}44`, transition: "all 0.2s",
              }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 24px ${C.accent}66`; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : `0 4px 18px ${C.accent}44`; }}
              >{loading ? "Logging in..." : "Log In →"}</button>
            </form>

            <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 18 }}>
              Don't have an account?{" "}<a href="/signup" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Sign up free</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}