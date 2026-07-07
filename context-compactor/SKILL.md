---
name: context-compactor
description: >
  Context compaction system to avoid saturating the context window.
  Saves decisions, steps, and context into organized markdown files under .context/.
  Trigger: when the user says "save context", "compact", "offload", "guardar contexto",
  "compactar", or when the conversation gets very long.
license: MIT
metadata:
  author: jrodrigopuca
  version: "2.0"
---

## When to Use

- When the context window is close to running out
- When there are important decisions worth documenting
- When a process has more steps than fit in context
- When the user says "save this", "compact", "offload"
- To save state before large changes
- At the end of long sessions, to summarize

## Installation (once)

```bash
# 1. Copy scripts to ~/.local/bin/
# {SKILL_DIR} = directory where this skill is installed, for example:
#   Claude Code: ~/.claude/skills/context-compactor
#   opencode:    ~/.config/opencode/skill/context-compactor
mkdir -p ~/.local/bin
cp -r {SKILL_DIR}/assets/scripts/* ~/.local/bin/
chmod +x ~/.local/bin/cc*

# 2. Add aliases to ~/.zshrc
cat >> ~/.zshrc << 'EOF'

# Context Compactor - context compaction commands
alias ccinit="~/.local/bin/ccinit"
alias ccsave="~/.local/bin/ccsave"
alias ccnote="~/.local/bin/ccnote"
alias cclist="~/.local/bin/cclist"
alias ccgrep="~/.local/bin/ccgrep"
EOF

# 3. Reload shell
source ~/.zshrc
```

**Fallback without scripts**: if the `cc*` commands are not installed, do not block the user. Create the files directly under `.context/{decisions,steps,context}/` with the write tool, using the templates below and the filename format `YYYY-MM-DD-kebab-title.md`.

## Commands

| Command  | Description                          | Example                              |
| -------- | ------------------------------------ | ------------------------------------ |
| `ccinit` | Initialize .context in the project   | `ccinit`                             |
| `ccsave` | Quick context save                   | `ccsave "title" "content" decision`  |
| `ccnote` | Create note from full template       | `ccnote "process title" steps`       |
| `cclist` | List all notes                       | `cclist` or `cclist decision`        |
| `ccgrep` | Search across all notes              | `ccgrep "jwt"`                       |

### Detailed usage

```bash
# Initialize in a project (once)
ccinit

# Quick save
ccsave "JWT auth" "We chose JWT with refresh tokens for simplicity" decision

# Create note from template
ccnote "Local development setup" steps
ccnote "Payments architecture" decision

# See what is saved
cclist              # everything
cclist decision     # decisions only
cclist steps        # steps only

# Search
ccgrep "auth"
ccgrep "2026"
```

## File Structure

```
{workdir}/
└── .context/
    ├── README.md
    ├── decisions/
    │   ├── 2026-01-15-auth-architecture.md
    │   └── 2026-02-20-database-choice.md
    ├── steps/
    │   └── 2026-01-10-local-setup.md
    └── context/
        └── 2026-01-05-project-kickoff.md
```

## Note Types

### 1. Decision (decisions/)

For important decisions with context and consequences.

**Automatic template**:

```markdown
# Decision: {title}

> Date: {timestamp}

## Context

{Why was this decision made?}

## Options considered

- **Option A**: ...
- **Option B**: ...

## Final decision

{What was chosen and why}

## Consequences

- Positive: ...
- Negative: ...

## Status

- [ ] Pending
- [ ] Implemented

## Tags

#context #decision
```

### 2. Steps (steps/)

For processes and procedures.

**Automatic template**:

```markdown
# Steps: {title}

> Date: {timestamp}

## Goal

{What this achieves}

## Step 1: {title}

**Action**: ...
**Result**: ...

## Verification

{How to confirm}

## Troubleshooting

- Problem: ...
  - Solution: ...
```

### 3. Context (context/)

For general state and information.

**Automatic template**:

```markdown
# Context: {title}

> Date: {timestamp}

## Current state

{What is happening}

## Key information

- ...

## Open questions

- [ ] ...

## Next steps

- [ ] ...
```

## Golden Rules

1. **Always ask before compacting** - never save anything without the user's approval
2. **Be specific with titles** - "auth-flow-jwt" > "note1"
3. **Save the "why"** - future context will need to understand the decisions
4. **Use the templates** - consistency makes searching easier later
5. **Reference from chat** - when you save something, say "Saved it to .context/decisions/auth-flow.md"
6. **The user is the owner** - these are their notes; they can edit or delete anything

## Compaction Workflow

```
1. Identify what to compact
2. Choose the type (decision/step/context)
3. Create the file (ccnote or ccsave, or write it directly as fallback)
4. Summarize the essentials in 2-3 lines
5. Reference the file in chat
6. SHOW the user where it landed
```

## Usage Example

**User**: "Save what we did about the auth architecture"

**You**: "Saving it. Should it be a decision, steps, or general context?"

**User**: "Decision"

**You**: (runs it) → Done, saved to `.context/decisions/2026-01-auth-architecture.md`.

```
Decision: Auth Architecture
├── We chose JWT with refresh tokens
├── Because it is simple and scalable
└── Tags: #context #decision #auth
```

**User**: "Perfect, I'll check it later"

**You**: "Whenever you want to see everything saved use `cclist`, or search for something specific with `ccgrep 'auth'`"

## Assets

- **Scripts**: See [scripts/](assets/scripts/) for the bash scripts
- **Template**: See [assets/template.md](assets/template.md) for the general template
