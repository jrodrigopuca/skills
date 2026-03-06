# Validation Rules

## Purpose

Define the structural and evidence-based checks that validation must perform before delivery or cleanup.

## Applies To

- `validate-generated-docs`

## Rules

- output path is under `{scope}/docs/`
- `Scope` is explicit where required
- `Sources Inspected` appears in generated documents
- `Inferred` and `Needs confirmation` are used where necessary
- internal document links resolve
- names and modules are consistent across docs
- Mermaid diagrams align with the narrative and selected scope
- placeholder sections that remain unsupported are removed

## Usage Notes

- report cleanup candidates separately from hard validation failures when possible
