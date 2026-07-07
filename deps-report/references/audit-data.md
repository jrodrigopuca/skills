# Audit & Outdated Data Formats

Field shapes and gotchas for the machine-readable outputs deps-report consumes.

## npm audit --json (npm 7+)

```json
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "semver": {
      "name": "semver",
      "severity": "high",
      "isDirect": false,
      "via": [ { "source": 1101088, "title": "…ReDoS…", "url": "https://github.com/advisories/GHSA-…", "severity": "high", "range": "<5.7.2" } ],
      "effects": ["nodemon"],
      "range": "<5.7.2",
      "nodes": ["node_modules/semver"],
      "fixAvailable": { "name": "nodemon", "version": "3.0.1", "isSemVerMajor": false }
    }
  },
  "metadata": { "vulnerabilities": { "info": 0, "low": 1, "moderate": 3, "high": 2, "critical": 0, "total": 6 } }
}
```

**Key fields:**

- `isDirect` — direct vs transitive (exposure axis)
- `via[]` — entries are objects (real advisories) **or strings** (vulnerable because of another vulnerable package — follow the chain to the root cause)
- `effects[]` — what depends on this; the **direct dep to upgrade** is usually at the top of this chain
- `fixAvailable` — `true` | `false` | object. **`isSemVerMajor: true` means `npm audit fix` will NOT fix it and `--force` would install a breaking major** — that's a planned upgrade, never an auto-fix
- Dev-only check: `npm ls <pkg>` or cross-reference the direct root with `devDependencies`

## npm outdated --json

```json
{
  "react": { "current": "17.0.2", "wanted": "17.0.2", "latest": "19.1.0", "dependent": "my-app", "location": "node_modules/react" }
}
```

- `wanted` = max satisfying the semver range in package.json; `current === wanted && wanted !== latest` → **major behind** (range blocks it)
- Missing `current` → declared but not installed
- Classification: patch/minor if `wanted > current` or latest differs only in minor/patch; major if `latest` major > `current` major

## pnpm

- `pnpm audit --json` — same advisory schema family as npm v2 report
- `pnpm outdated --format json` — object keyed by package with `current`/`latest`/`wanted`; add `-r` for all workspace packages (keyed per project)
- Monorepo: run at root with `-r`; attribute findings to the workspace that declares the dep (`pnpm why <pkg> -r`)

## yarn

- **Berry (2+):** `yarn npm audit --json` → NDJSON (one advisory per line) — parse line by line, not as one document
- **Classic (1.x):** `yarn audit --json` → NDJSON with `type: "auditAdvisory"` entries; totals in the `auditSummary` line
- Check `yarn --version` before parsing.

## Python

**pip-audit:**

```bash
pip-audit -f json    # or: uv run pip-audit
```

```json
{ "dependencies": [ { "name": "requests", "version": "2.25.0", "vulns": [ { "id": "PYSEC-2023-74", "fix_versions": ["2.31.0"], "description": "…" } ] } ] }
```

- Empty `fix_versions` → no fix published (mitigation territory)
- `pip list --outdated --format json` → `[{ "name", "version", "latest_version" }]`
- Poetry: `poetry show --outdated --no-ansi`; uv: `uv pip list --outdated`

## Severity → Priority Is NOT 1:1

The report's priority = severity **weighted by exposure and fix cost**:

| Finding                                            | npm says | Report says |
| -------------------------------------------------- | -------- | ----------- |
| critical in dev-only webpack plugin, build-time    | critical | 🟢 Accepted (documented) or 🟡 hygiene |
| moderate ReDoS in prod Express middleware          | moderate | 🔴 Patch now |
| high in transitive dep, fix = minor of a direct dep| high     | 🔴 Patch now (cheap) |
| high, fix requires direct dep major                | high     | 🟠 Planned upgrade |
| critical, no fix published                         | critical | 🟠 Mitigate: pin, patch (e.g. pnpm patch), or replace |

Justify every downgrade from raw severity in one sentence — "dev-only, not in any runtime path" — so accepting risk is a decision, not an omission.

## Useful Chain Commands

```bash
npm ls <pkg>                  # who pulls this in (npm)
pnpm why <pkg> [-r]           # same for pnpm (+ workspaces)
yarn why <pkg>
npm view <pkg> time --json    # release history — staleness signal
npm view <pkg> deprecated     # deprecation notice
```

## Unmaintained Signals

Flag for replacement (not just upgrade) when several hold:

- Last publish > 2 years ago (`npm view <pkg> time`)
- Marked `deprecated` on the registry
- Repo archived, or open critical advisories with no fix
- Peer ecosystem moved on (e.g. the framework it plugs into had two majors since)

Suggest alternatives only with evidence (active maintenance, adoption) — recommending a random substitute is how you trade one risk for another.
