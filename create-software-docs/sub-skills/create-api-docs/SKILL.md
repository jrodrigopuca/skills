---
name: create-api-docs
description: Generate API documentation for the selected scope from routes, handlers, schemas, resolvers, or formal specifications. | Genera documentación de API para el alcance seleccionado a partir de rutas, handlers, esquemas, resolvers o especificaciones formales.
license: MIT
---

# Create API Docs

Generate `{scope}/docs/api-reference.md`.

## Responsibilities

- identify the API surface
- group endpoints or operations by domain
- describe auth, request/response shapes, and error behavior when evidenced
- avoid speculating about undocumented contracts

## Rules

- Prefer route definitions, schemas, resolvers, OpenAPI specs, and validators.
- Use `Needs confirmation` for incomplete payload or error details.
- Keep endpoint grouping aligned with the repository structure.
- Include `Sources Inspected`.

See the shared template at [../../references/templates/api-reference.md](../../references/templates/api-reference.md), the shared conventions at [../../references/templates/common.md](../../references/templates/common.md), [references/endpoint-rules.md](references/endpoint-rules.md), and the local specialization note in `references/local-specialization.md`.
