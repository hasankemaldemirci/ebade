import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // @ts-ignore
    reactCompiler: true,
    // Fix monorepo workspace root warning
    // @ts-ignore
    outputFileTracingRoot: path.join(__dirname, "../"),
  },
};

export default nextConfig;
