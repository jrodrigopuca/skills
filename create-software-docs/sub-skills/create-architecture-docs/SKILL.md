---
name: create-architecture-docs
description: Generate architecture documentation for the selected scope, including architecture style, evidence-based Mermaid diagrams, module descriptions, cross-cutting concerns, and constraints. | Genera documentación de arquitectura para el alcance seleccionado, incluyendo estilo arquitectónico, diagramas Mermaid basados en evidencia, descripción de módulos, concerns transversales y restricciones.
license: MIT
---

# Create Architecture Docs

Generate `{scope}/docs/architecture.md`.

## Responsibilities

- classify the architecture style
- choose diagrams according to observed complexity
- document modules, dependencies, and cross-cutting concerns
- include security and operational notes when evidenced
- omit unsupported sections rather than speculate

## Rules

- Always include a component diagram and at least one critical sequence when evidence supports them.
- For simple projects, omit context, container, and deployment sections unless clearly supported.
- Keep naming aligned with actual modules, services, and integrations.
- Include `Scope`, `Confidence Note`, and `Sources Inspected`.

See the shared template at [../../references/templates/architecture.md](../../references/templates/architecture.md), the shared conventions at [../../references/templates/common.md](../../references/templates/common.md), the local specialization note in `references/local-specialization.md`, and [references/diagrams.md](references/diagrams.md).
