---
name: create-adrs
description: Generate retroactive ADRs for important technical decisions in the selected scope using evidence-aware rationale and MADR-style structure. | Genera ADRs retroactivos para decisiones técnicas importantes en el alcance seleccionado usando racionales con conciencia de evidencia y estructura tipo MADR.
license: MIT
---

# Create ADRs

Generate one or more files under `{scope}/docs/decisions/`.

## Responsibilities

- identify significant technical decisions
- reconstruct context when necessary
- explain why the decision matters
- mark uncertain rationale explicitly

## Rules

- Only create ADRs for decisions that affect multiple parts of the system, are hard to reverse, or will likely be questioned later.
- If rationale is reconstructed, say so explicitly.
- Prefer fewer strong ADRs over many weak ones.
- Include `Sources Inspected` in every ADR.

See the shared template at [../../references/templates/adr.md](../../references/templates/adr.md), the shared conventions at [../../references/templates/common.md](../../references/templates/common.md), the local specialization note in `references/local-specialization.md`, and [references/evidence-policy.md](references/evidence-policy.md).
