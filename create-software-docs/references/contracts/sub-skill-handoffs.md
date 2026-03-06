# Sub-skill Handoff Contract

Use this contract to define the logical artifacts exchanged between sub-skills and the orchestrator.

## Purpose

Keep artifact names stable across the documentation workflow so that each sub-skill can declare its own outputs while the orchestrator can compose them predictably.

## Core Handoff Artifacts

### Scope Analysis Artifact

Produced by:

- `analyze-project-scope`

Fields:

- `scope`
- `scopeType`
- `complexity`
- `techStack`
- `majorModules`
- `sourcesInspected`
- `documentsToGenerate`
- `confidenceNote`
- `missingContext`

Consumed by:

- all document-producing sub-skills
- `validate-generated-docs`
- `cleanup-and-review-docs`

### Document Generation Artifact

Produced by:

- any document-producing sub-skill

Fields:

- `targetPath` or `targetFolder`
- `documentType`
- `sourcesInspected`
- `confidenceNote` when applicable
- `omittedSections` when applicable
- `openQuestions` or `needsConfirmation` when applicable

Consumed by:

- `validate-generated-docs`
- `cleanup-and-review-docs`
- the orchestrator when updating README and summarizing outputs

### Validation Artifact

Produced by:

- `validate-generated-docs`

Fields:

- `filesChecked`
- `issuesFound`
- `brokenLinks`
- `missingEvidenceNotes`
- `speculativeSections`
- `cleanupCandidates`
- `knownIssueCandidates`
- `status`

Consumed by:

- `cleanup-and-review-docs`
- the orchestrator

### Cleanup Artifact

Produced by:

- `cleanup-and-review-docs`

Fields:

- `filesReviewed`
- `cleanupActionsTaken`
- `remainingIssues`
- `knownIssueCandidates`
- `followUpValidationNeeded`
- `status`

Consumed by:

- the orchestrator
- `validate-generated-docs` when a final pass is required

### Known Issues Document Artifact

Produced by:

- `create-known-issues`

Fields:

- `targetPath`
- `documentType`
- `sourcesInspected`
- `confidenceNote` when applicable
- `openQuestions` or `needsConfirmation` when applicable

Consumed by:

- the orchestrator
- `validate-generated-docs` when a final pass is required

## Handoff Rules

- Sub-skills define their own outputs, but artifact names should align with this contract.
- The orchestrator defines which produced artifact is required before the next sub-skill runs.
- If an expected artifact is incomplete, the orchestrator should either stop, downgrade the plan, or mark the gap as `Needs confirmation`.
- Do not rename core artifact fields casually once downstream sub-skills depend on them.

## Recommended Flow

1. `analyze-project-scope` produces the scope analysis artifact.
2. Document-producing sub-skills consume scope analysis and produce document generation artifacts.
3. `validate-generated-docs` consumes generated documents plus scope context and produces a validation artifact.
4. `cleanup-and-review-docs` consumes generated documents plus the validation artifact and produces a cleanup artifact.
5. `create-known-issues` consumes scope, validation, and cleanup findings and produces a known issues document artifact when applicable.
6. The orchestrator decides whether a final validation pass is required.
