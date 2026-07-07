---
name: create-skill
description: Create a new agent skill following this suite's conventions — trigger-first descriptions, token budgets, progressive disclosure into references/, deterministic work in tested scripts, and self-contained installation. Use when authoring a new skill, converting a repeated workflow into a skill, or reviewing a skill's structure. Trigger: "create a skill", "new skill", "turn this into a skill", "write a SKILL.md", "crear una skill", "nueva skill", "convertir esto en skill".
license: MIT
metadata:
  author: jrodrigopuca
  version: "1.0"
---

# Skill Creator

Author skills that activate reliably, load cheaply, and survive maintenance.

## When a Skill Earns Its Place

✅ A workflow you repeat across sessions and the agent needs guidance on
✅ Conventions that differ from what the model would do by default
✅ Multi-step processes with real decision points

❌ Something the model already does well unprompted (a skill adds cost, it must add behavior)
❌ One project's quirks → that's `AGENTS.md` (`create-agents-docs`), not a skill
❌ Content that duplicates existing docs → reference them instead
❌ Overlap with an existing skill → **extend it, don't fork it**

## Instructions

### 1. Fit and Name

Check the suite map (which lifecycle stage does it serve?) and the naming families:

| Family        | Pattern                    | Examples                              |
| ------------- | -------------------------- | ------------------------------------- |
| Generators    | `create-{artifact}`        | create-adr, create-changelog          |
| Conventions   | `using-{convention}`       | using-commit, using-review-comments   |
| Diagnostics   | `{domain}-report`          | build-report, test-report, deps-report|
| Tools         | `{name}` (freeform, short) | til, context-compactor                |

### 2. Write the Description FIRST

The frontmatter description is the **only thing the agent reads when deciding to activate** — body trigger sections are dead weight. Before any content exists, write:

```yaml
description: {What it does, one or two sentences, concrete}. {When to use}.
  Trigger: "{phrase}", "{phrase}", "{frase en español}", "{frase}", or when {situation}.
```

Rules: ≤ 1024 chars, bilingual trigger phrases (EN + ES), include the *situational* trigger ("or when the user pastes X") — users don't always say the magic words. If you can't write a crisp description, the skill isn't scoped yet — stop and scope it.

### 3. Structure by Load Cost

```
skill-name/
├── SKILL.md              # ≤ 350 lines (CI-enforced) — the operational core
├── references/           # depth, loaded on demand: formats, templates, examples
└── assets/
    └── scripts/          # deterministic work: parse, count, transform
```

What goes where:

- **SKILL.md** — what the agent needs on *every* activation: workflow, rules, decision tables, one example. Every line is paid for on every use.
- **references/** — what's needed *sometimes*: per-tool formats, long templates, worked examples. Link them from the step that needs them ("see references/x.md"), never inline them.
- **assets/scripts/** — anything with one correct answer: parsing, extraction, file generation. **Code parses; the model analyzes.**

### 4. The Script Rule

If a step transforms input mechanically (parse test output, generate a file tree, count things), it's a script — zero-dependency (bash or Node 18+), reading stdin or a file arg, emitting compact JSON or files.

**Every script ships tested.** Write fixtures covering each input format, run the script against them, verify the output — *before* committing. Untested scripts are fiction with a shebang (this suite shipped broken scripts exactly once). Give SKILL.md a fallback for when the runtime is missing.

### 5. Write the Body

Section skeleton (full template in [references/skill-template.md](references/skill-template.md)):

1. **Title + one-line promise**
2. **Overview** — what and *why it's shaped this way*; how it differs from neighbors
3. **When to use / when NOT** — the NOT list prevents misfires
4. **Instructions/Workflow** — numbered, imperative, with decision tables
5. **Degradation strategy** — what to do with partial input; always deliver something
6. **One worked example** — realistic input → realistic output
7. **Resources** — references, official links, sibling skills

Style rules:

- Imperatives an agent can execute; no motivational filler
- Examples as ❌/✅ pairs **with the why**
- State handoffs to sibling skills explicitly ("output feeds X", "run Y first")
- Prefer omission to speculation; mark inference as inference

### 6. Self-Containment (installation constraint)

Skills install individually — **never** depend on files in another skill or a shared directory. Shared conventions get duplicated where needed; that duplication is deliberate. Cross-skill references are *by name in prose* ("if `context-compactor` is available…"), always optional, never load-bearing.

### 7. Register and Validate

1. README: catalog entry (features, language, activators) + install line + count bump
2. `node scripts/validate-skills.mjs` must pass clean (frontmatter, Trigger, budget, links, scripts)
3. Test the skill against a real case before committing — a skill that hasn't run is a hypothesis
4. Commit: `feat(skill-name): add {what it does}`

## Anti-Patterns

- ❌ **Description written last** — produces skills that never activate
- ❌ **The 600-line SKILL.md** — context tax on every activation; push depth to references/
- ❌ **Keywords section in the body** — activation reads frontmatter only
- ❌ **Untested scripts** — see The Script Rule
- ❌ **The framework cheatsheet** — ages with every release and competes with official docs the model already knows; workflow skills are evergreen
- ❌ **Forking instead of extending** — two skills 80% alike will drift apart and confuse activation

## Example

**User:** "I keep asking you to check accessibility the same way — turn it into a skill."

**Process:** fit → Diagnostics family, `a11y-report`. Description first, with triggers ("check accessibility", "a11y", "revisar accesibilidad", or when auditing UI). Deterministic part → script wrapping `axe-core` CLI output into grouped JSON, tested against two fixture pages. SKILL.md ≤ 200 lines: classification (blocker/serious/moderate), grouping by rule, report template inline. README entry, validator green, `feat(a11y-report): add accessibility audit skill`.

## Resources

- [references/skill-template.md](references/skill-template.md) — copy-paste SKILL.md skeleton + fixture-testing pattern
- [CONTRIBUTING.md](../CONTRIBUTING.md) — suite map and design rules (when working inside this repo)
- [agentskills.io](https://agentskills.io/) — the Agent Skills format
