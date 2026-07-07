---
name: til
description: >
  Personal "Today I Learned" knowledge base — capture concepts, gotchas, and
  insights at the moment of learning into a global ~/.til/ log (per person,
  across all projects), with commands to save, list, search, and review.
  Complements context-compactor, which stores per-project state. Trigger:
  "TIL", "today I learned", "save this concept", "remember this for later",
  "aprendí que", "guardar este concepto", "anotá esto", or when the user
  expresses surprise at learning something new mid-task.
license: MIT
metadata:
  author: jrodrigopuca
  version: "1.0"
---

# TIL — Personal Learning Log

Capture what you learn **when you learn it**, in a knowledge base that follows you across projects.

## Overview

**Scope is what separates this from `context-compactor`:** `.context/` belongs to a *project* (decisions, state, steps — committed with the repo). `~/.til/` belongs to a *person* — "covering indexes skip the heap" is true in every repo you'll ever touch, so it doesn't belong in any one of them.

The moment of maximum retention is the moment of surprise. When something makes you (or the user) say *"ah, I didn't know that"* mid-task — that's the trigger.

## When to Use

- The user learns something non-obvious while debugging or reviewing
- A concept clicked after an explanation ("so THAT's why…")
- A gotcha cost real time and shouldn't cost it twice
- The user says "TIL", "anotá esto", "remember this for later"
- Periodically: resurface old notes with `tilreview`

**Not for:** project decisions (→ `create-adr` or `context-compactor`), task state (→ `context-compactor`), things trivially findable in docs (a TIL earns its place by being surprising or hard-won).

## Installation (once)

```bash
# {SKILL_DIR} = where this skill is installed, e.g.:
#   Claude Code: ~/.claude/skills/til
mkdir -p ~/.local/bin
cp {SKILL_DIR}/assets/scripts/til* ~/.local/bin/
chmod +x ~/.local/bin/til*
# ~/.local/bin must be on PATH; base dir override: export TIL_DIR=...
```

**Fallback without scripts:** don't block the user — write the note directly to `~/.til/{topic}/YYYY-MM-DD-kebab-title.md` using the format below.

## Commands

| Command     | Does                                        | Example                                      |
| ----------- | ------------------------------------------- | -------------------------------------------- |
| `til`       | Save a note                                 | `til "title" "what you learned" databases`   |
| `tillist`   | List notes, grouped by topic                | `tillist` · `tillist testing`                |
| `tilgrep`   | Search all notes                            | `tilgrep "index"`                            |
| `tilreview` | Resurface N random notes (spaced-rep lite)  | `tilreview 5`                                |

Notes land in `~/.til/{topic}/YYYY-MM-DD-slug.md` (`$TIL_DIR` overrides the base):

```markdown
# {Title — the insight as a statement}

> Learned: {timestamp}
> Topic: {topic}

{The explanation — WITH the why and, when possible, the evidence:
"saw it drop a query from 400ms to 8ms" beats "it's faster".}

## Tags

#til #{topic}
```

## Golden Rules

1. **Capture at the moment, not at day's end.** Deferred TILs don't happen.
2. **One concept per note.** Two insights = two notes; grep finds atoms, not essays.
3. **Title is the insight**, stated as a fact: "Covering indexes avoid table lookups", not "notes about indexes".
4. **Include the evidence.** Numbers, the error message, the before/after — that's what makes it trustworthy in six months.
5. **Ask before saving.** It's the user's knowledge base; offer ("Want me to TIL this?"), don't dump.
6. **Topics are cheap** — kebab-case, created on demand (`databases`, `git`, `testing`, `css`). Don't over-taxonomize.

## Agent Workflow

```
1. Detect the learning moment (surprise, gotcha resolved, concept clicked)
2. Offer: "Want me to save this as a TIL? (topic: {suggestion})"
3. Distill: title = the insight; body = why + evidence, 2-6 lines
4. Save (til command, or direct write as fallback)
5. Confirm with the path — the user owns the file
```

Periodic bonus: if the user seems idle-curious, `tilreview 3` resurfaces old notes — knowledge that never resurfaces is knowledge lost.

## Example

**Mid-debugging:** the user discovers their flaky test was order-dependent because of a module-level singleton.

**You:** "That's a solid gotcha — want me to TIL it? (topic: testing)"

**User:** "Dale"

```bash
til "Module-level singletons make tests order-dependent" \
  "The queue singleton kept state across tests: passing alone, failing in the suite. Fix: reset in beforeEach or inject the instance. Found via vitest -p randomly." \
  testing
```

→ `✓ Saved: ~/.til/testing/2026-07-07-module-level-singletons-make-tests-order-dependent.md`

## Resources

- **Scripts:** [assets/scripts/](assets/scripts/) — `til`, `tillist`, `tilgrep`, `tilreview`
- Siblings: `context-compactor` (project memory) · `create-adr` (team decisions)
