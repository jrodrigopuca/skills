# Test Output Parsing Patterns

How to recognize and extract failures from each framework's output. Always prefer the JSON/XML reporter when a re-run is possible; text patterns are the fallback for pasted output.

## Jest

### Machine-readable

```bash
npx jest --ci --json --outputFile=test-results.json
```

Key JSON fields: `testResults[]` (per file) → `.name` (file), `.status`, `.message` (suite-level error, e.g. failed to run), `.assertionResults[]` → `.fullName`, `.status` (`passed|failed|pending`), `.failureMessages[]`. Top-level `numFailedTests`, `numFailedTestSuites`.

### Text patterns

```
FAIL src/auth/login.test.ts                       ← failing file
  ● Login › rejects invalid credentials           ← failing test ("●" marker)

    expect(received).toBe(expected)               ← assertion
    Expected: 401
    Received: 500

      at Object.<anonymous> (src/auth/login.test.ts:42:19)   ← file:line

  ● Test suite failed to run                      ← CASCADE: whole file failed
    Cannot find module '../utils/auth' from 'src/auth/login.test.ts'

  ✕ renders the button (23 ms)                    ← alt failure marker
  ✓ renders the label (5 ms)                      ← pass marker

Snapshot Summary
 › 3 snapshots failed from 1 test suite.          ← stale snapshots signal
Tests:       4 failed, 12 passed, 16 total
```

Cascade signals: `● Test suite failed to run`, errors in `beforeAll`/`beforeEach` hooks (`thrown: ...` inside hook name).

## Vitest

### Machine-readable

```bash
npx vitest run --reporter=json --outputFile=test-results.json
```

JSON shape is Jest-compatible (`testResults`, `assertionResults`) in current versions — parse like Jest.

### Text patterns

```
 ❯ src/utils/date.test.ts (8 tests | 2 failed)    ← file summary
   × formats UTC dates correctly                   ← failing test ("×")
     → expected '2026-07-07' to be '2026-07-08'    ← inline assertion

 FAIL  src/auth/session.test.ts > Session > refreshes token
AssertionError: expected 401 to be 200
 ❯ src/auth/session.test.ts:57:23                  ← file:line ("❯" frame)

⎯⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯                    ← CASCADE section
 FAIL  src/api/client.test.ts [ src/api/client.test.ts ]
Error: Cannot find module './fetcher'

 Test Files  2 failed | 14 passed (16)
      Tests  3 failed | 120 passed (123)
```

## Playwright

### Machine-readable

```bash
npx playwright test --reporter=json > test-results.json
```

Key fields: `suites[]` nested → `specs[]` → `.title`, `.ok`, `tests[]` → `.status` and `results[]` (one per attempt: `.status`, `.error.message`, `.retry`). **`"status": "flaky"` is native** — failed then passed on retry. `"unexpected"` = real failure.

### Text patterns

```
  1) [chromium] › e2e/checkout.spec.ts:12:5 › completes purchase   ← number) [project] › file:line › title

    Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
    Call log:                                        ← locator wait log
      - waiting for getByRole('button', { name: 'Pay' })

    Retry #1 ────────────────────────────────        ← retry attempt marker

  2 failed
  1 flaky                                            ← NATIVE flaky count
    [chromium] › e2e/cart.spec.ts:30:5 › updates quantity
  47 passed (1.2m)
```

Timeouts + locator waits dominate Playwright failures — check for missing awaits, changed selectors, and races before assuming app bugs.

## pytest

### Machine-readable

```bash
pytest -ra --junitxml=test-results.xml
```

JUnit XML: `<testcase classname file name time>` with child `<failure message>` (assertion), `<error message>` (**setup/teardown errors** — cascade signal), `<skipped>`. Text content holds the traceback.

### Text patterns

```
FAILED tests/test_auth.py::test_login - AssertionError: assert 401 == 200
ERROR tests/test_db.py::test_query - fixture 'db_session' not found     ← CASCADE (ERROR = setup, not test body)

________________________ test_login ________________________            ← detailed section
    def test_login(client):
>       assert resp.status_code == 200
E       AssertionError: assert 401 == 200                                ← E lines = error detail
tests/test_auth.py:42: AssertionError                                    ← file:line

ERROR at setup of test_query                                             ← explicit setup failure
=================== 2 failed, 1 error, 50 passed in 4.32s ===================
```

Key distinction: pytest separates **`failed`** (test body assertion) from **`error`** (setup/fixture/teardown). Every `error` is a cascade candidate — one broken fixture in `conftest.py` errors every test that uses it.

## JUnit XML (universal fallback)

Most CI systems and every major framework can emit it. Parse `<testsuite>` stats and per-`<testcase>` children:

- `<failure>` → assertion failure (real or snapshot)
- `<error>` → exception/setup problem (cascade candidate)
- `<skipped>` → excluded

## Message Normalization (for grouping)

Before comparing failure messages across tests, strip the noise:

```
- Absolute paths            /Users/x/repo/src/a.ts → src/a.ts
- Line/column numbers       a.ts:42:19 → a.ts
- Hex/object ids            0x7f3a…, ObjectId("…"), uuid-like tokens → <id>
- Timestamps and durations  (23 ms), 2026-07-07T… → <t>
- Numbers in diffs          expected 401 received 500 → keep! (that IS the signal)
```

Two failures with identical normalized messages almost always share a root cause.
