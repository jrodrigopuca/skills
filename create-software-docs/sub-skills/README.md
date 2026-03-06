# Sub-skills Index

This folder contains the specialized skills used by the `create-software-docs` orchestrator.

## Structure of This Index

This index summarizes:

1. execution order
2. sub-skill roles
3. main artifacts exchanged through the pipeline
4. shared contracts that keep the workflow consistent

## Execution Order

1. `analyze-project-scope`
2. `create-project-overview`
3. `create-architecture-docs`
4. `create-development-guide`
5. conditional: `create-data-model-docs`
6. conditional: `create-api-docs`
7. conditional: `create-runbooks`
8. conditional: `create-glossary`
9. `create-adrs`
10. `validate-generated-docs`
11. `cleanup-and-review-docs`
12. conditional: `create-known-issues`

If cleanup or known-issues generation performs substantial edits, run `validate-generated-docs` again as a final pass.

## Sub-skill Roles

### Scope Analysis

- `analyze-project-scope`
  - resolves `{scope}`
  - identifies evidence sources
  - decides which docs should be generated
  - produces the `Scope Analysis Artifact`

### Document Generation

- `create-project-overview`
- `create-architecture-docs`
- `create-development-guide`
- `create-data-model-docs`
- `create-api-docs`
- `create-runbooks`
- `create-glossary`
- `create-adrs`

These sub-skills generate final documentation files and produce `Document Generation Artifact` outputs.

### Known-Issue Documentation

- `create-known-issues`

This sub-skill generates the final known-issues document and produces the `Known Issues Document Artifact`.

### Validation

- `validate-generated-docs`
  - validates generated docs against scope, evidence, links, and consistency rules
  - produces the `Validation Artifact`
  - emits structured fields such as `filesChecked`, `issuesFound`, `brokenLinks`, `missingEvidenceNotes`, `speculativeSections`, `cleanupCandidates`, and `knownIssueCandidates`

### Cleanup and Review

- `cleanup-and-review-docs`
  - applies safe editorial cleanup
  - resolves or escalates cleanup candidates
  - produces the `Cleanup Artifact`
  - emits structured `remainingIssues` and surviving `knownIssueCandidates`

## Artifact Pipeline Summary

The main handoff flow is:

1. `analyze-project-scope` → `Scope Analysis Artifact`
2. document-producing sub-skills → `Document Generation Artifact`
3. `validate-generated-docs` → `Validation Artifact`
4. `cleanup-and-review-docs` → `Cleanup Artifact`
5. `create-known-issues` → `Known Issues Document Artifact` when applicable

## Typed Artifact Highlights

The shared handoff contract also defines reusable structured items used inside those artifacts, including:

- `Evidence Reference`
- `File Check Entry`
- `Validation Finding`
- `Broken Link Entry`
- `Missing Evidence Note`
- `Speculative Section Entry`
- `Cleanup Candidate`
- `Remaining Issue`
- `Known Issue Candidate`

These reusable shapes should keep naming and escalation behavior consistent across the orchestrator, validation, cleanup, and known-issues stages.

Use those shared shapes instead of free-form lists whenever the sub-skill output is intended for downstream consumption.

## Reference Contract

Document-producing sub-skills should consume references in this order:

1. shared conventions in `../references/templates/common.md`
2. the shared contract in `../references/contracts/document-subskill.md`
3. one document-specific shared template in `../references/templates/`
4. one or more local specialization notes in the sub-skill `references/` folder
5. any additional local rules files only when needed

This keeps shared structure centralized and local behavior minimal.

Non-document sub-skills should instead use the shared process contract in `../references/contracts/non-document-subskill.md` plus any local rules/checklists they require.

Local rule files and checklist files should follow the shared contract in `../references/contracts/rules-and-checklists.md`.

Artifact exchanges between sub-skills should align with the shared handoff contract in `../references/contracts/sub-skill-handoffs.md`.

When a sub-skill emits structured findings, prefer the canonical artifact names and shapes from that contract over local ad hoc lists.

## Purpose

- use smaller, specialized prompts
- reduce cross-document hallucination
- make monorepo scope handling explicit
- keep validation independent from generation
- keep editorial cleanup separate from structural validation
- keep analysis, validation, and cleanup on a shared process contract
- keep artifact exchange typed and predictable for downstream sub-skills
