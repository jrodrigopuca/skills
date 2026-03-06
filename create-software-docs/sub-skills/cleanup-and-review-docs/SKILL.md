---
name: cleanup-and-review-docs
description: Clean up and review generated documentation for editorial consistency, duplication, readability, placeholder removal, and final delivery quality without inventing new facts. | Limpia y revisa la documentación generada para asegurar consistencia editorial, evitar duplicaciones, mejorar legibilidad, eliminar placeholders y dejarla lista para entrega sin inventar hechos.
license: MIT
---

# Cleanup and Review Docs

Clean up and review everything generated under `{scope}/docs/`.

## Responsibilities

- remove duplication across related documents
- normalize headings, tables, and list formatting
- improve readability and concision without changing meaning
- remove leftover placeholders or clearly mark unresolved items
- standardize the use of `Inferred` and `Needs confirmation`
- align terminology across overview, architecture, API, ADRs, runbooks, and glossary
- fix minor cross-link and editorial consistency issues

## Required Inputs

- the validated files under `{scope}/docs/`
- validation findings from `validate-generated-docs`
- scope boundaries and expected output paths
- quality and editorial review checklists

## Rules

- Do not invent facts while polishing text.
- Prefer editorial cleanup over structural rewrites.
- Preserve repository-evidenced content from upstream sub-skills.
- If a section is unresolved and cannot be safely cleaned, leave it explicit rather than guessing.
- Keep the selected `{scope}` and output paths intact.

## Expected Output

Produce a structured cleanup result containing:

- `filesReviewed`
- `cleanupActionsTaken`
- `remainingIssues`
- `followUpValidationNeeded`
- `status` (`clean`, `clean-with-open-issues`, or `needs-manual-review`)

## References

Use these references when reviewing:

- the shared non-document contract in [../../references/contracts/non-document-subskill.md](../../references/contracts/non-document-subskill.md)
- `../../references/quality-checklist.md`
- `references/cleanup-rules.md`
- `references/editorial-checklist.md`
