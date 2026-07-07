---
name: using-commit
description: Guide for writing commit messages following Conventional Commits. Use when making a commit, writing descriptive messages, standardizing project history, or automating versioning and changelogs. Covers commit types, scopes, breaking changes, footers, and JIRA references. Trigger: "write a commit", "commit message", "conventional commits", "hacer commit", "mensaje de commit", "commit semántico".
license: MIT
metadata:
  author: jrodrigopuca
  version: "2.0"
---

# Conventional Commits Guide

Write structured, machine-readable commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Minimal example:**

```
feat: add authentication system
```

**Full example:**

```
feat(auth): implement OAuth2 login

Add support for Google and GitHub authentication.
Includes token handling and automatic refresh.

Closes #123
BREAKING CHANGE: The /login endpoint now requires redirect_uri
```

## Commit Types

| Type                        | Use for                              | Semver            |
| --------------------------- | ------------------------------------ | ----------------- |
| `feat`                      | New functionality                    | MINOR (0.X.0)     |
| `fix`                       | Bug fix                              | PATCH (0.0.X)     |
| `docs`                      | Documentation only                   | -                 |
| `style`                     | Formatting, whitespace (no logic)    | -                 |
| `refactor`                  | Code change, no feat and no fix      | -                 |
| `perf`                      | Performance improvement              | PATCH (0.0.X)     |
| `test`                      | Add or fix tests                     | -                 |
| `build`                     | Build system, dependencies           | -                 |
| `ci`                        | CI/CD scripts                        | -                 |
| `chore`                     | Maintenance tasks                    | -                 |
| `revert`                    | Revert a previous commit             | Varies            |
| **!** or **BREAKING CHANGE** | Incompatible change (any type)      | **MAJOR (X.0.0)** |

Quick decision guide:

```
Adds new functionality?            → feat
Fixes incorrect behavior?          → fix
Improves performance?              → perf
Changes structure, same behavior?  → refactor
Otherwise                          → style / docs / chore / test / build / ci
```

See [references/types.md](references/types.md) for the full reference with examples and common scopes per type.

## Scope

The scope names the part of the project affected:

```bash
feat(parser): add JSON5 support          # module/component
refactor(api): extract business logic    # application layer
fix(auth): resolve login timeout         # feature area
fix(auth,api): sync token validation     # multiple scopes, comma-separated
chore: migrate to TypeScript 5           # no scope when project-wide
```

Keep scopes **consistent** (always lowercase, same name for the same module) and document the team's scopes in CONTRIBUTING.md.

## Description Rules

- Max 72 characters (ideally ~50)
- Lowercase after the colon, no trailing period
- **Imperative mood**: "add" not "added", "fix" not "fixed"
- Must complete the sentence: "If applied, this commit will **\_\_**"

```bash
# ✅ GOOD — imperative, specific
git commit -m "feat: add email validation"
git commit -m "fix: prevent race condition in cache"

# ❌ BAD — past tense or vague
git commit -m "feat: added a feature"
git commit -m "update"
```

## Body

The body explains **what** and **why**, not how. Separate it from the description with a blank line, wrap at 72 characters, and mention motivation and trade-offs:

```
feat(cache): implement LRU strategy

Replace the simple cache with an LRU to bound memory usage.
This prevents unbounded cache growth in long-running apps.
```

Skip the body when the change is obvious (`docs: fix typo in README`).

## Breaking Changes

Mark incompatible changes with `!` after the type/scope, with a `BREAKING CHANGE:` footer, or both:

```
feat(api)!: change JSON response format

BREAKING CHANGE: The 'user_id' field is now 'userId'.
Update client code to the new naming.
```

Always include migration instructions.

## Footers

Footers go at the end, one per line:

```
Closes #123                    # closes an issue
Fixes #456, #789               # fixes issues
Refs: #890                     # related reference
BREAKING CHANGE: ...           # incompatible change
Reviewed-by: @tech-lead        # reviewer
Co-authored-by: Name <email>   # human co-author
```

**JIRA references** — preferred format is a footer:

```
feat(checkout): add PayPal payment option

Implements full PayPal SDK integration with webhook handling.

JIRA: PROJ-1234
```

Alternatives: subject prefix `[PROJ-1234] feat(checkout): ...` when team policy requires it; multiple tickets as `JIRA: PROJ-456 (principal)` plus `Also fixes: PROJ-123`. One primary ticket per commit — many unrelated tickets means the commit is not atomic.

## Best Practices

1. **One commit = one logical change** — don't mix refactor with feature
2. **Atomic commits** — every commit leaves the code working
3. **Self-explanatory description** — understandable without reading the diff
4. **Consistent scopes** — agree on scope names as a team
5. **Explicit breaking changes** — always document incompatibilities
6. **Tests pass before committing**

For detailed good/bad examples, anti-patterns, JIRA workflows, and commitlint/husky setup, see [references/best-practices.md](references/best-practices.md).

## Examples

**Feature with scope and breaking change:**

```
feat(auth)!: migrate authentication to headers

Switch from cookies to the Authorization header with Bearer
tokens for better compatibility with mobile apps and SPAs.

BREAKING CHANGE: Clients must send tokens in the Authorization
header instead of cookies. See docs/auth-migration.md

Closes #789
```

**Fix with technical context:**

```
fix(database): prevent duplicate insert in race condition

Add optimistic locking via a version field so concurrent
requests cannot create duplicate records. The second insert
now fails and retries by reading the existing row.

Fixes #456
Related: #234
```

**Simple chore, no body:**

```
chore(deps): update dependencies to latest versions
```

## What You Get

- **Readable history** — structured commits, easy to search: `git log --grep="^feat"`
- **Automatic changelogs** — tools like standard-version generate CHANGELOG.md
- **Semantic versioning** — the next version is derived from commit types
- **CI validation** — commitlint hooks reject malformed messages
- **Automated releases** — semantic-release publishes based on commits

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/) - Official specification
- [Semantic Versioning](https://semver.org/) - Semver 2.0.0
- [Commitizen](https://github.com/commitizen/cz-cli) - Interactive commit CLI
- [Commitlint](https://commitlint.js.org/) - Commit message linter
- [Semantic Release](https://semantic-release.gitbook.io/) - Automated releases
- [Husky](https://typicode.github.io/husky/) - Git hooks for validation
- [references/types.md](references/types.md) - Complete commit type reference
- [references/best-practices.md](references/best-practices.md) - Detailed examples and common mistakes
