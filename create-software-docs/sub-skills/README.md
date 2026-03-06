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

## Purpose

- use smaller, specialized prompts
- reduce cross-document hallucination
- make monorepo scope handling explicit
- keep validation independent from generation
