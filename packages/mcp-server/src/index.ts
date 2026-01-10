#!/usr/bin/env node

/**
 * ebade MCP Server
 *
 * This server enables AI agents to use ebade for building web applications.
 * It exposes tools that allow agents to:
 * - Scaffold projects from ebade definitions
 * - Validate ebade files
 * - Compile ebade to framework-specific code
 * - Generate components from natural language descriptions
 * - Build entire projects from natural language prompts (NEW in v0.4.7)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { scaffoldProject } from "./tools/scaffold.js";
import { validateIntent } from "./tools/validate.js";
import { compileIntent } from "./tools/compile.js";
import { generateComponent } from "./tools/generate.js";
import { buildFromPrompt } from "./tools/build.js";

// Create the MCP server
const server = new Server(
  {
    name: "ebade",
    version: "0.4.7",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "ebade_scaffold",
        description: `Scaffold a new project from an ebade definition. 
This creates a complete Next.js project structure based on the ebade specification.

Use this when the user wants to:
- Start a new web project
- Create an "SaaS Dashboard", "E-commerce", or "Landing Page"
- Generate a full application structure with agent-first rules (.cursorrules, etc.)

The ebade file uses YAML format with pages, components, data models, and API definitions.`,
        inputSchema: {
          type: "object",
          properties: {
            projectName: {
              type: "string",
              description: "Name of the project (kebab-case, e.g., 'my-app')",
            },
            projectType: {
              type: "string",
              enum: [
                "SaaS Dashboard",
                "E-commerce",
                "Landing Page",
                "Empty Project",
              ],
              description: "Type of project template to use",
            },
            primaryColor: {
              type: "string",
              description: "Hex primary color (e.g., '#4f46e5')",
            },
            outputDir: {
              type: "string",
              description: "Output directory path (absolute)",
            },
          },
          required: ["projectName", "projectType", "outputDir"],
        },
      },
      {
        name: "ebade_validate",
        description: `Validate an ebade definition file.
Checks for:
- Correct syntax and structure
- Valid decorator usage
- Proper data model relationships
- Missing required fields

Use this before scaffolding to ensure the ebade is valid.`,
        inputSchema: {
          type: "object",
          properties: {
            intentContent: {
              type: "string",
              description: "The ebade file content (YAML or TypeScript)",
            },
          },
          required: ["intentContent"],
        },
      },
      {
        name: "ebade_compile",
        description: `Compile a specific ebade definition into framework-specific code.
Returns the generated code for a specific page, component, or API route.

Use this when:
- User wants to see what code an ebade produces
- Building a specific component
- Iterating on a single ebade definition`,
        inputSchema: {
          type: "object",
          properties: {
            intent: {
              type: "object",
              description: "The ebade definition object",
              properties: {
                type: {
                  type: "string",
                  enum: ["page", "component", "api", "layout"],
                },
                name: { type: "string" },
                path: { type: "string" },
                components: {
                  type: "array",
                  items: { type: "string" },
                },
                auth: {
                  type: "string",
                  enum: ["none", "required", "optional"],
                },
                data: {
                  type: "array",
                  items: { type: "string" },
                },
                outcomes: {
                  type: "object",
                },
              },
            },
            target: {
              type: "string",
              enum: ["nextjs", "react", "vue", "svelte"],
              description: "Target framework (default: nextjs)",
            },
          },
          required: ["intent"],
        },
      },
      {
        name: "ebade_generate",
        description: `Generate a component from a natural language description.
AI-powered ebade inference - describe what you want and get the ebade + code.

Use this when:
- User describes a component in natural language
- Quick prototyping
- Exploring ebade syntax and capabilities`,
        inputSchema: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description:
                "Natural language description of the component (e.g., 'a product card with image, title, price, and add to cart button')",
            },
            style: {
              type: "string",
              enum: [
                "minimal-modern",
                "bold-vibrant",
                "dark-premium",
                "glassmorphism",
              ],
              description: "Design style preference",
            },
          },
          required: ["description"],
        },
      },
      {
        name: "ebade_build",
        description: `Revolutionary "Prompt-to-Product" tool. 
Generates a complete, production-ready project from a single natural language description.

Use this when the user says:
- "Bana mor temalı bir kripto borsası yap"
- "Create a red themed SaaS for AI model store"
- "Make a sleek portfolio for a creative director"

This tool handles architecture, component selection, color palette, and scaffolding in one shot.`,
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The natural language instruction for the project",
            },
            outputDir: {
              type: "string",
              description:
                "Base directory path where the project will be created (absolute)",
            },
          },
          required: ["prompt", "outputDir"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "ebade_scaffold":
        return {
          content: [
            {
              type: "text",
              text: await scaffoldProject(args as any),
            },
          ],
        };

      case "ebade_validate":
        return await validateIntent({
          intentContent: args?.intentContent as string,
        });

      case "ebade_compile":
        return {
          content: [
            {
              type: "text",
              text: await compileIntent({
                intent: args?.intent as any,
                target:
                  (args?.target as "nextjs" | "react" | "vue" | "svelte") ||
                  "nextjs",
              }),
            },
          ],
        };

      case "ebade_generate":
        return await generateComponent({
          description: args?.description as string,
          style: args?.style as any,
        });

      case "ebade_build":
        return {
          content: [
            {
              type: "text",
              text: await buildFromPrompt(args as any),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

// List available resources (ebade templates, examples)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "ebade://syntax",
        name: "ebade Syntax Reference",
        description: "The complete syntax guide for ebade definitions",
        mimeType: "text/markdown",
      },
      {
        uri: "ebade://examples/ecommerce",
        name: "E-commerce ebade Example",
        description: "A comprehensive ebade example for an e-commerce platform",
        mimeType: "text/x-yaml",
      },
      {
        uri: "ebade://examples/saas",
        name: "SaaS Dashboard ebade Example",
        description: "SaaS dashboard with auth, billing, user management",
        mimeType: "text/x-yaml",
      },
    ],
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  const resources: Record<string, string> = {
    "ebade://syntax": `# ebade Syntax Reference\n\n@page, @ebade, @requires, @outcomes, @data, @validate, @style, @compose, @on, @expects\n\nCode = f(ebade)`,
    "ebade://examples/ecommerce": `# E-commerce ebade\nname: my-store\ntype: e-commerce\nfeatures:\n  - product-catalog\n  - shopping-cart\n  - checkout`,
    "ebade://examples/saas": `# SaaS ebade\nname: my-saas\ntype: saas-dashboard\nfeatures:\n  - user-auth\n  - billing\n  - analytics`,
  };

  const content = resources[uri];
  if (!content) {
    throw new Error(`Resource not found: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: "text/markdown",
        text: content,
      },
    ],
  };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ebade MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
