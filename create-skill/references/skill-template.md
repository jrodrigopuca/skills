# SKILL.md Template and Script Testing Pattern

## Copy-Paste Skeleton

```markdown
---
name: {skill-name}
description: {What it does — concrete, one or two sentences}. {When to use it}.
  Trigger: "{english phrase}", "{english phrase}", "{frase en español}",
  "{frase en español}", or when {situational trigger}.
license: MIT
metadata:
  author: {author}
  version: "1.0"
---

# {Skill Title}

{One line: the promise. What does the user get?}

## Overview

{2-4 lines: what this does and WHY it's shaped this way. If a sibling
skill exists in the same space, state the boundary explicitly:
"X handles A; this handles B."}

## When to Use

✅ {situation}
✅ {situation}

❌ {near-miss that belongs elsewhere — name where}
❌ {case where the model needs no skill}

## Instructions

### 1. {First step — imperative}

{Concrete action. Decision tables beat prose:}

| If...            | Then...          |
| ---------------- | ---------------- |
| {condition}      | {action}         |

### 2. {Step with a script}

​```bash
node {skill-dir}/assets/scripts/{script}.mjs input
​```

{What the output means. Fallback: {manual path} if the runtime is missing.}

### 3. {Deliver}

{Output format/template. For reports: headline first, groups not items,
every group ends with a runnable command.}

## Degradation Strategy

| Issue              | Action                                    |
| ------------------ | ----------------------------------------- |
| {partial input}    | {do what's possible, state the gap}       |
| {unknown format}   | {generic path, flag it}                   |

## Example

**User:** "{realistic request}"

{Realistic input → what the skill produces. One example, worked fully,
beats four sketched.}

## Resources

- [references/{file}.md](references/{file}.md) — {what depth lives there}
- {Official docs link}
- Siblings: `{skill}` ({relationship})
```

## Fixture Testing Pattern for Scripts

Every script ships with proof it runs. The pattern:

```bash
# 1. One fixture per input format the script claims to handle
mkdir -p /tmp/fixtures && cd /tmp/fixtures
cat > case-a.json << 'EOF'
{realistic sample — copied from a real run, then anonymized}
EOF
cat > case-b.txt << 'EOF'
{realistic raw-text sample, including the messy parts}
EOF

# 2. Syntax gate
node --check script.mjs        # or: bash -n script.sh

# 3. Run against every fixture; assert the invariants, not the exact bytes
node script.mjs case-a.json | node -e "
  let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{
    const j=JSON.parse(d);
    if (j.totals.failed !== 3) { console.error('FAIL: expected 3'); process.exit(1); }
    console.log('OK case-a');
  })"
```

Rules learned the hard way:

- **Fixtures come from reality.** Invented samples miss the messy parts — the `== 200\nFAILED` line that breaks your summary regex lives only in real output.
- **Test the default path.** This suite once shipped scripts where only the *non-default* type worked — every happy-path demo had used the same argument.
- **Numbers in output get asserted**, not eyeballed. "Looks right" missed `failed: 200`.
- Keep one smoke test per script in CI (see `.github/workflows/validate.yml` for the inline pattern).

## Description Quality Test

Before shipping, check the description against these:

1. Could the agent decide to activate from the description **alone**? (It has nothing else.)
2. Does it include the situational trigger — what the *conversation looks like* when the skill applies, not just magic phrases?
3. Are trigger phrases in both languages your users actually type?
4. Is it under 1024 characters?
5. Read it as a stranger: does it promise exactly what the body delivers? Over-promising descriptions cause misfires that erode trust in the whole suite.
