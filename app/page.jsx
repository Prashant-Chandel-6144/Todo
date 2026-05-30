"use client";

import { useState, useEffect, useRef } from "react";

// ── Themes ─────────────────────────────────────────────────
const DARK = {
  bg:        "#0b0b0b",
  surface:   "#141414",
  surface2:  "#1c1c1c",
  border:    "#242424",
  accent:    "#D55210",
  accentHov: "#e8621f",
  accentDim: "#D5521015",
  accentMid: "#D5521050",
  text:      "#f0ece6",
  muted:     "#6b6560",
  success:   "#4ead72",
  navBg:     "rgba(11,11,11,0.92)",
};
const LIGHT = {
  bg:        "#f5f3f0",
  surface:   "#ffffff",
  surface2:  "#f0ede8",
  border:    "#ddd8d0",
  accent:    "#D55210",
  accentHov: "#e8621f",
  accentDim: "#D5521012",
  accentMid: "#D5521040",
  text:      "#1a1410",
  muted:     "#8a8078",
  success:   "#2e9e58",
  navBg:     "rgba(245,243,240,0.92)",
};

const makeCSS = (C) => `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px #D5521030, 0 4px 14px #D5521055; }
    50%       { box-shadow: 0 0 40px #D5521060, 0 4px 24px #D5521088; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
  .nav-link { transition: color 0.2s; }
  .nav-link:hover { color: ${C.text} !important; }
  .feature-card { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .feature-card:hover { transform: translateY(-6px) scale(1.01) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important; border-color: ${C.border} !important; }
  .pricing-card { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .pricing-card:hover { transform: translateY(-6px) !important; }
  .testimonial-card { transition: all 0.25s ease; }
  .testimonial-card:hover { transform: translateY(-4px); border-color: ${C.border} !important; }
  .step-badge { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
  .step-row:hover .step-badge { transform: scale(1.1); }
  .cta-btn { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important; }
  .cta-btn:hover { transform: translateY(-3px) scale(1.02) !important; }
  .outline-btn { transition: all 0.2s ease; }
  .outline-btn:hover { background: ${C.surface2} !important; border-color: ${C.border} !important; }
  .footer-link { transition: color 0.15s; }
  .footer-link:hover { color: ${C.text} !important; }
  .mock-task { transition: all 0.2s ease; }
  .mock-task:hover { background: ${C.surface2} !important; transform: translateX(4px); }
  .theme-toggle-btn { transition: all 0.25s ease; }
  .theme-toggle-btn:hover { transform: rotate(20deg) scale(1.1); }
`;

// ── Scroll-reveal ──────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Typewriter ─────────────────────────────────────────────
function Typewriter({ words, speed = 90, pause = 1800, C }) {
  const [text, setText] = useState("");
  const [wi, setWi]     = useState(0);
  const [ci, setCi]     = useState(0);
  const [del, setDel]   = useState(false);
  useEffect(() => {
    const word = words[wi];
    let timer;
    if (!del && ci < word.length)      timer = setTimeout(() => { setText(word.slice(0,ci+1)); setCi(ci+1); }, speed);
    else if (!del && ci===word.length) timer = setTimeout(() => setDel(true), pause);
    else if (del && ci > 0)            timer = setTimeout(() => { setText(word.slice(0,ci-1)); setCi(ci-1); }, speed/2);
    else if (del && ci === 0)          { setDel(false); setWi((wi+1)%words.length); }
    return () => clearTimeout(timer);
  }, [ci, del, wi, words, speed, pause]);
  return (
    <span>
      <span style={{ color: C.accent }}>{text}</span>
      <span style={{ animation:"blink 0.8s step-end infinite", color:C.accent }}>|</span>
    </span>
  );
}

// ── Marquee ────────────────────────────────────────────────
function Marquee({ C }) {
  const items = ["⚡ Priority Levels","📅 Due Dates","✓ Status Tracking","🔒 Secure & Private","📊 Task Overview","🚀 Fast & Lightweight","⚡ Priority Levels","📅 Due Dates","✓ Status Tracking","🔒 Secure & Private","📊 Task Overview","🚀 Fast & Lightweight"];
  return (
    <div style={{ overflow:"hidden", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"14px 0", background:C.surface }}>
      <div style={{ display:"flex", animation:"marquee 22s linear infinite", width:"max-content" }}>
        {items.map((item,i) => (
          <span key={i} style={{ fontSize:13, color:C.muted, fontWeight:500, padding:"0 36px", whiteSpace:"nowrap" }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── Feature card ───────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay=0, C }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} className="feature-card" style={{
      background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:16, padding:"28px 26px",
      opacity: visible?1:0, transform: visible?"translateY(0)":"translateY(24px)",
      transition:`opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    }}>
      <div style={{
        width:48, height:48, borderRadius:13,
        background:C.accentDim, border:`1px solid ${C.accentMid}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:22, marginBottom:18,
      }}>{icon}</div>
      <h3 style={{ fontSize:16, fontWeight:700, color:C.text, margin:"0 0 10px", letterSpacing:"-0.02em" }}>{title}</h3>
      <p style={{ fontSize:14, color:C.muted, lineHeight:1.65, margin:0 }}>{desc}</p>
    </div>
  );
}

// ── Step ───────────────────────────────────────────────────
function StepBadge({ n, label, desc, delay=0, C }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} className="step-row" style={{
      display:"flex", gap:20, alignItems:"flex-start",
      opacity:visible?1:0, transform:visible?"translateX(0)":"translateX(-30px)",
      transition:`opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    }}>
      <div className="step-badge" style={{
        width:44, height:44, borderRadius:"50%", flexShrink:0,
        background:`linear-gradient(135deg, ${C.accent}, #e8621f)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontWeight:800, fontSize:16, color:"#fff",
        boxShadow:`0 4px 16px ${C.accent}44`,
      }}>{n}</div>
      <div style={{ paddingTop:4 }}>
        <h4 style={{ fontSize:16, fontWeight:700, color:C.text, margin:"0 0 6px" }}>{label}</h4>
        <p style={{ fontSize:14, color:C.muted, margin:0, lineHeight:1.6 }}>{desc}</p>
      </div>
    </div>
  );
}

// ── Testimonial ────────────────────────────────────────────
function TestimonialCard({ name, role, quote, avatar, delay=0, C }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} className="testimonial-card" style={{
      background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:16, padding:"26px",
      opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(28px)",
      transition:`opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>
      <div style={{ fontSize:24, marginBottom:16, color:C.accent, opacity:0.5 }}>"</div>
      <p style={{ fontSize:14, color:C.muted, lineHeight:1.75, margin:"0 0 20px" }}>{quote}</p>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:"50%", background:avatar, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, color:"#fff" }}>{name[0]}</div>
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:C.text, margin:0 }}>{name}</p>
          <p style={{ fontSize:12, color:C.muted, margin:0 }}>{role}</p>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:2 }}>
          {[1,2,3,4,5].map(s => <span key={s} style={{ color:C.accent, fontSize:12 }}>★</span>)}
        </div>
      </div>
    </div>
  );
}

// ── Pricing card ───────────────────────────────────────────
function PricingCard({ plan, price, desc, features, accent, cta, href, delay=0, C }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} className="pricing-card" style={{
      background: accent ? (C===LIGHT ? `linear-gradient(160deg, #fff5f0, #ffffff)` : `linear-gradient(160deg, #1a120c, #141414)`) : C.surface,
      border:`1px solid ${accent ? C.accentMid : C.border}`,
      borderRadius:18, padding:"32px 28px", flex:1,
      boxShadow: accent ? `0 0 0 1px ${C.accentMid}, 0 24px 60px ${C.accent}18` : "none",
      position:"relative", overflow:"hidden",
      opacity:visible?1:0, transform:visible?"translateY(0) scale(1)":"translateY(30px) scale(0.97)",
      transition:`opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>
      {accent && (
        <div style={{ position:"absolute", top:16, right:16, background:C.accent, color:"#fff", fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, animation:"pulse-glow 2s ease-in-out infinite" }}>POPULAR</div>
      )}
      <p style={{ fontSize:13, fontWeight:600, color:accent?C.accent:C.muted, margin:"0 0 10px", letterSpacing:"0.08em", textTransform:"uppercase" }}>{plan}</p>
      <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:10 }}>
        <span style={{ fontSize:40, fontWeight:900, color:C.text, letterSpacing:"-0.04em" }}>{price}</span>
        {price !== "Free" && <span style={{ fontSize:14, color:C.muted }}>/mo</span>}
      </div>
      <p style={{ fontSize:13, color:C.muted, margin:"0 0 24px", lineHeight:1.6 }}>{desc}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:11, marginBottom:28 }}>
        {features.map((f,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:9 }}>
            <span style={{ color:accent?C.accent:C.success, fontSize:14, fontWeight:700 }}>✓</span>
            <span style={{ fontSize:13, color:C.muted }}>{f}</span>
          </div>
        ))}
      </div>
      <a href={href} className={accent?"cta-btn":"outline-btn"} style={{
        display:"block", textAlign:"center", padding:"13px",
        borderRadius:10, fontWeight:700, fontSize:14, textDecoration:"none",
        background: accent?`linear-gradient(135deg, ${C.accent}, #e8621f)`:"transparent",
        color: accent?"#fff":C.text,
        border: accent?"none":`1px solid ${C.border}`,
        boxShadow: accent?`0 4px 18px ${C.accent}44`:"none",
      }}>{cta}</a>
    </div>
  );
}

// ── FAQ ────────────────────────────────────────────────────
function FAQItem({ q, a, delay=0, C }) {
  const [open, setOpen] = useState(false);
  const [ref, visible]  = useReveal(0.1);
  return (
    <div ref={ref} style={{
      borderBottom:`1px solid ${C.border}`,
      opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(16px)",
      transition:`opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
    }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 0", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
        <span style={{ fontSize:15, fontWeight:600, color:C.text, textAlign:"left" }}>{q}</span>
        <span style={{ fontSize:20, color:C.accent, flexShrink:0, marginLeft:16, transition:"transform 0.3s ease", transform:open?"rotate(45deg)":"rotate(0deg)", display:"inline-block" }}>+</span>
      </button>
      <div style={{ overflow:"hidden", maxHeight:open?"200px":"0px", transition:"max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, paddingBottom:20 }}>{a}</p>
      </div>
    </div>
  );
}

// ── Theme toggle button ────────────────────────────────────
function ThemeToggle({ theme, toggle, C }) {
  return (
    <button className="theme-toggle-btn" onClick={toggle} style={{
      width:38, height:38, borderRadius:10,
      background:C.surface2, border:`1px solid ${C.border}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      cursor:"pointer", fontSize:17, transition:"all 0.2s",
      flexShrink:0,
    }} title={`Switch to ${theme==="dark"?"light":"dark"} mode`}>
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

// ── Navbar ─────────────────────────────────────────────────
function Navbar({ C, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 48px", height:66,
      borderBottom:`1px solid ${scrolled ? C.border : "transparent"}`,
      background: scrolled ? C.navBg : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      position:"fixed", top:0, left:0, right:0, zIndex:50,
      transition:"all 0.3s ease",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:32 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", color:"inherit" }}>
          <div style={{
            width:34, height:34, borderRadius:10,
            background:`linear-gradient(135deg, ${C.accent}, #ff7c3a)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:900, fontSize:16, color:"#fff",
            animation:"pulse-glow 3s ease-in-out infinite",
          }}>T</div>
          <span style={{ fontWeight:800, fontSize:18, letterSpacing:"-0.03em", color:C.text }}>
            Task<span style={{ color:C.accent }}>Board</span>
          </span>
        </a>
        <div style={{ display:"flex", gap:28 }}>
          {[["Features","#features"],["How it works","#how"],["Pricing","#pricing"],["FAQ","#faq"]].map(([label,href]) => (
            <a key={label} href={href} className="nav-link" style={{ fontSize:14, color:C.muted, textDecoration:"none", fontWeight:500 }}>{label}</a>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <ThemeToggle theme={theme} toggle={toggleTheme} C={C} />
        <a href="/login" className="outline-btn" style={{
          padding:"9px 20px", borderRadius:9, cursor:"pointer",
          background:"transparent", border:`1px solid ${C.border}`,
          color:C.text, fontSize:13, fontWeight:600, textDecoration:"none",
        }}>Log in</a>
        <a href="/signup" className="cta-btn" style={{
          padding:"9px 20px", borderRadius:9,
          background:`linear-gradient(135deg, ${C.accent}, #e8621f)`,
          color:"#fff", fontSize:13, fontWeight:700, textDecoration:"none",
          boxShadow:`0 4px 14px ${C.accent}44`,
        }}>Get Started →</a>
      </div>
    </nav>
  );
}

// ── MAIN ───────────────────────────────────────────────────
export default function LandingPage() {
  const [theme, setTheme] = useState("dark");
  const C = theme === "dark" ? DARK : LIGHT;

  const toggleTheme = () => {
    setTheme(t => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  const [heroRef, heroVisible] = useReveal(0.01);

  return (
    <>
      <style>{makeCSS(C)}</style>
      <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"inherit", transition:"background 0.3s, color 0.3s" }}>

        <Navbar C={C} theme={theme} toggleTheme={toggleTheme} />

        {/* ── HERO ── */}
        <section style={{ padding:"140px 48px 80px", maxWidth:1100, margin:"0 auto", textAlign:"center", position:"relative" }}>
          <div style={{ position:"absolute", top:60, left:"50%", transform:"translateX(-50%)", width:700, height:400, borderRadius:"50%", background:`radial-gradient(ellipse, ${C.accent}20 0%, transparent 65%)`, pointerEvents:"none", filter:"blur(20px)" }} />
          <div style={{ position:"absolute", top:120, left:"8%", width:80, height:80, borderRadius:"50%", background:`${C.accent}18`, border:`1px solid ${C.accent}30`, animation:"float 4s ease-in-out infinite" }} />
          <div style={{ position:"absolute", top:200, right:"6%", width:50, height:50, borderRadius:"50%", background:`${C.success}15`, border:`1px solid ${C.success}30`, animation:"float 5s ease-in-out infinite 1s" }} />
          <div style={{ position:"absolute", bottom:100, left:"15%", width:30, height:30, borderRadius:"50%", background:`#7a9cc420`, border:`1px solid #7a9cc430`, animation:"float 3.5s ease-in-out infinite 0.5s" }} />

          <div ref={heroRef} style={{ opacity:heroVisible?1:0, transform:heroVisible?"translateY(0)":"translateY(30px)", transition:"all 0.7s ease", position:"relative" }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"7px 16px", borderRadius:30,
              background:C.accentDim, border:`1px solid ${C.accentMid}`,
              fontSize:12, color:C.accent, fontWeight:600,
              marginBottom:32, letterSpacing:"0.05em",
              animation:"fadeIn 0.6s ease 0.2s both",
            }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:C.accent, display:"inline-block", animation:"pulse-glow 2s infinite" }} />
              BUILT FOR FOCUSED INDIVIDUALS & TEAMS
            </div>

            <h1 style={{ fontSize:72, fontWeight:900, lineHeight:1.05, letterSpacing:"-0.045em", margin:"0 0 20px", animation:"fadeUp 0.7s ease 0.1s both", color:C.text }}>
              Get things done.<br />
              <Typewriter words={["Stay in control.","Ship faster.","Think clearly.","Focus deeply."]} C={C} />
            </h1>

            <p style={{ fontSize:18, color:C.muted, lineHeight:1.7, maxWidth:520, margin:"0 auto 44px", animation:"fadeUp 0.7s ease 0.3s both" }}>
              TaskBoard keeps your work organized with priorities, deadlines, and status tracking — everything you need, nothing you don't.
            </p>

            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:56, animation:"fadeUp 0.7s ease 0.4s both" }}>
              <a href="/signup" className="cta-btn" style={{
                padding:"15px 32px", borderRadius:12, fontWeight:800, fontSize:15,
                background:`linear-gradient(135deg, ${C.accent}, #e8621f)`,
                color:"#fff", textDecoration:"none",
                boxShadow:`0 6px 24px ${C.accent}50`, letterSpacing:"-0.01em",
              }}>Start for free →</a>
              <a href="/login" className="outline-btn" style={{
                padding:"15px 32px", borderRadius:12, fontWeight:700, fontSize:15,
                background:"transparent", color:C.text, textDecoration:"none",
                border:`1px solid ${C.border}`,
              }}>Log in</a>
            </div>

            <div style={{ display:"flex", justifyContent:"center", gap:56, flexWrap:"wrap", animation:"fadeUp 0.7s ease 0.5s both" }}>
              {[{ display:"12K+", label:"Tasks completed" }, { display:"98%", label:"User satisfaction" }, { display:"3min", label:"Avg setup time" }, { display:"Free", label:"To get started" }].map(({ display, label }) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <p style={{ fontSize:30, fontWeight:900, color:C.accent, letterSpacing:"-0.03em", margin:"0 0 4px" }}>{display}</p>
                  <p style={{ fontSize:13, color:C.muted }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Marquee C={C} />

        {/* ── Dashboard mockup ── */}
        <section style={{ padding:"72px 48px", maxWidth:1100, margin:"0 auto" }}>
          {(() => {
            const [ref, visible] = useReveal(0.1);
            return (
              <div ref={ref} style={{ opacity:visible?1:0, transform:visible?"translateY(0) scale(1)":"translateY(40px) scale(0.97)", transition:"all 0.7s cubic-bezier(0.22,1,0.36,1)" }}>
                <div style={{
                  background:C.surface, border:`1px solid ${C.border}`,
                  borderRadius:20, padding:"28px",
                  boxShadow:`0 40px 100px rgba(0,0,0,0.15), 0 0 0 1px ${C.accentMid}`,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
                    {["#e05252","#e8c44a","#4ead72"].map(c => <div key={c} style={{ width:11, height:11, borderRadius:"50%", background:c }} />)}
                    <div style={{ flex:1, background:C.surface2, borderRadius:6, padding:"6px 12px", fontSize:12, color:C.muted, marginLeft:8 }}>taskboard.app/todos</div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:14 }}>
                    {[{ l:"Total Tasks", v:"24", c:C.accent }, { l:"Active", v:"16", c:"#7a9cc4" }, { l:"Completed", v:"8", c:C.success }].map(({ l,v,c }) => (
                      <div key={l} style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", borderTop:`3px solid ${c}` }}>
                        <p style={{ fontSize:10, color:C.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>{l}</p>
                        <p style={{ fontSize:26, fontWeight:800, color:c, margin:0 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
                    {[
                      { title:"Design the landing page", priority:"HIGH",   status:"TODO",      date:"Jun 2",  color:"#e05252" },
                      { title:"Set up authentication",   priority:"MEDIUM", status:"PENDING",   date:"Jun 5",  color:C.accent  },
                      { title:"Write API documentation", priority:"LOW",    status:"COMPLETED", date:"May 30", color:C.success },
                    ].map((t,i) => (
                      <div key={i} className="mock-task" style={{
                        display:"flex", alignItems:"center", gap:14, padding:"13px 18px",
                        borderBottom: i<2?`1px solid ${C.border}`:"none",
                        opacity: t.status==="COMPLETED"?0.5:1, background:"transparent",
                      }}>
                        <span style={{ width:8, height:8, borderRadius:"50%", background:t.color, flexShrink:0, boxShadow:`0 0 6px ${t.color}80` }} />
                        <span style={{ flex:1, fontSize:13, fontWeight:600, color:C.text, textDecoration:t.status==="COMPLETED"?"line-through":"none" }}>{t.title}</span>
                        <span style={{ fontSize:11, color:C.muted }}>{t.date}</span>
                        <span style={{ fontSize:10, padding:"3px 8px", borderRadius:5, fontWeight:600, background:t.color+"15", color:t.color, border:`1px solid ${t.color}30` }}>{t.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* ── Features ── */}
        <section id="features" style={{ padding:"80px 48px", maxWidth:1100, margin:"0 auto" }}>
          {(() => {
            const [ref, visible] = useReveal(0.1);
            return (
              <div ref={ref} style={{ textAlign:"center", marginBottom:60, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(24px)", transition:"all 0.6s ease" }}>
                <p style={{ fontSize:13, color:C.accent, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>Features</p>
                <h2 style={{ fontSize:44, fontWeight:900, letterSpacing:"-0.035em", marginBottom:16, color:C.text }}>Everything you need to<br /><span style={{ color:C.accent }}>stay productive</span></h2>
                <p style={{ fontSize:16, color:C.muted, maxWidth:440, margin:"0 auto" }}>Simple, powerful tools that adapt to your workflow — not the other way around.</p>
              </div>
            );
          })()}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:18 }}>
            <FeatureCard icon="⚡" title="Priority Levels"    delay={0}   C={C} desc="Set tasks as High, Medium, or Low priority. Stay focused on what matters most and never miss a critical deadline." />
            <FeatureCard icon="📅" title="Due Dates"          delay={80}  C={C} desc="Assign due dates to every task and see upcoming deadlines at a glance. Overdue tasks are flagged automatically." />
            <FeatureCard icon="✓"  title="Status Tracking"    delay={160} C={C} desc="Move tasks through Todo, Pending, and Completed states. Finished tasks are shown separately so your list stays clean." />
            <FeatureCard icon="🔒" title="Secure by Default"  delay={0}   C={C} desc="Your tasks are private and encrypted. We never share your data or run ads. What's yours stays yours." />
            <FeatureCard icon="⚙"  title="Fast & Lightweight" delay={80}  C={C} desc="No bloat. No slow load times. TaskBoard is built to be instant — your productivity tool shouldn't slow you down." />
            <FeatureCard icon="📊" title="Task Overview"      delay={160} C={C} desc="See a live summary of total, active, and completed tasks at the top of every session. Always know where you stand." />
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how" style={{ padding:"80px 48px", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
            <div>
              {(() => {
                const [ref, visible] = useReveal(0.1);
                return (
                  <div ref={ref} style={{ opacity:visible?1:0, transform:visible?"translateX(0)":"translateX(-30px)", transition:"all 0.6s ease" }}>
                    <p style={{ fontSize:13, color:C.accent, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>How it works</p>
                    <h2 style={{ fontSize:40, fontWeight:900, letterSpacing:"-0.03em", marginBottom:16, lineHeight:1.15, color:C.text }}>Up and running<br /><span style={{ color:C.accent }}>in 3 steps</span></h2>
                    <p style={{ fontSize:15, color:C.muted, lineHeight:1.7, marginBottom:44 }}>No onboarding calls. No setup guides. Just sign up and start managing your tasks immediately.</p>
                  </div>
                );
              })()}
              <div style={{ display:"flex", flexDirection:"column", gap:32 }}>
                <StepBadge n="1" label="Create your account" delay={0}   C={C} desc="Sign up with email. Takes less than 60 seconds." />
                <StepBadge n="2" label="Add your first task"  delay={100} C={C} desc="Hit '+ Add Task', fill in title, priority, and due date." />
                <StepBadge n="3" label="Track & complete"     delay={200} C={C} desc="Mark tasks complete as you go. Completed tasks move to their own section." />
              </div>
            </div>
            {(() => {
              const [ref, visible] = useReveal(0.1);
              return (
                <div ref={ref} style={{ display:"flex", flexDirection:"column", gap:14, opacity:visible?1:0, transform:visible?"translateX(0)":"translateX(30px)", transition:"all 0.6s ease 0.1s" }}>
                  {[
                    { icon:"📋", title:"Finish project report", sub:"Due today · HIGH",   color:"#e05252", done:false },
                    { icon:"📌", title:"Team sync at 3 PM",     sub:"Due Jun 3 · MEDIUM", color:C.accent,  done:false },
                    { icon:"✓",  title:"Update dependencies",   sub:"Completed · LOW",    color:C.success, done:true  },
                  ].map((t,i) => (
                    <div key={i} className="mock-task" style={{
                      display:"flex", alignItems:"center", gap:16,
                      background:C.surface, border:`1px solid ${t.done?C.success+"30":C.border}`,
                      borderRadius:14, padding:"18px 20px",
                      opacity:t.done?0.6:1, borderLeft:`3px solid ${t.color}`,
                    }}>
                      <span style={{ fontSize:22 }}>{t.icon}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:"0 0 4px", textDecoration:t.done?"line-through":"none" }}>{t.title}</p>
                        <p style={{ fontSize:12, color:C.muted, margin:0 }}>{t.sub}</p>
                      </div>
                      <span style={{ fontSize:11, padding:"4px 10px", borderRadius:6, background:t.color+"15", color:t.color, fontWeight:700, border:`1px solid ${t.color}30` }}>
                        {t.done?"DONE":"ACTIVE"}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section style={{ padding:"80px 48px", maxWidth:1100, margin:"0 auto" }}>
          {(() => {
            const [ref, visible] = useReveal(0.1);
            return (
              <div ref={ref} style={{ textAlign:"center", marginBottom:56, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(24px)", transition:"all 0.5s ease" }}>
                <p style={{ fontSize:13, color:C.accent, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>Testimonials</p>
                <h2 style={{ fontSize:40, fontWeight:900, letterSpacing:"-0.03em", color:C.text }}>Loved by <span style={{ color:C.accent }}>focused people</span></h2>
              </div>
            );
          })()}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            <TestimonialCard name="Arjun Mehta" role="Freelance Developer" avatar="#D55210" delay={0}   C={C} quote="Finally a todo app that doesn't get in the way. The priority system + due dates is exactly what I needed." />
            <TestimonialCard name="Sara Kim"    role="Product Manager"    avatar="#7a9cc4" delay={100} C={C} quote="I love that completed tasks are kept separate. My active list stays clean and I can see my wins without clutter." />
            <TestimonialCard name="Luca Ricci"  role="Startup Founder"    avatar="#4ead72" delay={200} C={C} quote="Set it up in under 2 minutes. The dashboard overview keeps me grounded every morning." />
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" style={{ padding:"80px 48px", borderTop:`1px solid ${C.border}`, maxWidth:1100, margin:"0 auto" }}>
          {(() => {
            const [ref, visible] = useReveal(0.1);
            return (
              <div ref={ref} style={{ textAlign:"center", marginBottom:56, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(24px)", transition:"all 0.5s ease" }}>
                <p style={{ fontSize:13, color:C.accent, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>Pricing</p>
                <h2 style={{ fontSize:40, fontWeight:900, letterSpacing:"-0.03em", marginBottom:14, color:C.text }}>Simple, honest <span style={{ color:C.accent }}>pricing</span></h2>
                <p style={{ fontSize:15, color:C.muted }}>No hidden fees. No surprise upgrades. Start free, grow when you're ready.</p>
              </div>
            );
          })()}
          <div style={{ display:"flex", gap:18, alignItems:"stretch" }}>
            <PricingCard plan="Starter" price="Free" delay={0}   C={C} desc="Perfect for individuals getting started." cta="Get started free" href="/signup" features={["Up to 50 tasks","Priority levels","Due dates","Status tracking","Dashboard overview"]} />
            <PricingCard plan="Pro"     price="$5"   delay={100} C={C} desc="For power users who want more."          cta="Start Pro →"     href="/signup" accent features={["Unlimited tasks","Everything in Starter","Task labels & filters","Data export","Priority support"]} />
            <PricingCard plan="Team"    price="$12"  delay={200} C={C} desc="Collaborate with your whole team."       cta="Contact us"      href="#"       features={["Everything in Pro","Team workspaces","Shared task boards","Admin controls","SSO & security"]} />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ padding:"80px 48px", borderTop:`1px solid ${C.border}`, maxWidth:760, margin:"0 auto" }}>
          {(() => {
            const [ref, visible] = useReveal(0.1);
            return (
              <div ref={ref} style={{ textAlign:"center", marginBottom:52, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(24px)", transition:"all 0.5s ease" }}>
                <p style={{ fontSize:13, color:C.accent, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>FAQ</p>
                <h2 style={{ fontSize:40, fontWeight:900, letterSpacing:"-0.03em", color:C.text }}>Common <span style={{ color:C.accent }}>questions</span></h2>
              </div>
            );
          })()}
          <FAQItem q="Is TaskBoard really free?"      delay={0}   C={C} a="Yes — the Starter plan is completely free with no credit card required. You get up to 50 tasks, priority levels, due dates, and status tracking." />
          <FAQItem q="Do I need to install anything?" delay={80}  C={C} a="No. TaskBoard is a web app — just sign up and start using it in your browser instantly. No downloads, no extensions needed." />
          <FAQItem q="Is my data secure?"             delay={160} C={C} a="Yes. Your tasks are only visible to you and are stored securely. We never share or sell your data, and we don't run ads." />
          <FAQItem q="Can I use it on mobile?"        delay={240} C={C} a="TaskBoard works in any modern browser including on mobile. A dedicated mobile app is on our roadmap." />
          <FAQItem q="Can I export my tasks?"         delay={320} C={C} a="Data export is available on the Pro plan. You can export your tasks as CSV or JSON at any time." />
        </section>

        {/* ── CTA Banner ── */}
        {(() => {
          const [ref, visible] = useReveal(0.1);
          return (
            <section style={{ padding:"0 48px 100px", maxWidth:1100, margin:"0 auto" }}>
              <div ref={ref} style={{
                background: theme==="dark" ? `linear-gradient(135deg, #1a0f08, #141414)` : `linear-gradient(135deg, #fff5f0, #ffffff)`,
                border:`1px solid ${C.accentMid}`,
                borderRadius:22, padding:"72px 48px", textAlign:"center",
                boxShadow:`0 0 80px ${C.accent}12`,
                position:"relative", overflow:"hidden",
                opacity:visible?1:0, transform:visible?"translateY(0) scale(1)":"translateY(30px) scale(0.98)",
                transition:"all 0.7s cubic-bezier(0.22,1,0.36,1)",
              }}>
                <div style={{ position:"absolute", top:-80, left:"50%", transform:"translateX(-50%)", width:600, height:250, background:`radial-gradient(ellipse, ${C.accent}18 0%, transparent 70%)`, pointerEvents:"none", filter:"blur(10px)" }} />
                <h2 style={{ fontSize:48, fontWeight:900, letterSpacing:"-0.04em", marginBottom:18, position:"relative", color:C.text }}>
                  Ready to <span style={{ color:C.accent }}>take control</span>?
                </h2>
                <p style={{ fontSize:17, color:C.muted, marginBottom:40, position:"relative" }}>
                  Join thousands of people who ship more by thinking less about their task list.
                </p>
                <a href="/signup" className="cta-btn" style={{
                  display:"inline-block", padding:"16px 44px", borderRadius:13,
                  background:`linear-gradient(135deg, ${C.accent}, #e8621f)`,
                  color:"#fff", fontWeight:800, fontSize:16, textDecoration:"none",
                  boxShadow:`0 6px 28px ${C.accent}55`, position:"relative", letterSpacing:"-0.01em",
                }}>Create your free account →</a>
              </div>
            </section>
          );
        })()}

        {/* ── Footer ── */}
        <footer style={{ borderTop:`1px solid ${C.border}`, padding:"36px 48px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:`linear-gradient(135deg, ${C.accent}, #ff7c3a)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, color:"#fff" }}>T</div>
              <span style={{ fontWeight:700, fontSize:15, letterSpacing:"-0.02em", color:C.text }}>Task<span style={{ color:C.accent }}>Board</span></span>
            </div>
            <p style={{ fontSize:13, color:C.muted }}>© 2025 TaskBoard. Built with ♥</p>
            <div style={{ display:"flex", gap:24 }}>
              {["Privacy","Terms","Contact"].map(l => (
                <a key={l} href="#" className="footer-link" style={{ fontSize:13, color:C.muted, textDecoration:"none" }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}