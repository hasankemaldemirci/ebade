import { execSync } from "child_process";
import path from "path";
import fs from "fs";

interface BuildArgs {
  prompt: string;
  outputDir: string;
}

export async function buildFromPrompt(args: BuildArgs): Promise<string> {
  const { prompt, outputDir } = args;

  try {
    // Find the CLI script path
    // Assuming we are in packages/mcp-server/dist/tools/ (at runtime)
    // or packages/mcp-server/src/tools/ (at dev time)
    const cliPath = path.resolve(process.cwd(), "../../cli/scaffold.js");

    if (!fs.existsSync(cliPath)) {
      throw new Error(`CLI not found at ${cliPath}`);
    }

    console.log(`🚀 Executing ebade build from prompt: "${prompt}"`);

    // Execute the CLI command
    // We pass the prompt as an argument.
    // We need to handle the outputDir carefully.
    // The CLI build command currently uses its own naming logic,
    // but it creates the folder in the current process.cwd().

    const cmd = `node "${cliPath}" build "${prompt}"`;

    // Run in the specified outputDir if provided
    const result = execSync(cmd, {
      cwd: outputDir,
      encoding: "utf-8",
      env: { ...process.env, NODE_ENV: "production" },
    });

    return `✅ ebade v0.4.7 Build Complete!
    
Prompt: "${prompt}"
Output: ${outputDir}

CLI Output:
${result}

Next Steps:
1. Navigate to the generated folder.
2. Run 'npm install && npm run dev'.
3. Enjoy your turnkey project!`;
  } catch (error) {
    throw new Error(
      `Build failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
