---
name: validate-generated-docs
description: Validate generated documentation for scope correctness, evidence markings, links, document consistency, and structural completeness. | Valida la documentación generada en cuanto a corrección del alcance, marcados de evidencia, enlaces, consistencia documental e integridad estructural.
license: MIT
---

# Validate Generated Docs

Validate everything generated under `{scope}/docs/` before final editorial cleanup, and optionally again after cleanup if substantial edits were made.

## Responsibilities

- verify files are inside the selected scope
- check cross-links and README links
- ensure evidence and confidence labeling are present
- detect empty or speculative sections
- review Mermaid consistency and document coherence
- emit structured `filesChecked` entries for per-file validation coverage
- emit structured `issuesFound` for meaningful validation findings
- report issues that should be fixed by cleanup and review without inventing new content
- emit structured `brokenLinks`, `missingEvidenceNotes`, and `speculativeSections`
- emit structured `cleanupCandidates` for issues cleanup can safely address
- identify only persistent, track-worthy findings as `knownIssueCandidates`

## Required Inputs

- the generated files under `{scope}/docs/`
- the selected `{scope}` and expected docs boundaries
- cross-links between generated docs and the scope README
- evidence markers such as `Sources inspected`, `Inferred`, and `Needs confirmation`

## Expected Output

Produce a **Validation Artifact** containing:

- `filesChecked` as structured file check entries
- `issuesFound`
- `brokenLinks`
- `missingEvidenceNotes`
- `speculativeSections`
- `cleanupCandidates`
- `knownIssueCandidates`
- `status` (`pass`, `pass-with-findings`, or `fail`)

## Rules

- Prefer minimal corrections over broad rewrites.
- Preserve specialized content from upstream sub-skills.
- Report unresolved issues explicitly.
- Use the final checklist before completion.
- Do not absorb editorial cleanup responsibilities that belong to `cleanup-and-review-docs`.
- Use structured `filesChecked` entries so downstream review can see which checks were applied per file.
- Use structured `issuesFound` instead of free-form lists for meaningful validation findings.
- Use structured `brokenLinks`, `missingEvidenceNotes`, and `speculativeSections` instead of ambiguous summaries.
- Use structured `cleanupCandidates` instead of vague prose when the issue is expected to be handled during cleanup.
- Do not promote every finding into `knownIssueCandidates`; use that field only for evidence-backed issues that should remain visible after the current pass.

## References

Use the shared non-document contract in [../../references/contracts/non-document-subskill.md](../../references/contracts/non-document-subskill.md), the shared handoff contract in [../../references/contracts/sub-skill-handoffs.md](../../references/contracts/sub-skill-handoffs.md), and the local references [references/validation-rules.md](references/validation-rules.md) and [references/output-checklist.md](references/output-checklist.md).
