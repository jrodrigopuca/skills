# Conventional Commits Best Practices

Detailed good/bad examples, common mistakes, and how to avoid them.

## 1. The Vague Commit Problem

```bash
# ❌ BAD — impossible to understand without the diff, unsearchable, useless changelog
git commit -m "fix"
git commit -m "update code"
git commit -m "changes"
git commit -m "WIP"

# ✅ GOOD — specific, typed, scoped, searchable with git log --grep="auth"
git commit -m "fix(auth): prevent redirect loop after logout"
git commit -m "feat(api): add GET /users/:id/orders endpoint"
git commit -m "perf(database): add composite index on (user_id, created_at)"
```

## 2. Verb Mood: Imperative, Not Past Tense

```bash
# ❌ BAD — past tense or gerund
git commit -m "feat: added Google login"
git commit -m "refactor: refactoring the payments module"

# ✅ GOOD — imperative, like giving an order
git commit -m "feat: add Google login"
git commit -m "refactor: simplify payments module"
```

**Trick:** the message must complete the sentence "If applied, this commit will **\_\_**".

## 3. Lowercase After the Colon

```bash
# ❌ BAD
git commit -m "feat: Add notification system"

# ✅ GOOD
git commit -m "feat: add notification system"

# Exception: proper nouns and acronyms
git commit -m "feat: integrate Google Analytics"
git commit -m "fix: correct JSON parsing"
```

## 4. Don't Mix Change Types

```bash
# ❌ BAD — one commit doing everything: hard to revert, impossible to cherry-pick,
# unclear semver impact (MINOR for the feat? PATCH for the fix?)
git commit -m "feat: add dark mode, fix login bug, update README, refactor utils"

# ✅ GOOD — atomic commits, each independently revertible
git commit -m "feat(ui): add dark mode with persistent toggle"
git commit -m "fix(auth): prevent redirect loop on login page"
git commit -m "docs(readme): update configuration examples"
git commit -m "refactor(utils): extract date formatting function"
```

## 5. Description Length

```bash
# ❌ BAD — too long (truncated in git log --oneline) or too short (no context)
git commit -m "feat(api): implement complete JWT authentication system including refresh tokens and token revocation for improved security"
git commit -m "fix: error"

# ✅ GOOD — concise subject (~50 chars, max 72), details in the body
git commit -m "feat(api): add JWT auth with refresh tokens

Implements:
- Access token (15min) and refresh token (7 days)
- POST /auth/refresh endpoint
- Token revocation on logout, blacklist in Redis

Closes #234
"
```

## 6. Breaking Changes: Be Explicit

```bash
# ❌ BAD — API change with no warning: clients break silently,
# no MAJOR bump, not highlighted in the changelog
git commit -m "feat(api): improve response structure"

# ✅ GOOD — marked with ! and footer, with migration instructions
git commit -m "feat(api)!: change response fields to camelCase

BREAKING CHANGE: API fields now use camelCase.
- user_id → userId
- created_at → createdAt

Update client code. Migration guide: docs/api-v2-migration.md
"
```

## 7. Scope Consistency

```bash
# ❌ BAD — inconsistent or too generic; can't filter, disorganized changelog
git commit -m "feat(Auth): add login"            # capitalized
git commit -m "feat(authentication): add logout" # different name
git commit -m "fix(code): fix bug"               # meaningless scope

# ✅ GOOD — one canonical scope per module, defined up front
git commit -m "feat(auth): add OAuth login"
git commit -m "fix(auth): correct token expiration"
git commit -m "test(auth): add integration tests"
```

Document your scopes in CONTRIBUTING.md:

```markdown
## Project scopes

- `auth`: authentication and authorization
- `api`: REST endpoints
- `database`: models, migrations, queries
- `ui`: interface components
- `payments`: Stripe integration
```

## 8. When to Use the Body

Use a body when: the description doesn't fit in 72 chars, you need to explain the **why**, there are breaking changes, or you reference issues/PRs. Skip it for obvious changes (`docs: fix typo in README`).

```bash
# ✅ GOOD — concise subject, context and results in the body
git commit -m "fix(cache): prevent race condition on concurrent writes

Add optimistic locking via a version field so multiple workers
cannot write the same record simultaneously.

Before: the slowest worker overwrote the fastest one's work.
After: the second write detects the conflict and retries.

Reduces inconsistent-data errors from ~50/day to 0.

Fixes #456
Related: #234
"
```

## 9. Footers: References and Metadata

Footers have a specific format at the end of the message — tools parse them to close issues automatically:

```
Closes #123               # closes an issue
Fixes #123                # fixes an issue
Resolves #123             # resolves an issue
Refs: #123                # related reference
BREAKING CHANGE: ...      # incompatible change
Reviewed-by: @user        # reviewer
Co-authored-by: Name <email>  # human co-author
Signed-off-by: Name <email>   # sign-off
```

Don't bury references in free-form prose ("this also closes #123 and #456") — tools can't parse them.

## 10. Atomic Commits per Feature

A large feature should be a sequence of self-contained commits, not one giant commit touching 20+ files:

```bash
git commit -m "build(deps): add Stripe SDK"
git commit -m "feat(database): add payments table migration"
git commit -m "feat(payments): implement Stripe checkout flow"
git commit -m "feat(payments): add Stripe webhook handler"
git commit -m "test(payments): add integration tests"
git commit -m "docs(payments): document payments API"
```

Each step is reviewable, revertible, and `git bisect` works.

## 11. Common Type Mistakes

```bash
# ❌ Feature disguised as a fix
git commit -m "fix: add strong password validation"
# → feat(auth): add strong password requirements

# ❌ Refactor that actually fixes a bug
git commit -m "refactor: improve calculation logic"
# → if it corrects wrong behavior: fix

# ❌ Chore for a significant change
git commit -m "chore: change database structure"
# → refactor(database)! (breaking change)

# ❌ Style with functional impact
git commit -m "style: rename calculateSum function"
# → if the rename has implications: refactor
```

**Decision guide:**

```
Adds new functionality?                       → feat
Fixes a bug / incorrect behavior?             → fix
Improves performance?                         → perf
Changes structure without changing behavior?  → refactor
Otherwise                                     → style / docs / chore / test / build / ci
```

## 12. When NOT to Follow the Rules Strictly

- **Merge commits** — Git generates them (`Merge pull request #123 ...`); no conventional format needed.
- **Revert commits** — `git revert` generates a standard format already.
- **Local development commits** — informal checkpoints (`wip: ...`) are fine locally, but squash/rebase into well-formed commits before pushing.

## 13. Pre-Commit Checklist

```
✅ Correct type (feat/fix/docs/...)?
✅ Specific, consistent scope?
✅ Imperative mood, lowercase after ": ", <72 chars, no trailing period?
✅ Atomic (one logical change)?
✅ Tests pass, code compiles?
✅ BREAKING CHANGE included if the API changes?
✅ Body present when context is needed?
✅ Footers reference issues correctly?
✅ No unrelated files in the commit?
```

## 14. Common Anti-Patterns

```bash
# The "misc changes" commit
❌ git commit -m "chore: misc changes from today"        → separate commits by topic

# The "fix typo in previous commit" commit
❌ git commit -m "fix: typo in previous commit"          → git commit --amend (before push)

# The "final version" saga
❌ "feat: final version" / "final 2" / "final for real"  → clear, specific descriptions

# Debugging commits
❌ git commit -m "debug: add console.logs"               → don't commit debug code; use git stash

# The Friday mega-commit
❌ git commit -m "feat: everything I did this week"      → incremental commits during development
```

## 15. JIRA Ticket References

### Formats

```bash
# Format 1: footer (RECOMMENDED — clean subject, easy to parse)
git commit -m "feat(dashboard): add sales widget

JIRA: PROJ-1234"

# Format 2: subject prefix (visible in git log --oneline; use if team policy requires)
git commit -m "[PROJ-1234] feat(dashboard): add sales widget"

# Format 3: generic Refs footer (works for multiple systems)
git commit -m "fix(login): prevent redirect loop

Refs: PROJ-456"

# Combined with GitHub issues
git commit -m "feat(export): add Excel export

Closes #234
JIRA: PROJ-567"
```

### One Ticket vs Multiple

```bash
# ❌ BAD — many unrelated tickets = non-atomic commit
git commit -m "fix: several fixes from this week

JIRA: PROJ-100, PROJ-101, PROJ-102, PROJ-103"

# ✅ GOOD — one primary ticket per atomic commit
git commit -m "fix(auth): prevent redirect loop after logout

JIRA: PROJ-100"

# ✅ ACCEPTABLE — related tickets with one root cause and one solution
git commit -m "fix(validation): resolve inconsistent validation

Unifies duplicated validation logic across login,
registration, and profile forms.

JIRA: PROJ-456 (principal)
Also fixes: PROJ-123, PROJ-234"
```

### Searching by Ticket

```bash
git log --all --grep="PROJ-1234" --oneline --decorate
git log --all --grep="PROJ-" --oneline                      # all tickets of a project
git log --all --grep="PROJ-456" --since="2026-01-01"        # date range
git log --all --grep="PROJ-789" --name-only                 # files touched
```

### When NOT to Include a Ticket

Routine maintenance, typo fixes, automatic formatting, merge and revert commits. If your team requires a ticket for everything, use generic tickets (`MAINT-001`, `DOCS-001`, `TECH-001`).

### JIRA Validation Hook

```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

commit_msg=$(cat "$1")

if ! echo "$commit_msg" | grep -qE '(JIRA: [A-Z]+-[0-9]+|\[[A-Z]+-[0-9]+\])'; then
  echo "❌ Error: commit must include a JIRA reference"
  echo "Valid formats:"
  echo "  - [PROJ-123] feat: description"
  echo "  - JIRA: PROJ-123 (footer)"
  exit 1
fi
```

## 16. Automated Validation Setup

### Husky + Commitlint

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional husky
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

Invalid commits are now rejected:

```
$ git commit -m "added a feature"
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

### Commitizen (Interactive Commits)

```bash
npm install --save-dev commitizen cz-conventional-changelog
npx commitizen init cz-conventional-changelog --save-dev --save-exact
npx cz   # guided, interactive commit prompt
```

## Quick Reference Table

| Situation              | ❌ BAD                       | ✅ GOOD                              |
| ---------------------- | ---------------------------- | ------------------------------------ |
| **Verb mood**          | "added login"                | "add login"                          |
| **Capitalization**     | "feat: Add..."               | "feat: add..."                       |
| **Length**             | >72 chars in subject         | <72 chars, details in body           |
| **Vagueness**          | "fix bug"                    | "fix(auth): prevent redirect loop"   |
| **Mixed changes**      | feat + fix + docs in one     | separate commits                     |
| **Breaking change**    | unmarked                     | use ! or BREAKING CHANGE             |
| **Scope consistency**  | Auth, authentication, AUTH   | auth (always)                        |
| **No context**         | "update"                     | type + scope + clear description     |
