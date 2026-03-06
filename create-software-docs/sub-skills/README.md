# Sub-skills Index

This folder contains the specialized skills used by the `create-software-docs` orchestrator.

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

If cleanup performs substantial edits, run `validate-generated-docs` again as a final pass.

## Reference Contract

Document-producing sub-skills should consume references in this order:

1. shared conventions in `../references/templates/common.md`
2. one document-specific shared template in `../references/templates/`
3. one or more local specialization notes in the sub-skill `references/` folder
4. any additional local rules files only when needed

This keeps shared structure centralized and local behavior minimal.

Non-document sub-skills should instead use the shared process contract in `../references/contracts/non-document-subskill.md` plus any local rules/checklists they require.

Local rule files and checklist files should follow the shared contract in `../references/contracts/rules-and-checklists.md`.

## Purpose

- use smaller, specialized prompts
- reduce cross-document hallucination
- make monorepo scope handling explicit
- keep validation independent from generation
- keep editorial cleanup separate from structural validation
- keep analysis, validation, and cleanup on a shared process contract
