import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function simulate() {
  console.clear();
  console.log(
    chalk.bold.cyan("\n--- ebade Playground: Total Agent-First Flow ---")
  );
  console.log(
    chalk.gray("Testing User Prompt: 'Make a premium SaaS landing page'\n")
  );

  // --- PHASE 0: The Intent Mapping (The Start) ---
  const spinnerMapping = ora(
    chalk.yellow("AI Agent is mapping Natural Language to ebade Intent...")
  ).start();
  await sleep(1500);

  const yamlOutput = `
  pages:
    - path: "/"
      components:
        - navbar
        - hero-section
        - pricing-table
        - footer
  `;
  spinnerMapping.succeed(
    chalk.yellow(
      "Agent-First View: Intent mapped to 4 components in project.ebade.yaml"
    )
  );
  console.log(chalk.gray("Generated Intent (YAML):") + chalk.white(yamlOutput));

  await sleep(1000);

  // --- PHASE 1: Legacy AI (The Token Burner) ---
  console.log(chalk.red("\n[Legacy AI Path]"));
  const spinnerAI = ora(
    chalk.red("Generating 5000+ lines of raw React/CSS/Logic...")
  ).start();

  // Simulate slow character-by-character generation (like a real LLM)
  for (let i = 0; i < 40; i++) {
    await sleep(30);
  }

  spinnerAI.fail(
    chalk.red(
      "Legacy AI: Burned 4200 Tokens, 15 seconds wait, High risk of CSS bugs."
    )
  );

  await sleep(1000);

  // --- PHASE 2: ebade (The Agent-First Engine) ---
  console.log(chalk.cyan("\n[ebade Agent-First Path]"));
  const spinnerEbade = ora(
    chalk.cyan("CLI is expanding intents into Shadcn code...")
  ).start();

  const startTime = performance.now();
  // Simulate reading all 4 components
  const components = ["navbar", "hero-section", "pricing-table", "footer"];
  let totalLines = 0;
  components.forEach((c) => {
    const p = path.join(process.cwd(), "cli/templates", `${c}.tsx`);
    if (fs.existsSync(p))
      totalLines += fs.readFileSync(p, "utf-8").split("\n").length;
  });
  const endTime = performance.now();

  await sleep(800);
  spinnerEbade.succeed(
    chalk.cyan(
      `ebade: Generated ${totalLines} lines of PR-Ready code in ${(
        endTime - startTime
      ).toFixed(2)}ms!`
    )
  );

  // --- PHASE 3: The Scorecard ---
  console.log(chalk.bold.yellow("\n--- GREEN AI LIFECYCLE SCORECARD ---"));
  console.log(
    chalk.white("🧠 AI Thinking: ") + chalk.green("98% Less (YAML vs Code)")
  );
  console.log(
    chalk.white("⚡ App Creation: ") + chalk.green("Instant (Deterministic)")
  );
  console.log(
    chalk.white("🌿 Total Carbon: ") + chalk.green("Minimal (Native Speed)")
  );
  console.log(
    chalk.gray("--------------------------------------------------\n")
  );
}

simulate();
