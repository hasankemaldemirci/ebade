# ebade 🧠

![ebade - The First Agent-First Framework](https://ebade.dev/og-readme.png)

[![npm version](https://img.shields.io/npm/v/ebade.svg)](https://www.npmjs.com/package/ebade)
[![Website](https://img.shields.io/badge/Website-ebade.dev-4F46E5)](https://ebade.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP Server](https://img.shields.io/badge/MCP-Ready-green.svg)](./packages/mcp-server)
[![Status](https://img.shields.io/badge/Status-Alpha-orange.svg)](./ROADMAP.md)
[![Green AI](https://img.shields.io/badge/🌱_Green_AI-70%25_Less_Tokens-brightgreen)](./docs/GREEN-AI.md)
[![Sponsor](https://img.shields.io/badge/Sponsor-ebade-pink.svg?logo=github-sponsors)](https://github.com/sponsors/hasankemaldemirci)

> **The first framework designed for AI agents, readable by humans.**
>
> `Code = f(ebade)`
>
> *Capture the essence of code. Less tokens. Less carbon. Same result.* 🌱

## 🎬 See it in action

![ebade demo](./demo.gif)

```typescript

// ❌ Before: 100+ lines of boilerplate
export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => { /* fetch data */ }, []);
  // ... 100 more lines of HOW
}

// ✅ After: Pure intent - WHAT you want
@page('/checkout')
@intent('complete-purchase')
@requires({ data: ['cart', 'user'], auth: 'required' })
@outcomes({ success: '/order/[id]', error: 'show-inline' })
export function Checkout({ cart, user }) {
  // Just business logic, zero boilerplate
}
```

---

## 🚀 Quick Start

### For AI Agents (MCP)

**ebade** is designed to be used BY AI agents. Add to your MCP configuration:

```json
{
  "mcpServers": {
    "ebade": {
      "command": "node",
      "args": ["./packages/mcp-server/dist/index.js"]
    }
  }
}
```

Then AI agents can use:

- `ebade_scaffold` - Create full projects from intent
- `ebade_compile` - Compile single intents to code
- `ebade_validate` - Validate intent files
- `ebade_generate` - Generate from natural language

### For Humans (CLI)

```bash
# Scaffold a new project
npx ebade scaffold --type e-commerce --name my-store

# Compile intents to code
npx ebade build

# Watch mode
npx ebade dev
```

---

## 📊 Benchmark: ~70% Fewer Tokens (Tested)

We measured token usage across common development tasks:

| Task | Next.js | ebade | Savings | Efficiency |
| :--- | :--- | :--- | :--- | :--- |
| Checkout Page | 258 tokens | 66 tokens | **74.4%** | 3.9x |
| Product Listing | 133 tokens | 63 tokens | **52.6%** | 2.1x |
| User Auth | 148 tokens | 56 tokens | **62.2%** | 2.6x |
| SaaS Dashboard ⭐ | 1,850 tokens | 245 tokens | **86.8%** | 7.6x |
| **Average** | | | **68.8%** | **4.1x** |

> *For full project scaffolding, savings can reach 75-92%.*

### 💰 Cost Impact

At scale (1M AI coding sessions):

| Framework | Token Cost | Savings |
| :--- | :--- | :--- |
| Next.js | $5,390 | - |
| **ebade** | **$1,850** | **$3,540** |

> *The greenest code is the code you don't generate.*

📄 [Full Benchmark Results](./benchmarks/RESULTS.md) | 🌱 [Green AI Manifesto](./docs/GREEN-AI.md)

---

## 💡 The Problem

AI agents (Cursor, Copilot, Claude) write code for **human-designed frameworks**:

```text
AI: "Is this a server or client component?"

AI: "App router or pages router?"
AI: "useState or useReducer?"
AI: "Where does this file go?"
```

Every decision is **ambiguous**. AI guesses. Sometimes wrong.

## ✨ The Solution

**ebade** - A framework where AI expresses **intent**, not implementation.

```text
Human describes → AI writes intent → ebade compiles → Working code
                        ↑
                 No ambiguity here
```

---

## 📦 Packages

| Package | Description | Status |
| :--- | :--- | :--- |
| **`ebade`** | Core Framework & CLI | ✅ Alpha |
| [@ebade/mcp-server](./packages/mcp-server) | MCP Server for AI agents | ✅ Alpha |
| `@ebade/compiler` | Advanced Intent Compiler | 🚧 Planning |
| `@ebade/vscode` | VS Code extension | 📋 Planned |

---

## 🎯 Core Concepts

### Intent-First

```typescript
@intent('user-authentication')
@inputs(['email', 'password'])
@outcomes({ success: '/dashboard', failure: 'show-error' })
```

You say **WHAT**, not **HOW**.

### Deterministic

Same intent = Same output. Every time. No guessing.

### Composable

```typescript
@compose(['header', 'sidebar', 'content', 'footer'])
```

Small intents build big applications.

### Target-Agnostic

```typescript
@compile('nextjs')   // → Next.js App Router
@compile('vue')      // → Vue + Nuxt (coming)
@compile('svelte')   // → SvelteKit (coming)
```

One intent, many outputs.

---

## 📋 Example

```yaml
# project.intent.yaml

name: my-store
type: e-commerce
features:
  - product-catalog
  - shopping-cart
  - checkout
  - user-auth

pages:
  - path: /
    intent: landing-page
    components:
      - hero-section
      - featured-products
      - testimonials
      
  - path: /products
    intent: product-listing
    components:
      - search-bar
      - product-grid
      - pagination
      
  - path: /checkout
    intent: checkout-flow
    auth: required
    components:
      - cart-summary
      - payment-form
```

**Output:** Full Next.js project with 20+ files, ready to run.

---

## 🎭 The Paradigm Shift

| Era | Paradigm | Core Question |
| :--- | :--- | :--- |
| 2000s | jQuery | "How do I manipulate DOM?" |
| 2013 | React | "What if UI = f(state)?" |
| 2024 | AI Coding | "AI writes code, but for humans" |
| **2026** | **ebade** | **"What if Code = f(intent)?"** |

---

## 📚 Documentation

- 📜 [Manifesto](./MANIFESTO.md) — Philosophy & Vision
- 📖 [Syntax Spec](./SYNTAX.md) — Complete Decorator Reference
- 🗺️ [Roadmap](./ROADMAP.md) — Development Plan
- 📁 [Examples](./examples/) — Real-world Intent Files
- 📊 [Benchmarks](./benchmarks/) — Token & Cost Analysis
- 🌱 [Green AI](./docs/GREEN-AI.md) — Environmental Impact

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

*TypeScript made JavaScript better for humans.*
*ebade makes frameworks better for AI.*
