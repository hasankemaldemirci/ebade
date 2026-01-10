import fs from "fs";
import path from "path";
import ora from "ora";
import { fileURLToPath } from "url";
import { TargetAdapter } from "./base.js";
import {
  toPascalCase,
  toSnakeCase,
  hexToHsl,
  ensureDir,
  mapToSqlType,
} from "../utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class NextJsAdapter extends TargetAdapter {
  constructor(colors, log) {
    super(colors, log);
    // Path to templates relative to this file (cli/adapters/nextjs.js)
    this.templateBaseDir = path.join(__dirname, "..", "templates");
  }

  generateBoilerplate(config, projectDir) {
    this.log.section("Creating Next.js directory structure");

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
      this.log.file(`${dir}/`);
    });

    // lib/utils.ts
    fs.writeFileSync(
      path.join(projectDir, "lib/utils.ts"),
      this.generateUtils()
    );
    this.log.file("lib/utils.ts");

    this.log.section("Generating Next.js config files");

    // package.json
    fs.writeFileSync(
      path.join(projectDir, "package.json"),
      this.generatePackageJson(config)
    );
    this.log.file("package.json");

    // next.config.mjs
    fs.writeFileSync(
      path.join(projectDir, "next.config.mjs"),
      this.generateNextConfig()
    );
    this.log.file("next.config.mjs");

    // tsconfig.json
    fs.writeFileSync(
      path.join(projectDir, "tsconfig.json"),
      this.generateTsConfig()
    );
    this.log.file("tsconfig.json");

    // tailwind.config.js
    fs.writeFileSync(
      path.join(projectDir, "tailwind.config.js"),
      this.generateTailwindConfig()
    );
    this.log.file("tailwind.config.js");

    // postcss.config.js
    fs.writeFileSync(
      path.join(projectDir, "postcss.config.js"),
      this.generatePostcssConfig()
    );
    this.log.file("postcss.config.js");

    // vitest.config.ts
    fs.writeFileSync(
      path.join(projectDir, "vitest.config.ts"),
      this.generateVitestConfig()
    );
    this.log.file("vitest.config.ts");

    // .gitignore
    fs.writeFileSync(
      path.join(projectDir, ".gitignore"),
      this.generateGitignore()
    );
    this.log.file(".gitignore");

    // .env.example
    fs.writeFileSync(
      path.join(projectDir, ".env.example"),
      this.generateEnvExample(config)
    );
    this.log.file(".env.example");

    // app/layout.tsx
    fs.writeFileSync(
      path.join(projectDir, "app/layout.tsx"),
      this.generateLayout(config)
    );
    this.log.file("app/layout.tsx");

    // next-env.d.ts
    fs.writeFileSync(
      path.join(projectDir, "next-env.d.ts"),
      `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n`
    );
    this.log.file("next-env.d.ts");

    // Design System
    this.log.section("Generating design system");
    const cssContent = this.generateGlobalsCss(config.design || {});
    fs.writeFileSync(
      path.join(projectDir, "app/globals.css"),
      cssContent.trim()
    );
    this.log.file("app/globals.css");

    // Agent Rules
    const agentRules = this.generateAgentRules(config).trim();
    fs.writeFileSync(path.join(projectDir, ".cursorrules"), agentRules);
    fs.writeFileSync(path.join(projectDir, ".clauderules"), agentRules);
    ensureDir(path.join(projectDir, ".github"));
    fs.writeFileSync(
      path.join(projectDir, ".github/copilot-instructions.md"),
      agentRules
    );
    this.log.file(
      ".cursorrules, .clauderules, .github/copilot-instructions.md"
    );

    // Database Schema
    if (config.data) {
      this.log.section("Generating database schema");
      ensureDir(path.join(projectDir, "database"));
      const schemaContent = this.generateDatabaseSchema(config.data);
      fs.writeFileSync(
        path.join(projectDir, "database/schema.sql"),
        schemaContent.trim()
      );
      this.log.file("database/schema.sql");
    }
  }

  generatePage(page, design) {
    const componentImports =
      page.components
        ?.map((c) => `import { ${toPascalCase(c)} } from '@/components/${c}';`)
        .join("\n") || "";
    const componentUsage =
      page.components
        ?.map((c) => `          <${toPascalCase(c)} />`)
        .join("\n") || "          {/* No components defined */}";

    return `import React from 'react';\n${componentImports}\n\n/**\n * 🧠 Generated via ebade - The Agent-First Framework\n * https://github.com/hasankemaldemirci/ebade\n * \n * @page('${
      page.path
    }')\n * @intent('${
      page.intent
    }')\n */\nexport default function ${toPascalCase(
      page.intent
    )}Page() {\n  return (\n    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200">\n      <main className="relative overflow-hidden">\n        {/* Ambient background glow */}\n        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />\n        \n        <div className="relative z-10">\n${componentUsage}\n        </div>\n      </main>\n    </div>\n  );\n}\n\n// Auth: ${
      page.auth || "public"
    }\n`;
  }

  generateComponent(componentName, design) {
    const templatePath = path.join(
      this.templateBaseDir,
      `${componentName}.tsx`
    );
    let content = "";

    if (fs.existsSync(templatePath)) {
      content = fs.readFileSync(templatePath, "utf-8");
      const primaryColor = design?.colors?.primary || "#6366f1";
      content = content.replace(/\{\{primary\}\}/g, primaryColor);
    } else {
      content = `import React from 'react';\nimport { cn } from "@/lib/utils";\n\n/**\n * 🧠 Generated via ebade\n * Component: ${toPascalCase(
        componentName
      )}\n * Status: Intent needs implementation\n */\nexport function ${toPascalCase(
        componentName
      )}() {\n  return (\n    <div className="p-12 glass-card rounded-[2.5rem] text-center min-h-[300px] flex flex-col items-center justify-center group hover:border-primary/50 transition-all">\n      <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">\n        <span className="text-3xl">✨</span>\n      </div>\n      <h3 className="text-2xl font-bold mb-3 text-white">${toPascalCase(
        componentName
      )}</h3>\n      <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">\n        This intent is defined for your AI agent. To customize, edit <code>components/${componentName}.tsx</code> or use the ebade compiler.\n      </p>\n    </div>\n  );\n}\n`;
    }

    const testContent = `import { describe, it, expect } from 'vitest';\nimport { render } from '@testing-library/react';\nimport { ${toPascalCase(
      componentName
    )} } from './${componentName}';\nimport React from 'react';\n\ndescribe('${toPascalCase(
      componentName
    )} Component', () => {\n  it('renders without crashing', () => {\n    render(<${toPascalCase(
      componentName
    )} />);\n    expect(document.body).toBeDefined();\n  });\n});\n`;

    return { content, testContent };
  }

  generateApiRoute(endpoint) {
    return endpoint.methods
      .map(
        (method) =>
          `\n/**\n * 🧠 Generated via ebade - The Agent-First Framework\n * ${method} ${
            endpoint.path
          }\n * Auth: ${
            endpoint.auth || "none"
          }\n */\nexport async function ${method}(request) {\n  // TODO: Implement ${method} handler\n  \n  return Response.json({ \n    message: "${method} ${
            endpoint.path
          } - Not implemented" \n  });\n}\n`
      )
      .join("\n");
  }

  // Helper Methods for Boilerplate
  generateUtils() {
    return `import { type ClassValue, clsx } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n`;
  }

  generatePackageJson(config) {
    return JSON.stringify(
      {
        name: config.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
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
          next: "^14.2.0",
          react: "^18.3.0",
          "react-dom": "^18.3.0",
          "lucide-react": "^0.400.0",
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

  generateNextConfig() {
    return `/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nexport default nextConfig;\n`;
  }

  generateTsConfig() {
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
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./*"] },
        },
        include: [
          "next-env.d.ts",
          "**/*.ts",
          "**/*.tsx",
          ".next/types/**/*.ts",
        ],
        exclude: ["node_modules"],
      },
      null,
      2
    );
  }

  generateTailwindConfig() {
    return `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  darkMode: ["class"],\n  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],\n  theme: {\n    extend: {\n      colors: {\n        border: "hsl(var(--border))",\n        input: "hsl(var(--input))",\n        ring: "hsl(var(--ring))",\n        background: "hsl(var(--background))",\n        foreground: "hsl(var(--foreground))",\n        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },\n        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },\n        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },\n        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },\n        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },\n        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },\n        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },\n      },\n      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },\n    },\n  },\n  plugins: [require("tailwindcss-animate")],\n}\n`;
  }

  generatePostcssConfig() {
    return `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }\n`;
  }

  generateVitestConfig() {
    return `import { defineConfig } from 'vitest/config';\nimport react from '@vitejs/plugin-react';\nimport path from 'path';\n\nexport default defineConfig({ plugins: [react()], test: { environment: 'jsdom', globals: true }, resolve: { alias: { '@': path.resolve(__dirname, './') } } });\n`;
  }

  generateGitignore() {
    return `/node_modules\n/.next/\n/out/\n/build\n.DS_Store\n*.pem\n.env*.local\n.env\n.vercel\nnext-env.d.ts\n`;
  }

  generateEnvExample(config) {
    return `# ebade Generated Environment Variables\n# Project: ${config.name}\n\nDATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"\nNEXTAUTH_SECRET="your-secret-here"\n`;
  }

  generateLayout(config) {
    const fontFamily = config.design?.font || "Inter";
    return `import React from 'react';\nimport type { Metadata } from "next";\nimport "./globals.css";\n\nexport const metadata: Metadata = { title: "${
      config.name
    }", description: "Built with ebade" };\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <head>\n        <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      " ",
      "+"
    )}:wght@400;500;600;700;800&display=swap" rel="stylesheet" />\n      </head>\n      <body>{children}</body>\n    </html>\n  );\n}\n`;
  }

  generateGlobalsCss(design) {
    const primary = design.colors?.primary || "#6366f1";
    return `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n \n@layer base {\n  :root {\n    --background: 222 47% 4%;\n    --foreground: 213 31% 91%;\n    --primary: ${hexToHsl(
      primary
    )};\n    --border: 216 34% 17%;\n    --radius: 1rem;\n  }\n}\n \n@layer base {\n  * { @apply border-border; }\n  body { @apply bg-background text-foreground antialiased; }\n}\n\n.glass-card { @apply bg-white/[0.03] border border-white/10 backdrop-blur-xl; }\n`;
  }

  generateDatabaseSchema(data) {
    let sql = "-- ebade Generated Database Schema\n\n";
    for (const [modelName, model] of Object.entries(data)) {
      sql += `-- Table: ${modelName}\nCREATE TABLE IF NOT EXISTS ${toSnakeCase(
        modelName
      )} (\n`;
      const fields = Object.entries(model.fields).map(
        ([fieldName, fieldDef]) => {
          const sqlType = mapToSqlType(fieldDef.type);
          return `  ${toSnakeCase(fieldName)} ${sqlType}${
            fieldDef.required ? " NOT NULL" : ""
          }${fieldDef.unique ? " UNIQUE" : ""}`;
        }
      );
      sql += fields.join(",\n") + "\n);\n\n";
    }
    return sql;
  }

  generateAgentRules(config) {
    return `# ebade Rules\n- Intent > Implementation\n- Source of Truth: project.ebade.yaml\n- Use CSS Variables: var(--color-primary)\n`;
  }
}
