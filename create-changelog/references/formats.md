# Changelog Formats and Templates

## Keep a Changelog Skeleton (new CHANGELOG.md)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-07-07

### Added

- …

### Fixed

- …

## [1.0.0] - 2026-06-01

### Added

- Initial release.

[Unreleased]: https://github.com/{owner}/{repo}/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/{owner}/{repo}/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/{owner}/{repo}/releases/tag/v1.0.0
```

Maintenance rules when updating an existing file:

- New versions go **directly below `## [Unreleased]`**, newest first.
- Keep `[Unreleased]` present (empty is fine) — it's where in-progress entries accumulate.
- Update the comparison links block at the bottom: retarget `[Unreleased]`, add the new version's link.
- Never rewrite released sections (except typo fixes) — released history is immutable, like released tags.

## Section Semantics

| Section       | Contains                                                          |
| ------------- | ----------------------------------------------------------------- |
| ⚠ Breaking Changes* | Incompatible changes + migration instructions. Always first. |
| Added         | New user-facing capabilities                                      |
| Changed       | Changes to existing behavior (incl. performance improvements)     |
| Deprecated    | Still works, will be removed — say when and what to use instead   |
| Removed       | Gone in this version                                              |
| Fixed         | Bug fixes, described by symptom ("Fixed crash when…")             |
| Security      | Vulnerability fixes — always include, even if the fix was a dep bump |

\* Keep a Changelog 1.1 doesn't define a Breaking section; the convention is either a dedicated `### ⚠ Breaking Changes` block (recommended, high visibility) or bolded `**BREAKING:**` prefixes inside Changed/Removed. Follow whichever style the existing file already uses.

## Writing Style for Entries

```markdown
# ❌ Developer-speak (commit subject pasted in)
- fix(auth): handle nil deref in token refresh (#417)

# ✅ User language (symptom / benefit)
- Fixed a crash when refreshing an expired session. (#417)

# ❌ Three commits, three entries, one feature
- feat(export): add PDF export
- fix(export): fix PDF orientation
- fix(export): fix fonts in PDF export

# ✅ Merged — the user got ONE new thing
- Export reports as PDF from the dashboard. (#398)
```

- Start entries with a verb (Added…, Fixed…, Improved…) or the feature noun — be consistent within the file.
- Describe **fixes by symptom**, not by implementation: users recognize "duplicate charge", not "race condition in idempotency layer".
- Breaking entries always answer: what breaks, what to do about it, where the migration guide is.

## Release Notes Template (separate artifact)

```markdown
# {Project} v{X.Y.Z}

{One-paragraph narrative: the theme of this release.}

## Highlights

### {Headline feature}
{2-3 sentences: what it does and why it matters to the user. Screenshot/example if visual.}

### {Second highlight}
{…}

## Breaking changes & upgrade guide

{Step-by-step: what to change when upgrading. Link the full migration doc.}

## Also in this release

- {Smaller items, one line each}

**Full changelog:** [v{prev}...v{X.Y.Z}](…/compare/v{prev}...v{X.Y.Z})
```

Changelog = complete, scannable, reference. Release notes = curated, narrative, persuasive. Don't merge the two jobs into one document.

## Version Bump Rules

| Range contains…            | ≥ 1.0.0 | 0.x (pre-stable) |
| -------------------------- | ------- | ---------------- |
| Breaking change            | MAJOR   | MINOR            |
| feat (no breaking)         | MINOR   | PATCH            |
| only fix / perf            | PATCH   | PATCH            |
| only excluded types        | no release needed | no release needed |

Always report **which commit** triggered the bump ("MAJOR because of #412").

## Monorepo Notes

- One changelog **per published package**, next to its package.json — not one giant root file.
- Filter commits per package: by scope convention (`feat(ui): …`) or by path (`git log v1.4.0..HEAD -- packages/ui`). Path filtering is more reliable; scopes lie when people forget them.
- Version bumps are per-package. Changesets or per-package tags (`ui-v2.1.0`) are the common tagging schemes — detect which one the repo uses before writing links.

## When to Use Automation Instead

If the release flow is already automated, this skill's job is config/output quality, not manual generation:

| Tool                  | Model                                              | Use when                                  |
| --------------------- | -------------------------------------------------- | ----------------------------------------- |
| **semantic-release**  | Fully automated: version + changelog + publish in CI | Continuous releases, no human gate      |
| **changesets**        | Contributors write change files; CI assembles      | Monorepos; human-written entries wanted   |
| **git-cliff**         | Changelog generator, highly configurable templates | You want generated changelog, manual release |
| **commit-and-tag-version** | Local bump + changelog (successor of standard-version) | Simple repos, release from a laptop |

Manual generation (this skill) fits: repos without CI release automation, backfills, stakeholder summaries, and crafting release notes that automation can't write well.
