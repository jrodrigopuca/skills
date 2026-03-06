# Local Specialization

## Base Inputs

Use these inputs in order:

1. shared conventions at `../../references/templates/common.md`
2. shared document template at `../../references/templates/architecture.md`
3. the existing target document when operating in `update` or `reconcile` mode
4. this local specialization note
5. local diagram rules in `diagrams.md`

## Local Adjustments

- keep component and sequence diagrams aligned with the selected `{scope}` only
- use real module names from the repository whenever possible
- omit context, container, and deployment sections for simple scoped projects unless evidence is explicit
- when updating, prefer replacing only outdated diagrams or sections instead of rewriting the full architecture doc

## Do Not Repeat

Do not restate the full shared template here. Only describe scope-specific adjustments.
