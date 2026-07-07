# Test Report Templates

Three variants by failure volume. All share the same headline discipline: **failures → root causes → ordered actions**.

## Fast Report (< 5 failures)

```markdown
# Test Report — {project} · {date}

**Status:** 🔴 {N} failed / {M} passed ({runner}, {duration})

## Failures

### 1. {test full name}
- **File:** `{file}:{line}`
- **Category:** {regression | broken test | snapshot | flaky | infra}
- **Error:** `{concise error message}`
- **Fix direction:** {one or two sentences pointing at the cause}
- **Re-run:** `{command for just this test}`

{…repeat per failure…}

## Suggested order
1. {failure} — {why first}
2. {failure}
```

## Standard Report (5-50 failures)

```markdown
# Test Report — {project} · {date}

**Status:** 🔴 {N} failed / {M} passed / {K} skipped ({runner}, {duration})
**Headline:** {N} failures → **{G} root causes.** {One-sentence fix plan.}

## Summary by category

| Category | Failures | Groups |
| -------- | -------- | ------ |
| 🔴 Infra/environment | {n} | {g} |
| 🔴 Cascades (setup/fixture) | {n} | {g} |
| 🟠 Real regressions | {n} | {g} |
| 🟡 Broken tests | {n} | {g} |
| 🟢 Stale snapshots | {n} | {g} |
| ⚪ Flaky | {n} | {g} |

## Root cause groups (priority order)

### Group 1 🔴 — {shared root cause, stated as a fact}
- **Evidence:** `{the common error message}`
- **Origin:** `{file}:{line}`
- **Affected:** {count} tests — {2-3 representative names}
- **Fix direction:** {what to change and why that clears the group}
- **Verify:** `{command to re-run just this group}`

{…repeat per group…}

## ⚪ Flaky ({n}) — quarantine + follow-up, don't block on these

| Test | Evidence | Suspected cause |
| ---- | -------- | --------------- |
| {name} | {retry pattern} | {category + file:line} |

## Fix plan
1. {group} — {expected effect: "clears ~15 failures"}
2. {group}
3. {snapshots: confirm intentional, then `{runner} -u`}
```

## Sampled Report (50+ failures)

```markdown
# Test Report — {project} · {date} (sampled)

**Status:** 🔴 {N} failed / {M} passed — analyzed all, detailing top {T} groups
**Headline:** {Check for a global cause first: broken import, dead service,
env var — with 50+ failures one cause usually dominates.}

## Failure distribution

| Module / area | Failures | Dominant error |
| ------------- | -------- | -------------- |
| {src/auth} | {32} | {normalized message} |
| {e2e/} | {18} | {normalized message} |

## Top {T} root cause groups
{…same group format as standard, top groups only…}

## Remaining
{count} failures across {g} smaller groups — re-run after fixing the top
groups; most are expected to clear. `{full re-run command}`

## Top 3 actions
1. {highest-leverage fix}
2. …
3. …
```

## Style Rules

- **Headline first**: failures → causes → plan, in one sentence, before any table.
- State causes as **evidence-backed facts** ("15 failures share this fixture error"), not guesses. When inferring, say "likely".
- Every group ends with a **runnable command** — the reader should never construct one by hand.
- Snapshot groups always carry the warning: confirm the change is intentional **before** `-u`.
- Never pad: a category with zero entries is omitted, not shown as "0".
