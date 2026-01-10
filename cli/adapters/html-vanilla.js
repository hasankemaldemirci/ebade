import fs from "fs";
import path from "path";
import { TargetAdapter } from "./base.js";
import { ensureDir } from "../utils.js";

export class HtmlVanillaAdapter extends TargetAdapter {
  generateBoilerplate(config, projectDir) {
    this.log.section("Creating Vanilla HTML project structure");

    // Simple structure
    const dirs = ["assets", "css", "js"];
    dirs.forEach((dir) => {
      ensureDir(path.join(projectDir, dir));
      this.log.file(`${dir}/`);
    });

    // Generate style.css
    const cssContent = `
:root {
  --primary: ${config.design?.colors?.primary || "#6366f1"};
}
body { 
  font-family: sans-serif; 
  background: #0f172a; 
  color: white; 
}
.container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    `.trim();

    fs.writeFileSync(path.join(projectDir, "styles.css"), cssContent);
    this.log.file("styles.css");
  }

  generatePage(page, design) {
    const filename = page.path === "/" ? "index.html" : `${page.intent}.html`;
    const componentsHtml =
      page.components
        ?.map((c) => `<div class="component" id="${c}">${c} Intent</div>`)
        .join("\n") || "";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.intent}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>${page.intent} Page</h1>
        <div class="components">
            ${componentsHtml}
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  generateComponent(componentName, design) {
    // For Vanilla HTML, components might just be snippets or fragments
    return {
      content: `<div class="ebade-component">${componentName}</div>`,
      testContent: `// No unit test for vanilla HTML component yet`,
    };
  }

  generateApiRoute(endpoint) {
    return `// API Route stub for ${endpoint.path}`;
  }
}
