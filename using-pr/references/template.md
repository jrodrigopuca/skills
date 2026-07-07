# PR Template, Commands, and Checklist

## Full PR Description Template

```markdown
## Summary

{Why this change exists: the problem or requirement, 2-4 lines.
Link the issue/ticket for the deep background instead of retelling it.}

## Changes

- {Logical change 1 — grouped from commits, user of the codebase perspective}
- {Logical change 2}
- {Refactors/moves called out separately so reviewers can skim them}

## Review guide

{Optional but gold: where to start, what's mechanical, what deserves
attention. "Start with RefundService.process(); routes and DTOs are
plumbing. The tricky part is the idempotency check (refunds.ts:40)."}

## Test plan

- [ ] {Unit: `pnpm vitest run src/payments` — covers happy path + provider timeout}
- [ ] {Manual: refund a test charge in staging, verify webhook}
- [ ] {Edge: partial refund > remaining balance rejected}

## Breaking changes / migrations

{Only when real. What breaks, who's affected, migration steps, rollback.
Delete the section otherwise — an empty "N/A" section is noise.}

## Screenshots

{Before/after for anything visual. Delete if not applicable.}

---
Closes #{issue}
JIRA: {PROJ-123}
```

## Repo-Level Template

Commit a trimmed version as `.github/PULL_REQUEST_TEMPLATE.md` so every PR starts from the skeleton. Keep the repo template minimal (Summary / Changes / Test plan) — templates with 12 sections get deleted wholesale.

## gh CLI Reference

```bash
# Create
gh pr create --title "feat(scope): subject" --body-file body.md --base main
gh pr create --draft ...                     # direction feedback, not review
gh pr create --fill                          # title/body from commits (then EDIT it)

# Manage
gh pr view [--web]                           # check rendering
gh pr edit --add-reviewer alice,bob --add-label payments
gh pr ready                                  # draft → ready
gh pr checks --watch                         # CI status live
gh pr diff                                   # review your own diff in terminal

# Review flow (reviewer side)
gh pr review --comment --body "..."          # conventional comments!
gh pr review --approve / --request-changes

# Merge
gh pr merge --squash [--delete-branch]       # title becomes main's commit
gh pr merge --auto --squash                  # merge when checks pass
```

## Stacked PRs (splitting big work)

```bash
# Branch B builds on branch A's PR:
git checkout -b feature-b feature-a
gh pr create --base feature-a --title "feat(x): part 2"
# After A merges: gh will retarget, or:
gh pr edit --base main
```

Order the stack in each description: "Part 2 of 3 — depends on #101, followed by #103."

## Review-Readiness Checklist

```
✅ Title is a valid conventional commit subject (it WILL land in history)
✅ Summary says why; review guide says where to look
✅ Self-reviewed the diff in the PR UI (not the editor)
✅ No accidental files, debug leftovers, or unrelated formatting
✅ Tests cover the failure paths, not just the happy one
✅ Test plan has runnable commands
✅ < ~400 reviewable lines, or split/reading-order provided
✅ Breaking changes flagged (title `!` + section) if any
✅ CI green BEFORE requesting review
✅ Issue/ticket linked (Closes #N / JIRA: PROJ-N)
```

## Responding to Review (author side)

Follows `using-review-comments` author rules:

- Every `issue`/`todo` gets a fix commit referenced in the thread, or a reasoned pushback — never a silent "done" without the commit
- Batch responses: push once, respond to all threads, re-request review once — not comment-by-comment pings
- If a comment reveals a misunderstanding the code caused, the fix is usually **in the code** (rename, comment, restructure), not just in the reply
