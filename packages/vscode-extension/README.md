# ebade VS Code Extension

Syntax highlighting, snippets, and language support for `.ebade.yaml` files.

## Features

### 🎨 Syntax Highlighting

- Keywords: `project`, `pages`, `api`, `data`, `design`
- Decorators: `@page`, `@intent`, `@requires`
- Strings, numbers, booleans
- Comments

### ✨ Snippets (v0.3.2 Updates)

| Prefix | Description |
| :--- | :--- |
| `eb-saas` | Full SaaS Dashboard template |
| `eb-shop` | Full E-commerce store template |
| `eb-page` | New page definition |
| `eb-comp` | Component reference |

## Installation

### From VSIX (Local)

```bash
cd packages/vscode-extension
npx vsce package
code --install-extension ebade-*.vsix
```

### From Marketplace (Coming Soon)

Search for "ebade" in VS Code Extensions.

## Usage

1. Create a file with `.ebade.yaml` extension
2. Start typing `eb-` to see available snippets
3. Enjoy syntax highlighting! 🎉

---

Built with 💜 by the ebade team.
