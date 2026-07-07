---
name: using-review-comments
description: Guide for writing code review feedback using the Conventional Comments standard (label + decorations + subject + discussion). Makes review comments actionable, kind, and machine-parseable, and separates blocking from non-blocking feedback. Use when reviewing pull requests, writing or responding to review comments, or standardizing team review culture. Trigger: "review this PR", "write review comments", "code review feedback", "conventional comments", "comentarios de review", "revisar el PR", "dejar comentarios de código".
license: MIT
metadata:
  author: jrodrigopuca
  version: "1.0"
---

# Conventional Comments Guide

Write review feedback following [Conventional Comments](https://conventionalcomments.org/) — the review-side mirror of Conventional Commits.

## Format

```
<label> [decorations]: <subject>

[discussion]
```

```
suggestion (non-blocking): extract this validation into a helper

It's repeated in `createUser` and `updateUser`; a shared
`validateEmail()` keeps the two in sync when rules change.
```

The **label** states intent, **decorations** state severity, the **subject** states the point in one line, and the **discussion** carries reasoning, context, and (ideally) a concrete way forward.

## Labels

| Label        | Intent                                            | Blocking by default? |
| ------------ | ------------------------------------------------- | -------------------- |
| `praise`     | Highlight something genuinely well done           | —                    |
| `nitpick`    | Trivial, preference-based                         | Never (always non-blocking) |
| `suggestion` | Propose a concrete improvement                    | Depends — decorate it |
| `issue`      | A real problem with the code (bug, security, spec) | Usually blocking     |
| `question`   | You need understanding before judging             | Blocks your approval, not their code |
| `todo`       | Small, necessary change (rename, missing test)    | Usually blocking, small |
| `thought`    | Non-actionable idea sparked by the code           | Never                |
| `chore`      | Process step required before merge (changelog, migration) | Blocking by checklist |
| `note`       | Non-blocking context the author should see        | Never                |

## Decorations

| Decoration       | Meaning                                              |
| ---------------- | ---------------------------------------------------- |
| `(blocking)`     | Must be resolved before approval                     |
| `(non-blocking)` | Should not block acceptance — author's call          |
| `(if-minor)`     | Resolve only if the change turns out to be small     |
| `(security)`, `(test)` | Optional topical tags teams may add            |

**The blocking distinction is the whole game.** An unlabeled wall of 15 comments reads as 15 demands; `2 issues (blocking) + 13 non-blocking` reads as an afternoon of work. Say which is which — explicitly, every time.

## Rules for Writing Feedback

1. **Label every comment deliberately.** Choosing the label forces you to decide what you're actually saying — half-formed objections die at this step.
2. **Issues come with a reason; suggestions come with a path.** "This is wrong" is not a review comment. State *why* it's a problem and *what* better looks like.
3. **Critique the code, not the author.** "This function re-reads the file on every call" — not "you're re-reading the file".
4. **Questions are honest questions.** If you already know the answer and disagree, that's an `issue` or `suggestion` — disguising verdicts as questions erodes trust.
5. **Praise is specific or it's noise.** `praise: the fixture redesign removed all the test interdependence` teaches; "LGTM nice work 👍" doesn't.
6. **Nitpicks are always non-blocking.** If you'd block a merge on it, it's not a nitpick — relabel honestly.
7. **One comment, one point.** Two problems on the same line = two comments, each resolvable independently.

## Examples

```
# ❌ Unlabeled verdict, no reason, no path
This won't scale.

# ✅
issue (blocking): this loads the entire table into memory

`findAll()` on `events` will OOM in production (the table is ~40M rows).
Paginate with a cursor or stream the rows — `processEventsBatch()` in
`jobs/cleanup.ts` already implements the pattern.
```

```
# ❌ Verdict disguised as a question
Why didn't you just use a transaction here?

# ✅
issue (blocking): the two writes can partially fail

If the second `update` throws, the account is debited without the order
being created. Wrap both in a transaction so they commit atomically.
```

```
# ❌ Nitpick presented as a demand
Rename this.

# ✅
nitpick (non-blocking): `data2` hides what this actually holds

Something like `retriedPayments` would make the filter below self-evident.
```

More rewrites, a full-PR worked example, and responder etiquette: [references/examples.md](references/examples.md).

## Reviewing as an Agent

When this skill drives an AI review:

- Output findings **as conventional comments**, most severe first
- Default mapping: correctness/security defects → `issue (blocking)`; improvements → `suggestion (non-blocking)`; style covered by a linter → **don't comment**, the linter owns it
- Include `file:line` in the subject or metadata so comments land on the diff
- Cap nitpicks (3-5 max) — a review drowning in nitpicks buries its one real issue
- End with a verdict summary: "{N} blocking, {M} non-blocking; approve after the blocking two."

## Responding to Feedback (author side)

- Resolve `issue`/`todo` with the fix commit referenced; don't just reply "done"
- Disagree with evidence, in the thread — an unresolved silent disagreement re-appears in the next PR
- `thought`/`note`/`praise` need no action; a reaction is enough

## Resources

- [Conventional Comments](https://conventionalcomments.org/) — the standard
- [references/examples.md](references/examples.md) — good/bad rewrites and a full worked review
- Sibling: `using-commit` — the same convention philosophy, commit side
