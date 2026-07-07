---
name: deps-report
description: Audit project dependencies and generate a prioritized report of vulnerabilities and outdated packages. Parses npm/pnpm/yarn audit and outdated JSON (plus pip-audit for Python), classifies by severity, exposure (direct/transitive, prod/dev), and fix cost, and produces an ordered upgrade plan. Trigger: "audit dependencies", "dependency report", "check vulnerabilities", "outdated packages", "update dependencies safely", "auditar dependencias", "vulnerabilidades", "dependencias desactualizadas".
license: MIT
metadata:
  author: jrodrigopuca
  version: "1.0"
---

# Dependency Report Generator

Turn `audit` + `outdated` noise into a prioritized, risk-aware upgrade plan.

## Overview

Raw `npm audit` output optimizes for alarm, not for action: it mixes critical prod vulnerabilities with dev-only lodash advisories and counts them all the same. This skill classifies findings by **actual exposure and fix cost**, then orders the work: what to patch now, what to plan, what to consciously accept.

Third sibling of the report family: `build-report` (compiler), `test-report` (tests), `deps-report` (supply chain).

## Workflow

### 1. Collect Machine-Readable Data

Detect the package manager **from the lockfile** and run:

| Ecosystem | Vulnerabilities                     | Outdated                      |
| --------- | ----------------------------------- | ----------------------------- |
| npm       | `npm audit --json`                  | `npm outdated --json`         |
| pnpm      | `pnpm audit --json`                 | `pnpm outdated --format json` |
| yarn      | `yarn npm audit --json`             | `yarn outdated --json`*       |
| Python    | `pip-audit -f json` or `uv pip audit` | `pip list --outdated --format json` |

\* yarn classic vs berry differ — check `yarn --version` first.

Field shapes and gotchas per tool: [references/audit-data.md](references/audit-data.md).

### 2. Classify Every Vulnerability

Severity alone is not priority. Score each finding on three axes:

| Axis         | Values                                                              |
| ------------ | ------------------------------------------------------------------- |
| **Severity** | critical / high / moderate / low (from the advisory)                |
| **Exposure** | prod dependency > dev-only; direct > transitive; runtime-reachable > build-time tool |
| **Fix cost** | `fixAvailable` within semver range (cheap) / needs minor / needs **major** of a direct dep (expensive) / no fix published (mitigate) |

A *moderate* in a prod HTTP parser outranks a *critical* in a dev-only build plugin. Say so explicitly in the report — this is the judgment `npm audit` doesn't make.

### 3. Classify Outdated Packages

- **Patch/minor behind** → batch-upgradeable, low risk
- **Major behind** → one planning item per package: read its changelog/migration guide, note breaking changes relevant to this repo's usage
- **Multiple majors behind or unmaintained** (no release in 2+ years, deprecation notice) → flag for replacement discussion, don't just bump

### 4. Build the Ordered Plan

1. 🔴 **Patch now** — critical/high, prod-exposed, fix within semver: `npm audit fix` (scoped) or explicit `npm install pkg@x.y.z`
2. 🟠 **Planned upgrades** — fixes requiring a major: one task each, with the breaking changes listed
3. 🟡 **Hygiene batch** — safe minor/patch updates, grouped in one commit (`chore(deps)`)
4. 🟢 **Accepted (documented)** — dev-only/unreachable findings consciously deferred: record them with a reason, don't let them rot silently
5. ⚪ **Replacement candidates** — unmaintained packages

**Rules:**

- **Never `npm audit fix --force`** — it installs breaking majors silently. Majors are always explicit, planned upgrades.
- After every batch: install + build + test. Recommend `test-report` if the suite breaks.
- One concern per commit: security patches separate from hygiene bumps (`fix(deps):` vs `chore(deps):`).

### 5. Generate the Report

```markdown
# Dependency Report — {project} · {date}

**Headline:** {N} advisories → {X} need action now, {Y} planned majors,
{Z} accepted (dev-only). {M} packages outdated ({K} majors).

## 🔴 Patch now
| Package | Advisory | Severity | Exposure | Fix |
|---------|----------|----------|----------|-----|
| {pkg} | {GHSA-…} | high | prod, direct | `npm i pkg@1.2.4` (semver-compatible) |

## 🟠 Planned major upgrades
### {pkg} {2.x → 4.x} — fixes {GHSA-…}
- Breaking: {relevant changes for THIS repo's usage}
- Effort: {S/M/L} · Verify: {build + affected tests}

## 🟡 Hygiene batch (safe minors/patches)
{table} → one commit: `chore(deps): update {n} packages (minor/patch)`

## 🟢 Accepted for now — reasons recorded
| Package | Advisory | Why deferred |

## ⚪ Replacement candidates
{unmaintained packages + suggested alternatives}
```

### 6. Persist the Report

Offer to save to `.reports/YYYY-MM-DD-deps.md`. Dependency reports age well as evidence: the 🟢 accepted-risk section is exactly what the next audit needs to avoid re-litigating the same advisories.

## Degradation Strategy

| Issue                                | Action                                                   |
| ------------------------------------ | -------------------------------------------------------- |
| No network / registry blocked        | Report from lockfile only; state audit data is missing   |
| Monorepo                             | Per-workspace tables; root-level advisories deduplicated |
| Hundreds of advisories (transitive)  | Group by the direct dependency that pulls them in — fixing one direct dep often clears dozens |
| Version conflicts block a fix        | Show the dependency chain (`npm ls pkg`) and the blocking constraint |

## When NOT to Use

- Renovate/Dependabot already manages upgrades → review their PRs instead; this skill can still triage a backlog of open bot PRs
- A single known CVE to patch (just do it)

## Resources

- [references/audit-data.md](references/audit-data.md) — JSON shapes and per-tool gotchas
- [npm audit docs](https://docs.npmjs.com/cli/v10/commands/npm-audit) · [GitHub Advisory DB](https://github.com/advisories) · [pip-audit](https://pypi.org/project/pip-audit/) · [endoflife.date](https://endoflife.date/)
- Siblings: `build-report`, `test-report` (verify after upgrading)
