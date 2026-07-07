# Conventional Comments — Worked Examples

## Rewrites by Label

### issue

```
# ❌ Vague alarm
There's a bug here.

# ✅ Symptom + cause + path
issue (blocking): duplicate webhooks create duplicate orders

`handleWebhook` has no idempotency check — Stripe retries deliveries,
so a slow response creates the order twice. Store the event id and
skip already-processed ids (there's a unique index ready on
`webhook_events.event_id`).
```

### suggestion

```
# ❌ Preference stated as fact
This should use a Map.

# ✅ Improvement + measurable why
suggestion (non-blocking): a Map would make lookups O(1)

`users.find()` inside the loop makes this O(n·m) — noticeable at
import sizes (~10k rows). Building `new Map(users.map(u => [u.id, u]))`
once outside the loop drops the import from ~4s to ~0.2s.
```

### question

```
# ❌ Interrogation
Did you even test this with empty arrays?

# ✅ Honest gap in understanding
question: can `items` be empty at this point?

If yes, `items[0].currency` throws. I couldn't tell from the callers
whether the schema guarantees at least one item.
```

### todo

```
todo (blocking): add the failure-path test

`refundPayment` gained a new error branch (provider timeout) but the
test file only covers success. One test hitting the timeout path is
enough for this PR.
```

### praise / thought / note / chore

```
praise: the retry queue redesign removed all the sleep() calls in tests

Deterministic clock injection instead of real waits — the suite went
from 90s to 12s. This is the pattern the rest of the jobs should follow.

thought: this validation layer is close to being schema-driven

Not for this PR — but if we ever generate these validators from the
OpenAPI spec, this file is the only place that would need to change.

note (non-blocking): this endpoint is also called by the mobile app

Nothing to change — just flagging that the response shape is consumed
by mobile 2.x, so future field removals need their deprecation cycle.

chore (blocking): add the migration to the release checklist

The new column needs `db:migrate` on deploy — add it to
`docs/runbooks/release.md` so ops doesn't get surprised.
```

## A Full Worked Review

PR: "feat(payments): add refund endpoint" — 14 files.

```
issue (blocking): refund amount isn't validated against the charge
  src/routes/refunds.ts:34 — a refund larger than the original charge
  passes straight to the provider. Clamp to `charge.amount - refunded`.

issue (blocking): provider errors return 500 with the raw message
  src/routes/refunds.ts:52 — provider messages can contain account
  details. Map to typed errors like the checkout route does.

todo (blocking): missing test for the partial-refund path
  tests only cover full refunds; partial is the common case.

suggestion (non-blocking): extract `toMinorUnits()` — third copy
  src/routes/refunds.ts:18 duplicates checkout.ts and invoices.ts.

nitpick (non-blocking): `doRefund` → `executeRefund` for consistency
  with `executeCharge` / `executePayout` in the same module.

praise: the idempotency-key handling is exactly right
  same key + same payload → same response, replay-safe.

Verdict: 3 blocking (2 issues + 1 todo), 2 non-blocking.
Approve once the blocking three are addressed.
```

Why this works: severity is explicit, every blocking item has a path, the praise is information, and the author knows exactly what stands between them and merge.

## Anti-Patterns

| Anti-pattern            | What it looks like                          | Fix |
| ----------------------- | ------------------------------------------- | --- |
| The unlabeled wall      | 20 comments, no labels, no severity         | Label + decorate; lead with blocking |
| The disguised verdict   | "Why didn't you use X?"                     | If you have a position, make it an `issue`/`suggestion` |
| The linter cosplay      | Human comments about semicolons and imports | Automate it; humans review what machines can't |
| The drive-by            | "this is not how I'd do it" + no path       | No path, no comment — or downgrade to `thought` |
| Nitpick flooding        | 14 nitpicks burying 1 real issue            | Cap nitpicks; the issue leads |
| The rubber stamp        | "LGTM" on a 800-line diff in 3 minutes      | Scope the review honestly: say what you did and didn't look at |
