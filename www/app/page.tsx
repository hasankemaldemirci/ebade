"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import {
  Cpu,
  Github,
  Zap,
  Brain,
  Leaf,
  Code2,
  Layers,
  Terminal,
  Fingerprint,
  Target,
} from "lucide-react";
import pkg from "../package.json";
const version = pkg.version;

// Dynamically import Three.js canvas to avoid SSR issues
const ThreeCanvas = dynamic(() => import("@/components/ThreeCanvas"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <div className="page-wrapper">
        <ThreeCanvas />
        <div className="bg-glow"></div>
        <Navbar />

        <main>
          {/* Hero Section */}
          <section className="hero-full">
            <div className="hero-grid">
              <div className="hero-content">
                <div className="badge-modern">
                  <Cpu className="icon-small" size={14} />
                  Protocol {version} // Alpha
                </div>
                <h1 className="glitch-text" data-version="1.0.1">
                  Code = f(<span>Intent</span>)
                </h1>
                <p className="hero-description">
                  <span className="ebade-brand">ebade</span> is an evolution in
                  abstract engineering. We don&apos;t build components; we model
                  intent. Designed for the era where <strong>Agents</strong> are
                  the primary developers.
                </p>
                <div className="hero-actions">
                  <a href="#technology" className="btn-glow">
                    Explore Protocol
                  </a>
                  <a
                    href="https://www.npmjs.com/package/ebade"
                    className="btn-minimal"
                  >
                    npm install ebade
                  </a>
                </div>
              </div>

              <div className="hero-visual">
                <div className="visual-glow"></div>
                <div className="video-container">
                  <video className="hero-video" autoPlay loop muted playsInline>
                    <source src="/assets/demo.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section id="technology" className="section-dark">
            <div className="section-container">
              <header className="section-header">
                <div className="badge-accent">Philosophy</div>
                <h2>
                  Agentic <span>Intent</span>
                </h2>
                <p>
                  Why write 100 lines of boilerplate when an agent can infer
                  implementation from 8 lines of pure intent?
                </p>
              </header>

              <div className="comparison-modern">
                {/* ebade Intent (Input) */}
                <div className="code-card ebade">
                  <div className="card-header">
                    <div className="window-controls">
                      <span className="control close"></span>
                      <span className="control minimize"></span>
                      <span className="control maximize"></span>
                    </div>
                    <div className="card-tag">ebade Protocol (Intent)</div>
                  </div>
                  <pre>
                    <code>
                      <span className="keyword">@page</span>(
                      <span className="string">&apos;/products&apos;</span>)
                      {"\n"}
                      <span className="keyword">@intent</span>(
                      <span className="string">
                        &apos;product-catalog&apos;
                      </span>
                      ){"\n"}
                      <span className="keyword">@requires</span>([
                      <span className="string">&apos;products&apos;</span>])
                      {"\n"}
                      <span className="keyword">@compose</span>([
                      <span className="string">&apos;grid&apos;</span>,{" "}
                      <span className="string">&apos;loader&apos;</span>])
                      {"\n"}
                      <span className="keyword">export function</span>{" "}
                      <span className="function">Catalog</span>() {"{}"}
                    </code>
                  </pre>
                </div>

                <div className="transform-arrow">
                  <Zap size={24} />
                </div>

                {/* React Output (Generated Code) */}
                <div className="code-card legacy">
                  <div className="card-header">
                    <div className="window-controls">
                      <span className="control close"></span>
                      <span className="control minimize"></span>
                      <span className="control maximize"></span>
                    </div>
                    <div className="card-tag">Generated: React + Next.js</div>
                  </div>
                  <pre>
                    <code>{`export default function ProductList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/products');
      const json = await res.json();
      setItems(json);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <section className="grid">
      {items.map(p => <Card key={p.id} {...p} />)}
    </section>
  );
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Benchmarks Section */}
          <section id="benchmarks" className="benchmark-minimal">
            <div className="section-container">
              <header
                className="section-header"
                style={{ marginBottom: "4rem" }}
              >
                <div className="badge-accent">Efficiency</div>
                <h2>
                  Proven <span>Performance</span>
                </h2>
                <p
                  style={{
                    margin: "0 auto",
                    color: "var(--text-dim)",
                    maxWidth: "600px",
                  }}
                >
                  Real-world benchmarks demonstrating how ebade slashes
                  operational costs and cognitive load for AI agents.
                </p>
              </header>
              <div className="stats-box">
                <div className="stat">
                  <div className="stat-icon">
                    <Zap size={32} />
                  </div>
                  <span className="val">70%</span>
                  <span className="label">Token Reduction</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <div className="stat-icon">
                    <Brain size={32} />
                  </div>
                  <span className="val">4.1x</span>
                  <span className="label">Agent Context Efficiency</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <div
                    className="stat-icon"
                    style={{ color: "var(--accent-emerald)" }}
                  >
                    <Leaf size={32} />
                  </div>
                  <span className="val">Zero</span>
                  <span className="label">Sustainable AI Core</span>
                </div>
              </div>
            </div>
          </section>

          {/* Agent-Native Stack Section */}
          <section className="agent-stack-section">
            <div className="section-container">
              <header
                className="section-header"
                style={{ marginBottom: "4rem" }}
              >
                <div className="badge-accent">The New Stack</div>
                <h2>
                  The <span>Agent-Native</span> Stack
                </h2>
                <p
                  style={{
                    margin: "0 auto",
                    color: "var(--text-dim)",
                    maxWidth: "600px",
                  }}
                >
                  Defining the three essential layers of high-autonomy software
                  engineering.
                </p>
              </header>

              <div className="stack-container">
                {/* Identity Layer */}
                <div className="stack-node">
                  <div className="stack-node-icon">
                    <Fingerprint size={28} />
                  </div>
                  <div className="stack-node-content">
                    <h4>Layer 01: Identity</h4>
                    <h3>agents.md</h3>
                    <p>
                      Defines the persona, mission, and boundaries of the agent.
                    </p>
                  </div>
                </div>

                <div className="stack-connector"></div>

                {/* Capability Layer */}
                <div className="stack-node">
                  <div className="stack-node-icon">
                    <Zap size={28} />
                  </div>
                  <div className="stack-node-content">
                    <h4>Layer 02: Capability</h4>
                    <h3>MCP / Tools</h3>
                    <p>
                      The arms and legs. Connects LLMs to real-world
                      environments.
                    </p>
                  </div>
                </div>

                <div className="stack-connector"></div>

                {/* Intent Layer */}
                <div className="stack-node intent">
                  <div className="stack-node-icon">
                    <Target size={32} />
                  </div>
                  <div className="stack-node-content">
                    <h4>Layer 03: The Core</h4>
                    <h3>ebade.dev (Intent)</h3>
                    <p>
                      The brain. Transforms abstract intent into production code
                      via a low-entropy protocol.
                    </p>
                    <div className="stack-badge">
                      Deterministic Architecture
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-grid-section">
            <div className="section-container">
              <header className="section-header">
                <div className="badge-accent">Standard</div>
                <h2 style={{ color: "var(--text)" }}>
                  The ebade <span>Ecosystem</span>
                </h2>
                <p style={{ margin: "0 auto", color: "var(--text-dim)" }}>
                  Engineered for high-autonomy agents and complex product
                  lifecycles.
                </p>
              </header>
              <div className="grid-3">
                <div className="feature-item">
                  <Code2 size={40} />
                  <h3>Agent-Native</h3>
                  <p>
                    Designed as a first-class citizen for LLMs. Structured
                    intent that models understand instantly.
                  </p>
                </div>
                <div className="feature-item">
                  <Layers size={40} />
                  <h3>Meta-Abstraction</h3>
                  <p>
                    Platform-agnostic intent layer. Currently optimized for
                    Next.js. The same intent will power mobile, backend, and
                    beyond.
                  </p>
                </div>
                <div className="feature-item">
                  <Terminal size={40} />
                  <h3>Binary Scaffold</h3>
                  <p>
                    Generate full, production-ready project structures from a
                    single schema definition.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-container">
            <div className="footer-brand">
              <div className="footer-logo">🧠 ebade</div>
              <p className="footer-slogan">
                Capture the essence of code.
                <br />
                Less tokens. Less carbon. Same result. 🌱
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#technology">Technology</a>
                <a href="#benchmarks">Benchmarks</a>
                <a
                  href="https://github.com/hasankemaldemirci/ebade/tree/main/examples"
                  target="_blank"
                >
                  Examples
                </a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a
                  href="https://github.com/hasankemaldemirci/ebade"
                  target="_blank"
                >
                  GitHub
                </a>
                <a href="https://www.npmjs.com/package/ebade" target="_blank">
                  npm
                </a>
                <a
                  href="https://github.com/hasankemaldemirci/ebade/blob/main/ROADMAP.md"
                  target="_blank"
                >
                  Roadmap
                </a>
              </div>
              <div className="footer-column">
                <h4>Contact</h4>
                <a href="mailto:hello@ebade.dev">hello@ebade.dev</a>
                <a
                  href="https://github.com/sponsors/hasankemaldemirci"
                  target="_blank"
                >
                  Sponsor 💜
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 ebade. The Agent-First Framework.</p>
            <p className="footer-tagline">
              Code = f(Intent) // Kind to Earth 🌍
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
