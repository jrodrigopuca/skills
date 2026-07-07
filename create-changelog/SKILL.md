---
name: create-changelog
description: Generate or update CHANGELOG.md and release notes from conventional commit history. Follows Keep a Changelog format, infers the semver bump (major/minor/patch) from commit types, rewrites commit subjects into user-facing language, and filters internal noise. Trigger: "generate changelog", "update the changelog", "release notes", "prepare the release", "what changed since", "generar changelog", "notas de versión", "preparar release".
license: MIT
metadata:
  author: jrodrigopuca
  version: "1.0"
---

# Changelog Generator

Turn conventional commit history into a [Keep a Changelog](https://keepachangelog.com/) CHANGELOG.md and human-quality release notes.

## Overview

This is the payoff of `using-commit`: if the team writes conventional commits, the changelog and the next version number are already encoded in the history — they just need extraction and **editing**. The editing matters: a changelog is written **for users of the software, not for its developers**. A raw `git log` dump is not a changelog.

## When to Use

✅ Repo with conventional commits and no changelog automation
✅ Preparing a release: changelog section + version bump + release notes
✅ "What changed since v2.3?" summaries for stakeholders
✅ Backfilling a CHANGELOG.md for an existing project

❌ The repo already uses semantic-release / changesets / git-cliff in CI — don't fight the automation; offer to improve its config instead (see [references/formats.md](references/formats.md) for the tool comparison)
❌ Writing the commits themselves → `using-commit`

## Workflow

### 1. Determine the Range

```bash
git describe --tags --abbrev=0        # last tag → range is {tag}..HEAD
git tag --sort=-creatordate | head -5 # or let the user pick two refs
```

No tags? Ask whether to cover the whole history (backfill) or a date range. State the chosen range in the output.

### 2. Extract Commits

```bash
git log {range} --no-merges --date=short \
  --format="%H%x1f%ad%x1f%s%x1f%b%x1e"
```

(`%x1f`/`%x1e` separators survive multi-line bodies; parse hash, date, subject, body.)

### 3. Parse Each Commit

Extract: **type**, **scope**, **breaking flag** (`!` after type/scope OR `BREAKING CHANGE:` footer — check both), subject, and issue/PR references from footers (`Closes #123`, `JIRA: PROJ-456`).

Non-conventional commits go to a **Review** bucket — never silently drop them, never guess their type.

### 4. Map Types to Changelog Sections

| Commit type                     | Keep a Changelog section | Include?                        |
| ------------------------------- | ------------------------ | ------------------------------- |
| any type with breaking flag     | **⚠ Breaking Changes**   | Always, first, with migration note |
| `feat`                          | **Added**                | Always                          |
| `fix`                           | **Fixed**                | Always                          |
| `perf`                          | **Changed** (as "Improved…") | Always                      |
| `feat`/`fix` that removes or deprecates | **Removed** / **Deprecated** | Read the body to detect |
| security-related `fix`/`build(deps)` (CVE, vulnerability) | **Security** | Always |
| `refactor`, `style`, `test`, `ci`, `chore`, `docs` | — | **Exclude** (internal noise) unless user-visible |
| `build(deps)` routine bumps     | —                        | Exclude (or one summary line)   |

The exclusion rule is the difference between a changelog and a log. When in doubt, ask: *does a user of this software care?*

### 5. Edit for Humans

- **Rewrite subjects into user language.** `fix(auth): handle nil deref in token refresh` → "Fixed a crash when refreshing expired sessions."
- **Merge related commits.** A feature plus its three follow-up fixes in the same range = **one** entry.
- **Keep references.** End entries with `(#123)` when the repo links PRs/issues.
- **Order by impact** within each section, not by commit date.

### 6. Infer the Version Bump

| Highest change in range | Bump  | Example        |
| ----------------------- | ----- | -------------- |
| Breaking                | MAJOR | 2.3.1 → 3.0.0  |
| feat                    | MINOR | 2.3.1 → 2.4.0  |
| fix / perf only         | PATCH | 2.3.1 → 2.3.2  |

**0.x caveat:** pre-1.0, convention is breaking → MINOR, everything else → PATCH. State the inferred bump and the rule used; the user decides the actual release.

### 7. Write or Update CHANGELOG.md

- **New file** → full Keep a Changelog skeleton from [references/formats.md](references/formats.md).
- **Existing file** → insert the new version section directly below `## [Unreleased]`, **preserving all existing content and style**. Update the comparison links at the bottom.
- Version heading format: `## [2.4.0] - 2026-07-07`.
- If the user isn't releasing yet, put entries under `## [Unreleased]` instead.

### 8. Optional: Release Notes

Different artifact, different audience. Changelog = complete and scannable; release notes = narrative highlights (top 2-3 changes with a sentence of *why it matters*, then upgrade instructions, then a "Full changelog" link). Template in [references/formats.md](references/formats.md).

## Degradation Strategy

| Issue                             | Action                                                        |
| --------------------------------- | ------------------------------------------------------------- |
| History is mostly non-conventional | Best-effort classification by keywords; every guessed entry flagged `<!-- review -->`; suggest adopting `using-commit` |
| Huge range (500+ commits)          | Group by scope, summarize; offer per-scope detail on request  |
| No tags and no versions in package.json | Generate `[Unreleased]` only; recommend tagging strategy |
| Monorepo                           | Ask which package; filter commits by scope or path (`git log -- packages/ui`) |

## Example

**User:** "Prepare the changelog for the next release"

**Found:** last tag `v1.4.0`; range has 24 commits — 2 feat (one with `!`), 5 fix, 1 perf, 16 chore/test/refactor.

**Output:**

```markdown
## [2.0.0] - 2026-07-07

### ⚠ Breaking Changes

- API responses now use camelCase field names. Update clients to the new
  naming — see [migration guide](docs/api-v2-migration.md). (#412)

### Added

- Export reports as PDF from the dashboard. (#398)

### Changed

- Improved dashboard load time on large accounts (~3x faster). (#405)

### Fixed

- Fixed duplicate charges when confirming payment twice in quick succession. (#401)
- Fixed session expiring early in timezones ahead of UTC. (#417)
…
```

> Inferred bump: **MAJOR** (breaking change in #412) → suggested version **2.0.0**. 16 internal commits (chore/test/refactor) excluded.

## Resources

- [references/formats.md](references/formats.md) — Keep a Changelog skeleton, release notes template, automation tool comparison
- [Keep a Changelog](https://keepachangelog.com/) · [Semantic Versioning](https://semver.org/) · [Conventional Commits](https://www.conventionalcommits.org/)
- Sibling skill: `using-commit` — write the commits this skill consumes
