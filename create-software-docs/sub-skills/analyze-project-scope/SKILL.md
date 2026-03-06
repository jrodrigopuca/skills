---
name: analyze-project-scope
description: Analyze a project or selected sub-scope to determine documentation boundaries, complexity, stack, evidence sources, and which documentation artifacts should be generated. | Analiza un proyecto o sub-alcance seleccionado para determinar límites de documentación, complejidad, stack, fuentes de evidencia y qué artefactos documentales deben generarse.
license: MIT
---

# Analyze Project Scope

Determine the documentation `{scope}` before any other documentation skill runs.

## Responsibilities

- identify whether the target is a whole repo, app, package, or service
- detect technology stack and major entry points
- identify evidence sources inside the selected scope
- classify complexity as simple, medium, or complex
- decide which documentation outputs are applicable
- report confidence and missing context

## Required Output

Produce a structured result containing:

- `scope`
- `scopeType`
- `complexity`
- `techStack`
- `majorModules`
- `sourcesInspected`
- `documentsToGenerate`
- `confidenceNote`
- `missingContext`

## Rules

- Prefer the smallest scope that matches the user request.
- If the repo is a monorepo, identify the exact app/package/service root.
- If evidence is incomplete, state what cannot be verified.
- Reuse the evidence inventory in downstream sub-skills.

See [references/scope-rules.md](references/scope-rules.md) and [references/evidence-model.md](references/evidence-model.md).
