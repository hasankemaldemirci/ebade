#!/usr/bin/env node

/**
 * ebade CLI Scaffold Tool
 *
 * This tool reads an .ebade.yaml file and scaffolds
 * a project structure for AI Agents.
 */

import fs from "fs";
import path from "path";
import yaml from "yaml";
import ora from "ora";
import prompts from "prompts";
import chokidar from "chokidar";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// Adatpers
import { NextJsAdapter } from "./adapters/nextjs.js";
import { HtmlVanillaAdapter } from "./adapters/html-vanilla.js";
import { ensureDir } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// ANSI Colors
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

const LOGO = `
${colors.magenta}    ███████╗${colors.cyan}██████╗  ${colors.magenta}█████╗ ${colors.cyan}██████╗ ${colors.magenta}███████╗
${colors.magenta}    ██╔════╝${colors.cyan}██╔══██╗${colors.magenta}██╔══██╗${colors.cyan}██╔══██╗${colors.magenta}██╔════╝
${colors.magenta}    █████╗  ${colors.cyan}██████╔╝${colors.magenta}███████║${colors.cyan}██║  ██║${colors.magenta}█████╗  
${colors.magenta}    ██╔══╝  ${colors.cyan}██╔══██╗${colors.magenta}██╔══██║${colors.cyan}██║  ██║${colors.magenta}██╔══╝  
${colors.magenta}    ███████╗${colors.cyan}██████╔╝${colors.magenta}██║  ██║${colors.cyan}██████╔╝${colors.magenta}███████╗
${colors.magenta}    ╚══════╝${colors.cyan}╚═════╝ ${colors.magenta}╚═╝  ╚═╝${colors.cyan}╚═════╝ ${colors.magenta}╚══════╝${colors.reset}
    
    ${colors.dim}✨ Agent-First Framework ${colors.yellow}v0.4.6${colors.reset}
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
// ebade Architect (The Brain)
// ============================================
export class EbadeArchitect {
  static async plan(prompt) {
    const p = prompt.toLowerCase();
    let type = "saas-dashboard";
    if (p.includes("e-commerce") || p.includes("shop") || p.includes("store"))
      type = "e-commerce";
    if (p.includes("blog") || p.includes("article") || p.includes("news"))
      type = "blog";
    if (p.includes("portfolio") || p.includes("personal") || p.includes("cv"))
      type = "portfolio";

    const components = ["navbar", "footer"];
    const features = [];
    const has = (keyword) => new RegExp(`\\b${keyword}`, "i").test(p);

    if (has("chart") || has("analytics") || has("graph") || has("metric")) {
      components.push("activity-chart", "stats-grid");
      features.push("Advanced Analytics");
    }
    if (has("saas") || has("dashboard") || has("admin")) {
      components.push("sidebar-navigation", "metrics-cards");
      features.push("Admin Dashboard");
    }
    if (has("login") || has("auth") || has("sign") || has("user")) {
      components.push("login-form", "signup-form");
      features.push("Authentication");
    }
    if (has("price") || has("plan") || has("subscribe") || has("billing")) {
      components.push("pricing-table", "cta-banner");
      features.push("Subscription Tiers");
    }
    if (has("testim") || has("review") || has("social proof"))
      components.push("testimonials-grid");
    if (has("contact") || has("form") || has("help") || has("support"))
      components.push("contact-form");
    if (has("faq") || has("question")) components.push("faq-accordion");

    let primary = "#6366f1";
    if (has("gold") || has("luxury") || has("premium") || has("exclusive"))
      primary = "#fbbf24";
    if (has("green") || has("eco") || has("emerald") || has("nature"))
      primary = "#10b981";
    if (
      has("blue") ||
      has("ocean") ||
      has("sky") ||
      has("trust") ||
      has("corp")
    )
      primary = "#3b82f6";
    if (has("violet") || has("purple") || has("creative") || has("design"))
      primary = "#8b5cf6";
    if (has("orange") || has("fire") || has("warm") || has("brand"))
      primary = "#f59e0b";
    if (has("red") || has("danger") || has("hot") || has("love"))
      primary = "#ef4444";

    const pages = [
      {
        path: "/",
        intent: "landing-page",
        components: components.filter((c) =>
          [
            "navbar",
            "hero-section",
            "pricing-table",
            "testimonials-grid",
            "cta-banner",
            "footer",
          ].includes(c)
        ),
      },
    ];

    if (type === "saas-dashboard") {
      pages.push({
        path: "/dashboard",
        intent: "main-dashboard",
        components: components.filter((c) =>
          [
            "sidebar-navigation",
            "stats-grid",
            "activity-chart",
            "metrics-cards",
          ].includes(c)
        ),
      });
    } else if (type === "e-commerce") {
      pages.push(
        {
          path: "/products",
          intent: "product-list",
          components: ["product-grid"],
        },
        { path: "/cart", intent: "shopping-cart", components: ["cart-list"] }
      );
    } else if (type === "blog") {
      pages.push(
        { path: "/posts", intent: "blog-index", components: ["post-list"] },
        {
          path: "/posts/[slug]",
          intent: "blog-post",
          components: ["post-body"],
        }
      );
    }

    const config = {
      name:
        p
          .split(" ")
          .filter(
            (w) =>
              ![
                "can",
                "you",
                "make",
                "create",
                "a",
                "an",
                "the",
                "with",
                "please",
                "super",
                "ultra",
                "is",
                "for",
                "me",
                "my",
                "and",
              ].includes(w.toLowerCase())
          )
          .slice(0, 2)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join("") || "EbadeApp",
      type: type,
      description: prompt,
      features: features.length > 0 ? features : ["Turnkey Scaffold"],
      design: { colors: { primary }, style: "glass-modern" },
      pages: pages,
      api: [{ path: "/api/data", methods: ["GET"], intent: "fetch-data" }],
    };
    return config;
  }
}

// ============================================
// ebade Parser
// ============================================
function parseEbade(ebadePath) {
  const content = fs.readFileSync(ebadePath, "utf-8");
  return yaml.parse(content);
}

// ============================================
// Main Scaffold Function
// ============================================
async function scaffold(ebadePath, outputDir, target = "nextjs") {
  const startTime = Date.now();
  const stats = {
    pages: 0,
    components: 0,
    apiRoutes: 0,
    files: 0,
    tokenSavings: 0,
  };

  console.log(LOGO);

  // Load Adapter
  let adapter;
  if (target === "html") {
    adapter = new HtmlVanillaAdapter(colors, log);
  } else {
    adapter = new NextJsAdapter(colors, log);
  }

  // Parse ebade file
  log.info(`Reading ebade file: ${ebadePath}`);
  const config = parseEbade(ebadePath);
  log.success(
    `Parsed ebade for project: ${colors.bright}${config.name}${colors.reset} (Target: ${target})`
  );

  const projectDir = outputDir.endsWith(config.name)
    ? outputDir
    : path.join(outputDir, config.name);
  ensureDir(projectDir);

  // ========== Generate Boilerplate ==========
  adapter.generateBoilerplate(config, projectDir);

  // ========== Generate Pages ==========
  log.section("Generating pages");
  if (config.pages) {
    const spinner = ora("Generating pages...").start();
    config.pages.forEach((page) => {
      const pagePath =
        page.path === "/"
          ? target === "html"
            ? "index.html"
            : "app/page.tsx"
          : target === "html"
            ? `${page.intent}.html`
            : `app${page.path.replace("[", "(").replace("]", ")")}/page.tsx`;

      const pageDir = path.dirname(path.join(projectDir, pagePath));
      ensureDir(pageDir);

      const pageContent = adapter.generatePage(page, config.design);
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
    const { content, testContent } = adapter.generateComponent(
      component,
      config.design
    );
    stats.tokenSavings += Math.floor(content.length / 4);

    const componentExt = target === "html" ? "html" : "tsx";
    const componentPath =
      target === "html"
        ? `components/${component}.html`
        : `components/${component}.tsx`;
    ensureDir(path.join(projectDir, "components"));
    fs.writeFileSync(path.join(projectDir, componentPath), content.trim());

    if (target !== "html") {
      const testPath = `tests/components/${component}.test.tsx`;
      ensureDir(path.dirname(path.join(projectDir, testPath)));
      fs.writeFileSync(path.join(projectDir, testPath), testContent.trim());
      stats.files += 2;
    } else {
      stats.files++;
    }
    stats.components++;
  });
  spinner2.succeed(
    `Generated ${colors.bright}${stats.components}${colors.reset} components (+ tests)`
  );

  // ========== Generate API Routes ==========
  if (config.api) {
    log.section("Generating API routes");
    const spinner3 = ora("Generating API routes...").start();
    config.api.forEach((endpoint) => {
      const apiPath =
        target === "html"
          ? `api/${endpoint.intent}.js`
          : `app/api${endpoint.path.replace("/api", "")}/route.ts`;
      ensureDir(path.dirname(path.join(projectDir, apiPath)));
      fs.writeFileSync(
        path.join(projectDir, apiPath),
        adapter.generateApiRoute(endpoint).trim()
      );
      stats.apiRoutes++;
      stats.files++;
    });
    spinner3.succeed(
      `Generated ${colors.bright}${stats.apiRoutes}${colors.reset} API routes`
    );
  }

  // ========== Generate ebade Copy ==========
  log.section("Copying ebade file");
  fs.copyFileSync(ebadePath, path.join(projectDir, "project.ebade.yaml"));
  log.file("project.ebade.yaml (for agent reference)");

  // ========== Format Output ==========
  const formatSpinner = ora("Formatting codebase for production...").start();
  import("./utils.js").then(({ formatProject }) => {
    formatProject(projectDir);
    formatSpinner.succeed("Codebase formatted & linted");
  });

  // ========== Summary ==========
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `\n${colors.bright}${colors.green}  ✅ ebade scaffold complete!${colors.reset}\n  Project: ${config.name}\n  Target:  ${target}\n  Files:   ${stats.files}\n  Time:    ${duration}s\n`
  );
}

// CLI Logic
const args = process.argv.slice(2);
const command = args[0];

// Simple argument parser for --target
function getFlag(flag) {
  const index = args.indexOf(flag);
  if (index !== -1 && args[index + 1]) return args[index + 1];
  return null;
}

const target = getFlag("--target") || "nextjs";

if (command === "init") {
  // ... init implementation (could be refactored too)
} else if (command === "build") {
  const prompt = args
    .filter((a) => !a.startsWith("-"))
    .slice(1)
    .join(" ");
  if (!prompt) {
    console.error("Prompt required");
    process.exit(1);
  }
  const config = await EbadeArchitect.plan(prompt);
  const tempDir = path.join(process.cwd(), ".ebade_temp");
  ensureDir(tempDir);
  const tempFile = path.join(tempDir, "project.ebade.yaml");
  fs.writeFileSync(tempFile, yaml.stringify(config));
  await scaffold(tempFile, "./", target);
  fs.rmSync(tempDir, { recursive: true, force: true });
} else if (command === "scaffold") {
  const file = args.filter((a) => !a.startsWith("-"))[1];
  const out = args.filter((a) => !a.startsWith("-"))[2] || "./output";
  await scaffold(file, out, target);
} else {
  console.log(
    "ebade v0.4.6 - Next Gen Scaffolder\nUsage: npx ebade <build|scaffold> <prompt|file> [--target nextjs|html]"
  );
}
