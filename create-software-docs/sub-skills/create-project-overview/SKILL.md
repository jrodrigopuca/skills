---
name: create-project-overview
description: Generate the project overview document for the selected scope, including scope, confidence note, repository structure, modules, and links to all generated documentation. | Genera el documento de visión general del proyecto para el alcance seleccionado, incluyendo alcance, nota de confianza, estructura del repositorio, módulos y enlaces a toda la documentación generada.
license: MIT
---

# Create Project Overview

Generate `{scope}/docs/project-overview.md`.

## Responsibilities

- summarize what the scoped project does
- describe stack and repository structure
- list key modules and responsibilities
- act as the entry point to all generated docs
- link only to docs generated inside `{scope}/docs/`

## Rules

- Keep it concise.
- Do not duplicate full architecture details.
- Include `Scope`, `Confidence Note`, and `Sources Inspected`.
- Use repository-relative paths that match the selected scope.

See the shared template at [../../references/templates/project-overview.md](../../references/templates/project-overview.md) and the local specialization at [references/template.md](references/template.md).
