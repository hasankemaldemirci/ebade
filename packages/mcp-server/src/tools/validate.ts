/**
 * Validate Tool
 *
 * Validates an ebade definition file for correctness.
 */

import yaml from "yaml";
import { z } from "zod";

interface ValidateArgs {
  intentContent: string;
}

// Schema for intent validation
const PageSchema = z.object({
  path: z.string().startsWith("/"),
  intent: z.string(),
  auth: z.enum(["none", "required", "optional"]).optional(),
  components: z.array(z.string()).optional(),
});

const FieldSchema = z.object({
  type: z.enum([
    "uuid",
    "string",
    "text",
    "integer",
    "decimal",
    "boolean",
    "timestamp",
    "json",
    "array",
    "enum",
  ]),
  required: z.boolean().optional(),
  unique: z.boolean().optional(),
});

const DataModelSchema = z.object({
  fields: z.record(FieldSchema),
  relations: z.array(z.string()).optional(),
});

const DesignSchema = z.object({
  style: z
    .enum([
      "minimal-modern",
      "bold-vibrant",
      "corporate-clean",
      "playful-rounded",
      "dark-premium",
      "glassmorphism",
    ])
    .optional(),
  colors: z
    .object({
      primary: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional(),
      secondary: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional(),
      accent: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional(),
    })
    .optional(),
  font: z.string().optional(),
  borderRadius: z.enum(["none", "sm", "md", "lg", "full"]).optional(),
});

const IntentFileSchema = z.object({
  name: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, "Project name must be kebab-case"),
  type: z.enum([
    "e-commerce",
    "saas-dashboard",
    "blog",
    "landing-page",
    "portfolio",
    "api-only",
  ]),
  description: z.string().optional(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  pages: z.array(PageSchema).optional(),
  design: DesignSchema.optional(),
  data: z.record(DataModelSchema).optional(),
});

interface ValidationIssue {
  type: "error" | "warning";
  path: string;
  message: string;
}

export async function validateIntent(args: ValidateArgs) {
  const { intentContent } = args;
  const issues: ValidationIssue[] = [];

  // Try to parse YAML
  let parsed: any;
  try {
    parsed = yaml.parse(intentContent);
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: `❌ YAML Parse Error: ${
            e instanceof Error ? e.message : String(e)
          }`,
        },
      ],
      isError: true,
    };
  }

  // Validate against schema
  const result = IntentFileSchema.safeParse(parsed);

  if (!result.success) {
    for (const issue of result.error.issues) {
      issues.push({
        type: "error",
        path: issue.path.join("."),
        message: issue.message,
      });
    }
  }

  // Additional semantic validations
  if (parsed.pages) {
    const paths = new Set<string>();
    for (const page of parsed.pages) {
      // Check for duplicate paths
      if (paths.has(page.path)) {
        issues.push({
          type: "error",
          path: `pages.${page.path}`,
          message: `Duplicate page path: ${page.path}`,
        });
      }
      paths.add(page.path);

      // Warn about pages requiring auth without auth feature
      if (page.auth === "required" && !parsed.features?.includes("user-auth")) {
        issues.push({
          type: "warning",
          path: `pages.${page.path}`,
          message: `Page requires auth but 'user-auth' feature is not enabled`,
        });
      }
    }
  }

  // Check data model relations
  if (parsed.data) {
    const modelNames = new Set(Object.keys(parsed.data));
    for (const [modelName, model] of Object.entries(
      parsed.data as Record<string, any>
    )) {
      if (model.relations) {
        for (const relation of model.relations) {
          // Extract target model from relation (e.g., "has_many: Review" → "Review")
          const match = relation.match(/:\s*(\w+)/);
          if (match && !modelNames.has(match[1])) {
            issues.push({
              type: "warning",
              path: `data.${modelName}.relations`,
              message: `Relation references unknown model: ${match[1]}`,
            });
          }
        }
      }
    }
  }

  // Build response
  const errors = issues.filter((i) => i.type === "error");
  const warnings = issues.filter((i) => i.type === "warning");

  if (errors.length === 0 && warnings.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `✅ ebade file is valid!

📋 Summary:
  • Name: ${parsed.name}
  • Type: ${parsed.type}
  • Features: ${parsed.features?.length || 0}
  • Pages: ${parsed.pages?.length || 0}
  • Data Models: ${Object.keys(parsed.data || {}).length}

Ready to scaffold with ebade_scaffold tool.
`,
        },
      ],
    };
  }

  let responseText = "";

  if (errors.length > 0) {
    responseText += `❌ ${errors.length} Error(s):\n`;
    for (const error of errors) {
      responseText += `  • [${error.path}] ${error.message}\n`;
    }
    responseText += "\n";
  }

  if (warnings.length > 0) {
    responseText += `⚠️ ${warnings.length} Warning(s):\n`;
    for (const warning of warnings) {
      responseText += `  • [${warning.path}] ${warning.message}\n`;
    }
  }

  return {
    content: [
      {
        type: "text",
        text: responseText,
      },
    ],
    isError: errors.length > 0,
  };
}
