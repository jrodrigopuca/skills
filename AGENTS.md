# AGENTS.md

## Project overview

Suite of 15 AI-agent skills (agents.md / Agent Skills spec) covering a dev lifecycle:
understand → decide → work → record → remember. Each skill is a directory with a
`SKILL.md` plus optional `references/` and `assets/scripts/`. Zero runtime dependencies —
there is no `package.json`; scripts are plain Node 18+ or bash.

Human-facing docs: [README.md](README.md). Design conventions: [CONTRIBUTING.md](CONTRIBUTING.md).

## Commands

```bash
node scripts/validate-skills.mjs   # THE gate — frontmatter, triggers, line budgets, links, script syntax. CI runs exactly this.
```

CI (`.github/workflows/`) also smoke-tests the parser scripts by piping fixture text:

```bash
printf '...tsc output...' | node build-report/assets/scripts/parse-build.mjs
printf '...pytest output...' | node test-report/assets/scripts/parse-tests.mjs
```

There is no build, no test runner, no linter. The validator is the whole safety net — run it after every change.

## Conventions (deltas only — full rules in CONTRIBUTING.md)

- SKILL.md bodies in **English**; `Trigger:` phrases **bilingual (EN + ES)** inside the frontmatter `description`. Trigger lists in the body are dead weight — activation happens on the description.
- SKILL.md ≤ 350 lines; depth goes to `references/`.
- Skills are **self-contained**: never reference files in another skill. Duplicated conventions across skills are intentional — do not "deduplicate" them.
- Deterministic work (parsing, counting) goes in `assets/scripts/`; judgment and prose stay in the SKILL.md. Every script gets run against a fixture before committing.
- Conventional Commits: `feat(skill-name): ...`, `chore: ...`. No AI attribution lines.

## Working method

How to decompose, verify, and decide in this repo. These are operating rules, not suggestions.

### Decompose

1. **Evidence before opinion.** Before proposing or writing anything, read the files the task touches — and for skill work, read `CONTRIBUTING.md` and one existing skill of the same shape (report-style → `test-report`, doc-style → `create-adr`) as the reference pattern. Never work from memory of "how skills usually look".
2. **Restate the task as a done-condition** you can check mechanically, e.g. "validator passes, README count says 16, script exits 0 on the fixture". If you can't phrase the done-condition, you don't understand the task yet — go back to step 1.
3. **Split by verification boundary, not by file.** Each step must end in something checkable (validator run, script vs fixture, link resolution) — not in "wrote more text".
4. **Front-load the riskiest unknown.** If one step might invalidate the plan (an unclear spec rule, a script that may not parse), do that step first, before investing in the rest.

### Verify

1. **Every factual claim gets checked before it's written down.** A command is only documented after it ran; a convention is only stated if a config or the code shows it. Prefer omission over speculation — mark inference as inferred.
2. **Verify at the level of the change:** touched a script → pipe a fixture through it and check the output shape; touched a SKILL.md → validator (budget, links, triggers); touched README → count matches; added a skill → all of the above plus a dry run of the skill's own instructions against a real repo.
3. **Run `node scripts/validate-skills.mjs` after every edit batch**, not once at the end. A red validator invalidates everything built on top since the last green run.
4. **Report reality.** If a check fails, say it failed and show the output. Never describe intended behavior as verified behavior.

### Decide what's next

- Check green and steps remain → continue, no ceremony.
- Check red → **fix before any new work**. After two failed fix attempts, stop patching and re-diagnose from evidence: re-read the validator source or the spec — the assumption is usually wrong, not the code.
- Ambiguity that changes the design (new skill vs. extending one, where a convention lives) → stop and ask the user, presenting options with tradeoffs.
- Cosmetic ambiguity (wording, section order) → pick the pattern the suite already uses, apply it, and state the choice made.
- Discovered work outside the task (a stale doc, an unrelated bug) → note it, finish the current task, propose it separately. Never silently expand scope.
- Done-condition met → stop. Do not keep polishing past green.

## Gotchas

- The frontmatter `description` is the skill's activation surface (≤ 1024 chars) — editing it changes when the skill fires. Treat it as an API, not prose.
- `name` in frontmatter must equal the directory name; the validator enforces it.
- Relative links in SKILL.md must resolve (code fences and `templates/` paths are exempt).
- Shell scripts must be executable (`chmod +x`) or the validator fails.
- Immutable artifacts (released changelog sections, accepted ADRs in examples) are superseded, never rewritten.
