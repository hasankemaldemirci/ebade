---
description: ebade Prompt-to-Product Workflow
---

# 🐣 ebade Prompt-to-Product Workflow

This workflow describes how an AI Agent should use the ebade framework to transform a user's natural language intent into a production-ready codebase.

## 1. Initial Project Scaffolding
When a user asks to "build", "create", or "start" a new web application:

// turbo
1. Use the `ebade build` command with the user's prompt.
   ```bash
   node cli/scaffold.js build "[User's Prompt]"
   ```
   *This tool will automatically choose the project type, color palette, and initial components.*

2. Navigate into the generated project directory.

## 2. Understanding the Architecture
ebade generates a `project.ebade.yaml` file in the project root. This is your **Source of Truth**.
1. Read `project.ebade.yaml` to understand the pages, components, and data models.
2. Respect the design system tokens in `app/globals.css`.

## 3. Iterative Development
Once the scaffold is ready, move from "Architect" to "Engineer":

1. **Refine Components**: Locate generated components in `components/`. They are high-quality visual placeholders. Add the specific business logic, API calls, or complex state management requested by the user.
2. **Implement API Logic**: Fill the `app/api/` route handlers with real backend logic (database queries, external service integrations).
3. **Data Schemas**: Use the generated SQL in `database/schema.sql` to set up the actual database.

## 4. Expanding the Project
To add new features:
1. Update `project.ebade.yaml` with the new intent.
2. Run `node cli/scaffold.js scaffold project.ebade.yaml .` to generate the new files while preserving your logic.
3. Apply the specific implementation details to the new files.

---
*Built for the Agent-First Era. ebade empowers you to focus on logic, while we handle the architecture.*
