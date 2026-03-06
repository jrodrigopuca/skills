---
name: create-data-model-docs
description: Generate data model documentation for the selected scope using schemas, migrations, ORM models, and other persistence evidence. | Genera documentación del modelo de datos para el alcance seleccionado usando esquemas, migraciones, modelos ORM y otra evidencia de persistencia.
license: MIT
---

# Create Data Model Docs

Generate `{scope}/docs/data-model.md`.

## Responsibilities

- identify persisted entities
- document fields, constraints, and relationships
- generate an evidence-based ER diagram
- describe lifecycle when observable

## Rules

- Use field names and types that exist in the repository.
- Mark uncertain relationships as `Needs confirmation`.
- Do not infer persistence if only transient types are present.
- Include `Sources Inspected`.

See the shared template at [../../references/templates/data-model.md](../../references/templates/data-model.md), the shared conventions at [../../references/templates/common.md](../../references/templates/common.md), and the local references [references/erd-rules.md](references/erd-rules.md) and [references/template.md](references/template.md).
