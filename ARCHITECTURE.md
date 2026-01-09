# ebade Architecture 🏗️

> **The System of Intent.**

ebade is not just a framework; it's a **compilation pipeline** designed for an era where AI agents are the primary authors of software. This document explains the technical underpinnings of how ebade transforms abstract niyet (intent) into production-ready code.

---

## 🏁 The Core Pipeline

The ebade transformation follows a strictly deterministic flow:

```mermaid
graph LR
    A[Intent File .ebade.yaml] --> B[ebade CLI/MCP]
    B --> C[Intent AST Parser]
    C --> D[Target Adapter Next.js/etc]
    D --> E[AI-Enhanced Scaffolder]
    E --> F[Production Codebase]
```

### 1. Intent Definition (`.ebade.yaml`)

The source of truth. It defines **WHAT** the application should be, sans implementation details. It uses a high-density decorator syntax that is optimized for LLM token efficiency.

### 2. AST Parsing

The ebade CLI parses the YAML/TypeScript intent into a **Standardized Intent Tree (SIT)**. This tree represents the semantic meaning of the application (pages, components, data flows, auth rules).

### 3. Target Adapters

ebade is target-agnostic. While it currently ships with a high-end **Next.js + Tailwind + Shadcn** adapter, the architecture allows for:

- **Web:** Next.js, Nuxt, SvelteKit.
- **Mobile:** Flutter, SwiftUI, React Native.
- **Backend:** Fastify, Go/Gin, NestJS.

### 4. AI-Enhanced Scaffolding (The "Online Compiler")

This is where the magic happens. ebade uses AI not as a "free-text generator," but as a **Deterministic Compiler Component**.

- **Templates:** ebade provides a library of high-quality, pre-tested component templates.
- **Mapping:** The AI maps the specific fields and logic from the `@intent` into these templates.
- **Validation:** Every generated file is validated against the intent AST to ensure zero hallucinations.

---

## 🟢 Green AI: Token Density Architecture

Traditional AI coding (e.g., "Write me a dashboard") is **High Entropy**:

- User sends 50 tokens.
- AI returns 2,000 tokens of boilerplate.
- High cost, high noise, high probability of error.

ebade is **Low Entropy**:

- Intent is defined in ~50-100 tokens.
- ebade handles the structure, imports, and layout (0 tokens).
- AI only fills in the specific business logic snippets.
- **Result:** ~70% fewer tokens, 100% more reliable.

---

## 🛠️ Internal Structure

### Intent Model

The `Intent` model is the central class that holds the parsed state.

```typescript
class IntentProject {
  name: string;
  type: ProjectType;
  pages: PageIntent[];
  components: ComponentIntent[];
  data: DataIntent[];
  auth: AuthConfig;
}
```

### The Scaffold Engine

The engine responsible for directory creation and file writing. It uses a "Clean Architecture" approach, ensuring that:

1. Components stay in `@/components`.
2. Logic stays in `@/lib`.
3. UI stays in `@/app`.

---

## 🧬 Principles of ebade Engineering

1. **Delete the How:** If a machine can infer the implementation, it shouldn't be in the source file.
2. **Deterministic Outputs:** Same input must yield the same structure.
3. **Agent-First DX:** The developer experience (DX) is optimized for the agent's context window.
4. **Production-Ready by Default:** No "TODOs" in the output. Real types, real error handling, real responsive design.

---

_ebade: Compiling Intent into Reality._ 🌱🚀
