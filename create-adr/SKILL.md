---
name: create-adr
description: Record an Architecture Decision Record (ADR) at the moment a significant technical decision is made — context, options considered, decision, and consequences — in docs/decisions/NNNN-title.md with proper statuses and index. Use when choosing between technologies, patterns, or approaches with lasting impact. Trigger: "record this decision", "create an ADR", "architecture decision record", "why did we choose", "registrar esta decisión", "crear un ADR", "decisión de arquitectura", or when a conversation settles a hard-to-reverse technical choice.
license: MIT
metadata:
  author: jrodrigopuca
  version: "1.0"
---

# ADR Generator

Record architecture decisions **when they happen**, not months later from archaeology.

## Overview

An Architecture Decision Record captures one significant decision: the forces that shaped it, the options weighed, what was chosen, and what it costs. Six months later, "why is this a monolith?" has an answer with context — instead of a shrug and a rewrite that re-learns the original constraints the hard way.

The moment of maximum knowledge about a decision is **the moment it's made**. That's when this skill runs — typically right after a design conversation settles something.

## When a Decision Merits an ADR

✅ **Hard to reverse:** database choice, framework, auth model, API paradigm, multi-tenancy strategy
✅ **Cross-cutting:** error handling policy, monorepo layout, state management approach, event schema
✅ **Expensive either way:** build vs buy, sync vs async processing, consistency trade-offs
✅ **Repeatedly asked:** if the same "why do we…?" comes up twice, the answer belongs in an ADR

❌ Reversible in an afternoon (a util's name, a folder move)
❌ Enforced by a linter (that's config, not a decision)
❌ Personal working notes → `context-compactor` (`.context/decisions/` is the private draft space; ADRs are the team-facing record — a `.context` decision note can graduate into an ADR)

## Instructions

### 1. Locate or Create the Log

- Convention: `docs/decisions/` (also accept an existing `docs/adr/` — follow what's there)
- Numbering: `NNNN-kebab-title.md`, sequential (`0001-…`). Check the highest existing number first
- If this is the repo's first ADR, create `docs/decisions/README.md` (index) using [references/template.md](references/template.md)

### 2. Draft From the Actual Conversation

Fill the template with what was really discussed — including the losing options and the real trade-offs. An ADR that only praises the winner is marketing, not a record:

```markdown
# NNNN. {Decision title — a statement, not a question}

Date: {YYYY-MM-DD}
Status: accepted

## Context

{The forces: requirements, constraints, scale, team reality, deadlines.
What makes this decision necessary NOW. 1-3 paragraphs.}

## Options Considered

### Option A — {name}
{2-4 lines: what it is, its strongest pro, its worst con — honestly}

### Option B — {name}
{same}

## Decision

{What was chosen and the decisive reason(s). Present tense: "We use X."}

## Consequences

**Positive:** {what this buys}
**Negative:** {what this costs — every real decision costs something}
**Follow-ups:** {migrations, spikes, revisit triggers: "reevaluate if we exceed 10k req/s"}
```

Rules:

- **Consequences must include negatives.** No negatives = the options weren't seriously compared.
- **Evidence over vibes.** "Benchmarked at 3x our peak load" beats "very fast". Link the spike/benchmark if one exists.
- **Present tense, active voice.** "We use PostgreSQL", not "it was decided that…"

### 3. Set the Status

| Status       | Meaning                                        |
| ------------ | ---------------------------------------------- |
| `proposed`   | Under discussion; PR open for the ADR itself   |
| `accepted`   | In force                                       |
| `deprecated` | No longer applies (context disappeared)        |
| `superseded by [{NNNN}]({NNNN}-title.md)` | Replaced — link forward |

**Accepted ADRs are immutable** (like released changelog entries): to change course, write a new ADR that supersedes the old one and update the old status line. History is the point.

### 4. Update the Index

Add a row to `docs/decisions/README.md`: number, title, status, date. Keep it sorted by number.

### 5. Link It

- Reference the ADR from the code/PR it affects: `See docs/decisions/0007-….md`
- If `using-commit` is in play: `docs(adr): record decision on event bus (ADR-0007)`
- `create-software-docs`'s architecture doc should cite ADRs instead of re-explaining decisions

## Suite Integration

- **Upstream:** design conversations, `sdd`-style explorations, `.context/decisions/` drafts
- **Downstream:** `create-software-docs` (its `create-adrs` sub-skill reuses this format and backfills historical decisions from code evidence — this skill records them fresh, which is always better)
- **Trigger discipline:** when a chat with the user lands a significant choice, *offer* the ADR ("Want me to record this as ADR-0008?") — don't create files unasked

## Example

**Conversation outcome:** team chose server-side rendering with Next.js over the existing SPA for the storefront, driven by SEO and TTFB on mobile.

**Result:** `docs/decisions/0004-adopt-nextjs-ssr-for-storefront.md` — context cites the Core Web Vitals report and lost organic traffic; options: keep SPA + prerender service, Astro, Next.js SSR; consequences include the negative ("hosting cost rises, team must learn RSC; revisit if hosting exceeds $X/mo") — and the index gains one row.

## Resources

- [references/template.md](references/template.md) — full ADR + index templates, worked example
- [ADR GitHub organization](https://adr.github.io/) — formats ecosystem (MADR, Nygard)
- Michael Nygard's original: [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- Siblings: `context-compactor` (private drafts), `create-software-docs` (backfill + architecture docs)
