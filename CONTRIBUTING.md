# Contributing to ebade 🤝

First off, thank you for considering contributing to ebade! This is a community-driven project, and we welcome contributions of all kinds.

## 🌟 Ways to Contribute

### 1. Star the Repository
The simplest way to show support! It helps others discover the project.

### 2. Report Bugs
Found a bug? Please open an issue with:
- A clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, etc.)

### 3. Suggest Features
Have an idea? Open an issue with the "feature request" label:
- Describe the problem you're trying to solve
- Propose your solution
- Consider alternatives you've thought about

### 4. Submit ebade Examples

One of the best ways to contribute is adding new ebade examples:

```
examples/
├── ecommerce.ebade.yaml      # existing
├── blog.ebade.yaml           # new!
├── saas-dashboard.ebade.yaml # new!
└── portfolio.ebade.yaml      # new!
```

### 5. Add Component Templates
Expand the component library in the MCP server:
```typescript
// packages/mcp-server/src/tools/generate.ts
const componentPatterns = [
  // Add your pattern here!
];
```

### 6. Improve Documentation
- Fix typos
- Add examples
- Clarify confusing sections
- Translate to other languages

### 7. Core Development
- Parser improvements
- New compilation targets (Vue, Svelte, etc.)
- VS Code extension
- CLI enhancements

---

## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ebade.git
cd ebade

# Install dependencies
npm install

# Build MCP server
cd packages/mcp-server
npm install
npm run build

# Run in dev mode
npm run dev
```

---

## 📝 Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** your changes
5. **Commit** with a descriptive message
6. **Push** to your fork
7. **Open** a Pull Request

### Commit Message Format

```
type(scope): subject

body (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(mcp): add vue compilation target
fix(scaffold): handle nested routes correctly
docs(readme): add installation instructions
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

---

## 📋 Code Style

- Use TypeScript
- 2 spaces for indentation
- Semicolons required
- Single quotes for strings
- Max line length: 100 characters

We use ESLint and Prettier (coming soon).

---

## 🎯 Priority Areas

Currently, we're focusing on:

1. **MCP Server stability** - Making it robust for AI agents
2. **ebade examples** - More real-world examples
3. **Documentation** - Comprehensive guides
4. **Vue/Svelte targets** - Cross-framework compilation

---

## 🤖 For AI Contributors

Yes, AI agents can contribute too! When contributing via AI:

1. Clearly state that the contribution was AI-assisted
2. Review the generated code carefully
3. Test the changes
4. Ensure the code follows our style guide

---

## 💬 Questions?

- Open an issue with the "question" label
- Start a GitHub Discussion
- Reach out on Twitter (coming soon)

---

## 📜 Code of Conduct

Be kind, be respectful, be constructive.

We're all here to build something amazing together.

---

Thank you for helping make ebade better! 🚀
