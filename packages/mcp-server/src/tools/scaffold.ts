/**
 * Scaffold Tool
 *
 * v0.3.0 - Integrated with standard ebade templates
 */

import fs from "fs";
import path from "path";
import yaml from "yaml";

interface ScaffoldArgs {
  projectName: string;
  projectType:
    | "SaaS Dashboard"
    | "E-commerce"
    | "Landing Page"
    | "Empty Project";
  primaryColor?: string;
  outputDir: string;
}

const TEMPLATES: Record<string, any> = {
  "SaaS Dashboard": {
    features: ["user-auth", "billing", "analytics", "team-management"],
    pages: [
      {
        path: "/",
        intent: "landing-page",
        components: ["hero", "features", "pricing"],
      },
      {
        path: "/dashboard",
        intent: "main-dashboard",
        auth: "required",
        components: ["stats-grid", "activity-chart"],
      },
      {
        path: "/settings",
        intent: "user-settings",
        auth: "required",
        components: ["profile-form", "security"],
      },
    ],
    design: { style: "modern-glassmorphism", borderRadius: "xl" },
  },
  "E-commerce": {
    features: ["product-catalog", "shopping-cart", "checkout", "search"],
    pages: [
      {
        path: "/",
        intent: "home-page",
        components: ["hero-section", "product-grid"],
      },
      {
        path: "/cart",
        intent: "shopping-cart",
        components: ["cart-list", "checkout-cta"],
      },
      {
        path: "/checkout",
        intent: "checkout-flow",
        auth: "required",
        components: ["payment-form"],
      },
    ],
    design: { style: "clean-minimal", borderRadius: "md" },
  },
  "Landing Page": {
    features: ["hero", "features", "testimonials", "cta", "footer"],
    pages: [
      {
        path: "/",
        intent: "landing-page",
        components: [
          "hero",
          "feature-grid",
          "testimonial-slider",
          "cta-section",
        ],
      },
    ],
    design: { style: "premium-dark", borderRadius: "full" },
  },
  "Empty Project": {
    features: [],
    pages: [{ path: "/", intent: "index", components: ["welcome"] }],
    design: { style: "minimal", borderRadius: "md" },
  },
};

export async function scaffoldProject(args: ScaffoldArgs): Promise<string> {
  const {
    projectName,
    projectType,
    primaryColor = "#6366f1",
    outputDir,
  } = args;

  const template = TEMPLATES[projectType];
  const projectDir = path.join(outputDir, projectName);

  try {
    // 1. Create directory structure
    const dirs = [
      "app/api",
      "components",
      "lib",
      "styles",
      "public",
      "types",
      "database",
    ];
    if (!fs.existsSync(projectDir))
      fs.mkdirSync(projectDir, { recursive: true });

    dirs.forEach((d) => {
      const fullPath = path.join(projectDir, d);
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
    });

    // 2. Generate ebade file
    const ebadeConfig = {
      name: projectName,
      type: projectType.toLowerCase().replace(" ", "-"),
      description: `Generated ${projectType} via ebade MCP`,
      features: template.features,
      pages: template.pages,
      design: {
        ...template.design,
        colors: { primary: primaryColor },
      },
    };

    fs.writeFileSync(
      path.join(projectDir, "project.ebade.yaml"),
      yaml.stringify(ebadeConfig)
    );

    // 3. Generate Next.js files (Basic mocks to match CLI)
    generateCoreFiles(projectDir, ebadeConfig);

    return `✅ ebade v0.3.0 Scaffold Complete!
    
Project: ${projectName}
Type: ${projectType}
Dir: ${projectDir}

Next Steps:
1. Open this folder in Cursor/Claude
2. Run 'npx ebade dev project.ebade.yaml' to start the agent engine.`;
  } catch (error) {
    throw new Error(
      `Scaffold failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

function generateCoreFiles(projectDir: string, config: any) {
  // package.json
  const pkg = {
    name: config.name,
    version: "0.1.0",
    dependencies: {
      next: "latest",
      react: "latest",
      "react-dom": "latest",
      "lucide-react": "latest",
    },
    devDependencies: {
      "@types/node": "latest",
      "@types/react": "latest",
      "@types/react-dom": "latest",
      autoprefixer: "latest",
      postcss: "latest",
      tailwindcss: "latest",
      typescript: "latest",
    },
    scripts: { dev: "next dev", build: "next build", start: "next start" },
  };
  fs.writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify(pkg, null, 2)
  );

  // tsconfig.json (Basic version)
  const tsconfig = {
    compilerOptions: {
      target: "es5",
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
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"],
  };
  fs.writeFileSync(
    path.join(projectDir, "tsconfig.json"),
    JSON.stringify(tsconfig, null, 2)
  );

  // .cursorrules
  const rules = `
# ebade Agent Rules for ${config.name}
- Respect project.ebade.yaml as the source of truth.
- Follow the ${config.design.style} design style.
- Use ${config.design.colors.primary} as the primary color.
- Always import React from 'react' in .tsx files.
`;
  fs.writeFileSync(path.join(projectDir, ".cursorrules"), rules);
}
