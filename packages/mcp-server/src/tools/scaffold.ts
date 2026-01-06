/**
 * Scaffold Tool
 *
 * Creates a complete project structure from an intent definition.
 */

import fs from "fs";
import path from "path";
import yaml from "yaml";

interface ScaffoldArgs {
  projectName: string;
  projectType: string;
  features?: string[];
  outputDir: string;
}

// Project type templates
const projectTemplates: Record<string, any> = {
  "e-commerce": {
    pages: [
      {
        path: "/",
        intent: "landing-page",
        components: ["hero-section", "featured-products", "testimonials"],
      },
      {
        path: "/products",
        intent: "product-listing",
        components: ["search-bar", "filter-sidebar", "product-grid"],
      },
      {
        path: "/products/[slug]",
        intent: "product-detail",
        components: [
          "product-gallery",
          "product-info",
          "add-to-cart",
          "reviews",
        ],
      },
      {
        path: "/cart",
        intent: "shopping-cart",
        components: ["cart-items", "cart-summary", "checkout-cta"],
      },
      {
        path: "/checkout",
        intent: "checkout-flow",
        auth: "required",
        components: ["checkout-form", "payment-section", "order-summary"],
      },
    ],
    data: {
      Product: {
        fields: {
          id: { type: "uuid", required: true },
          name: { type: "string", required: true },
          price: { type: "decimal", required: true },
          images: { type: "array" },
          category: { type: "string" },
          stock: { type: "integer" },
        },
      },
      Cart: {
        fields: {
          id: { type: "uuid", required: true },
          items: { type: "array", required: true },
          total: { type: "decimal", required: true },
        },
      },
    },
  },
  "saas-dashboard": {
    pages: [
      {
        path: "/",
        intent: "landing-page",
        components: ["hero", "features", "pricing", "cta"],
      },
      {
        path: "/dashboard",
        intent: "dashboard",
        auth: "required",
        components: ["stats-cards", "chart-section", "recent-activity"],
      },
      {
        path: "/settings",
        intent: "settings",
        auth: "required",
        components: ["profile-form", "security-settings", "billing-section"],
      },
    ],
    data: {
      User: {
        fields: {
          id: { type: "uuid", required: true },
          email: { type: "string", required: true, unique: true },
          name: { type: "string", required: true },
          plan: { type: "enum" },
        },
      },
    },
  },
  blog: {
    pages: [
      {
        path: "/",
        intent: "blog-home",
        components: ["featured-post", "post-grid", "newsletter"],
      },
      {
        path: "/posts",
        intent: "post-listing",
        components: ["post-list", "search", "categories"],
      },
      {
        path: "/posts/[slug]",
        intent: "post-detail",
        components: ["post-content", "author-bio", "comments", "related-posts"],
      },
    ],
    data: {
      Post: {
        fields: {
          id: { type: "uuid", required: true },
          title: { type: "string", required: true },
          slug: { type: "string", required: true, unique: true },
          content: { type: "text", required: true },
          publishedAt: { type: "timestamp" },
        },
      },
    },
  },
  "landing-page": {
    pages: [
      {
        path: "/",
        intent: "landing",
        components: [
          "hero",
          "features",
          "testimonials",
          "pricing",
          "faq",
          "cta",
          "footer",
        ],
      },
    ],
    data: {},
  },
  portfolio: {
    pages: [
      {
        path: "/",
        intent: "portfolio-home",
        components: ["hero", "about", "projects-grid", "skills", "contact"],
      },
      {
        path: "/projects/[slug]",
        intent: "project-detail",
        components: ["project-gallery", "project-info", "tech-stack"],
      },
    ],
    data: {
      Project: {
        fields: {
          id: { type: "uuid", required: true },
          title: { type: "string", required: true },
          description: { type: "text" },
          images: { type: "array" },
          link: { type: "string" },
        },
      },
    },
  },
};

// Component templates
const componentTemplates: Record<string, (name: string) => string> = {
  default: (name: string) => {
    const pascalName = name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
    return `"use client";

import { useState } from "react";

interface ${pascalName}Props {
  className?: string;
}

export function ${pascalName}({ className }: ${pascalName}Props) {
  return (
    <section className={\`${name} \${className || ""}\`}>
      <div className="container">
        {/* ${pascalName} content */}
        <h2>${pascalName}</h2>
      </div>
    </section>
  );
}
`;
  },
};

// Page template
function generatePageTemplate(page: any): string {
  const componentImports = (page.components || [])
    .map((c: string) => {
      const pascalName = c
        .split("-")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
      return `import { ${pascalName} } from "@/components/${c}";`;
    })
    .join("\n");

  const componentUsage = (page.components || [])
    .map((c: string) => {
      const pascalName = c
        .split("-")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
      return `      <${pascalName} />`;
    })
    .join("\n");

  const pageName = page.intent
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  return `/**
 * @page('${page.path}')
 * @ebade('${page.intent}')
 * ${page.auth ? `@requires({ auth: '${page.auth}' })` : ""}
 */

${componentImports}

export default function ${pageName}Page() {
  return (
    <main className="page ${page.intent}">
${componentUsage}
    </main>
  );
}
`;
}

// Generate package.json
function generatePackageJson(projectName: string, projectType: string): string {
  return JSON.stringify(
    {
      name: projectName,
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
        typescript: "^5.3.0",
      },
      ebade: {
        type: projectType,
        version: "0.1.0",
      },
    },
    null,
    2
  );
}

// Generate globals.css
function generateGlobalsCss(): string {
  return `/* ebade Generated Design System */

:root {
  --color-primary: #6366f1;
  --color-secondary: #f59e0b;
  --color-accent: #10b981;
  
  --font-family: 'Inter', system-ui, sans-serif;
  
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
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
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page {
  min-height: 100vh;
}
`;
}

export async function scaffoldProject(args: ScaffoldArgs) {
  const { projectName, projectType, features = [], outputDir } = args;

  // Get template for project type
  const template = projectTemplates[projectType];
  if (!template) {
    throw new Error(
      `Unknown project type: ${projectType}. Available: ${Object.keys(
        projectTemplates
      ).join(", ")}`
    );
  }

  // Create project directory
  const projectDir = path.join(outputDir, projectName);

  // Create directory structure
  const dirs = ["", "app", "components", "lib", "styles", "public", "types"];

  for (const dir of dirs) {
    const fullPath = path.join(projectDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }

  // Track created files
  const createdFiles: string[] = [];

  // Generate pages
  for (const page of template.pages) {
    // Create page directory if needed
    const pagePath =
      page.path === "/"
        ? "app/page.tsx"
        : `app${page.path.replace("[", "(").replace("]", ")")}/page.tsx`;

    const pageDir = path.dirname(path.join(projectDir, pagePath));
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    // Write page file
    const pageContent = generatePageTemplate(page);
    fs.writeFileSync(path.join(projectDir, pagePath), pageContent);
    createdFiles.push(pagePath);

    // Generate component files
    for (const component of page.components || []) {
      const componentPath = `components/${component}.tsx`;
      const fullComponentPath = path.join(projectDir, componentPath);

      if (!fs.existsSync(fullComponentPath)) {
        const componentContent = componentTemplates.default(component);
        fs.writeFileSync(fullComponentPath, componentContent);
        createdFiles.push(componentPath);
      }
    }
  }

  // Generate package.json
  fs.writeFileSync(
    path.join(projectDir, "package.json"),
    generatePackageJson(projectName, projectType)
  );
  createdFiles.push("package.json");

  // Generate globals.css
  fs.writeFileSync(
    path.join(projectDir, "styles/globals.css"),
    generateGlobalsCss()
  );
  createdFiles.push("styles/globals.css");

  // Generate intent file for reference
  const intentContent = yaml.stringify({
    name: projectName,
    type: projectType,
    features: features,
    pages: template.pages,
    data: template.data,
    design: {
      style: "minimal-modern",
      colors: {
        primary: "#6366f1",
        secondary: "#f59e0b",
        accent: "#10b981",
      },
    },
  });
  fs.writeFileSync(path.join(projectDir, "project.ebade.yaml"), intentContent);
  createdFiles.push("project.ebade.yaml");

  // Generate layout
  const layoutContent = `import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "${projectName}",
  description: "Built with ebade",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`;
  fs.writeFileSync(path.join(projectDir, "app/layout.tsx"), layoutContent);
  // Copy globals.css to app folder for Next.js
  fs.writeFileSync(
    path.join(projectDir, "app/globals.css"),
    generateGlobalsCss()
  );
  createdFiles.push("app/layout.tsx", "app/globals.css");

  return {
    content: [
      {
        type: "text",
        text: `✅ Successfully scaffolded "${projectName}" (${projectType})

📁 Project created at: ${projectDir}

📄 Files created:
${createdFiles.map((f) => `  • ${f}`).join("\n")}

🚀 Next steps:
  1. cd ${projectDir}
  2. npm install
  3. npm run dev

📋 ebade file saved as: project.ebade.yaml
   This can be used by AI agents to understand and iterate on the project.
`,
      },
    ],
  };
}
