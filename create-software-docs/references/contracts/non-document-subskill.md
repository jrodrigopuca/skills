# Non-Document Sub-skill Contract

Use this contract for sub-skills that do not directly author a final documentation file, but instead analyze, validate, or editorially refine generated docs.

## Required Sections

Every non-document sub-skill should define:

- `## Responsibilities`
- `## Required Inputs`
- `## Expected Output`
- `## Rules`
- `## References`

## Intent

These sub-skills should operate on the documentation system rather than a single target document.

Examples:

- scope analysis
- validation
- cleanup and review

## Output Rules

Expected outputs should be structured and reusable by the orchestrator.

Typical fields include:

- scope metadata
- findings
- issues to fix
- cleanup actions taken or recommended
- unresolved items
- pass/fail summary when applicable

Artifact names should align with the shared handoff contract in `sub-skill-handoffs.md` when outputs are passed to downstream sub-skills.

## Constraint

Non-document sub-skills should not duplicate document templates. They should define process contracts, findings, and decision criteria.
