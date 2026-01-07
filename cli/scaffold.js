#!/usr/bin/env node

/**
 * ebade CLI Scaffold Tool
 *
 * Bu araç bir .ebade.yaml dosyasını okur ve
 * AI Agent'ın anlayacağı şekilde proje yapısını oluşturur.
 */

import fs from "fs";
import path from "path";
import yaml from "yaml";
import ora from "ora";

// ============================================
// ANSI Renk Kodları (Terminal çıktısı için)
// ============================================
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
};

// ASCII Art Logo
const LOGO = `
${colors.magenta}    ███████╗${colors.cyan}██████╗  ${colors.magenta}█████╗ ${colors.cyan}██████╗ ${colors.magenta}███████╗
${colors.magenta}    ██╔════╝${colors.cyan}██╔══██╗${colors.magenta}██╔══██╗${colors.cyan}██╔══██╗${colors.magenta}██╔════╝
${colors.magenta}    █████╗  ${colors.cyan}██████╔╝${colors.magenta}███████║${colors.cyan}██║  ██║${colors.magenta}█████╗  
${colors.magenta}    ██╔══╝  ${colors.cyan}██╔══██╗${colors.magenta}██╔══██║${colors.cyan}██║  ██║${colors.magenta}██╔══╝  
${colors.magenta}    ███████╗${colors.cyan}██████╔╝${colors.magenta}██║  ██║${colors.cyan}██████╔╝${colors.magenta}███████╗
${colors.magenta}    ╚══════╝${colors.cyan}╚═════╝ ${colors.magenta}╚═╝  ╚═╝${colors.cyan}╚═════╝ ${colors.magenta}╚══════╝${colors.reset}
    
    ${colors.dim}✨ Agent-First Framework ${colors.yellow}v0.1.0${colors.reset}
`;

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  file: (msg) => console.log(`${colors.cyan}  →${colors.reset} ${msg}`),
  section: (msg) =>
    console.log(`\n${colors.bright}${colors.magenta}▸ ${msg}${colors.reset}`),
};

// ============================================
// ebade Parser
// ============================================
function parseEbade(ebadePath) {
  const content = fs.readFileSync(ebadePath, "utf-8");
  return yaml.parse(content);
}

// ============================================
// Component Generator Templates
// ============================================
const componentTemplates = {
  "hero-section": (design) => `
export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to Our Store</h1>
        <p className="hero-subtitle">Discover amazing products</p>
        <button className="hero-cta" style={{ backgroundColor: '${
          design.colors?.primary || "#6366f1"
        }' }}>
          Shop Now
        </button>
      </div>
    </section>
  );
}
`,
  "product-grid": (design) => `
export function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
`,
  "add-to-cart": (design) => `
import { useState } from 'react';

export function AddToCart({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  
  return (
    <div className="add-to-cart">
      <div className="quantity-selector">
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(q => q + 1)}>+</button>
      </div>
      <button 
        className="add-btn"
        style={{ backgroundColor: '${design.colors?.primary || "#6366f1"}' }}
        onClick={() => onAdd(product, quantity)}
      >
        Add to Cart
      </button>
    </div>
  );
}
`,
};

// ============================================
// Page Generator
// ============================================
function generatePage(page, design) {
  const componentImports =
    page.components
      ?.map((c) => `import { ${toPascalCase(c)} } from '@/components/${c}';`)
      .join("\n") || "";

  const componentUsage =
    page.components?.map((c) => `      <${toPascalCase(c)} />`).join("\n") ||
    "      {/* No components defined */}";

  return `
/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('${page.path}')
 * @intent('${page.intent}')
 */

${componentImports}


export default function ${toPascalCase(page.intent)}Page() {
  return (
    <main className="page ${page.intent}">
${componentUsage}
    </main>
  );
}

// Auth requirement: ${page.auth || "public"}
`;
}

// ============================================
// API Route Generator
// ============================================
function generateApiRoute(endpoint) {
  const handlers = endpoint.methods
    .map(
      (method) => `
/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * ${method} ${endpoint.path}
 * Auth: ${endpoint.auth || "none"}
 */
export async function ${method}(request) {
  // TODO: Implement ${method} handler
  
  return Response.json({ 
    message: "${method} ${endpoint.path} - Not implemented" 
  });
}
`
    )
    .join("\n");

  return handlers;
}

// ============================================
// Database Schema Generator (Supabase SQL)
// ============================================
function generateDatabaseSchema(data) {
  let sql = "-- ebade Generated Database Schema\n\n";

  for (const [modelName, model] of Object.entries(data)) {
    sql += `-- Table: ${modelName}\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${toSnakeCase(modelName)} (\n`;

    const fields = Object.entries(model.fields).map(([fieldName, fieldDef]) => {
      const sqlType = mapToSqlType(fieldDef.type);
      const constraints = [];
      if (fieldDef.required) constraints.push("NOT NULL");
      if (fieldDef.unique) constraints.push("UNIQUE");
      return `  ${toSnakeCase(fieldName)} ${sqlType}${
        constraints.length ? " " + constraints.join(" ") : ""
      }`;
    });

    sql += fields.join(",\n");
    sql += "\n);\n\n";
  }

  return sql;
}

// ============================================
// Next.js Config Generators
// ============================================
function generatePackageJson(config) {
  return JSON.stringify(
    {
      name: config.name,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        next: "^14.0.0",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
      },
      devDependencies: {
        "@types/node": "^20.0.0",
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        typescript: "^5.0.0",
      },
    },
    null,
    2
  );
}

function generateNextConfig() {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
`;
}

function generateTsConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2
  );
}

function generateLayout(config) {
  const fontFamily = config.design?.font || "Inter";
  return `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${config.name}",
  description: "Built with ebade - The Agent-First Framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(
            " ",
            "+"
          )}:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
`;
}

function generateGlobalsCss(design) {
  return `/* ebade Generated Design System */
/* Style: ${design.style || "minimal-modern"} */

:root {
  --color-primary: ${design.colors?.primary || "#6366f1"};
  --color-secondary: ${design.colors?.secondary || "#f59e0b"};
  --color-accent: ${design.colors?.accent || "#10b981"};
  --font-family: '${design.font || "Inter"}', system-ui, sans-serif;
  --radius-lg: 1rem;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  line-height: 1.6;
  color: #1f2937;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: white;
}

.hero-section {
  text-align: center;
  max-width: 800px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-cta {
  background: white;
  color: var(--color-primary);
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.hero-cta:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.add-to-cart {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-selector button {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn {
  flex: 1;
}
`;
}

// ============================================
// Design System CSS Generator
// ============================================
function generateDesignSystem(design) {
  return `
/* ebade Generated Design System */
/* Style: ${design.style || "minimal-modern"} */

:root {
  --color-primary: ${design.colors?.primary || "#6366f1"};
  --color-secondary: ${design.colors?.secondary || "#f59e0b"};
  --color-accent: ${design.colors?.accent || "#10b981"};
  
  --font-family: '${design.font || "Inter"}', system-ui, sans-serif;
  
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  --radius-default: var(--radius-${design.borderRadius || "md"});
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  line-height: 1.6;
  color: #1f2937;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-default);
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}
`;
}

function generateAgentRules(config) {
  return `
# ebade Agent-First Framework Rules

You are an AI developer working on a project built with the **ebade Agent-First Framework**.
This project is designed specifically for AI-Human collaboration.

## 🧠 Core Philosophy
- **Intent > Implementation**: Focus on WHAT the code should do.
- **Source of Truth**: The structure is defined in \`project.ebade.yaml\`. Always refer to it before making structural changes.
- **Consistency**: All generated code should match the intents defined in \`app/\`, \`components/\`, and \`api/\`.

## 🛠 Framework Patterns

### 1. Decorators (Comments)
All files generated by ebade contain semantic decorators in their headers. Keep them intact:
- @page('/path'): Marks a Next.js Page.
- @intent('name'): Describes the purpose of the file.
- @requires(['components']): Lists dependencies.

### 2. Design System
- Use CSS Variables defined in \`app/globals.css\`.
- Prefer these tokens: var(--color-primary), var(--color-secondary), var(--radius-default).

## 🤝 AI Collaboration Guidelines
1. **When adding a new page**: First, suggest updating \`project.ebade.yaml\` if possible.
2. **When modifying components**: Ensure they remain decoupled and respect the design system props.

Built with ebade - The Agent-First Framework for the next era of development. 🌱
`;
}

// ============================================
// Utility Functions
// ============================================
function toPascalCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}

function mapToSqlType(type) {
  const typeMap = {
    uuid: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
    string: "VARCHAR(255)",
    text: "TEXT",
    integer: "INTEGER",
    decimal: "DECIMAL(10,2)",
    boolean: "BOOLEAN",
    timestamp: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
    json: "JSONB",
    array: "JSONB",
    enum: "VARCHAR(50)",
  };
  return typeMap[type] || "VARCHAR(255)";
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ============================================
// Main Scaffold Function
// ============================================
function scaffold(ebadePath, outputDir) {
  const startTime = Date.now();
  let stats = { pages: 0, components: 0, apiRoutes: 0, files: 0 };

  console.log(LOGO);

  // Parse ebade file
  log.info(`Reading ebade file: ${ebadePath}`);
  const config = parseEbade(ebadePath);
  log.success(
    `Parsed ebade for project: ${colors.bright}${config.name}${colors.reset}`
  );

  // Create output directory structure
  const projectDir = path.join(outputDir, config.name);
  ensureDir(projectDir);

  // ========== Generate Structure ==========
  log.section("Creating directory structure");

  const dirs = [
    "app",
    "app/api",
    "components",
    "lib",
    "styles",
    "public",
    "types",
  ];

  dirs.forEach((dir) => {
    ensureDir(path.join(projectDir, dir));
    log.file(`${dir}/`);
  });

  // ========== Generate Pages ==========
  log.section("Generating pages");

  if (config.pages) {
    const spinner = ora("Generating pages...").start();
    config.pages.forEach((page) => {
      const pagePath =
        page.path === "/"
          ? "app/page.tsx"
          : `app${page.path.replace("[", "(").replace("]", ")")}/page.tsx`;

      const pageDir = path.dirname(path.join(projectDir, pagePath));
      ensureDir(pageDir);

      const pageContent = generatePage(page, config.design);
      fs.writeFileSync(path.join(projectDir, pagePath), pageContent.trim());
      stats.pages++;
      stats.files++;
    });
    spinner.succeed(
      `Generated ${colors.bright}${stats.pages}${colors.reset} pages`
    );
  }

  // ========== Generate Components ==========
  log.section("Generating components");

  const allComponents = new Set();
  config.pages?.forEach((page) => {
    page.components?.forEach((c) => allComponents.add(c));
  });

  const spinner2 = ora("Generating components...").start();
  allComponents.forEach((component) => {
    const componentPath = `components/${component}.tsx`;
    const template = componentTemplates[component];
    const content = template
      ? template(config.design)
      : `// TODO: Implement ${toPascalCase(
          component
        )} component\nexport function ${toPascalCase(
          component
        )}() {\n  return <div>${component}</div>;\n}\n`;

    fs.writeFileSync(path.join(projectDir, componentPath), content.trim());
    stats.components++;
    stats.files++;
  });
  spinner2.succeed(
    `Generated ${colors.bright}${stats.components}${colors.reset} components`
  );

  // ========== Generate API Routes ==========
  log.section("Generating API routes");

  if (config.api) {
    const spinner3 = ora("Generating API routes...").start();
    config.api.forEach((endpoint) => {
      const apiPath = `app/api${endpoint.path}/route.ts`;
      const apiDir = path.dirname(path.join(projectDir, apiPath));
      ensureDir(apiDir);

      const routeContent = generateApiRoute(endpoint);
      fs.writeFileSync(path.join(projectDir, apiPath), routeContent.trim());
      stats.apiRoutes++;
      stats.files++;
    });
    spinner3.succeed(
      `Generated ${colors.bright}${stats.apiRoutes}${colors.reset} API routes`
    );
  }

  // ========== Generate Design System ==========
  log.section("Generating design system");

  const cssContent = generateGlobalsCss(config.design || {});
  fs.writeFileSync(path.join(projectDir, "app/globals.css"), cssContent.trim());
  log.file("app/globals.css");

  // ========== Generate Next.js Config Files ==========
  log.section("Generating Next.js config files");

  // package.json
  fs.writeFileSync(
    path.join(projectDir, "package.json"),
    generatePackageJson(config)
  );
  log.file("package.json");

  // next.config.mjs
  fs.writeFileSync(
    path.join(projectDir, "next.config.mjs"),
    generateNextConfig()
  );
  log.file("next.config.mjs");

  // tsconfig.json
  fs.writeFileSync(path.join(projectDir, "tsconfig.json"), generateTsConfig());
  log.file("tsconfig.json");

  // app/layout.tsx
  fs.writeFileSync(
    path.join(projectDir, "app/layout.tsx"),
    generateLayout(config)
  );
  log.file("app/layout.tsx");

  // next-env.d.ts
  fs.writeFileSync(
    path.join(projectDir, "next-env.d.ts"),
    `/// <reference types="next" />
/// <reference types="next/image-types/global" />
`
  );
  log.file("next-env.d.ts");

  // Agent Rules
  const agentRules = generateAgentRules(config).trim();

  // .cursorrules (Cursor)
  fs.writeFileSync(path.join(projectDir, ".cursorrules"), agentRules);
  log.file(".cursorrules");

  // .clauderules (Claude/Windsurf)
  fs.writeFileSync(path.join(projectDir, ".clauderules"), agentRules);
  log.file(".clauderules");

  // GitHub Copilot instructions
  ensureDir(path.join(projectDir, ".github"));
  fs.writeFileSync(
    path.join(projectDir, ".github/copilot-instructions.md"),
    agentRules
  );
  log.file(".github/copilot-instructions.md");

  // ========== Generate Database Schema ==========
  if (config.data) {
    log.section("Generating database schema");

    ensureDir(path.join(projectDir, "database"));
    const schemaContent = generateDatabaseSchema(config.data);
    fs.writeFileSync(
      path.join(projectDir, "database/schema.sql"),
      schemaContent.trim()
    );
    log.file("database/schema.sql");
  }

  // ========== Generate ebade Copy ==========
  log.section("Copying ebade file");

  fs.copyFileSync(ebadePath, path.join(projectDir, "project.ebade.yaml"));
  log.file("project.ebade.yaml (for agent reference)");

  // ========== Summary ==========
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const estimatedTokenSavings = Math.round(stats.files * 35); // ~35 tokens saved per file

  console.log(`
${colors.bright}${colors.green}  ┌${"─".repeat(41)}┐${colors.reset}
${colors.green}  │${colors.reset}  ${colors.bright}✅ ebade scaffold complete!${
    colors.reset
  }              ${colors.green}│${colors.reset}
${colors.green}  ├${"─".repeat(41)}┤${colors.reset}
${colors.green}  │${colors.reset}  ${colors.dim}Project:${
    colors.reset
  } ${config.name.padEnd(26)} ${colors.green}│${colors.reset}
${colors.green}  │${colors.reset}  ${colors.dim}Type:${
    colors.reset
  }    ${config.type.padEnd(26)} ${colors.green}│${colors.reset}
${colors.green}  ├${"─".repeat(41)}┤${colors.reset}
${colors.green}  │${colors.reset}  ${colors.cyan}📁 Files Created:${
    colors.reset
  }    ${String(stats.files).padEnd(18)} ${colors.green}│${colors.reset}
${colors.green}  │${colors.reset}  ${colors.cyan}📊 Token Savings:${
    colors.reset
  }    ~${String(estimatedTokenSavings).padEnd(17)} ${colors.green}│${
    colors.reset
  }
${colors.green}  │${colors.reset}  ${colors.cyan}⏱  Completed in:${
    colors.reset
  }    ${String(duration + "s").padEnd(18)} ${colors.green}│${colors.reset}
${colors.green}  └${"─".repeat(41)}┘${colors.reset}

${colors.dim}Next steps:${colors.reset}
  ${colors.gray}1.${colors.reset} cd ${colors.cyan}${projectDir}${colors.reset}
  ${colors.gray}2.${colors.reset} npm install
  ${colors.gray}3.${colors.reset} npm run dev

${colors.yellow}💡 Tip:${colors.reset} AI Agents can read ${
    colors.cyan
  }project.ebade.yaml${colors.reset}
       to understand and iterate on this project.
`);
}

// ============================================
// CLI Entry Point
// ============================================
const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
${colors.bright}ebade CLI${colors.reset} - The Agent-First Framework

${colors.dim}Usage:${colors.reset}
  npx ebade <command> [options]

${colors.dim}Commands:${colors.reset}
  scaffold <file> [output]   Scaffold a project from ebade file
  
${colors.dim}Examples:${colors.reset}
  npx ebade scaffold examples/ecommerce.ebade.yaml ./output
  npx ebade scaffold my-project.ebade.yaml

${colors.dim}Learn more:${colors.reset}
  https://ebade.dev
`);
}

if (
  args.length === 0 ||
  command === "help" ||
  command === "--help" ||
  command === "-h"
) {
  showHelp();
  process.exit(0);
}

if (command === "scaffold") {
  const ebadeFile = args[1];
  const outputDir = args[2] || "./output";

  if (!ebadeFile) {
    console.error(
      `${colors.red}Error:${colors.reset} Please provide an ebade file path.`
    );
    console.log(
      `\n${colors.dim}Usage:${colors.reset} npx ebade scaffold <file.ebade.yaml> [output-dir]\n`
    );
    process.exit(1);
  }

  if (!fs.existsSync(ebadeFile)) {
    console.error(
      `${colors.red}Error:${colors.reset} ebade file not found: ${ebadeFile}`
    );
    process.exit(1);
  }

  scaffold(ebadeFile, outputDir);
} else {
  console.error(
    `${colors.red}Error:${colors.reset} Unknown command: ${command}`
  );
  showHelp();
  process.exit(1);
}
