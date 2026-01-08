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
import prompts from "prompts";
import chokidar from "chokidar";

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
  "hero-section": (design) => `import React from 'react';

/**
 * 🧠 Generated via ebade
 * Intent: hero-section
 */
export function HeroSection() {
  const primaryColor = '${design.colors?.primary || "#6366f1"}';
  
  return (
    <section className="relative py-20 px-4 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Welcome to <span style={{ color: primaryColor }}>ebade</span>
        </h1>
        <p className="text-xl opacity-80 max-w-2xl mx-auto mb-10">
          The first framework designed for AI agents. Build faster, cleaner, and smarter.
        </p>
        <button 
          className="px-8 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl"
          style={{ backgroundColor: primaryColor }}
        >
          Explore Now
        </button>
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
           style={{ background: \`radial-gradient(circle at center, \${primaryColor} 0%, transparent 70%)\` }} />
    </section>
  );
}
`,
  "product-grid": (design) => `import React from 'react';

/**
 * 🧠 Generated via ebade
 * Intent: product-grid
 */
export function ProductGrid({ items = [] }: { items?: any[] }) {
  const primaryColor = '${design.colors?.primary || "#6366f1"}';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
      {items.length > 0 ? items.map((item, idx) => (
        <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
          <div className="aspect-square bg-white/5 rounded-xl mb-4 animate-pulse" />
          <h3 className="text-xl font-bold mb-2">{item.name || 'Product Name'}</h3>
          <p className="text-sm opacity-60 mb-4">{item.description || 'Modern product description goes here.'}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-mono font-bold" style={{ color: primaryColor }}>\\$99.00</span>
            <button className="text-sm font-semibold opacity-80 hover:opacity-100">Details →</button>
          </div>
        </div>
      )) : (
        <div className="col-span-full py-20 text-center opacity-40">
          <p>No products found tracking the ebade signal...</p>
        </div>
      )}
    </div>
  );
}
`,
  "stats-grid": (design) => `import React from 'react';

/**
 * 🧠 Generated via ebade
 */
export function StatsGrid() {
  const primaryColor = '${design.colors?.primary || "#6366f1"}';
  const stats = [
    { label: "Active Users", value: "12.4k", trend: "+12%" },
    { label: "Revenue", value: "\\$45,200", trend: "+8.5%" },
    { label: "Conversion", value: "3.2%", trend: "-1.2%" },
    { label: "Avg. Session", value: "4m 12s", trend: "+24%" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <p className="text-sm opacity-50 mb-1">{stat.label}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold font-mono">{stat.value}</h4>
            <span className={\`text-xs \${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}\`}>
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
`,
};

function generateComponentTest(componentName) {
  const name = toPascalCase(componentName);
  return `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${name} } from './${componentName}';
import React from 'react';

describe('${name} Component', () => {
  it('renders without crashing', () => {
    // Basic test to ensure target intent is present
    render(<${name} />);
    expect(document.body).toBeDefined();
  });
});
`;
}

function generateVitestConfig() {
  return `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
`;
}

// ============================================
// Page Generator
// ============================================
function generatePage(page, design) {
  const componentImports =
    page.components
      ?.map((c) => `import { ${toPascalCase(c)} } from '@/components/${c}';`)
      .join("\n") || "";

  const componentUsage =
    page.components
      ?.map((c) => `          <${toPascalCase(c)} />`)
      .join("\n") || "          {/* No components defined */}";

  return `import React from 'react';
${componentImports}

/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('${page.path}')
 * @intent('${page.intent}')
 */
export default function ${toPascalCase(page.intent)}Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight opacity-90">${toPascalCase(
            page.intent
          )}</h1>
          <p className="text-sm opacity-40 mt-1">Route: ${page.path}</p>
        </header>
        
        <main className="space-y-12">
${componentUsage}
        </main>
      </div>
    </div>
  );
}

// Auth: ${page.auth || "public"}
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
        test: "vitest",
      },
      dependencies: {
        next: "^14.0.0",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "lucide-react": "^0.294.0",
        clsx: "^2.0.0",
        "tailwind-merge": "^2.0.0",
      },
      devDependencies: {
        "@types/node": "^20.0.0",
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "@testing-library/react": "^14.1.2",
        "@vitejs/plugin-react": "^4.2.0",
        jsdom: "^22.1.0",
        vitest: "^0.34.6",
        autoprefixer: "^10.0.1",
        postcss: "^8",
        tailwindcss: "^3.3.0",
        typescript: "^5.0.0",
      },
    },
    null,
    2
  );
}

function generateTailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
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
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "react-jsx",
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
  return `import React from 'react';
import type { Metadata } from "next";
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
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: ${design.colors?.primary || "#6366f1"};
  --color-secondary: ${design.colors?.secondary || "#f59e0b"};
  --color-accent: ${design.colors?.accent || "#10b981"};
}

body {
  background: #020617;
  color: #f8fafc;
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
      : `import React from 'react';

/**
 * 🧠 Generated via ebade
 * Component: ${toPascalCase(component)}
 * Status: Placeholder
 */
export function ${toPascalCase(component)}() {
  return (
    <div className="p-8 border border-dashed border-white/20 rounded-3xl text-center opacity-50">
      <p className="text-lg font-medium">${toPascalCase(component)}</p>
      <p className="text-sm">Implement this component to complete the intent.</p>
    </div>
  );
}
`;

    fs.writeFileSync(path.join(projectDir, componentPath), content.trim());

    // Generate unit test
    const testPath = `components/${component}.test.tsx`;
    fs.writeFileSync(
      path.join(projectDir, testPath),
      generateComponentTest(component).trim()
    );

    stats.components++;
    stats.files += 2; // Component + Test
  });
  spinner2.succeed(
    `Generated ${colors.bright}${stats.components}${colors.reset} components (+ tests)`
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

  // tailwind.config.js
  fs.writeFileSync(
    path.join(projectDir, "tailwind.config.js"),
    generateTailwindConfig()
  );
  log.file("tailwind.config.js");

  // vitest.config.ts
  fs.writeFileSync(
    path.join(projectDir, "vitest.config.ts"),
    generateVitestConfig()
  );
  log.file("vitest.config.ts");

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
  init                       Create a new ebade project interactively
  scaffold <file> [output]   Scaffold a project from ebade file
  dev <file> [output]        Watch ebade file and re-scaffold on changes
  
${colors.dim}Examples:${colors.reset}
  npx ebade init
  npx ebade scaffold examples/saas-dashboard.ebade.yaml ./output
  npx ebade dev my-project.ebade.yaml ./my-app

${colors.dim}Learn more:${colors.reset}
  https://ebade.dev
`);
}

// ============================================
// Init Command (Interactive Setup)
// ============================================
async function init() {
  console.log(`
${LOGO}
`);

  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-ebade-app",
    },
    {
      type: "select",
      name: "template",
      message: "Choose a template:",
      choices: [
        { title: "SaaS Dashboard", value: "saas-dashboard" },
        { title: "E-commerce", value: "ecommerce" },
        { title: "Landing Page", value: "landing" },
        { title: "Empty Project", value: "empty" },
      ],
    },
    {
      type: "text",
      name: "primaryColor",
      message: "Primary color (hex):",
      initial: "#6366f1",
    },
    {
      type: "confirm",
      name: "autoScaffold",
      message: "Scaffold project now?",
      initial: true,
    },
  ]);

  if (!response.projectName) {
    console.log(`${colors.yellow}Cancelled.${colors.reset}`);
    process.exit(0);
  }

  const outputDir = `./${response.projectName}`;
  ensureDir(outputDir);

  let yamlContent;
  if (response.template === "empty") {
    yamlContent = `# ebade Project Configuration
# Generated by ebade init

project:
  name: ${response.projectName}
  type: custom
  version: "1.0.0"

design:
  style: minimal-modern
  colors:
    primary: "${response.primaryColor}"
    secondary: "#f59e0b"
  font: Inter
  borderRadius: md

pages:
  - path: /
    intent: landing-page
    components:
      - hero-section

api: []
data: []
`;
  } else {
    // Get the directory of the current script (cli/scaffold.js)
    const scriptDir = path.dirname(new URL(import.meta.url).pathname);
    const templatePath = path.join(
      scriptDir,
      "..",
      "examples",
      response.template === "saas-dashboard"
        ? "saas-dashboard.ebade.yaml"
        : "ecommerce.ebade.yaml"
    );
    if (fs.existsSync(templatePath)) {
      yamlContent = fs.readFileSync(templatePath, "utf-8");
      yamlContent = yamlContent.replace(
        /name: .*/,
        `name: ${response.projectName}`
      );
    } else {
      console.error(
        `${colors.red}Error:${colors.reset} Template not found. Using empty template.`
      );
      yamlContent = `project:\n  name: ${response.projectName}\n  type: custom\n`;
    }
  }

  const ebadeFilePath = path.join(outputDir, "project.ebade.yaml");
  fs.writeFileSync(ebadeFilePath, yamlContent);

  console.log(`
${colors.green}✓${colors.reset} Created ${colors.cyan}${ebadeFilePath}${colors.reset}
`);

  if (response.autoScaffold) {
    scaffold(ebadeFilePath, outputDir);
  } else {
    console.log(`
${colors.dim}Next steps:${colors.reset}
  ${colors.gray}1.${colors.reset} Edit ${colors.cyan}${ebadeFilePath}${colors.reset}
  ${colors.gray}2.${colors.reset} Run ${colors.cyan}npx ebade scaffold ${ebadeFilePath} ${outputDir}${colors.reset}
`);
  }
}

// ============================================
// Dev Command (Watch Mode)
// ============================================
function dev(ebadeFile, outputDir) {
  console.log(`
${LOGO}
`);

  console.log(
    `${colors.cyan}👀 Watching${colors.reset} ${colors.bright}${ebadeFile}${colors.reset} for changes...\n`
  );
  console.log(`${colors.dim}Press Ctrl+C to stop.${colors.reset}\n`);

  // Initial scaffold
  scaffold(ebadeFile, outputDir);

  // Watch for changes
  const watcher = chokidar.watch(ebadeFile, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", () => {
    console.log(
      `\n${colors.yellow}⚡ Change detected!${colors.reset} Re-scaffolding...\n`
    );
    scaffold(ebadeFile, outputDir);
  });

  watcher.on("error", (error) => {
    console.error(`${colors.red}Watcher error:${colors.reset}`, error);
  });
}

// ============================================
// Command Router
// ============================================
if (
  args.length === 0 ||
  command === "help" ||
  command === "--help" ||
  command === "-h"
) {
  showHelp();
  process.exit(0);
}

if (command === "init") {
  await init();
} else if (command === "scaffold") {
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
} else if (command === "dev") {
  const ebadeFile = args[1];
  const outputDir = args[2] || "./output";

  if (!ebadeFile) {
    console.error(
      `${colors.red}Error:${colors.reset} Please provide an ebade file path.`
    );
    console.log(
      `\n${colors.dim}Usage:${colors.reset} npx ebade dev <file.ebade.yaml> [output-dir]\n`
    );
    process.exit(1);
  }

  if (!fs.existsSync(ebadeFile)) {
    console.error(
      `${colors.red}Error:${colors.reset} ebade file not found: ${ebadeFile}`
    );
    process.exit(1);
  }

  dev(ebadeFile, outputDir);
} else {
  console.error(
    `${colors.red}Error:${colors.reset} Unknown command: ${command}`
  );
  showHelp();
  process.exit(1);
}
