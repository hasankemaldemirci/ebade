/**
 * Compile Tool
 *
 * Compiles a single ebade definition into framework-specific code.
 */

interface CompileArgs {
  intent: {
    type: "page" | "component" | "api" | "layout";
    name: string;
    path?: string;
    components?: string[];
    auth?: "none" | "required" | "optional";
    data?: string[];
    outcomes?: Record<string, any>;
    style?: string | Record<string, any>;
  };
  target?: "nextjs" | "react" | "vue" | "svelte";
}

// Code generators for different targets
const generators = {
  nextjs: {
    page: (intent: CompileArgs["intent"]) => {
      const name = intent.name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");

      const imports: string[] = [];
      const bodyParts: string[] = [];

      // Auth handling
      if (intent.auth === "required") {
        imports.push(`import { redirect } from "next/navigation";`);
        imports.push(`import { auth } from "@/lib/auth";`);
        bodyParts.push(`  const session = await auth();
  if (!session) {
    redirect("/login");
  }`);
      }

      // Data fetching
      if (intent.data && intent.data.length > 0) {
        imports.push(`import { db } from "@/lib/db";`);
        for (const dataName of intent.data) {
          const varName = dataName.toLowerCase();
          bodyParts.push(
            `  const ${varName} = await db.${varName}.findMany();`
          );
        }
      }

      // Component imports
      if (intent.components && intent.components.length > 0) {
        for (const comp of intent.components) {
          const compName = comp
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join("");
          imports.push(`import { ${compName} } from "@/components/${comp}";`);
        }
      }

      // Component usage
      const componentJSX = (intent.components || [])
        .map((comp) => {
          const compName = comp
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join("");
          return `        <${compName} />`;
        })
        .join("\n");

      return `/**
 * @page('${intent.path || "/"}')
 * @ebade('${intent.name}')
 * Built with ebade
 * ${intent.auth ? `@requires({ auth: '${intent.auth}' })` : ""}
 * ${
   intent.data ? `@data([${intent.data.map((d) => `'${d}'`).join(", ")}])` : ""
 }
 */

${imports.join("\n")}

export default async function ${name}Page() {
${bodyParts.join("\n\n")}

  return (
    <main className="page ${intent.name}">
      <div className="container">
${componentJSX || "        {/* Page content */}"}
      </div>
    </main>
  );
}

// Metadata
export const metadata = {
  title: "${name}",
  description: "Page for ${intent.name} (Built with ebade)",
};
`;
    },

    component: (intent: CompileArgs["intent"]) => {
      const name = intent.name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");

      const style =
        typeof intent.style === "string"
          ? intent.style
          : JSON.stringify(intent.style);

      return `/* ebade Generated Component */
/**
 * @ebade('${name}')
 * ${intent.style ? `@style(${style})` : ""}
 */

import { useState } from "react";

interface ${name}Props {
  className?: string;
}

export function ${name}({ className }: ${name}Props) {
  return (
    <section className={\`${intent.name} \${className || ""}\`}>
      <div className="container">
        <h2>${name}</h2>
        {/* Component content */}
      </div>
    </section>
  );
}
`;
    },

    api: (intent: CompileArgs["intent"]) => {
      const authCheck =
        intent.auth === "required"
          ? `
  // Auth check
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
`
          : "";

      return `/**
 * @api('${intent.path || "/api/" + intent.name}')
 * @ebade('${intent.name}')
 * Built with ebade
 * ${intent.auth ? `@requires({ auth: '${intent.auth}' })` : ""}
 */

import { NextRequest, NextResponse } from "next/server";
${intent.auth === "required" ? `import { auth } from "@/lib/auth";` : ""}

export async function GET(request: NextRequest) {
${authCheck}
  try {
    // TODO: Implement GET handler
    return NextResponse.json({ message: "GET ${intent.name}" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
${authCheck}
  try {
    const body = await request.json();
    // TODO: Implement POST handler
    return NextResponse.json({ message: "POST ${intent.name}", data: body });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
`;
    },

    layout: (intent: CompileArgs["intent"]) => {
      const name = intent.name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");

      return `/**
 * ${name} Layout
 * 
 * @layout('${intent.name}')
 * ${
   intent.components
     ? `@compose([${intent.components.map((c) => `'${c}'`).join(", ")}])`
     : ""
 }
 */

${(intent.components || [])
  .map((comp) => {
    const compName = comp
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
    return `import { ${compName} } from "@/components/${comp}";`;
  })
  .join("\n")}

export default function ${name}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout ${intent.name}">
      ${intent.components?.includes("header") ? "<Header />" : ""}
      <main>{children}</main>
      ${intent.components?.includes("footer") ? "<Footer />" : ""}
    </div>
  );
}
`;
    },
  },
};

export async function compileIntent(args: CompileArgs) {
  const { intent, target = "nextjs" } = args;

  if (target !== "nextjs") {
    return `⚠️ Target "${target}" is not yet supported. Currently only "nextjs" is available.

Coming soon: vue, svelte, react (standalone)`;
  }

  const generator = generators[target];
  const typeGenerator = (generator as any)[intent.type];

  if (!typeGenerator) {
    return `❌ Unknown ebade type: ${intent.type}. Available: page, component, api, layout`;
  }

  const code = typeGenerator(intent);

  return `✅ Compiled ${intent.type}: ${intent.name}

\`\`\`typescript
${code}
\`\`\`

📋 ebade definition used:
\`\`\`json
${JSON.stringify(intent, null, 2)}
\`\`\`
`;
}
