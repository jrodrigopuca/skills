---
name: create-software-docs
description: Generate project-level documentation from codebase analysis — architecture with Mermaid diagrams, ADRs, runbooks, development guides, and more. Technology agnostic. | Genera documentación a nivel de proyecto desde el análisis del código — arquitectura con diagramas Mermaid, ADRs, runbooks, guías de desarrollo y más. Agnóstico de tecnología.
license: MIT
---

# Software Project Documentation Generator

Generate structured project documentation by analyzing the codebase.

## Overview

This skill directs the creation of project-level documentation:

- **Architecture** with Mermaid diagrams (C4-style)
- **Decision records** (ADRs) with context and rationale
- **Runbooks** for operations and incident response
- **Development guide**, data model, API reference, and more

The agent infers content from the codebase — config files, directory structure, code patterns, and existing docs. All output goes into a `{scope}/docs/` folder as Markdown files, where `{scope}` is the repository root or the selected app/package/service root.

## Prerequisites

- Access to the project source code
- Existing project with identifiable structure (not an empty repo)

## Operating Rules

These rules are mandatory:

1. **Do not invent facts.** Only document behavior, structure, commands, integrations, and architecture that are directly observable in the repository.
2. **Differentiate evidence from inference.** When something is reconstructed indirectly, label it as **Inferred**. If confidence is low, label it as **Needs confirmation**.
3. **Leave explicit placeholders when evidence is missing.** Use `TODO:` or `Needs confirmation:` instead of filling gaps with guesses.
4. **Cite repository evidence.** Every generated document should include a short **Sources inspected** section listing the main files, directories, configs, or scripts used to produce it.
5. **Preserve project scope.** If the repository is a monorepo or only part of a system is present, state the scope being documented (for example: whole repo, one service, one package, one app).
6. **Prefer omission over speculation.** If a section is not supported by evidence, omit it or mark it clearly as not yet documented.

## Instructions

### 1. Define Scope First

Before writing documentation, determine the documentation scope:

- **Single-project repo** — document the whole repository
- **Monorepo** — identify whether the target is the whole repo, one app, one package, or one service
- **Partial repository** — explicitly state what is missing and what cannot be verified

Write this scope at the top of `project-overview.md` and `architecture.md`.

### 2. Analyze the Project

Scan the codebase to understand:

- **Languages and frameworks** — detect from config/manifest files
- **Project structure** — major directories, modules, entry points
- **Data layer** — schema files, migrations, ORM configs
- **API surface** — routes, controllers, resolvers, endpoints
- **External integrations** — third-party services, env vars, SDK usage
- **Build and deploy** — scripts, CI config, Dockerfiles, cloud configs
- **Existing docs** — README, `{scope}/docs/`, inline comments, wikis

This analysis drives which documents to generate and what content goes in each.

Capture the evidence you used while analyzing. Reuse that evidence list in the generated documents.

### 3. Determine Which Documents to Generate

Use this priority matrix — not every project needs every document:

| Document                   | Always                    | If applicable            |
| -------------------------- | ------------------------- | ------------------------ |
| **project-overview.md**    | ✅                        |                          |
| **architecture.md**        | ✅                        |                          |
| **development-guide.md**   | ✅                        |                          |
| **decisions/NNN-title.md** | ✅ (at least retroactive) |                          |
| **data-model.md**          |                           | Has persistent data      |
| **runbooks/\*.md**         |                           | Has deployments or ops   |
| **api-reference.md**       |                           | Exposes an API           |
| **glossary.md**            |                           | Domain-specific language |

Generate the "Always" documents first. Add others based on what the analysis reveals.

### 4. Generate Project Overview

Generate `{scope}/docs/project-overview.md` with:

1. **Scope** — what part of the repository is being documented
2. **Confidence note** — what is confirmed vs inferred
3. **What the project does** — 1-2 paragraphs, business and technical purpose
4. **Tech stack** — languages, frameworks, infrastructure (as discovered)
5. **Repository structure** — annotated directory tree of major folders
6. **Key modules** — name, purpose, and responsibilities of each
7. **Links** — point to every other doc in `{scope}/docs/`
8. **Sources inspected** — files/directories used as evidence

This is the entry point to all documentation. Keep it concise — detail belongs in specialized docs.

See [references/templates.md](references/templates.md) for structure.

### 5. Generate Architecture Document

Generate `{scope}/docs/architecture.md` with:

1. **Scope** — what part of the repository is being documented
2. **Architecture style** — identify and name the pattern (layered, event-driven, microservices, monolith, serverless, etc.)
3. **Diagrams** — use Mermaid syntax. Select based on project complexity:
   - **Simple** (single service) → component diagram + 1-2 sequence diagrams
   - **Medium** (API + data + frontend) → add system context + data flow
   - **Complex** (distributed/multi-service) → full C4 set + deployment diagram
4. **Module descriptions** — for each major module: purpose, responsibilities, key dependencies
5. **Cross-cutting concerns** — how the project handles auth, logging, error handling, caching, etc.
6. **Security and operations** — auth boundaries, secrets/config handling, observability, backup/restore, jobs, schedulers, queues, and operational dependencies if present
7. **Constraints and trade-offs** — known limitations and why they exist
8. **Sources inspected** — files/directories used as evidence

Only include the sections and diagrams supported by the repository. For simple projects, omit context/container/deployment sections when they do not apply.

See [references/diagrams.md](references/diagrams.md) for Mermaid diagram patterns.
See [references/templates.md](references/templates.md) for document structure.

### 6. Generate Development Guide

Generate `{scope}/docs/development-guide.md` with:

1. **Prerequisites** — required tools and versions
2. **Setup** — clone, install dependencies, configure environment
3. **Environment variables** — list with descriptions (infer from .env.example or config)
4. **Run locally** — dev server, watch mode, hot reload
5. **Testing** — how to run tests, what frameworks are used
6. **Linting and formatting** — commands and config
7. **Build** — production build command and output
8. **Security and operational notes** — secrets handling, local credentials, background workers, seed/migration order, known safety precautions
9. **Common issues** — FAQ from patterns you observe (e.g., port conflicts, missing env vars)
10. **Sources inspected** — files/directories used as evidence

Infer all steps from scripts, config files, and Dockerfiles. Use actual commands found in the project.

### 7. Record Decisions (ADRs)

Generate `{scope}/docs/decisions/NNN-title.md` files:

1. **Identify decisions** — tech stack choices, architectural patterns, library selections that can be inferred from the codebase
2. **Use MADR format** — Status, Context, Decision Drivers, Considered Options, Decision Outcome, Consequences
3. **Naming** — `NNN-short-kebab-case-title.md` (e.g., `001-use-layered-architecture.md`)
4. **Focus on "why"** — the rationale matters more than the "what"
5. **For existing projects** — note that context is reconstructed from code analysis
6. **Do not overstate rationale** — if the reason cannot be verified from code, issues, or docs, mark it as reconstructed or uncertain

Write an ADR when the decision is hard to reverse, affects multiple parts of the system, or will be questioned in the future.

See [references/templates.md](references/templates.md) for MADR template.

### 8. Write Runbooks

Generate `{scope}/docs/runbooks/*.md` files when the project has deployment, database, or operational concerns:

1. **Identify operations** — deploy, migrate, rollback, scale, recover
2. **Two types:**
   - **Operational** (routine) — deploy, migrate, rotate credentials, release
   - **Troubleshooting** (incidents) — outage, performance degradation, data issues
3. **Each runbook must include:**
   - Overview and trigger conditions
   - Prerequisites (access, tools, permissions)
   - Step-by-step procedure with exact commands
   - Verification steps (how to confirm success)
   - Rollback steps
   - Escalation path
   - Sources inspected
4. **Use safety warnings** (⚠️) before destructive operations
5. **One action per step** — don't combine multiple commands

Infer commands from CI/CD configs, scripts, and Dockerfiles.

See [references/templates.md](references/templates.md) for runbook template.

### 9. Generate Data Model (if applicable)

Generate `{scope}/docs/data-model.md` when the project has persistent data:

1. **ER diagram** — use Mermaid `erDiagram` syntax showing entities and relationships
2. **Entity descriptions** — purpose, key fields, constraints
3. **Relationships** — cardinality and business meaning
4. **Data lifecycle** — how records are created, updated, archived, deleted
5. **Sources inspected** — schema/model files used to infer the structure

Infer from schema files, migration files, ORM models, or type definitions.

### 10. Generate API Reference (if applicable)

Generate `{scope}/docs/api-reference.md` when the project exposes an API:

1. **Base info** — base URL pattern, versioning strategy, auth requirements
2. **Endpoints** — grouped by resource/domain, with method, path, description
3. **Request/response shapes** — infer from types, schemas, or validation
4. **Error handling** — common error codes and their meaning
5. **Sources inspected** — routes/controllers/schemas used as evidence

Infer from route definitions, controllers, middleware, and type definitions.

### 11. Generate Glossary (if applicable)

Generate `{scope}/docs/glossary.md` when the domain has specialized language:

1. **Domain terms** — business concepts found in model names and business logic
2. **Project-specific terms** — abbreviations, acronyms, internal naming
3. **Sort alphabetically**

### 12. Update README

Add or update a `## Documentation` section in the scope README.md that links to each generated file in `{scope}/docs/`.

### 13. Validate Before Finalizing

Before final output, validate the generated documentation:

1. **Commands are real** — verify setup, test, lint, build, deploy, and migration commands against scripts, Makefiles, Dockerfiles, CI jobs, or task runners
2. **Links resolve** — check cross-links and README links
3. **Mermaid is internally consistent** — entity names, participants, and nodes match the written description
4. **No empty sections** — remove placeholder sections that are not supported by evidence
5. **Inference is labeled** — every reconstructed statement is marked appropriately
6. **Scope is explicit** — monorepo/package/service boundaries are clearly called out
7. **Output path is correct** — generated files live under `{scope}/docs/`, not outside the selected scope

## Quality Checklist

Before finalizing, verify:

- [ ] All diagrams use valid Mermaid syntax
- [ ] Architecture diagrams reflect actual code structure (not aspirational)
- [ ] ADRs explain "why", not just "what"
- [ ] Reconstructed ADR rationale is labeled when not directly evidenced
- [ ] Runbook commands are real (inferred from project scripts/configs)
- [ ] Development guide steps can be followed sequentially
- [ ] No technology-specific assumptions that don't match the codebase
- [ ] Every document includes sources inspected or equivalent evidence notes
- [ ] Inferred or uncertain statements are explicitly marked
- [ ] Monorepo or partial-repo scope is clearly stated when applicable
- [ ] Generated files are placed under `{scope}/docs/`
- [ ] Cross-references between documents are consistent
- [ ] project-overview.md links to all other generated docs

## External Resources

- [Mermaid](https://mermaid.js.org/) — Diagrams as code
- [MADR](https://adr.github.io/madr/) — Markdown Any Decision Record
- [C4 Model](https://c4model.com/) — Software architecture visualization
- [ADR GitHub Organization](https://adr.github.io/) — Decision record resources

---

See [references/templates.md](references/templates.md) for document templates.
See [references/diagrams.md](references/diagrams.md) for Mermaid diagram patterns.
