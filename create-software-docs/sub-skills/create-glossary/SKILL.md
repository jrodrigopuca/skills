---
name: create-glossary
description: Generate a glossary for the selected scope using domain terms, acronyms, and internal vocabulary evidenced by the codebase and docs. | Genera un glosario para el alcance seleccionado usando términos de dominio, acrónimos y vocabulario interno evidenciado por el código y la documentación.
license: MIT
---

# Create Glossary

Generate `{scope}/docs/glossary.md`.

## Responsibilities

- identify domain-specific terms
- expand acronyms and internal naming
- define terms concisely and consistently

## Rules

- Include only terms evidenced by the selected scope.
- Prefer business-meaningful definitions over implementation jargon.
- Avoid circular definitions.
- Include `Sources Inspected`.

See the shared template at [../../references/templates/glossary.md](../../references/templates/glossary.md), the shared conventions at [../../references/templates/common.md](../../references/templates/common.md), and the local specialization at [references/template.md](references/template.md).
