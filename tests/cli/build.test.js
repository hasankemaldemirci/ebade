import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import assert from "assert";

async function runCliTests() {
  console.log("🧪 Running CLI Integration Tests...\n");

  const PROJECT_NAME = "ModernBlog";
  if (fs.existsSync(PROJECT_NAME)) {
    fs.rmSync(PROJECT_NAME, { recursive: true, force: true });
  }

  try {
    // 1. Test 'ebade build' command
    console.log(`Testing 'ebade build' command for ${PROJECT_NAME}...`);
    const cmd = `node cli/scaffold.js build "A Modern Blog with blue theme"`;

    execSync(cmd, { stdio: "inherit" });

    const projectDir = path.join(process.cwd(), PROJECT_NAME);

    assert.ok(
      fs.existsSync(projectDir),
      `Project directory (${PROJECT_NAME}) should exist`
    );
    assert.ok(
      fs.existsSync(path.join(projectDir, "project.ebade.yaml")),
      "project.ebade.yaml should be generated"
    );
    assert.ok(
      fs.existsSync(path.join(projectDir, "app/page.tsx")),
      "Main page should be generated"
    );
    assert.ok(
      fs.existsSync(path.join(projectDir, ".env.example")),
      ".env.example should be generated"
    );
    assert.ok(
      fs.existsSync(path.join(projectDir, ".gitignore")),
      ".gitignore should be generated"
    );

    // Verify blog pages
    assert.ok(
      fs.existsSync(path.join(projectDir, "app/posts/page.tsx")),
      "Blog index page should be generated"
    );

    console.log("✅ 'ebade build' Integration OK");
  } catch (err) {
    console.error("\n❌ CLI Test failed:");
    console.error(err);
    process.exit(1);
  } finally {
    // Cleanup
    console.log("\n🧹 Cleaning up test artifacts...");
    if (fs.existsSync(PROJECT_NAME)) {
      fs.rmSync(PROJECT_NAME, { recursive: true, force: true });
    }
  }

  console.log("\n✨ CLI integration tests passed!");
}

runCliTests();
