# Local Specialization

## Base Inputs

Use these inputs in order:

1. shared conventions at `../../references/templates/common.md`
2. shared document template at `../../references/templates/development-guide.md`
3. the existing target document when operating in `update` or `reconcile` mode
4. this local specialization note

## Local Adjustments

- prefer commands that are runnable from within the selected `{scope}`
- if the monorepo requires root-level commands, explain that explicitly in the setup or running sections
- keep operational warnings practical and tied to local developer workflow
- when updating, preserve valid setup instructions and replace only stale commands, env notes, or workflow steps

## Do Not Repeat

Do not restate the full shared template here. Only describe scope-specific adjustments.
