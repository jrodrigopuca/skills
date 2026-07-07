# ADR Templates

## Decision Record (`docs/decisions/NNNN-kebab-title.md`)

```markdown
# NNNN. {Decision title as a statement}

Date: {YYYY-MM-DD}
Status: {proposed | accepted | deprecated | superseded by [NNNN](NNNN-title.md)}

## Context

{The forces that make this decision necessary: functional requirements,
constraints (budget, team skills, deadlines, compliance), current pain,
scale expectations. Write it so a newcomer in 2 years understands the
situation without asking anyone.}

## Options Considered

### Option A — {name}

{What it is. Strongest argument for. Worst argument against — stated
honestly, especially for the option that won.}

### Option B — {name}

{same treatment}

### Option C — do nothing / status quo

{Almost always worth listing: what happens if we don't decide.}

## Decision

{We use / we adopt / we split… — present tense, active voice.
The one or two DECISIVE reasons, not every reason.}

## Consequences

**Positive:**
- {what this buys us}

**Negative:**
- {what this costs — complexity, lock-in, learning curve, money}

**Follow-ups:**
- [ ] {migration, spike, doc to update}
- {Revisit trigger: "reevaluate if X exceeds Y" / "when Z ships"}
```

## Index (`docs/decisions/README.md`)

```markdown
# Architecture Decision Records

Significant technical decisions for this project, with their context and
consequences. Accepted ADRs are immutable — course changes are recorded
as new ADRs that supersede old ones.

| #    | Decision                                   | Status   | Date       |
| ---- | ------------------------------------------ | -------- | ---------- |
| 0001 | [Record decisions as ADRs](0001-record-decisions-as-adrs.md) | accepted | 2026-07-07 |
| 0002 | [{title}]({file})                          | accepted | {date}     |
```

Tip: make ADR-0001 the decision to keep ADRs — it's the natural first record and documents the convention itself.

## Worked Example

```markdown
# 0004. Adopt Next.js SSR for the storefront

Date: 2026-07-07
Status: accepted

## Context

Organic search traffic dropped 18% over two quarters; Search Console
attributes it to poor mobile Core Web Vitals (TTFB p75 = 2.9s). The
storefront is a React SPA served from a static bucket; all rendering
happens client-side on low-end mobile devices, which dominate our
traffic (64%). SEO is the primary acquisition channel and the Q3 OKR
targets recovering it. The team is strong in React, has no Vue/Svelte
experience, and the checkout (separate app) is out of scope.

## Options Considered

### Option A — Keep the SPA, add a prerender service

Lowest effort. But prerender caches go stale against our hourly price
updates, and it does nothing for real-user TTFB — it fixes the crawler,
not the customer.

### Option B — Astro with islands

Best raw performance for content pages. But the product grid is deeply
interactive, the team would split across two frameworks, and our
component library is React-only.

### Option C — Next.js App Router with SSR/ISR

Keeps the React skill set and component library. ISR fits hourly price
updates. Costs: server hosting (the bucket was ~free), and RSC is a
real learning curve the team hasn't climbed yet.

## Decision

We adopt Next.js (App Router) for the storefront, with ISR (1h
revalidation) for product pages and SSR for search. Decisive factors:
team skill reuse and ISR matching our data update cadence.

## Consequences

**Positive:**
- TTFB p75 projected < 800ms (spike measured 620ms on staging)
- Product pages indexable without a prerender middleman
- Component library and team skills carry over

**Negative:**
- Hosting moves from ~$0 (bucket) to estimated $180/mo
- RSC mental model: expect 1-2 sprints of reduced velocity
- Vendor gravity toward Vercel patterns — mitigated by standalone output

**Follow-ups:**
- [ ] Migration spike for the search page (owns the hairiest state)
- [ ] Update docs/architecture.md rendering section
- Revisit trigger: hosting > $500/mo or RSC blocks a roadmap feature
```

Notice what makes it useful: numbers in the context, a real worst-case stated for the winner, costs with amounts, and a revisit trigger that makes "we'll see" concrete.
