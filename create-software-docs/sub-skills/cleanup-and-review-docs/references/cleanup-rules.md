# Cleanup Rules

## Purpose

Apply only editorial and consistency improvements that are safe after validation has already identified the main issues.

## Applies To

- `cleanup-and-review-docs`

## Rules

### Safe Cleanup Actions

- remove duplicated explanations that appear in multiple docs
- shorten repetitive paragraphs without dropping evidenced meaning
- normalize heading depth and section ordering when needed
- normalize table style and bullet formatting
- remove placeholders that were left by mistake
- convert unresolved placeholders into explicit `Needs confirmation` notes when removal would hide a real gap
- align repeated names for modules, services, and domains across documents
- fix obvious broken relative links inside `{scope}/docs/`

### Priority Order

1. correctness-preserving cleanup
2. consistency across docs
3. readability and concision
4. cosmetic formatting improvements

## Constraints

Do not:

- add new architectural claims
- invent missing rationale, commands, endpoints, or relationships
- rewrite major sections in ways that change technical meaning
- merge documents or restructure the docs tree unless explicitly instructed
