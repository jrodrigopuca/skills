# Complete Commit Type Reference

Detailed guide to every Conventional Commits type with examples and use cases.

## Main Types

### feat - New Functionality

**When:** Any addition of new functionality users can use.
**Semver:** MINOR (0.X.0)

```bash
feat(ui): add dark mode
feat(navbar): implement search with autocomplete
feat(api): create notifications endpoint
feat(auth): implement OAuth authentication
feat(payments): integrate Stripe as payment method
feat(export): add PDF export
feat(i18n): add Portuguese support
feat(cache): implement distributed cache with Redis
```

**Common scopes:** `ui`, `api`, `auth`, `payments`, `i18n`, `export`, `search`, `notifications`

### fix - Bug Fixes

**When:** Any correction of incorrect behavior.
**Semver:** PATCH (0.0.X)

```bash
fix(login): correct redirect after authentication
fix(cart): prevent duplicate products in cart
fix(modal): correct z-index over header
fix(form): prevent double submit on Enter
fix(query): optimize query causing timeout
fix(memory): prevent memory leak in polling
fix(webhook): retry failed deliveries correctly
fix: restore export behavior (regression in v2.1)
```

**Common scopes:** `login`, `cart`, `api`, `form`, `validation`, `ui`, `query`

### docs - Documentation

**When:** Changes to documentation files only (README, guides, comments).
**Semver:** none

```bash
docs: update installation guide
docs(readme): add troubleshooting section
docs(api): document new endpoints
docs(architecture): add component diagram
docs(utils): add JSDoc to helper functions
docs(changelog): update for version 2.0
```

**Note:** If documentation ships together with code, use the code's type (`feat`, `fix`) and mention the docs in the body.

### style - Code Formatting

**When:** Changes that do NOT affect logic (whitespace, formatting, semicolons).
**Semver:** none

```bash
style: apply Prettier to all files
style(components): run ESLint --fix
style(imports): sort imports alphabetically
style(variables): rename to consistent camelCase
```

**Important:** If a rename has functional implications or spans many files, consider `refactor` instead.

### refactor - Refactoring

**When:** Code changes that neither add functionality nor fix bugs — they improve structure or readability.
**Semver:** none (unless the public API changes)

```bash
refactor(auth): extract validation logic to helpers
refactor(components): split large component into subcomponents
refactor(validation): simplify logic with early returns
refactor(state): migrate from Context API to Zustand
refactor: reorganize folder structure by domain
refactor: migrate class components to hooks
refactor(api): convert callbacks to async/await
```

**Common scopes:** `auth`, `api`, `components`, `utils`, `state`, `config`

### perf - Performance Improvements

**When:** Changes that improve performance without adding functionality or fixing bugs.
**Semver:** PATCH (0.0.X)

```bash
perf(database): add indexes to frequent queries
perf(api): implement pagination on large listings
perf(query): reduce N+1 queries with eager loading
perf(images): implement lazy loading
perf(bundle): split bundle into per-route chunks
perf(api): add 5min cache to static endpoints
perf(search): replace linear search with binary search
```

**Tip:** Include benchmarks in the body when possible:

```
perf(query): add index to user_email

Reduces user lookup by email from ~800ms to ~12ms
on tables with 1M+ rows.
```

### test - Tests

**When:** Adding new tests or fixing existing ones without changing production code.
**Semver:** none

```bash
test(auth): add tests for login flow
test(utils): cover formatDate edge cases
test(e2e): add end-to-end tests for checkout
test(fixtures): add factory for test data
test(auth): fix flaky timeout test
test: update snapshots after UI change
```

**Common scopes:** `unit`, `e2e`, `integration`, `fixtures`

### build - Build System

**When:** Changes to the build system, tooling, or external dependencies.
**Semver:** none (unless it affects compatibility)

```bash
build(deps): upgrade React from 17 to 18
build(deps): bump lodash from 4.17.20 to 4.17.21
build(vite): migrate from webpack to Vite
build(tsconfig): enable strict mode
build: migrate from npm to pnpm
build(docker): update base image to Node 20
```

**Common scopes:** `deps`, `webpack`, `vite`, `docker`, `babel`, `npm`

### ci - Continuous Integration

**When:** Changes to CI/CD configuration and automation scripts.
**Semver:** none

```bash
ci: add test workflow on pull requests
ci(actions): configure automatic deploy to staging
ci(gitlab): add security scanning stage
ci(vercel): configure environment variables
ci(dependabot): configure weekly updates
ci: add coverage comments on PRs
```

**Common scopes:** `actions`, `jenkins`, `gitlab`, `circleci`, `deploy`

### chore - Maintenance Tasks

**When:** Routine tasks that touch neither production code nor tests. Catch-all for changes that fit no other type.
**Semver:** none

```bash
chore: update .gitignore
chore(deps): update dev dependencies
chore(eslint): update linting rules
chore(husky): configure git hooks
chore: remove commented-out code
chore(logs): remove development console.logs
```

**Common scopes:** `deps`, `config`, `eslint`, `prettier`, `husky`

**Note:** `chore` is controversial — some teams prefer avoiding it in favor of more specific types.

### revert - Revert a Commit

**When:** Reverting a previous commit that caused problems.
**Semver:** depends on the reverted commit

```
revert: feat(auth): add OAuth

This reverts commit a1b2c3d4.

Conflicted with the existing auth system.
```

## Optional Extra Types

Some teams add types for their own needs:

```bash
security(auth): patch XSS vulnerability in inputs
hotfix(payment): fix critical failure in processing
wip(feature): partial multi-tenant implementation   # controversial — avoid pushing incomplete code
release: bump version to 2.0.0
```

## Breaking Changes

Not a type — a **modifier** that applies to any type:

```bash
# Syntax 1: ! after type/scope
feat(api)!: change response format

# Syntax 2: BREAKING CHANGE footer
feat(api): add endpoint versioning

BREAKING CHANGE: Endpoints now require /v2/ in the path.
```

**Semver:** MAJOR (X.0.0)

A change is breaking when it: changes the public API in a way that requires client updates, removes existing functionality, changes expected behavior, changes data formats (requests/responses), or adds new configuration requirements.

## Quick Reference Table

| Type       | Description                             | Semver            | Scope       |
| ---------- | --------------------------------------- | ----------------- | ----------- |
| `feat`     | New functionality                       | MINOR (0.X.0)     | Recommended |
| `fix`      | Bug fix                                 | PATCH (0.0.X)     | Recommended |
| `docs`     | Documentation only                      | -                 | Optional    |
| `style`    | Formatting (no logic change)            | -                 | Optional    |
| `refactor` | Code change (no feat, no fix)           | -                 | Recommended |
| `perf`     | Performance improvement                 | PATCH (0.0.X)     | Recommended |
| `test`     | Tests                                   | -                 | Optional    |
| `build`    | Build system, dependencies              | -                 | Optional    |
| `ci`       | CI/CD                                   | -                 | Optional    |
| `chore`    | Maintenance (no production code)        | -                 | Optional    |
| `revert`   | Revert previous commit                  | Varies            | No          |
| **!**      | Breaking change (any type + !)          | **MAJOR (X.0.0)** | -           |

## Scopes by Application Layer

- **Frontend:** `ui`, `components`, `pages`, `layout`, `theme`, `form`, `modal`, `table`, `navigation`, `hooks`, `context`, `state`, `store`
- **Backend:** `api`, `routes`, `controllers`, `middleware`, `service`, `repository`, `model`, `database`, `migrations`, `queries`
- **Auth:** `auth`, `login`, `register`, `jwt`, `oauth`, `permissions`
- **Infrastructure:** `docker`, `k8s`, `terraform`, `aws`, `cache`, `queue`, `worker`, `scheduler`, `logger`
- **Tooling:** `config`, `utils`, `helpers`, `validators`, `types`, `schemas`, `constants`
- **Business features:** `payments`, `billing`, `subscriptions`, `notifications`, `emails`, `search`, `export`, `i18n`

## Useful Git Commands

```bash
# Commits by type
git log --oneline --grep="^feat"
git log --oneline --grep="^fix"

# Breaking changes
git log --oneline --grep="BREAKING CHANGE"

# Filter by scope
git log --oneline --grep="^feat(api)"

# Commit type statistics
git log --oneline | grep -oE "^[a-z]+(\(.*\))?" | sort | uniq -c | sort -rn

# Commits since last release / manual changelog
git log v1.0.0..HEAD --oneline --no-merges
git log --oneline --no-merges --format="- %s" v1.0.0..HEAD
```

## Validation Tooling

### Commitlint Configuration

```javascript
// commitlint.config.js
module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"],
		],
		"scope-case": [2, "always", "lower-case"],
		"subject-case": [2, "always", "lower-case"],
		"subject-full-stop": [2, "never", "."],
		"header-max-length": [2, "always", 72],
	},
};
```

### Commitizen Config

```json
{
	"config": {
		"commitizen": {
			"path": "cz-conventional-changelog"
		}
	}
}
```
