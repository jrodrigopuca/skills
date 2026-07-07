# AGENTS.md Templates by Project Type

Ready-to-fill templates. Replace every `{placeholder}` with **verified** repository evidence — if you can't verify a line, delete it. Keep the final file under ~150 lines.

## Template: Web App (JS/TS)

```markdown
# AGENTS.md

## Project overview

{One-liner: product + stack, e.g. "E-commerce storefront — Next.js 15, TypeScript strict, Tailwind 4."}
App code in `{src/}`, {api routes in `app/api/`}, tests colocated as `*.test.ts`.

## Setup

{pnpm|npm|yarn|bun} install
{cp .env.example .env.local   # required vars: DATABASE_URL, STRIPE_KEY}
{docker compose up -d          # postgres + redis, needed before dev}

## Commands

{pm} dev              # dev server on :{port}
{pm} build            # production build — must pass before PR
{pm} test             # {vitest|jest} full run
{pm} {vitest run path/to/file.test.ts}   # single test file
{pm} test -- -t "{test name}"            # single test by name
{pm} lint             # {eslint} — CI-blocking
{pm} typecheck        # {tsc --noEmit} — CI-blocking

## Code style

- {TypeScript strict mode; no `any` (lint-enforced)}
- {Formatting: Prettier — run `{pm} format`, don't hand-format}
- {Named exports only (lint rule `import/no-default-export`)}
- {Components: function declarations, props interface above component}

## Testing instructions

- {Unit tests colocated: `foo.ts` → `foo.test.ts`}
- {E2E in `e2e/` with Playwright: `{pm} test:e2e` (needs dev server running)}
- {Before any commit: `{pm} lint && {pm} test` must pass}

## Commit & PR conventions

- {Conventional Commits: `feat(scope): ...`, `fix(scope): ...`}
- {PRs need: green CI, updated tests for behavior changes}

## Security & boundaries

- {Never commit `.env*` files}
- {`src/generated/**` is generated — regenerate with `{pm} codegen`, never edit}
- {DB schema changes only via migrations: `{pm} db:migrate:new`}

## Gotchas

- {Non-obvious, verified facts only. Delete this section if empty.}
```

## Template: Library / Package

```markdown
# AGENTS.md

## Project overview

{Name} — {what it does}, published to {npm|PyPI} as `{package-name}`.
Source in `src/`, public API surface is `src/index.ts` only.

## Setup

{pm} install

## Commands

{pm} build            # {tsup|rollup|tsc} → dist/
{pm} test             # {vitest} — includes type tests
{pm} test:watch
{pm} lint

## Code style

- {Public API: everything exported from `src/index.ts` is public — changing
  signatures there is a BREAKING CHANGE}
- {JSDoc required on all exported symbols (docs are generated from it)}

## Testing instructions

- {Every exported function needs a test in `test/`}
- {Type-level tests in `test/types/` run via `{pm} test:types`}

## Commit & PR conventions

- {Conventional Commits — release automation derives versions from them:
  feat → minor, fix → patch, `!`/BREAKING CHANGE → major}
- {Changesets: run `{pm} changeset` for user-facing changes}

## Security & boundaries

- {Don't add runtime dependencies without discussion — this package ships to consumers}
```

## Template: Python Service

```markdown
# AGENTS.md

## Project overview

{Service name} — {FastAPI|Django} service for {purpose}. Python {3.12},
managed with {uv|poetry|pip-tools}.

## Setup

{uv sync                       # or: poetry install}
{cp .env.example .env}
{docker compose up -d db}

## Commands

{uv run uvicorn app.main:app --reload}   # dev server on :8000
{uv run pytest}                           # full test suite
{uv run pytest tests/test_auth.py::test_login -x}   # single test
{uv run ruff check . && uv run ruff format --check .}  # lint — CI-blocking
{uv run mypy .}                           # types — CI-blocking
{uv run alembic upgrade head}             # apply migrations

## Code style

- {Ruff enforces style — run `uv run ruff format .`, don't hand-format}
- {Type hints required on public functions (mypy strict)}
- {Pydantic models for all request/response schemas}

## Testing instructions

- {Tests in `tests/`, mirror package layout}
- {Fixtures in `tests/conftest.py`; DB tests use the `db_session` fixture}
- {New endpoints need: happy path + auth failure + validation failure tests}

## Commit & PR conventions

- {Conventional Commits}

## Security & boundaries

- {Migrations: generate with alembic, never edit applied migrations}
- {Never log request bodies on auth endpoints}
```

## Template: Monorepo Root

Keep the root file about the **workspace**; per-package detail lives in nested files.

```markdown
# AGENTS.md

## Project overview

Monorepo ({pnpm workspaces|turborepo|nx}): `apps/web` (Next.js),
`apps/api` (Fastify), `packages/ui` (shared components), `packages/config`.

Each app/package has its own AGENTS.md with specific commands —
**the closest AGENTS.md to the file you are editing wins.**

## Setup

{pnpm install                 # once, at the root — never install inside packages}

## Workspace commands

{pnpm build                   # turbo build, all packages}
{pnpm test                    # all packages}
{pnpm --filter web dev        # run one app}
{pnpm --filter ui test        # test one package}

## Cross-cutting conventions

- {TypeScript strict everywhere; shared config in `packages/config`}
- {Conventional Commits with the package as scope: `feat(web): ...`, `fix(ui): ...`}
- {Shared code goes in `packages/*` — never import across apps directly}

## Security & boundaries

- {Version bumps and releases are automated — never edit versions by hand}
```

## Template: Monorepo Package (nested)

Only the deltas — do not repeat root content:

```markdown
# AGENTS.md — apps/api

Fastify + Prisma. Runs on :4000.

## Commands (from repo root)

pnpm --filter api dev         # needs `docker compose up -d` first
pnpm --filter api test        # vitest
pnpm --filter api db:migrate  # prisma migrate dev

## Specifics

- Route handlers in `src/routes/`, one file per resource, registered in `src/app.ts`
- Prisma schema is the source of truth — after editing it, run db:migrate and commit the migration
- Integration tests hit a real postgres (docker) — no DB mocking
```

## Section Checklist

| Section              | Include when...                                    |
| -------------------- | -------------------------------------------------- |
| Project overview     | Always (2-3 lines max)                             |
| Setup                | Always                                             |
| Commands             | Always — with the single-test incantation          |
| Code style           | A linter/formatter/tsconfig enforces something     |
| Testing instructions | Tests exist                                        |
| Commit & PR          | A convention is observable in git history or docs  |
| Security & boundaries| There are generated files, migrations, or secrets  |
| Gotchas              | You verified at least one non-obvious fact         |
