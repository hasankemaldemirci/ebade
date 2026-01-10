import fs from "fs";

export function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export function toSnakeCase(str) {
  return str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace(/-/g, "_")
    .toLowerCase()
    .replace(/^_/, "");
}

export function hexToHsl(hex) {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) h = s = 0;
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
    l * 100
  )}%`;
}

export function mapToSqlType(type) {
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

export function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

import { execSync } from "child_process";

export function formatProject(projectDir) {
  try {
    // Try to use local prettier if it exists, otherwise npx
    execSync(
      `npx prettier --write "${projectDir}/**/*.{ts,tsx,js,jsx,html,css,json,yaml,md}" --ignore-path .gitignore`,
      {
        stdio: "ignore",
      }
    );
    return true;
  } catch (e) {
    return false;
  }
}
