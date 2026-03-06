---
name: create-known-issues
description: Generate a known issues document for the selected scope using validation findings, cleanup findings, and repository evidence, including issue status and future clarification or review notes. | Genera un documento de problemas conocidos para el alcance seleccionado usando hallazgos de validación, limpieza y evidencia del repositorio, incluyendo estado del issue y notas de aclaración o reevaluación futura.
license: MIT
---

# Create Known Issues

## Responsibilities

- consolidate unresolved or consciously accepted issues detected during analysis, validation, cleanup, or manual review
- distinguish between newly detected issues, accepted limitations, deferred work, and resolved items that remain historically relevant
- preserve issue status and future clarification or re-evaluation needs
- avoid losing known gaps that should remain visible to humans or future LLMs
- consume only persistent `knownIssueCandidates`, not transient drafting defects

## Required Inputs

- the selected `{scope}` and documentation boundaries
- validation findings, especially unresolved issues and `knownIssueCandidates`
- cleanup findings, especially structured `remainingIssues`, surviving `knownIssueCandidates`, and follow-up validation needs
- scope analysis findings when context gaps or partial repository boundaries exist
- repository evidence supporting each issue entry

## Expected Output

Produce a **Document Generation Artifact** for known issues containing at least:

- `targetPath`: `{scope}/docs/known-issues.md`
- `documentType`: `known-issues`
- `sourcesInspected`
- `confidenceNote`
- `openQuestions` or `needsConfirmation` when applicable

The generated document must track per-item status and future clarification or re-evaluation notes.

## Rules

- Include only issues supported by repository evidence or by upstream sub-skill findings.
- Do not turn every unresolved question into a known issue; include only items worth preserving for future work or review.
- Preserve issue history when an item is already acknowledged by the team.
- Use explicit statuses rather than vague prose.
- If an issue was reconsidered and is intentionally tolerated, change its status instead of deleting the record.
- Merge duplicates coming from validation and cleanup into one stable issue entry when they describe the same underlying problem.
- Prefer the cleanup artifact over the validation artifact when deciding whether a candidate still needs long-term tracking.
- Treat a `remainingIssue` as input context, but escalate it into a final known issue only when it truly needs status tracking or future re-evaluation.

## References

Use the shared document sub-skill contract in [../../references/contracts/document-subskill.md](../../references/contracts/document-subskill.md), the shared handoff contract in [../../references/contracts/sub-skill-handoffs.md](../../references/contracts/sub-skill-handoffs.md), the shared template at [../../references/templates/known-issues.md](../../references/templates/known-issues.md), the shared conventions at [../../references/templates/common.md](../../references/templates/common.md), and the local references [references/local-specialization.md](references/local-specialization.md) and [references/status-rules.md](references/status-rules.md).
