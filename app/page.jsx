"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const fontLink = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');`;

const C = {
  bg:        "#0b0b0b",
  surface:   "#141414",
  surface2:  "#1c1c1c",
  border:    "#242424",
  accent:    "#D55210",
  accentHov: "#e8621f",
  accentDim: "#D5521015",
  accentMid: "#D5521050",
  success:   "#4ead72",
  text:      "#f0ece6",
  muted:     "#6b6560",
  dim:       "#2a2a2a",
};

function FeaturePill({ icon, text }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 14px", borderRadius: 30,
      background: C.surface, border: `1px solid ${C.border}`,
      fontSize: 13, color: C.muted,
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span> {text}
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.surface2 : C.surface,
        border: `1px solid ${hov ? "#303030" : C.border}`,
        borderRadius: 16, padding: "28px 26px",
        transition: "all 0.22s",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 16px 48px rgba(0,0,0,0.35)" : "none",
        cursor: "default",
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 12,
        background: C.accentDim, border: `1px solid ${C.accentMid}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, marginBottom: 18,
      }}>{icon}</div>
      <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px", color: C.text }}>{title}</h3>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(135deg, ${C.accent}, #e8621f)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 16, color: "#fff",
        boxShadow: `0 4px 14px ${C.accent}44`,
      }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: C.text }}>{title}</h3>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, name, role, avatar }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: "26px 24px",
    }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ color: C.accent, fontSize: 14 }}>★</span>
        ))}
      </div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: "0 0 20px", fontStyle: "italic" }}>
        "{quote}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, ${avatar}, #ff7c3a)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: "#fff",
        }}>{name[0]}</div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{name}</p>
          <p style={{ fontSize: 11, color: C.muted, margin: "2px 0 0" }}>{role}</p>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ plan, price, desc, features, highlight, onStart }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: highlight ? `linear-gradient(160deg, #1a1008, #141414)` : C.surface,
        border: `1px solid ${highlight ? C.accentMid : hov ? "#303030" : C.border}`,
        borderRadius: 18, padding: "30px 26px", flex: 1,
        position: "relative", overflow: "hidden",
        transform: hov ? "translateY(-4px)" : "none",
        transition: "all 0.22s",
        boxShadow: highlight ? `0 0 0 1px ${C.accentMid}, 0 20px 60px rgba(0,0,0,0.4)` : hov ? "0 16px 48px rgba(0,0,0,0.3)" : "none",
      }}
    >
      {highlight && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: `linear-gradient(135deg, ${C.accent}, #e8621f)`,
          color: "#fff", fontSize: 10, fontWeight: 700,
          padding: "4px 10px", borderRadius: 20, letterSpacing: "0.06em",
        }}>POPULAR</div>
      )}
      <p style={{ fontSize: 12, color: highlight ? C.accent : C.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px" }}>{plan}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 40, fontWeight: 900, color: C.text, letterSpacing: "-0.04em" }}>{price}</span>
        {price !== "Free" && <span style={{ fontSize: 13, color: C.muted }}>/month</span>}
      </div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 24px" }}>{desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ color: highlight ? C.accent : C.success, fontSize: 13, fontWeight: 700 }}>✓</span>
            <span style={{ fontSize: 13, color: C.muted }}>{f}</span>
          </div>
        ))}
      </div>
      <button onClick={onStart} style={{
        width: "100%", padding: "12px", borderRadius: 10,
        cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
        transition: "all 0.2s",
        background: highlight ? `linear-gradient(135deg, ${C.accent}, #e8621f)` : "transparent",
        color: highlight ? "#fff" : C.text,
        border: highlight ? "none" : `1px solid ${C.border}`,
        boxShadow: highlight ? `0 4px 18px ${C.accent}44` : "none",
      }}>
        Get started free →
      </button>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goAuth = (tab = "signup") => router.push(tab === "login" ? "/login" : "/signup");

  return (
    <>
      <style>{fontLink}</style>
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Sora', sans-serif" }}>

        {/* ── Navbar ── */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px", height: 64,
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          background: scrolled ? C.surface : "transparent",
          position: "sticky", top: 0, zIndex: 40,
          transition: "all 0.25s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.accent}, #ff7c3a)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 16, color: "#fff",
              boxShadow: `0 4px 14px ${C.accent}55`,
            }}>T</div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em" }}>
              Task<span style={{ color: C.accent }}>Board</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {["Features", "How it works", "Pricing"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{
                fontSize: 13, color: C.muted, textDecoration: "none", fontWeight: 500, transition: "color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => goAuth("login")} style={{
              padding: "9px 20px", borderRadius: 9, cursor: "pointer",
              background: "transparent", border: `1px solid ${C.border}`,
              color: C.text, fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.surface2; e.currentTarget.style.borderColor = "#3a3a3a"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.border; }}
            >Log in</button>
            <button onClick={() => goAuth("signup")} style={{
              padding: "9px 20px", borderRadius: 9, cursor: "pointer",
              background: `linear-gradient(135deg, ${C.accent}, #e8621f)`,
              border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
              fontFamily: "inherit", boxShadow: `0 4px 14px ${C.accent}44`,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${C.accent}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 14px ${C.accent}44`; }}
            >Get started free</button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section style={{
          maxWidth: 900, margin: "0 auto", padding: "100px 32px 80px",
          textAlign: "center",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 30,
            background: C.accentDim, border: `1px solid ${C.accentMid}`,
            fontSize: 12, color: C.accent, fontWeight: 600,
            marginBottom: 32, letterSpacing: "0.04em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, display: "inline-block" }} />
            NOW IN BETA — FREE TO USE
          </div>

          <h1 style={{
            fontSize: 72, fontWeight: 900, lineHeight: 1.04,
            letterSpacing: "-0.04em", margin: "0 0 26px",
          }}>
            Manage tasks<br />
            <span style={{ color: C.accent }}>without</span> the noise.
          </h1>

          <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 44px" }}>
            TaskBoard keeps your work organized with priorities, deadlines, and status tracking — all in one clean interface.
          </p>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14 }}>
            <button onClick={() => goAuth("signup")} style={{
              padding: "14px 32px", borderRadius: 11, cursor: "pointer",
              background: `linear-gradient(135deg, ${C.accent}, #e8621f)`,
              border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
              fontFamily: "inherit", boxShadow: `0 6px 24px ${C.accent}55`,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 30px ${C.accent}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 6px 24px ${C.accent}55`; }}
            >Create free account →</button>
            <a href="/todos" style={{
              padding: "14px 28px", borderRadius: 11, cursor: "pointer",
              background: "transparent", border: `1px solid ${C.border}`,
              color: C.text, fontSize: 15, fontWeight: 600, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.surface2; e.currentTarget.style.borderColor = "#3a3a3a"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.border; }}
            >View Dashboard</a>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginTop: 52 }}>
            <div style={{ display: "flex" }}>
              {["#D55210", "#e8621f", "#ff7c3a", "#ffaa70", "#ffc49e"].map((c, i) => (
                <div key={i} style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: c, border: "2px solid #0b0b0b",
                  marginLeft: i > 0 ? -10 : 0,
                }} />
              ))}
            </div>
            <p style={{ fontSize: 13, color: C.muted }}>
              <strong style={{ color: C.text }}>1,200+</strong> tasks completed this week by real users
            </p>
          </div>
        </section>

        {/* ── Dashboard Preview ── */}
        <section style={{ maxWidth: 960, margin: "0 auto 100px", padding: "0 32px" }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: "28px",
            boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px ${C.accentMid}`,
            position: "relative", overflow: "hidden",
          }}>
            {/* Glow */}
            <div style={{
              position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
              width: 500, height: 200,
              background: `radial-gradient(ellipse, ${C.accent}22 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />
            {/* Fake header bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
              {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
              ))}
              <div style={{
                flex: 1, height: 28, borderRadius: 6,
                background: C.surface2, border: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", paddingLeft: 12,
                fontSize: 11, color: C.muted,
              }}>taskboard.app/todos</div>
            </div>
            {/* Fake stats */}
            <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Total Tasks", value: "24", color: C.accent },
                { label: "Active", value: "18", color: "#7a9cc4" },
                { label: "Completed", value: "6", color: C.success },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: "14px 18px", position: "relative",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color, borderRadius: "10px 10px 0 0" }} />
                  <p style={{ fontSize: 10, color: C.muted, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
                  <p style={{ fontSize: 26, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>
            {/* Fake tasks */}
            {[
              { title: "Design new landing page", priority: "HIGH", status: "TODO", due: "Jun 2" },
              { title: "Review pull requests", priority: "MEDIUM", status: "PENDING", due: "Jun 3" },
              { title: "Update documentation", priority: "LOW", status: "COMPLETED", due: "May 30" },
            ].map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                background: C.bg, borderRadius: 10, marginBottom: i < 2 ? 10 : 0,
                border: `1px solid ${C.border}`,
                opacity: t.status === "COMPLETED" ? 0.6 : 1,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: t.priority === "HIGH" ? "#e05252" : t.priority === "MEDIUM" ? C.accent : C.success }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text, textDecoration: t.status === "COMPLETED" ? "line-through" : "none" }}>{t.title}</span>
                <span style={{ fontSize: 11, color: C.muted }}>{t.due}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  color: t.status === "COMPLETED" ? C.success : t.status === "PENDING" ? "#c4a55a" : "#7a9cc4",
                  background: t.status === "COMPLETED" ? "#4ead7215" : t.status === "PENDING" ? "#c4a55a15" : "#7a9cc415",
                  border: `1px solid ${t.status === "COMPLETED" ? "#4ead7230" : t.status === "PENDING" ? "#c4a55a30" : "#7a9cc430"}`,
                }}>{t.status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" style={{ maxWidth: 960, margin: "0 auto 100px", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>Features</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 16px" }}>Everything you need,<br />nothing you don't.</h2>
            <p style={{ fontSize: 15, color: C.muted, maxWidth: 420, margin: "0 auto" }}>Designed to get out of your way so you can focus on what actually matters — getting things done.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            <FeatureCard icon="⚡" title="Priority levels" desc="Mark tasks as High, Medium, or Low priority so you always know what needs attention first." />
            <FeatureCard icon="📅" title="Due date tracking" desc="Set deadlines and get visual warnings when tasks are overdue — never miss a beat again." />
            <FeatureCard icon="✓" title="Status management" desc="Move tasks through Todo → Pending → Completed with a single click update." />
            <FeatureCard icon="🔒" title="Private & secure" desc="Your tasks are tied to your account only. Nobody else can see your workspace." />
            <FeatureCard icon="🔍" title="Quick overview" desc="Stats at the top show total, active, and completed tasks at a glance every time you open the app." />
            <FeatureCard icon="📌" title="Upcoming deadlines" desc="A smart sidebar surfaces your nearest due dates so you stay ahead of your workload." />
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" style={{ maxWidth: 960, margin: "0 auto 100px", padding: "0 32px" }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 22, padding: "60px 56px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center",
          }}>
            <div>
              <p style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>How it works</p>
              <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 14px", lineHeight: 1.1 }}>Up and running<br />in 60 seconds.</h2>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>No onboarding calls, no 47-step setup guide. Create an account, add your first task, and you're done.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <StepCard number="1" title="Create your account" desc="Sign up with your email in under 30 seconds. No credit card required." />
              <div style={{ width: 1, height: 20, background: C.border, marginLeft: 20 }} />
              <StepCard number="2" title="Add your tasks" desc="Give each task a title, priority level, due date, and status." />
              <div style={{ width: 1, height: 20, background: C.border, marginLeft: 20 }} />
              <StepCard number="3" title="Stay on top of everything" desc="Your dashboard gives you a live view of what's active, pending, and done." />
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section style={{ maxWidth: 960, margin: "0 auto 100px", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 12px" }}>People actually love it.</h2>
            <p style={{ fontSize: 14, color: C.muted }}>Don't take our word for it.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            <TestimonialCard
              quote="Finally a task manager that doesn't feel like a project management tool for a Fortune 500 company. Clean, fast, simple."
              name="Priya Mehta" role="Freelance Designer" avatar="#D55210"
            />
            <TestimonialCard
              quote="I've tried Notion, Asana, Todoist. TaskBoard is the only one I've actually stuck with for more than a week."
              name="James Okafor" role="Backend Engineer" avatar="#7a9cc4"
            />
            <TestimonialCard
              quote="The priority + deadline combo is exactly what I needed. Overdue warnings keep me honest."
              name="Sara Lindqvist" role="Product Manager" avatar="#4ead72"
            />
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" style={{ maxWidth: 800, margin: "0 auto 100px", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>Pricing</p>
            <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 12px" }}>Simple, honest pricing.</h2>
            <p style={{ fontSize: 14, color: C.muted }}>Start free. Upgrade when it makes sense for you.</p>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <PricingCard
              plan="Free" price="Free"
              desc="Everything you need to get started and stay organized."
              features={["Unlimited tasks", "Priority levels", "Due date tracking", "Status management"]}
              onStart={() => goAuth("signup")}
            />
            <PricingCard
              plan="Pro" price="$5"
              desc="For power users who want more control and insights."
              features={["Everything in Free", "Task analytics", "Recurring tasks", "Export to CSV", "Priority support"]}
              highlight
              onStart={() => goAuth("signup")}
            />
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section style={{ maxWidth: 960, margin: "0 auto 100px", padding: "0 32px" }}>
          <div style={{
            background: `linear-gradient(135deg, #1a0f08, #141414)`,
            border: `1px solid ${C.accentMid}`,
            borderRadius: 22, padding: "60px 56px", textAlign: "center",
            boxShadow: `0 0 80px ${C.accent}15`,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 600, height: 300,
              background: `radial-gradient(ellipse, ${C.accent}12 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 16px" }}>
              Ready to get<br /><span style={{ color: C.accent }}>focused?</span>
            </h2>
            <p style={{ fontSize: 15, color: C.muted, margin: "0 0 36px" }}>Join thousands of people who've simplified the way they work.</p>
            <button onClick={() => goAuth("signup")} style={{
              padding: "16px 40px", borderRadius: 12, cursor: "pointer",
              background: `linear-gradient(135deg, ${C.accent}, #e8621f)`,
              border: "none", color: "#fff", fontSize: 16, fontWeight: 700,
              fontFamily: "inherit", boxShadow: `0 6px 28px ${C.accent}55`,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 36px ${C.accent}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 6px 28px ${C.accent}55`; }}
            >Start for free — no credit card needed →</button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg, ${C.accent}, #ff7c3a)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 13, color: "#fff",
            }}>T</div>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>Task<span style={{ color: C.accent }}>Board</span></span>
            <span style={{ fontSize: 12, color: C.muted, marginLeft: 8 }}>© 2025 All rights reserved.</span>
          </div>
          <div style={{ display: "flex", gap: 22 }}>
            {["Privacy", "Terms", "Contact"].map(link => (
              <a key={link} href="#" style={{ fontSize: 13, color: C.muted, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >{link}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}