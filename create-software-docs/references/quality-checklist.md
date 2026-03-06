# Quality Checklist

Use this checklist after generating documentation under `{scope}/docs/`.

## Global Checks

- [ ] The selected `{scope}` is explicit in the docs.
- [ ] Files were generated only inside `{scope}/docs/`.
- [ ] No section claims behavior that is not supported by repository evidence.
- [ ] Inferred statements are labeled as `Inferred`.
- [ ] Uncertain statements are labeled as `Needs confirmation`.
- [ ] Each document includes `Sources inspected`.
- [ ] Links between documents resolve correctly.
- [ ] Editorial cleanup has removed stale placeholders and obvious duplication.

## Document-Specific Checks

### Project Overview

- [ ] Matches the selected scope.
- [ ] Links to every generated document.

### Architecture

- [ ] Mermaid diagrams match actual modules, services, and integrations.
- [ ] Omitted sections are truly unsupported by evidence.

### Development Guide

- [ ] Setup, test, lint, and build commands exist in the repository.
- [ ] Environment variables are described only when evidenced.

### ADRs

- [ ] Decisions explain why, not only what.
- [ ] Reconstructed rationale is clearly labeled.

### Runbooks

- [ ] Steps are executable and ordered.
- [ ] Rollback and verification are present.

### Data Model

- [ ] Entities and relationships come from actual schema evidence.
- [ ] Uncertain relationships are marked.

### API Reference

- [ ] Endpoints and auth match routes, schemas, or specs.
- [ ] Error behavior is evidence-based.

### Glossary

- [ ] Terms reflect real domain or internal language.
- [ ] Definitions are concise and non-speculative.

## Cleanup and Review

- [ ] Terminology is consistent across all generated docs.
- [ ] Repeated explanations were reduced or cross-linked instead of duplicated.
- [ ] Heading levels, bullet lists, and tables are stylistically consistent.
- [ ] Final wording is concise without changing evidenced meaning.
