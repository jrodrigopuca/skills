# Local Specialization

## Base Inputs

Use these inputs in order:

1. shared conventions at `../../references/templates/common.md`
2. shared document template at `../../references/templates/data-model.md`
3. the existing target document when operating in `update` or `reconcile` mode
4. this local specialization note
5. local ERD rules in `erd-rules.md`

## Local Adjustments

- prefer schema and migration evidence over DTOs and transport types
- keep entity descriptions tied to business meaning, not only storage detail
- mark unclear cardinality as `Needs confirmation`
- when updating, preserve valid entities and refresh only changed fields, relationships, lifecycle notes, or ERD fragments

## Do Not Repeat

Do not restate the full shared template here. Only describe scope-specific adjustments.
