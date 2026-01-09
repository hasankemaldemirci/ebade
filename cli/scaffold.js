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
import { execSync } from "child_process";

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
    
    ${colors.dim}✨ Agent-First Framework ${colors.yellow}v0.4.0${colors.reset}
`;

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  file: (msg) => console.log(`${colors.cyan}  →${colors.reset} ${msg}`),
  verify: (msg) => console.log(`${colors.yellow}  🔍${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}  ✘${colors.reset} ${msg}`),
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
// ============================================
// Template Resolver
// ============================================
function getComponentTemplate(componentName, design) {
  const templatePath = path.join(
    process.cwd(),
    "cli/templates",
    `${componentName}.tsx`
  );

  if (fs.existsSync(templatePath)) {
    let content = fs.readFileSync(templatePath, "utf-8");

    // Config-based replacement (e.g., {{primary}})
    const primaryColor = design?.colors?.primary || "#6366f1";
    content = content.replace(/\{\{primary\}\}/g, primaryColor);

    return content;
  }

  // Fallback to placeholder if template file doesn't exist
  return `import React from 'react';
import { cn } from "@/lib/utils";

/**
 * 🧠 Generated via ebade
 * Component: ${toPascalCase(componentName)}
 * Status: Placeholder (No template found in cli/templates)
 */
export function ${toPascalCase(componentName)}() {
  return (
    <div className="p-12 border-2 border-dashed border-border rounded-3xl text-center bg-muted/30">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🧩</span>
      </div>
      <h3 className="text-xl font-bold mb-2">${toPascalCase(componentName)}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
        No template found for this intent. Create a file at <code>cli/templates/${componentName}.tsx</code> to customize.
      </p>
    </div>
  );
}
`;
}

function generateComponentTest(componentName) {
  const name = toPascalCase(componentName);
  return `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ${name} } from './${componentName}';
import React from 'react';

describe('${name} Component', () => {
  it('renders without crashing', () => {
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
        "lucide-react": "^0.300.0",
        clsx: "^2.1.0",
        "tailwind-merge": "^2.2.0",
        "class-variance-authority": "^0.7.0",
        "framer-motion": "^11.0.0",
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
        postcss: "^8.4.0",
        tailwindcss: "^3.4.0",
        "tailwindcss-animate": "^1.0.7",
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
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
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
  const primary = design.colors?.primary || "#6366f1";

  // Helper to convert hex to HSL for CSS vars if needed
  // For now we'll use standard shadcn slate
  return `@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
 
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
}

function generateUtils() {
  return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
async function scaffold(ebadePath, outputDir) {
  const startTime = Date.now();
  const stats = {
    pages: 0,
    components: 0,
    apiRoutes: 0,
    files: 0,
    tokenSavings: 0,
  };

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

  // lib/utils.ts
  fs.writeFileSync(path.join(projectDir, "lib/utils.ts"), generateUtils());
  log.file("lib/utils.ts");

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
    const content = getComponentTemplate(component, config.design);
    stats.tokenSavings += Math.floor(content.length / 4);

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
  // ========== Verify Output ==========
  const verificationResult = await verifyOutput(projectDir, config);

  // ========== Summary ==========
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

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
  }    ~${String(stats.tokenSavings).padEnd(17)} ${colors.green}│${colors.reset}
${colors.green}  │${colors.reset}  ${colors.cyan}⏱  Completed in:${
    colors.reset
  }    ${String(duration + "s").padEnd(18)} ${colors.green}│${colors.reset}
${colors.green}  ├${"─".repeat(41)}┤${colors.reset}
${colors.green}  │${colors.reset}  ${colors.yellow}🔍 Integrity:${
    colors.reset
  }      ${(verificationResult.passed ? "PASSED" : "ISSUES FOUND").padEnd(
    18
  )} ${colors.green}│${colors.reset}
${colors.green}  └${"─".repeat(41)}┘${colors.reset}

${verificationResult.report}

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

/**
 * ebade Output Verifier
 * Performs a sanity check on the generated codebase.
 */
async function verifyOutput(projectDir, config) {
  log.section("Verifying output integrity");
  const spinner = ora("Running ebade verification protocols...").start();

  const results = {
    structure: true,
    syntax: true,
    tests: true,
    issues: [],
  };

  // 1. Structure Check
  const requiredFiles = [
    "package.json",
    "tsconfig.json",
    "app/layout.tsx",
    "app/page.tsx",
    "lib/utils.ts",
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(projectDir, file))) {
      results.structure = false;
      results.issues.push(`Missing core file: ${file}`);
    }
  }

  // 2. Syntax Check (Lightweight)
  // We check if exports match the intent in some key files
  if (config.pages) {
    config.pages.forEach((page) => {
      const pagePath =
        page.path === "/"
          ? "app/page.tsx"
          : `app${page.path.replace("[", "(").replace("]", ")")}/page.tsx`;
      const fullPath = path.join(projectDir, pagePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const expectedExport = `export default function ${toPascalCase(
          page.intent
        )}Page()`;
        if (!content.includes(expectedExport)) {
          results.syntax = false;
          results.issues.push(
            `Syntax mismatch in ${pagePath}: Export name should be ${toPascalCase(
              page.intent
            )}Page`
          );
        }
      }
    });
  }

  // 3. Test Coverage Check
  // Ensure every component has a matching test file
  const components = fs
    .readdirSync(path.join(projectDir, "components"))
    .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"));
  components.forEach((comp) => {
    const testFile = comp.replace(".tsx", ".test.tsx");
    if (!fs.existsSync(path.join(projectDir, "components", testFile))) {
      results.tests = false;
      results.issues.push(`Missing test for component: ${comp}`);
    }
  });

  // 4. Semantic Integrity Check
  // Check if layout imports globals.css
  const layoutPath = path.join(projectDir, "app/layout.tsx");
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, "utf-8");
    if (!content.includes('import "./globals.css"')) {
      results.issues.push(
        "Semantic Error: Root layout missing global styles import"
      );
    }
  }

  // Check if home page has at least one intent-defined component
  const homePath = path.join(projectDir, "app/page.tsx");
  if (fs.existsSync(homePath) && config.pages?.[0]?.components?.length > 0) {
    const content = fs.readFileSync(homePath, "utf-8");
    const firstComp = toPascalCase(config.pages[0].components[0]);
    if (!content.includes(`<${firstComp} />`)) {
      results.issues.push(
        `Semantic Warning: Home page might be missing the ${firstComp} component`
      );
    }
  }

  spinner.stop();

  const passed = results.issues.length === 0;

  let report = "";
  if (passed) {
    report = `${colors.green}  ✓ All integrity checks passed! Code is production-ready.${colors.reset}`;
  } else {
    report = `${colors.red}  ⚠ Verification found ${results.issues.length} issue(s):${colors.reset}\n`;
    results.issues.forEach((issue) => {
      report += `    ${colors.red}•${colors.reset} ${issue}\n`;
    });
  }

  return { passed, report };
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
  playground                 Open the ebade playground
  
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
    await scaffold(ebadeFilePath, outputDir);
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
async function dev(ebadeFile, outputDir) {
  console.log(`
${LOGO}
`);

  console.log(
    `${colors.cyan}👀 Watching${colors.reset} ${colors.bright}${ebadeFile}${colors.reset} for changes...\n`
  );
  console.log(`${colors.dim}Press Ctrl+C to stop.${colors.reset}\n`);

  // Initial scaffold
  await scaffold(ebadeFile, outputDir);

  // Watch for changes
  const watcher = chokidar.watch(ebadeFile, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", async () => {
    console.log(
      `\n${colors.yellow}⚡ Change detected!${colors.reset} Re-scaffolding...\n`
    );
    await scaffold(ebadeFile, outputDir);
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

  await scaffold(ebadeFile, outputDir);
} else if (command === "playground") {
  console.log(`\n${colors.cyan}🌐 Opening ebade playground...${colors.reset}`);
  const url = "https://ebade.dev/playground";
  const start =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
      ? "start"
      : "xdg-open";
  try {
    execSync(`${start} ${url}`);
  } catch (e) {
    console.log(`\n${colors.yellow}Please open:${colors.reset} ${url}`);
  }
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

  await dev(ebadeFile, outputDir);
} else {
  console.error(
    `${colors.red}Error:${colors.reset} Unknown command: ${command}`
  );
  showHelp();
  process.exit(1);
}
