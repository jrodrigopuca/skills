---
name: using-pr
description: Guide for creating pull requests that get reviewed fast — conventional titles, descriptions generated from branch commits, size discipline, test plans, and gh CLI workflow. Bridges using-commit (input) and using-review-comments (output). Trigger: "create a PR", "open a pull request", "write the PR description", "prepare this branch for review", "crear un PR", "abrir pull request", "descripción del PR".
license: MIT
metadata:
  author: jrodrigopuca
  version: "1.0"
---

# Pull Request Guide

Write PRs that respect the reviewer's time — because review latency, not code speed, is what usually gates delivery.

## Overview

A PR is an argument addressed to a reviewer: *this change is correct, here's how to verify it, and here's what to look at first.* If the branch has good conventional commits (`using-commit`), most of the description already exists — this skill assembles and edits it.

## Instructions

### 1. Title — Conventional, Because It Becomes History

With squash-merge (the common case), **the PR title becomes the commit subject on main** — so it follows the exact `using-commit` rules:

```
feat(payments): add refund endpoint          ✅
fix(auth)!: migrate sessions to JWT          ✅ (breaking marked)
Final changes + review fixes                  ❌ (this lands in main's history!)
```

### 2. Description — Generated From the Branch, Then Edited

Extract the raw material:

```bash
git log main..HEAD --oneline --no-merges     # the story so far
git diff main...HEAD --stat                  # blast radius
```

Assemble into the template (full version in [references/template.md](references/template.md)):

```markdown
## Summary
{2-4 lines: WHY this change exists — the problem, not the diff.}

## Changes
{Grouped from the commits — not one bullet per commit, one per logical change.}

## Test plan
{How this was verified: commands run, cases covered, what reviewers
can run themselves. "CI passes" alone is not a test plan.}

## Breaking changes / migrations
{Only if real: what breaks, migration steps. Omit the section otherwise.}

Closes #123
JIRA: PROJ-456
```

Editing rules (same discipline as `create-changelog`):

- **Summary answers "why"** — the diff already shows the what
- Merge fixup noise: 12 commits ≠ 12 bullets
- **Guide the review:** "start with `RefundService`; the rest is plumbing" is the single highest-value sentence you can write
- Screenshots/recordings for anything visual — before/after

### 3. Size Discipline

Review quality collapses with size: a 2,000-line PR gets a rubber stamp ("LGTM"), not a review.

- **Target < ~400 changed lines** of reviewable code (generated files, lockfiles, and snapshots don't count — say so in the description)
- Bigger than that? **Split it**: by commit sequence (the `using-commit` atomic series maps 1:1 to stacked PRs), refactor-first-then-feature, or feature-flag the increments
- If it genuinely can't be split (a migration touching everything), warn the reviewer and provide a **reading order**

### 4. Self-Review First

Before requesting review, read your own diff in the PR UI — different context reveals what the editor hid:

- Leftover debug code, commented blocks, accidental file changes
- Missing tests for the failure paths
- The place where YOU hesitate is where the reviewer will too — annotate it preemptively with a comment (`note:` … per `using-review-comments`)

### 5. Draft vs Ready

- **Draft** = CI can run, feedback on direction welcome, not review-ready
- **Ready** = you'd merge it as-is; every reviewer minute now costs someone's focus
- Don't mark ready to "get in the queue" — that trains reviewers to ignore the queue

### 6. gh CLI Workflow

```bash
gh pr create --title "feat(payments): add refund endpoint" \
             --body-file pr-body.md --base main [--draft]
gh pr view --web                     # verify rendering
gh pr ready                          # draft → ready
gh pr merge --squash                 # title becomes the commit
```

More commands (reviewers, labels, checks, stacked PRs): [references/template.md](references/template.md).

## Suite Handoffs

- **Upstream `using-commit`:** atomic conventional commits make the description assemble itself — garbage commits in, garbage description out
- **Downstream `using-review-comments`:** the review this PR receives should use conventional comments; respond per its author-side rules
- **`create-changelog`:** the squashed title is exactly what the changelog generator will consume — one more reason it must be conventional

## Anti-Patterns

- ❌ **The mystery PR** — no description, "see commits". The reviewer reconstructs your reasoning at 10x the cost you saved
- ❌ **The kitchen sink** — feature + drive-by refactors + dep bumps in one PR; each dilutes review of the others
- ❌ **"Fixed review comments"** as a commit that will be squashed anyway — fine locally, but never as the PR title
- ❌ **Re-requesting review without answering the comments** — resolve or respond first (`using-review-comments`, author side)

## Resources

- [references/template.md](references/template.md) — full PR template, gh commands, review-readiness checklist
- [gh pr docs](https://cli.github.com/manual/gh_pr) · [Google's small CLs guidance](https://google.github.io/eng-practices/review/developer/small-cls.html)
- Siblings: `using-commit` · `using-review-comments` · `create-changelog`
