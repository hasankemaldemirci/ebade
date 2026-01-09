"use client";

import Link from "next/link";
import { Zap, Leaf, Clock, ArrowLeft, Play } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function PlaygroundPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [legacyTokens, setLegacyTokens] = useState(0);
  const [legacyTime, setLegacyTime] = useState(0);
  const [ebadeTime, setEbadeTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Refs for auto-scroll
  const processingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on phase change
  useEffect(() => {
    if (phase === 1 && processingRef.current) {
      processingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (phase === 3 && statsRef.current) {
      setTimeout(() => {
        statsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [phase]);

  const runSimulation = () => {
    setIsRunning(true);
    setPhase(1);
    setLegacyTokens(0);
    setLegacyTime(0);
    setEbadeTime(null);
    startTimeRef.current = Date.now();

    // ebade finishes almost instantly (500ms)
    setTimeout(() => {
      setEbadeTime(1.51);
    }, 500);

    // Legacy AI burns tokens slowly + track time
    let tokens = 0;
    const legacyInterval = setInterval(() => {
      tokens += Math.floor(Math.random() * 150) + 50;
      setLegacyTokens(tokens);
      setLegacyTime((Date.now() - startTimeRef.current) / 1000);
      if (tokens >= 4200) {
        clearInterval(legacyInterval);
        setPhase(3);
        setIsRunning(false);
      }
    }, 100);
  };

  return (
    <div
      className="page-wrapper"
      style={{ background: "#000", minHeight: "100vh" }}
    >
      <nav className="full-nav" style={{ background: "rgba(0,0,0,0.8)" }}>
        <Link href="/" className="logo" style={{ color: "#fff" }}>
          ebade<span>.dev</span>
        </Link>
        <Link
          href="/"
          style={{
            color: "var(--text-dim)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      <main style={{ paddingTop: "8rem" }}>
        <section
          className="section-container"
          style={{ textAlign: "center", paddingBottom: "4rem" }}
        >
          <div className="badge-accent">Agentic Simulation</div>
          <h2
            style={{
              color: "#fff",
              fontSize: "3rem",
              fontWeight: 900,
              letterSpacing: "-2px",
              marginBottom: "1rem",
            }}
          >
            One Prompt,{" "}
            <span style={{ color: "var(--primary)" }}>Two Paths</span>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              maxWidth: "600px",
              margin: "0 auto 2rem",
            }}
          >
            You ask an AI agent to build something. Watch how{" "}
            <strong style={{ color: "#ef4444" }}>Legacy AI</strong> and{" "}
            <strong style={{ color: "var(--accent-emerald)" }}>
              ebade-powered Agent
            </strong>{" "}
            handle the same request.
          </p>

          {/* The Single Prompt */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(16,185,129,0.15))",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "16px",
              padding: "1.5rem 2rem",
              maxWidth: "600px",
              margin: "0 auto 3rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              👤 User Prompt to AI Agent
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: "1.3rem",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              "Build me a premium pricing table with 3 tiers"
            </div>
          </div>

          {!isRunning && phase === 0 && (
            <button
              onClick={runSimulation}
              className="btn-glow"
              style={{
                cursor: "pointer",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Play size={18} /> Run Both Agents
            </button>
          )}
        </section>

        {/* Two Paths Diverge */}
        <section
          ref={processingRef}
          className="section-container"
          style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              ⚡ Agent Processing
            </span>
          </div>

          <div className="comparison-modern">
            {/* Legacy AI Path */}
            <div
              className="code-card"
              style={{
                borderColor:
                  phase >= 1 ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.2)",
              }}
            >
              <div className="card-header">
                <div className="window-controls">
                  <span className="control close"></span>
                  <span className="control minimize"></span>
                  <span className="control maximize"></span>
                </div>
                <div className="card-tag" style={{ color: "#ef4444" }}>
                  Legacy AI Agent
                </div>
              </div>
              <pre style={{ padding: "1.5rem", minHeight: "200px" }}>
                {phase === 0 && (
                  <code
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {`// Waiting for prompt...
// Will generate code directly
// Token-intensive approach`}
                  </code>
                )}
                {phase >= 1 && (
                  <div>
                    <code
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.7rem",
                        display: "block",
                        marginBottom: "1rem",
                      }}
                    >
                      {`// Generating 140 lines of React...
// Burning tokens on every character...`}
                    </code>
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                      <div
                        style={{
                          fontSize: "2.5rem",
                          fontWeight: 900,
                          color: "#ef4444",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {legacyTokens.toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.5)",
                          marginTop: "0.25rem",
                        }}
                      >
                        tokens burned
                      </div>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "#f97316",
                          fontFamily: "var(--font-mono)",
                          marginTop: "0.75rem",
                        }}
                      >
                        {legacyTime.toFixed(1)}s elapsed
                      </div>
                      {phase === 1 && (
                        <div
                          style={{
                            marginTop: "0.75rem",
                            color: "#ef4444",
                            fontSize: "0.7rem",
                          }}
                        >
                          ⏳ Still generating...
                        </div>
                      )}
                      {phase >= 2 && (
                        <div
                          style={{
                            marginTop: "0.75rem",
                            color: "#ef4444",
                            fontSize: "0.7rem",
                          }}
                        >
                          ⚠️ Done. Risk of hallucinations.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </pre>
            </div>

            <div className="transform-arrow">
              <Zap size={24} />
            </div>

            {/* ebade Agent Path */}
            <div className="code-card ebade">
              <div className="card-header">
                <div className="window-controls">
                  <span className="control close"></span>
                  <span className="control minimize"></span>
                  <span className="control maximize"></span>
                </div>
                <div
                  className="card-tag"
                  style={{ color: "var(--accent-emerald)" }}
                >
                  ebade-Powered Agent
                </div>
              </div>
              <pre style={{ padding: "1.5rem", minHeight: "200px" }}>
                {phase === 0 && (
                  <code
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {`// Waiting for prompt...
// Will map intent → YAML → Code
// Zero-token code generation`}
                  </code>
                )}
                {phase >= 1 && ebadeTime === null && (
                  <code
                    style={{
                      color: "var(--accent-emerald)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {`// Mapping intent...
components:
  - pricing-table`}
                  </code>
                )}
                {ebadeTime !== null && (
                  <div>
                    <code
                      style={{
                        color: "var(--accent-emerald)",
                        fontSize: "0.7rem",
                        display: "block",
                        marginBottom: "1rem",
                      }}
                    >
                      {`// Intent: pricing-table ✓
// Template loaded from disk`}
                    </code>
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                      <div
                        style={{
                          fontSize: "2.5rem",
                          fontWeight: 900,
                          color: "var(--accent-emerald)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {ebadeTime}ms
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.5)",
                          marginTop: "0.25rem",
                        }}
                      >
                        ✓ Done!
                      </div>
                      <div
                        style={{
                          marginTop: "0.75rem",
                          color: "var(--accent-emerald)",
                          fontSize: "0.7rem",
                        }}
                      >
                        0 tokens. 100% deterministic.
                      </div>
                    </div>
                  </div>
                )}
              </pre>
            </div>
          </div>
        </section>

        {/* Stats */}
        {phase === 3 && (
          <section
            ref={statsRef}
            className="section-container"
            style={{ paddingTop: "4rem", paddingBottom: "8rem" }}
          >
            {/* Output Comparison - First */}
            <div>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                  }}
                >
                  📦 Compare the Generated Code
                </span>
              </div>

              <div className="comparison-modern">
                {/* Legacy AI Output */}
                <div
                  className="code-card"
                  style={{ borderColor: "rgba(239,68,68,0.3)" }}
                >
                  <div className="card-header">
                    <div className="window-controls">
                      <span className="control close"></span>
                      <span className="control minimize"></span>
                      <span className="control maximize"></span>
                    </div>
                    <div className="card-tag" style={{ color: "#ef4444" }}>
                      Legacy AI Output
                    </div>
                  </div>
                  <pre
                    style={{
                      padding: "1rem",
                      fontSize: "0.65rem",
                      lineHeight: "1.4",
                      maxHeight: "180px",
                      overflow: "auto",
                    }}
                  >
                    <code style={{ color: "rgba(255,255,255,0.6)" }}>
                      {`function Pricing() {
  return (
    <div style={{display: 'flex'}}>
      <div style={{border: '1px solid gray'}}>
        <h3>Free</h3>
        <p>$0/mo</p>
        <button>Sign Up</button>
      </div>
      <div style={{border: '1px solid blue'}}>
        <h3>Pro</h3>
        <p>$29/mo</p>
        <button>Get Started</button>
      </div>
      <div style={{border: '1px solid gray'}}>
        <h3>Enterprise</h3>
        <p>Custom</p>
        <button>Contact Us</button>
      </div>
    </div>
  )
}`}
                    </code>
                  </pre>
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      fontSize: "0.65rem",
                      color: "#ef4444",
                    }}
                  >
                    ⚠️ No design system · Inline styles · No types · No
                    accessibility
                  </div>
                </div>

                <div className="transform-arrow">
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    vs
                  </span>
                </div>

                {/* ebade Output */}
                <div className="code-card ebade">
                  <div className="card-header">
                    <div className="window-controls">
                      <span className="control close"></span>
                      <span className="control minimize"></span>
                      <span className="control maximize"></span>
                    </div>
                    <div
                      className="card-tag"
                      style={{ color: "var(--accent-emerald)" }}
                    >
                      ebade Output (Shadcn)
                    </div>
                  </div>
                  <pre
                    style={{
                      padding: "1rem",
                      fontSize: "0.65rem",
                      lineHeight: "1.4",
                      maxHeight: "180px",
                      overflow: "auto",
                    }}
                  >
                    <code style={{ color: "rgba(255,255,255,0.8)" }}>
                      {`import { cn } from "@/lib/utils";

export function PricingTable() {
  const plans = [
    { name: "Starter", price: "$0", popular: false },
    { name: "Pro", price: "$29", popular: true },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <div className={cn(
          "p-8 rounded-2xl border transition-all",
          plan.popular && "border-primary"
        )}>
          ...
        </div>
      ))}
    </div>
  );
}`}
                    </code>
                  </pre>
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderTop: "1px solid rgba(16,185,129,0.2)",
                      fontSize: "0.65rem",
                      color: "var(--accent-emerald)",
                    }}
                  >
                    ✓ Shadcn tokens · Tailwind CSS · TypeScript · Responsive ·
                    Accessible
                  </div>
                </div>
              </div>
            </div>

            {/* Stats - Final Takeaway */}
            <div
              className="stats-box"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                marginTop: "3rem",
              }}
            >
              <div className="stat">
                <div className="stat-icon">
                  <Zap size={32} />
                </div>
                <span className="val" style={{ color: "#fff" }}>
                  ~{legacyTokens.toLocaleString()}
                </span>
                <span className="label">Tokens Saved</span>
              </div>
              <div
                className="stat-divider"
                style={{ background: "rgba(255,255,255,0.1)" }}
              ></div>
              <div className="stat">
                <div className="stat-icon">
                  <Clock size={32} />
                </div>
                <span className="val" style={{ color: "#fff" }}>
                  {ebadeTime && legacyTime
                    ? `${Math.round((legacyTime * 1000) / ebadeTime)}x`
                    : "—"}
                </span>
                <span className="label">Faster</span>
              </div>
              <div
                className="stat-divider"
                style={{ background: "rgba(255,255,255,0.1)" }}
              ></div>
              <div className="stat">
                <div
                  className="stat-icon"
                  style={{ color: "var(--accent-emerald)" }}
                >
                  <Leaf size={32} />
                </div>
                <span className="val" style={{ color: "#fff" }}>
                  ~99%
                </span>
                <span className="label">Less Energy</span>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <button
                onClick={() => {
                  setPhase(0);
                  setLegacyTokens(0);
                  setLegacyTime(0);
                  setEbadeTime(null);
                }}
                className="btn-minimal"
                style={{
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                }}
              >
                Run Again
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
