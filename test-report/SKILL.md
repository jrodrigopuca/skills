---
name: test-report
description: Analyze test runner output (Jest, Vitest, Playwright, pytest) and generate a structured failure report. Groups failures by root cause, detects cascading fixture failures and flaky tests, separates real regressions from stale snapshots, and prioritizes what to fix first. Trigger: "analyze test results", "test report", "why are my tests failing", "failing tests", "flaky tests", "analizar tests", "tests fallidos", "reporte de tests", or when the user pastes test runner output with failures.
license: MIT
metadata:
  author: jrodrigopuca
  version: "1.0"
---

# Test Report Generator

Turn noisy test runner output into a prioritized, root-cause-grouped failure report.

## Overview

A failing test run rarely means "N independent bugs". It usually means a few root causes fanning out: one broken fixture failing 20 tests, one changed component invalidating 12 snapshots, two real regressions, and one flaky test. This skill separates those categories so the user fixes causes, not symptoms.

**Sibling skill:** `build-report` handles compile/lint/bundler errors. This skill handles **test execution failures**. If the output shows both, run build-report first — tests can't be trusted while the build is broken.

## When to Use

✅ Test run with multiple failures that need triage
✅ CI test output that's too long to read
✅ Recurring/intermittent failures ("it passes locally")
✅ After a big refactor, to map the blast radius

❌ A single failing test with an obvious assertion diff (just read it)
❌ Compile/lint errors → `build-report`
❌ Writing new tests (this skill reports, it doesn't author)

## Workflow

### 1. Get the Best Possible Input

If the user can re-run tests, prefer **machine-readable output** — parsing it is far more reliable than scraping text:

| Framework  | Preferred invocation                                     |
| ---------- | -------------------------------------------------------- |
| Jest       | `npx jest --ci --json --outputFile=test-results.json`    |
| Vitest     | `npx vitest run --reporter=json --outputFile=test-results.json` |
| Playwright | `npx playwright test --reporter=json > test-results.json` |
| pytest     | `pytest -ra --junitxml=test-results.xml`                 |
| Any (CI)   | JUnit XML artifact if the pipeline already produces one  |

If only pasted text output is available, parse it with the per-framework patterns in [references/parsers.md](references/parsers.md).

### 2. Parse Failures

Extract for every failure: suite/file, test name, failure message, error type, assertion diff (expected/received) when present, `file:line` of the failure, duration, and retry information if the runner reports it.

### 3. Classify Each Failure

| Category               | Signals                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| **Cascade (setup/fixture)** | `beforeAll`/`beforeEach`/fixture/conftest error; "Test suite failed to run"; many failures in one file with identical setup error |
| **Real regression**    | Assertion failure with a meaningful diff, clustered near recent changes  |
| **Stale snapshot**     | Snapshot mismatch after intentional UI/output changes                    |
| **Flaky**              | Passed on retry; timeout/timing errors; order-dependent; see [references/flaky-tests.md](references/flaky-tests.md) |
| **Infra/environment**  | Connection refused, port in use, missing env var, docker not running     |
| **Broken test**        | Error thrown by the test's own code (bad mock, undefined helper)         |

### 4. Group by Root Cause

Grouping heuristics, in order of strength:

1. **Same setup/fixture error** → one group per broken fixture (fixing it may clear the whole group)
2. **Same normalized error message** (strip file paths, line numbers, ids, timestamps before comparing)
3. **Same failing import/module** — a moved or renamed module fails everything importing it
4. **Same source file/component** under test

Report groups, not individual failures: "12 failures, 3 root causes" is the headline.

### 5. Prioritize

1. 🔴 **Infra/environment** — nothing else is trustworthy until the environment runs
2. 🔴 **Cascades** — highest fix leverage: one fixture fix can clear dozens of failures
3. 🟠 **Real regressions** — the actual bugs, grouped by module
4. 🟡 **Broken tests** — code is probably fine, the test isn't
5. 🟢 **Stale snapshots** — likely one `--update` command, but confirm the diff is intentional first
6. ⚪ **Flaky** — quarantine and file for follow-up; don't block the current fix cycle on them

### 6. Generate the Report

Use the templates in [references/report-template.md](references/report-template.md). Pick the variant by volume:

| Path         | Failures | Behavior                                                        |
| ------------ | -------- | --------------------------------------------------------------- |
| **Fast**     | < 5      | Per-failure detail, no grouping ceremony                        |
| **Standard** | 5-50     | Full classification, groups, prioritized fix plan               |
| **Sampled**  | 50+      | Top groups detailed, stats for the rest, top 3 fixes            |

Every group in the report must include:

- The **shared root cause** (evidence: the common error, not a guess)
- Affected tests (count + representative names)
- A **suggested fix direction** with the relevant `file:line`
- The command to re-run just that group, e.g. `npx vitest run src/auth/` or `pytest tests/test_auth.py -x`

### 7. Offer Follow-Ups

- "Want me to fix the top group?"
- "Should I update the stale snapshots after you confirm the UI change is intentional?"
- "Want a deeper look at the flaky tests?" → [references/flaky-tests.md](references/flaky-tests.md)

## Degradation Strategy

| Issue                                | Action                                              |
| ------------------------------------ | --------------------------------------------------- |
| Output truncated mid-run             | Report on what parsed; state the cutoff explicitly  |
| Unknown test framework               | Generic parse (file + name + message); note it      |
| No stack traces (minimal reporter)   | Group by message only; suggest verbose re-run       |
| Mixed build + test errors            | Split them; recommend build-report for the former   |
| 500+ failures                        | Force sampled path; lead with "likely global cause" (env, broken import) |

Always deliver something useful — a partial triage beats no triage.

## Example

**User pastes:** vitest output, 23 failed.

**Analysis:** 15 failures share `TypeError: Cannot read properties of undefined (reading 'user')` from `renderWithProviders` in `test/utils.tsx:18` (cascade — auth context mock changed). 6 are snapshot mismatches in `Button` (intentional redesign, per the diff). 2 are assertion failures in `date.test.ts` (real regression: TZ handling).

**Report headline:**

> 🔴 23 failed → **3 root causes.** Fix `test/utils.tsx:18` first (clears ~15), then review the 2 real regressions in `src/utils/date.ts`, then `vitest -u` for the 6 Button snapshots once you confirm the redesign.

That's the value: 23 alarms, 3 actions, in order.

## Resources

- [references/parsers.md](references/parsers.md) — per-framework output formats and parsing patterns
- [references/flaky-tests.md](references/flaky-tests.md) — flaky detection heuristics and fix strategies
- [references/report-template.md](references/report-template.md) — report structures (fast/standard/sampled)
- Official docs: [Jest CLI](https://jestjs.io/docs/cli) · [Vitest reporters](https://vitest.dev/guide/reporters) · [Playwright reporters](https://playwright.dev/docs/test-reporters) · [pytest usage](https://docs.pytest.org/en/stable/how-to/usage.html)
