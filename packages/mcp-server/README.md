# ebade MCP Server 🤖

> Enable AI agents to build with ebade - The Essence of Code

This MCP (Model Context Protocol) server allows AI agents like Claude, GPT, and others to use ebade for building web applications.

## Installation

```bash
npm install -g @ebade/mcp-server
```

Or locally:

```bash
npm install @ebade/mcp-server
```

## Configuration

Add to your MCP client configuration:

### For Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ebade": {
      "command": "node",
      "args": ["/path/to/ebade/packages/mcp-server/dist/index.js"]
    }
  }
}
```

### For Cursor

Add to your Cursor MCP settings:

```json
{
  "ebade": {
    "command": "ebade-mcp"
  }
}
```

## Available Tools

### `ebade_scaffold`

Create a complete project from an ebade definition.

```typescript
// Example usage by an AI agent:
ebade_scaffold({
  projectName: "my-store",
  projectType: "e-commerce",
  features: ["product-catalog", "shopping-cart", "checkout"],
  outputDir: "/path/to/projects"
})
```

**Output:** Full Next.js project with pages, components, and styles.

### `ebade_validate`

Validate an ebade file before scaffolding.

```typescript
ebade_validate({
  intentContent: `
    name: my-app
    type: saas-dashboard
    features:
      - user-auth
      - analytics
  `
})
```

**Output:** Validation results with errors and warnings.

### `ebade_compile`

Compile a single ebade to code.

```typescript
ebade_compile({
  intent: {
    type: "page",
    name: "checkout",
    path: "/checkout",
    components: ["cart-summary", "payment-form"],
    auth: "required"
  },
  target: "nextjs"
})
```

**Output:** Generated TypeScript/React code.

### `ebade_generate`

Generate a component from natural language.

```typescript
ebade_generate({
  description: "a product card with image, title, price, and add to cart button",
  style: "minimal-modern"
})
```

**Output:** Inferred intent + generated component code.

## Resources

The server also provides resources:

- `ebade://syntax` - Complete syntax reference
- `ebade://examples/ecommerce` - E-commerce example
- `ebade://examples/saas` - SaaS dashboard example

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run
npm start
```

## License

MIT
