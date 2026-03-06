---
name: validate-generated-docs
description: Validate generated documentation for scope correctness, evidence markings, links, document consistency, and structural completeness. | Valida la documentación generada en cuanto a corrección del alcance, marcados de evidencia, enlaces, consistencia documental e integridad estructural.
license: MIT
---

# Validate Generated Docs

Validate everything generated under `{scope}/docs/`.

## Responsibilities

- verify files are inside the selected scope
- check cross-links and README links
- ensure evidence and confidence labeling are present
- detect empty or speculative sections
- review Mermaid consistency and document coherence

## Rules

- Prefer minimal corrections over broad rewrites.
- Preserve specialized content from upstream sub-skills.
- Report unresolved issues explicitly.
- Use the final checklist before completion.

See [references/validation-rules.md](references/validation-rules.md) and [references/output-checklist.md](references/output-checklist.md).
