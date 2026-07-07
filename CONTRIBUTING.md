# Contributing — Suite Design Conventions

These conventions keep 12 skills working as **one system**. CI enforces the mechanical ones (`scripts/validate-skills.mjs`); the rest are design rules — read them before adding or changing a skill.

## The Suite Map

```
ENTENDER      create-agents-docs · create-software-docs · create-component-docs
DECIDIR       create-adr
TRABAJAR      build-report · test-report · deps-report
REGISTRAR     using-jsdoc · using-commit · using-review-comments · create-changelog
RECORDAR      context-compactor
```

Known handoffs (document them explicitly in the skills involved):

| From → To | What flows |
| --------- | ---------- |
| `using-commit` → `create-changelog` | Conventional commit history is the changelog's input |
| `build-report` → `test-report` | Build must pass before test failures are trustworthy |
| `deps-report` → `test-report` | Verify the suite after upgrades |
| `context-compactor` → `create-adr` | `.context/decisions/` drafts graduate into team-facing ADRs |
| `create-adr` → `create-software-docs` | Architecture docs cite ADRs instead of re-explaining |
| `create-software-docs` → `create-agents-docs` | Reuse scope analysis; AGENTS.md links docs instead of repeating |
| report skills → `context-compactor` | Persisted reports (`.reports/`) + `ccsave` summary |

## Hard Rules (CI-enforced)

1. **Frontmatter:** `name` (= directory name), `description` **containing `Trigger:` phrases** (≤ 1024 chars), `license`, `metadata.version`. Activation happens on the description — trigger lists in the body are dead weight.
2. **Line budget:** SKILL.md ≤ 350 lines. Depth goes to `references/`, loaded on demand.
3. **Relative links must resolve** (code fences and `templates/`/example files are exempt).
4. **Scripts must pass syntax checks** (`bash -n` / `node --check`) and shell scripts must be executable.
5. **README lists every skill** and the count matches.

## Design Rules

- **Language:** SKILL.md bodies in English; trigger phrases bilingual (EN + ES) in the description.
- **Self-contained skills.** Skills install individually (`npx skills add --skill X`) — never depend on files in another skill or a shared directory. Shared *conventions* are duplicated where needed; that duplication is intentional.
- **Deterministic work goes in scripts** (`assets/scripts/`, zero-dependency, Node 18+ or bash). Parsing, counting, and transforming are code; judgment and prose are the model. Every script ships tested — run it against fixtures before committing (the cc* scripts shipped broken once; never again).
- **Evidence over invention.** Skills that generate docs/reports only state what the repo shows, mark inference as inferred, and prefer omission to speculation.
- **Reports follow the headline discipline:** outcome first ("23 failures → 3 root causes"), groups not items, every group ends with a runnable command.
- **Reports persist.** Report skills offer `.reports/YYYY-MM-DD-{type}.md` and a `context-compactor` summary so the next session doesn't re-derive the work.
- **Immutable history artifacts** (released changelog sections, accepted ADRs) are never rewritten — they're superseded.
- **Examples show ❌/✅ pairs** with the *why*, not just the what.

## Adding a Skill

1. Check it earns its place: does it fit a lifecycle stage above? Does it overlap an existing skill? (Overlap → extend, don't duplicate.)
2. Structure: `SKILL.md` + optional `references/` + optional `assets/scripts/`.
3. Write the description **first** — what + when + `Trigger:` phrases in both languages.
4. Test any scripts against fixtures; test the skill against a real repo.
5. Add the README entry (catalog section + install line).
6. Run `node scripts/validate-skills.mjs` — must pass clean.
7. Conventional commit: `feat(skill-name): ...` — and yes, use `using-commit` for it.

## Release Process

Dogfooding: `create-changelog` generates the repo's own changelog from the conventional commit history. Versions per skill live in their frontmatter; bump on behavior changes.
