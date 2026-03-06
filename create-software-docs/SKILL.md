---
name: create-software-docs
description: Orchestrate project documentation generation from codebase analysis using specialized sub-skills for scope analysis, architecture, development guides, ADRs, runbooks, APIs, data models, glossary, and validation. | Orquesta la generación de documentación de proyecto desde el análisis del código usando sub-skills especializadas para alcance, arquitectura, guía de desarrollo, ADRs, runbooks, API, modelo de datos, glosario y validación.
license: MIT
---

# Software Project Documentation Orchestrator

Generate structured project documentation by coordinating specialized documentation sub-skills.

## Overview

This skill is the **orchestrator** for project documentation. It does not try to author every document directly. Instead, it:

1. resolves the documentation `{scope}`
2. gathers shared evidence
3. decides which sub-skills are applicable
4. executes them in the right order
5. consolidates output under `{scope}/docs/`
6. validates consistency before finishing

The orchestrator is responsible for hierarchy, activation order, and global quality rules.

## Output Convention

All generated files must live under `{scope}/docs/`, where `{scope}` is:

- the repository root for a single-project repo
- the selected app root in a monorepo
- the selected package root in a monorepo
- the selected service root in a multi-service repository

Never write documentation outside the selected `{scope}`.

## Available Sub-skills

Use these sub-skills as building blocks:

- `sub-skills/analyze-project-scope/`
- `sub-skills/create-project-overview/`
- `sub-skills/create-architecture-docs/`
- `sub-skills/create-development-guide/`
- `sub-skills/create-adrs/`
- `sub-skills/create-runbooks/`
- `sub-skills/create-data-model-docs/`
- `sub-skills/create-api-docs/`
- `sub-skills/create-glossary/`
- `sub-skills/validate-generated-docs/`

## Operating Rules

These rules are mandatory across all sub-skills:

1. **Do not invent facts.** Only document behavior, structure, commands, integrations, and architecture that are directly observable in the repository.
2. **Differentiate evidence from inference.** Mark reconstructed statements as **Inferred**. Mark low-confidence statements as **Needs confirmation**.
3. **Prefer omission over speculation.** If a section is unsupported, omit it or mark it explicitly.
4. **Cite repository evidence.** Every generated document must include a short **Sources inspected** section.
5. **Respect scope boundaries.** Do not mix evidence from outside the selected `{scope}` unless you clearly label it as external context.
6. **Keep cross-document consistency.** Names, modules, diagrams, and paths must agree across all docs.
7. **Validate before finishing.** Always run the validation sub-skill after generation.

## Orchestrator Workflow

### 1. Resolve Scope

Call `sub-skills/analyze-project-scope/` first.

The scope analysis must determine:

- scope root
- scope type: repository, app, package, or service
- project complexity: simple, medium, or complex
- main technologies
- major modules and entry points
- evidence inventory
- applicable document types

If the repository is partial, document the missing context explicitly.

### 2. Build the Generation Plan

Based on scope analysis, decide which documents to generate.

#### Always generate

- `{scope}/docs/project-overview.md`
- `{scope}/docs/architecture.md`
- `{scope}/docs/development-guide.md`

#### Generate if applicable

- `{scope}/docs/decisions/NNN-title.md`
- `{scope}/docs/runbooks/*.md`
- `{scope}/docs/data-model.md`
- `{scope}/docs/api-reference.md`
- `{scope}/docs/glossary.md`

### 3. Execute Sub-skills in Order

Use this order unless there is a strong scope-specific reason to change it:

1. `analyze-project-scope`
2. `create-project-overview`
3. `create-architecture-docs`
4. `create-development-guide`
5. `create-data-model-docs` if persistent data exists
6. `create-api-docs` if an API exists
7. `create-runbooks` if deployments or operations exist
8. `create-glossary` if domain language is non-trivial
9. `create-adrs`
10. `validate-generated-docs`

### 4. Update Scope README

After generation and validation, add or update a `## Documentation` section in the README that belongs to the selected `{scope}`.

## Activation Rules

### `analyze-project-scope`

Always run.

### `create-project-overview`

Always run.

### `create-architecture-docs`

Always run.

### `create-development-guide`

Always run unless the scope is purely documentary and has no executable development workflow.

### `create-adrs`

Run when you can identify important, hard-to-reverse, or cross-cutting technical decisions.

### `create-runbooks`

Run when the repository shows evidence of deployment, migration, operations, workers, queues, jobs, or incident handling.

### `create-data-model-docs`

Run when persistent data is present: ORM models, migrations, schemas, entity definitions, or database configuration.

### `create-api-docs`

Run when the scope exposes an API: routes, controllers, resolvers, RPC handlers, OpenAPI specs, or similar.

### `create-glossary`

Run when the scope uses domain-specific language, acronyms, bounded contexts, or internal terminology.

### `validate-generated-docs`

Always run last.

## Conflict Resolution

If sub-skills produce overlapping or conflicting information:

1. prefer direct evidence over inference
2. prefer the more specialized sub-skill over the more general one
3. if the conflict cannot be resolved, mark it as **Needs confirmation**
4. fix links and naming inconsistencies before finalizing

## Shared References

Use the shared references when they apply:

- [references/templates.md](references/templates.md)
- [references/diagrams.md](references/diagrams.md)
- the shared quality checklist in `references/quality-checklist.md`

Sub-skills may also have local references that specialize these shared materials.

## Completion Checklist

Before finalizing, verify:

- [ ] `{scope}` is explicit
- [ ] output files are inside `{scope}/docs/`
- [ ] every document includes evidence or sources inspected
- [ ] inferred statements are labeled
- [ ] diagrams reflect the real code structure
- [ ] runbook commands are evidenced by repository artifacts
- [ ] README links point to generated docs inside the selected scope
- [ ] the validation sub-skill has been run
