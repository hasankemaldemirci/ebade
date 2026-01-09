# ebade: The Agent-First Protocol 🧠🌱

![ebade - The First Agent-First Framework](https://ebade.dev/og-readme.png)

[![npm version](https://img.shields.io/npm/v/ebade.svg)](https://www.npmjs.com/package/ebade)
[![Website](https://img.shields.io/badge/Website-ebade.dev-4F46E5)](https://ebade.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP Server](https://img.shields.io/badge/MCP-Ready-green.svg)](./packages/mcp-server)
[![Green AI](https://img.shields.io/badge/🌱_Green_AI-70%25_Less_Tokens-brightgreen)](./docs/GREEN-AI.md)
[![Architecture](https://img.shields.io/badge/Architecture-First_Principles-black)](./ARCHITECTURE.md)

> **"Code is a legacy byproduct. Intent is the source of truth."**

**ebade** is not just another framework. It is a **compilation protocol** designed for an era where AI Agents are the primary developers. It shifts the paradigm from "Human-Centric Coding" to "Agentic Intent Modeling."

---

## 🎬 The Power of Intent

Watch how **ebade** transforms 20 lines of YAML into a production-ready, full-stack Next.js application.

![ebade demo](./assets/demo.gif)

### ⚔️ The Battle of Entropy

| Legacy Coding (High Entropy) | ebade Protocol (Low Entropy) |
| :--- | :--- |
| **"Write me a dashboard..."** | **"@intent('saas-dashboard')"** |
| AI guesses folders, imports, and state. | ebade enforces architecture. |
| 1,500+ tokens burned (Noise). | **<250 tokens** used (Pure Signal). |
| Hallucinations likely. | **Deterministic** output. |

---

## 🛠️ The Syntax (Cheat Sheet)

ebade uses a high-density decorator syntax designed to fit within an Agent's context window.

| Decorator | Purpose | Example |
| :--- | :--- | :--- |
| `@page` | Defines routes & paths | `@page('/dashboard')` |
| `@intent` | The "What" of the logic | `@intent('user-auth')` |
| `@requires` | Data & Auth dependencies | `@requires(['user', 'db'])` |
| `@compose` | Intent orchestration | `@compose(['header', 'list'])` |
| `@outcomes` | Result handlers & UI | `@outcomes({ success: '/dashboard' })` |
| `@expects` | **Tests as Specification** | `@expects([{ scenario: 'happy-path' }])` |

📖 [Full Syntax Specification](./SYNTAX.md)

---

## 🚀 Quick Start

### 1. For Agents (MCP)

Add `ebade` to your AI agent (Claude, Cursor, Windsurf) via the Model Context Protocol:

```json
{
  "mcpServers": {
    "ebade": {
      "command": "npx",
      "args": ["-y", "@ebade/mcp-server"]
    }
  }
}
```

### 2. For Humans (CLI)

```bash
# Scaffold a full project from an intent file
npx ebade scaffold examples/saas-dashboard.ebade.yaml ./my-app
```

---

## 🏗️ Architecture: First Principles

ebade operates on the principle of **The Online Compiler**. It treats AI as a deterministic component of the toolchain, not a creative oracle.

- **Standardized Intent Tree (SIT):** Parses YAML/TS into a logical graph.
- **Target Adapters:** Compiles intent into Next.js, Flutter, or Svelte (0-token boilerplate).
- **AgentRules:** Automatically generates `.cursorrules` and `.clauderules` to keep your agent aligned.

🏗️ [Explore the Architecture](./ARCHITECTURE.md)

---

## 📊 Benchmark: ~70% Fewer Tokens

| Task | Legacy (Next.js) | ebade (Protocol) | Savings |
| :--- | :--- | :--- | :--- |
| **SaaS Dashboard** ⭐ | 1,850 tokens | **245 tokens** | **86.8%** |
| Checkout Flow | 258 tokens | **66 tokens** | **74.4%** |
| Product Grid | 133 tokens | **63 tokens** | **52.6%** |

> "The greenest code is the code you don't generate." 🌱

---

## 📦 Project Structure

- **`www/`**: The [ebade.dev](https://ebade.dev) landing page & playground.
- **`packages/mcp-server/`**: The bridge for AI agents.
- **`cli/`**: The core scaffolding engine.
- **`examples/`**: Real-world intent templates.

---

## 🤝 Join the Revolution

1. **Star the repo** to show your support ⭐
2. **Become a Sponsor** to help us build a Green AI future 💖

---

MIT © ebade Contributors — Made with ❤️ in Türkiye 🇹🇷

---

## 🤝 Contributing

**ebade** is open source and welcomes contributions!

1. **Star this repo** ⭐
2. **Try the MCP server** with your AI agent
3. **Open issues** with ideas and feedback
4. **Submit PRs** for new features

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 💎 Support the Movement

**ebade** is an ambitious project aiming to redefine how we build software in the age of AI. Your support helps us move faster, maintain high-quality documentation, and build a more sustainable "Green AI" future.

- **[Become a GitHub Sponsor](https://github.com/sponsors/hasankemaldemirci)** 💖
- **Star the repo** to show your support ⭐
- **Share the project** with other AI enthusiasts 🚀

---

## 📄 License

MIT © ebade Contributors — Made with ❤️ in Türkiye 🇹🇷

---

**Built for AI. Readable by humans. Revolutionary by design.**

_TypeScript made JavaScript better for humans._
_ebade makes frameworks better for AI._
