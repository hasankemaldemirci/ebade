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
};

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
 * @page('${page.path}')
 * @ebade('${page.intent}')
 * Built with ebade 
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
export async function ${method}(request) {
  // TODO: Implement ${method} handler for ${endpoint.path}
  // Auth: ${endpoint.auth || "none"}
  // Built with ebade
  
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
  console.log(`
${colors.bright}${colors.magenta}╔════════════════════════════════════════╗
命       ebade Scaffold CLI              命
命   🤖 Agent-First Framework Generator   命
╚════════════════════════════════════════╝${colors.reset}
`);

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
    config.pages.forEach((page) => {
      const pagePath =
        page.path === "/"
          ? "app/page.tsx"
          : `app${page.path.replace("[", "(").replace("]", ")")}/page.tsx`;

      const pageDir = path.dirname(path.join(projectDir, pagePath));
      ensureDir(pageDir);

      const pageContent = generatePage(page, config.design);
      fs.writeFileSync(path.join(projectDir, pagePath), pageContent.trim());
      log.file(`${pagePath} (${page.intent})`);
    });
  }

  // ========== Generate Components ==========
  log.section("Generating components");

  const allComponents = new Set();
  config.pages?.forEach((page) => {
    page.components?.forEach((c) => allComponents.add(c));
  });

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
    log.file(componentPath);
  });

  // ========== Generate API Routes ==========
  log.section("Generating API routes");

  if (config.api) {
    config.api.forEach((endpoint) => {
      const apiPath = `app/api${endpoint.path}/route.ts`;
      const apiDir = path.dirname(path.join(projectDir, apiPath));
      ensureDir(apiDir);

      const routeContent = generateApiRoute(endpoint);
      fs.writeFileSync(path.join(projectDir, apiPath), routeContent.trim());
      log.file(`${apiPath} [${endpoint.methods.join(", ")}]`);
    });
  }

  // ========== Generate Design System ==========
  log.section("Generating design system");

  const cssContent = generateDesignSystem(config.design || {});
  fs.writeFileSync(
    path.join(projectDir, "styles/globals.css"),
    cssContent.trim()
  );
  log.file("styles/globals.css");

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
  console.log(`
${colors.bright}${colors.green}════════════════════════════════════════${colors.reset}
${colors.green}✓${colors.reset} ebade scaffold complete!

${colors.dim}Project:${colors.reset} ${config.name}
${colors.dim}Type:${colors.reset} ${config.type}
${colors.dim}Output:${colors.reset} ${projectDir}

${colors.dim}Next steps:${colors.reset}
  1. cd ${projectDir}
  2. npm install
  3. npm run dev

${colors.yellow}Note:${colors.reset} The generated code is a starting point.
      An AI Agent can now read project.ebade.yaml
      to understand and iterate on this project.
${colors.bright}${colors.green}════════════════════════════════════════${colors.reset}
`);
}

// ============================================
// CLI Entry Point
// ============================================
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
${colors.bright}ebade Scaffold CLI${colors.reset}

Usage:
  npx ebade scaffold <ebade-file> [output-dir]

Example:
  npx ebade scaffold examples/ecommerce.ebade.yaml ./output

Options:
  ebade-file   Path to .ebade.yaml file
  output-dir    Output directory (default: ./output)
`);
  process.exit(1);
}

const ebadeFile = args[0];
const outputDir = args[1] || "./output";

if (!fs.existsSync(ebadeFile)) {
  console.error(
    `${colors.red}Error:${colors.reset} ebade file not found: ${ebadeFile}`
  );
  process.exit(1);
}

scaffold(ebadeFile, outputDir);
