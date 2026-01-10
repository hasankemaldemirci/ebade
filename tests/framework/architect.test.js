import {
  EbadeArchitect,
  toPascalCase,
  toSnakeCase,
  hexToHsl,
} from "../../cli/scaffold.js";
import assert from "assert";

async function runTests() {
  console.log("🧪 Running Framework Unit Tests (v0.4.7)...\n");

  // 1. Utility Functions
  console.log("Testing Utility Functions...");
  assert.strictEqual(toPascalCase("hello-world"), "HelloWorld");
  assert.strictEqual(toPascalCase("hello_world"), "HelloWorld");
  assert.strictEqual(toSnakeCase("HelloWorld"), "hello_world");
  assert.strictEqual(toSnakeCase("hello-world"), "hello_world");

  // hexToHsl Test (Critical for Design System)
  const hsl = hexToHsl("#8b5cf6"); // Violet
  assert.ok(
    hsl.includes("258"),
    `HSL for #8b5cf6 should include hue 258, got ${hsl}`
  );
  console.log("✅ Utilities OK");

  // 2. Architect Mapping
  console.log("\nTesting EbadeArchitect (Complex Intent)...");
  const prompt =
    "Can you make a luxury gold themed dashboard with charts and login features?";
  const config = await EbadeArchitect.plan(prompt);

  // Check intelligence
  assert.strictEqual(
    config.name,
    "LuxuryGold",
    "Should filter filler words like 'Can you make a'"
  );
  assert.strictEqual(
    config.design.colors.primary,
    "#fbbf24",
    "Gold detection failed"
  );
  assert.ok(
    config.features.includes("Advanced Analytics"),
    "Analytics detection failed"
  );
  assert.ok(
    config.features.includes("Authentication"),
    "Auth detection failed"
  );

  // Check Type-Aware Pages
  assert.strictEqual(
    config.pages.length,
    2,
    "Should have landing and dashboard"
  );
  assert.ok(
    config.pages.some((p) => p.path === "/dashboard"),
    "Dashboard page missing"
  );
  console.log("✅ Complex Intent mapping OK");

  // 3. Project Type Specifics (E-commerce)
  console.log("\nTesting EbadeArchitect (E-commerce)...");
  const shopConfig = await EbadeArchitect.plan(
    "Sleek shoe store with red theme"
  );
  assert.strictEqual(shopConfig.type, "e-commerce");
  assert.ok(
    shopConfig.pages.some((p) => p.path === "/products"),
    "E-commerce missing /products"
  );
  assert.ok(
    shopConfig.pages.some((p) => p.path === "/cart"),
    "E-commerce missing /cart"
  );
  console.log("✅ E-commerce structure OK");

  // 4. Project Type Specifics (Blog)
  console.log("\nTesting EbadeArchitect (Blog)...");
  const blogConfig = await EbadeArchitect.plan("Ocean themed news blog");
  assert.strictEqual(blogConfig.type, "blog");
  assert.ok(
    blogConfig.pages.some((p) => p.path === "/posts"),
    "Blog missing /posts index"
  );
  assert.ok(
    blogConfig.pages.some((p) => p.path === "/posts/[slug]"),
    "Blog missing /posts/[slug] dynamic route"
  );
  console.log("✅ Blog structure OK");

  console.log("\n✨ All framework tests passed!");
}

runTests().catch((err) => {
  console.error("\n❌ Test failed:");
  console.error(err);
  process.exit(1);
});
