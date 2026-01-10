---
description: ebade Prompt-to-Product Workflow
---

# 🌗 Hybrid Workflow: Architect & Engineer

This workflow divides your task into two phases: **Offline Architecture** (Deterministic) and **Online Engineering** (Generative).

## 1. Phase I: The Offline Architect (Deterministic)
When a user asks to "build", "create", or "start" a new web application:

// turbo
1. **Execute the Architecture**: Run the `ebade build` command.
   ```bash
   node cli/scaffold.js build "[User's Prompt]"
   ```
   *ebade will handle the heavy lifting: selecting the project type, generating a design system, and creating the file structure with **0-token cost** and **100% determinism**.*

2. **Move In**: `cd` into the generated project directory.

## 2. Phase II: The Online Engineer (Generative)
Now that the foundation is set, you act as the generative engineer to add "The Soul" to the codebase.

1. **Initialize Dependencies**: Run `npm install` to prepare the environment.
2. **Read the Intent**: Open `project.ebade.yaml`. This is your **Source of Truth**. Your goal is to implement the specific logic requested by the user, while respecting the boundaries set in the YAML.
3. **Refine Components**: Locate the UI components in `components/`. They are visually premium but contain "Business Logic" placeholders. Replace these with actual logic (API calls, state, conditional rendering).
4. **API Integration**: Fill the `app/api/` skeletons with real backend code (DB queries, Auth logic).

## 3. Iterative Feedback Loop
To expand or modify:
1. Update `project.ebade.yaml` with the new intent (e.g., adding a new page or feature).
2. Run `node cli/scaffold.js scaffold project.ebade.yaml .` to generate new files without breaking your existing work.
3. Apply generative logic to the new structures.

---
*ebade: Empowering Agents to focus on Logic, while we handle the Architecture.*
