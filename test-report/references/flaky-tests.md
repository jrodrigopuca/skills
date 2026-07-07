# Flaky Test Detection and Handling

A flaky test passes and fails without code changes. Flaky tests are worse than failing tests: they train the team to ignore red CI.

## Detection Signals

| Signal                                   | Confidence | Notes                                        |
| ---------------------------------------- | ---------- | -------------------------------------------- |
| Failed, then passed on retry             | 🔴 Certain | Playwright reports `flaky` status natively   |
| Timeout errors on nondeterministic waits | 🟠 High    | `Timed out waiting for…`, `Exceeded timeout of 5000ms` |
| Passes alone, fails in the full suite    | 🟠 High    | Order dependence / shared state              |
| Fails only in CI, passes locally         | 🟡 Medium  | Resource contention, env differences, timezone |
| Date/time or randomness in the test path | 🟡 Medium  | Look for `Date.now()`, `Math.random()`, `sleep()` |
| Error message differs between runs       | 🟡 Medium  | Same test, different failure = nondeterminism |

## Confirming Flakiness

```bash
# Jest / Vitest — repeat a suspect test
npx vitest run path/to/test.ts --retry=3          # flaky if it passes on a retry
npx jest path/to/test.ts --testNamePattern="name" # run repeatedly

# Playwright — retries + repeat-each
npx playwright test suspect.spec.ts --retries=3
npx playwright test suspect.spec.ts --repeat-each=10

# pytest — rerun on failure / stress a single test
pytest tests/test_x.py::test_y --count=10          # needs pytest-repeat
pytest --reruns 3                                  # needs pytest-rerunfailures

# Order dependence — shuffle
npx jest --randomize                               # Jest 29.4+
pytest -p randomly                                 # pytest-randomly (default random order)
```

## Root Causes and Fixes

### 1. Missing await / unhandled async

The #1 cause in JS. An assertion runs before the work completes, and wins the race only sometimes.

```ts
// ❌ Flaky — assertion races the update
fireEvent.click(button);
expect(screen.getByText("Saved")).toBeInTheDocument();

// ✅ Deterministic — wait for the condition
fireEvent.click(button);
await screen.findByText("Saved");
```

### 2. Real time and real timers

```ts
// ❌ Flaky — depends on wall clock and machine speed
await new Promise(r => setTimeout(r, 500));
expect(cache.isExpired()).toBe(true);

// ✅ Fake timers
vi.useFakeTimers();
vi.advanceTimersByTime(500);
expect(cache.isExpired()).toBe(true);
```

Same for dates: freeze the clock (`vi.setSystemTime`, `freezegun` in Python) instead of asserting against `new Date()`.

### 3. Shared state between tests

Test A mutates a module-level object, a DB row, or localStorage; test B assumes a clean world. Passes in isolation, fails in the suite (or vice versa).

**Fix:** reset in `beforeEach` / fixtures with proper teardown; never share mutable module state; in pytest, prefer function-scoped fixtures unless there's a measured reason for wider scope.

### 4. Unseeded randomness

```python
# ❌ Different data every run
user = make_user(name=faker.name())

# ✅ Seeded — same data every run
faker.seed_instance(1234)
```

### 5. Network / external services

Tests hitting real APIs inherit the network's reliability. Mock at the boundary (MSW, `respx`, VCR cassettes) or run the dependency locally (docker) — and then it's an integration test with an env requirement, which belongs in AGENTS.md.

### 6. Port / resource collisions (CI-only flakiness)

Parallel workers fighting over port 3000 or the same DB schema. **Fix:** ephemeral ports (`listen(0)`), per-worker databases/schemas, unique temp dirs per test.

## Handling Policy (what to recommend in reports)

1. **Never delete a flaky test silently** — it was testing something.
2. **Quarantine, don't ignore:** mark it (`test.fixme` in Playwright, `it.skip` + tracking issue, `@pytest.mark.flaky`) so CI is green *and* the debt is visible.
3. **File it with evidence:** attach the pass/fail pattern and the suspected cause category from this doc.
4. **Retries are a mitigation, not a fix.** Global `retries: 2` hides real intermittent bugs — the retry that saves a flaky test also saves a genuinely racy production bug from detection.
5. **Fix within a deadline.** A quarantine lane without an SLA becomes a graveyard.

## In the Report

Flaky tests get their own section, never mixed with regressions:

```markdown
## ⚪ Flaky (2) — quarantine + follow-up, don't block on these

| Test | Evidence | Suspected cause |
| ---- | -------- | --------------- |
| e2e/cart.spec.ts › updates quantity | failed → passed on retry #1 | missing await on toast (cart.spec.ts:34) |
| test_report_queue | fails only with -p randomly | shared module state in queue singleton |
```
