# Changelog

All notable changes to **ebade** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.6] - 2025-01-10

### Added

- **EbadeArchitect (The Brain)**: New core engine that translates natural language prompts into structured `ebade` configurations.
- **`ebade build <prompt>`**: A "one-shot" project creation command. Designs, scaffolds, and prepares a project in seconds.
- **Architect Intelligence**: Projects now gain context-aware page structures (E-commerce get cart/products, Blog get posts, etc.) and smarter component selection via Regex.
- **Auto-Environment**: Automatically generates `.gitignore` and `.env.example` for professional project starts.
- **Agent Workflow Documentation**: Added `.agent/workflows/prompt-to-product.md` to guide AI agents on using the new tools.
- **MCP Server v0.4.6**: Integrated `ebade_build` as a tool for otonomous agent usage.
- **Testing Layer**: Added internal testing suites for both the framework logic and CLI integration.
- **CLI Branding**: Updated to `v0.4.6` with improved help menus and creative briefs.

### Fixed

- Fixed CLI entry point to allow safe imports of `scaffold.js` without triggering help output.
- Improved project naming logic to filter out filler words (e.g., "Can you make a...").
- Fixed component integrity check to correctly locate test files in `tests/components/`.

## [0.4.5] - 2025-01-10
...
## [0.4.5] - 2025-01-10

### Added

- UI/UX Overhaul: Premium dark-mode aesthetic with ambient glow and glassmorphism by default.
- Dynamic Color Support: Real-time Hex-to-HSL conversion to apply user's primary color choice to CSS variables.
- Component "Intents": Placeholders are now high-quality "Glass Cards" that look like part of a finished UI.
- Test Organization: All unit tests are now generated in a centralized `tests/` directory instead of being cluttered with components.

### Fixed

- API Pathing: Fixed a bug that caused double-nesting (e.g., `/api/api/...`) in generated routes.
- Removed debug information (headers, route labels) from generated pages for a "turnkey" production feel.

## [0.4.4] - 2025-01-10


### Fixed
- Added `postcss.config.js` generation to enable Tailwind styling in scaffolded projects.
- Fixed double-nesting issues when initializing projects (removed redundant `projectName/projectName` folder creation).
- Refined Tailwind config to ensure all component paths are correctly watched.

## [0.4.3] - 2025-01-10

### Fixed
- Critical bug where templates were not found when running via `npx` (fix using `import.meta.url`).
- Added missing component templates for SaaS Dashboard and Landing Pages (`testimonials`, `faq-accordion`, `cta-banner`, `activity-chart`, `stats-grid`, `recent-events`).
- Updated `tsconfig.json` generation to use `jsx: preserve` and added path aliases (`@/*`).
- Added slugification for `package.json` names to ensure valid naming conventions.
- Synced framework versions across all packages.

## [0.4.1] - 2025-01-10

### Added

- **Auto-Verification Layer** - CLI now performs structural, syntax, and semantic integrity checks after scaffolding.
- **Playground UI** - Interactive "Battle Mode" simulation comparing Legacy AI vs ebade-powered Agent.
- **Shadcn/UI Integration** - All component templates now use Shadcn design patterns.
- **20+ Component Templates** - navbar, footer, pricing-table, login-form, signup-form, and more.
- **File-based Template System** - Dynamic template loading from `cli/templates/`.
- **Real-time Token Savings** - CLI now displays actual token savings during scaffold.
- **Agent-Native Stack Vision** - Identity (agents.md) + Capability (MCP) + Intent (ebade).
- MCP Server branding update to **ebade**.
- Green AI Metrics and Carbon Impact calculations.
- Turkish identity integration (Badik mascot 🐣 and "The Essence of Code" vision).
- `ebade_generate` improved inference.

---

## [0.1.0] - 2025-01-07

### Added

- 🎉 Initial alpha release of **ebade**
- MCP Server package (`ebade-mcp-server`) with 4 tools:
  - `ebade_scaffold` - Create full projects from ebade definitions
  - `ebade_validate` - Validate ebade files against schema
  - `ebade_compile` - Compile single ebade to code
  - `ebade_generate` - Generate components from natural language
- Project scaffolding for 5 project types (e-commerce, SaaS, Blog, etc.)
- YAML ebade definition format (.ebade.yaml)
- Next.js App Router as primary compilation target
- Comprehensive documentation (Manifesto, Syntax, Roadmap, Green AI)

---

*This project was born out of the desire to make AI coding efficient and sustainable.*
