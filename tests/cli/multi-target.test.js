import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import assert from "assert";

async function runMultiTargetTests() {
  console.log("🧪 Running Multi-Target TDD Tests...\n");

  const PROJECT_NAME = "SimpleStatic";
  if (fs.existsSync(PROJECT_NAME)) {
    fs.rmSync(PROJECT_NAME, { recursive: true, force: true });
  }

  try {
    // 1. Test 'ebade build' with --target html
    console.log(`Testing '--target html' for ${PROJECT_NAME}...`);
    // Note: This will fail initially because --target flag and adapter aren't implemented yet.
    // This is the 'RED' phase of TDD.
    const cmd = `node cli/scaffold.js build "A simple static site" --target html`;

    execSync(cmd, { stdio: "inherit" });

    const projectDir = path.join(process.cwd(), PROJECT_NAME);

    assert.ok(
      fs.existsSync(projectDir),
      `Project directory (${PROJECT_NAME}) should exist`
    );

    // Vanilla HTML expected files
    assert.ok(
      fs.existsSync(path.join(projectDir, "index.html")),
      "index.html should be generated for HTML target"
    );
    assert.ok(
      fs.existsSync(path.join(projectDir, "styles.css")),
      "styles.css should be generated for HTML target"
    );

    // Ensure Next.js files are NOT generated
    assert.ok(
      !fs.existsSync(path.join(projectDir, "app/page.tsx")),
      "Next.js app directory should NOT exist for HTML target"
    );

    console.log("✅ Multi-Target TDD Test OK");
  } catch (err) {
    console.log("\n❌ TDD Test failed (Expected if not implemented yet):");
    console.error(err.message);
    // In TDD 'Red' phase, we don't necessarily exit(1) if we expect failure,
    // but here we want to see it fail.
  } finally {
    // Cleanup
    if (fs.existsSync(PROJECT_NAME)) {
      fs.rmSync(PROJECT_NAME, { recursive: true, force: true });
    }
  }
}

runMultiTargetTests();
