# Document Templates

Structural templates for each documentation file. Copy the relevant template and fill in content from codebase analysis.

All generated files should live under `{scope}/docs/`, where `{scope}` is the repository root or the selected app/package/service root.

## Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Development Guide](#development-guide)
- [ADR (Decision Record)](#adr-decision-record)
- [Runbook — Operational](#runbook--operational)
- [Runbook — Troubleshooting](#runbook--troubleshooting)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Glossary](#glossary)

---

## Project Overview

````markdown
# [Project Name]

## Scope

- Target: [whole repository | app | package | service]
- Boundary: [what is included and excluded]
- Docs location: `{scope}/docs/`

## Confidence Note

- Confirmed from repository evidence: [short summary]
- Inferred from repository structure or conventions: [short summary]
- Needs confirmation: [gaps that could not be verified]

## Summary

[1-2 paragraphs: what the project does, its purpose, and who uses it]

## Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Language       | [e.g., TypeScript, Python, Go]    |
| Framework      | [e.g., Express, Django, Gin]      |
| Database       | [e.g., PostgreSQL, MongoDB]       |
| Infrastructure | [e.g., Docker, AWS, Vercel]       |
| CI/CD          | [e.g., GitHub Actions, GitLab CI] |

## Repository Structure

```text
project-root/
├── [dir]/          ← [purpose]
├── [dir]/          ← [purpose]
├── [dir]/          ← [purpose]
├── [config-file]   ← [purpose]
└── README.md
```

## Key Modules

| Module | Purpose          | Location  |
| ------ | ---------------- | --------- |
| [Name] | [Responsibility] | `[path/]` |
| [Name] | [Responsibility] | `[path/]` |
| [Name] | [Responsibility] | `[path/]` |

## Documentation

- Base path: `{scope}/docs/`
- [Architecture](architecture.md)
- [Development Guide](development-guide.md)
- [Decision Records](decisions/)
- [Runbooks](runbooks/)
- [Data Model](data-model.md)
- [API Reference](api-reference.md)
- [Glossary](glossary.md)

## Sources Inspected

- `[path/to/file-or-dir]` — [why it matters]
- `[path/to/file-or-dir]` — [why it matters]
````

---

## Architecture

````markdown
# Architecture

## Scope

- Target: [whole repository | app | package | service]
- Boundary: [what is included and excluded]
- Docs location: `{scope}/docs/`

## Confidence Note

- Confirmed from repository evidence: [short summary]
- Inferred from repository structure or conventions: [short summary]
- Needs confirmation: [gaps that could not be verified]

## Overview

[1-2 paragraphs: architecture style, key design principles, high-level description]

## Architecture Style

- Pattern: [layered | event-driven | monolith | microservices | serverless | other]
- Complexity: [simple | medium | complex]
- Rationale: [why this classification fits the observed repository]

## System Context (omit if not applicable)

[Who/what interacts with this system — users, external services, other systems]

```mermaid
[System context diagram — see references/diagrams.md]
```

## Containers (omit if not applicable)

[Major deployable units and how they communicate]

```mermaid
[Container diagram — see references/diagrams.md]
```

## Components

[Internal module structure and dependencies]

```mermaid
[Component diagram — see references/diagrams.md]
```

## Key Flows

[Critical paths through the system — e.g., authentication, main business operation]

```mermaid
[Sequence diagram — see references/diagrams.md]
```

## Cross-Cutting Concerns

| Concern        | Approach                         |
| -------------- | -------------------------------- |
| Authentication | [How auth is handled]            |
| Logging        | [Logging strategy]               |
| Error handling | [Error handling approach]        |
| Caching        | [Caching strategy, if any]       |
| Monitoring     | [Observability approach, if any] |

## Security and Operations

| Area               | Notes                                            |
| ------------------ | ------------------------------------------------ |
| Secrets/config     | [How secrets are managed]                        |
| Background jobs    | [Workers, schedulers, queues]                    |
| Backup/restore     | [If observable]                                  |
| Operational limits | [Rate limits, maintenance windows, manual steps] |

## Deployment (omit if not applicable)

[How and where the system is deployed]

```mermaid
[Deployment diagram — see references/diagrams.md, if applicable]
```

## Constraints and Trade-offs

- [Constraint/trade-off 1 and why it exists]
- [Constraint/trade-off 2 and why it exists]

## Sources Inspected

- `[path/to/file-or-dir]` — [why it matters]
- `[path/to/file-or-dir]` — [why it matters]
````

---

## Development Guide

````markdown
# Development Guide

## Scope

- Target: [whole repository | app | package | service]
- Docs location: `{scope}/docs/`

## Confidence Note

- Confirmed from repository evidence: [short summary]
- Needs confirmation: [gaps that could not be verified]

## Prerequisites

- [Tool/runtime] version [X]+
- [Tool] version [X]+
- [Account/access] for [service]

## Setup

```bash
# Clone
git clone [repo-url]
cd [project-name]

# Install dependencies
[install command]

# Configure environment
cp .env.example .env

# Edit .env with your values
```

## Environment Variables

| Variable     | Description    | Required | Default        |
| ------------ | -------------- | -------- | -------------- |
| `[VAR_NAME]` | [What it does] | Yes/No   | [default or -] |
| `[VAR_NAME]` | [What it does] | Yes/No   | [default or -] |

## Running Locally

```bash
[dev server command]
```

Available at: `[http://localhost:port]`

## Testing

```bash
# Run all tests
[test command]

# Run specific tests
[specific test command]
```

## Linting and Formatting

```bash
[lint command]
[format command]
```

## Building

```bash
[build command]
```

## Security and Operational Notes

- [How to handle secrets locally]
- [Required services such as databases, queues, or emulators]
- [Migration/seed order, if applicable]
- [Safety warnings for destructive local commands]

## Common Issues

| Issue     | Solution |
| --------- | -------- |
| [Symptom] | [Fix]    |
| [Symptom] | [Fix]    |

## Sources Inspected

- `[path/to/file-or-dir]` — [why it matters]
- `[path/to/file-or-dir]` — [why it matters]
````

---

## ADR (Decision Record)

MADR format — Markdown Any Decision Record.

**Naming convention:** `NNN-short-kebab-case-title.md` (e.g., `001-adopt-layered-architecture.md`)

```markdown
# ADR-NNN: [Title of Decision]

## Status

[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Date

[YYYY-MM-DD]

## Scope

[Whole repository | app | package | service]

## Docs Location

`{scope}/docs/decisions/`

## Evidence Level

- Direct evidence: [files, issues, docs, commits, config]
- Reconstructed from repository state: [what had to be inferred]
- Needs confirmation: [what could not be verified]

## Context

[What situation prompted this decision? What problem are we solving?
What constraints exist?]

## Decision Drivers

- [Driver 1]
- [Driver 2]
- [Driver 3]

## Considered Options

### Option 1: [Name]

- ✅ [Advantage]
- ❌ [Disadvantage]

### Option 2: [Name]

- ✅ [Advantage]
- ❌ [Disadvantage]

## Decision Outcome

**Chosen option:** "[Option N]" because [justification].

> If the rationale is reconstructed rather than documented explicitly, say so clearly here.

### Consequences

**Positive:**

- [Benefit]

**Negative:**

- [Trade-off and how it's mitigated]

## Sources Inspected

- `[path/to/file-or-dir]` — [why it matters]

## Links

- [Related ADR, RFC, issue, or discussion]
```

---

## Runbook — Operational

````markdown
# Runbook: [Title]

## Runbook Type

Operational

## Docs Location

`{scope}/docs/runbooks/`

## Overview

[What this runbook covers — 1-2 sentences]

## Trigger Conditions

- [When this runbook should be used]

## Prerequisites

- [ ] Access to [system/service]
- [ ] [Tool] installed
- [ ] [Permission/role] required

## Procedure

### Step 1: [Action title]

⚠️ **Warning:** [Safety concern, if any]

[What this step does and why]

```bash
[exact command]
```

### Step 2: [Action title]

[Continue...]

## Verification

- [ ] [How to confirm success]

## Rollback

1. [How to undo if something went wrong]

## Escalation

| Contact     | Role   | Channel   |
| ----------- | ------ | --------- |
| [Name/Team] | [Role] | [Channel] |

## Sources Inspected

- `[path/to/file-or-dir]` — [why it matters]
````

---

## Runbook — Troubleshooting

````markdown
# Runbook: [Title]

## Runbook Type

Troubleshooting

## Docs Location

`{scope}/docs/runbooks/`

## Overview

[What this runbook covers — 1-2 sentences]

## Trigger Conditions

- [Alert, symptom, or error condition]

## Prerequisites

- [ ] Access to [system/service]
- [ ] [Tool] installed
- [ ] [Permission/role] required

## Symptoms

- [How to recognize this problem — alert, error message, user report]

## Diagnosis

- [What to inspect before taking action]

## Procedure

### Step 1: [Action title]

⚠️ **Warning:** [Safety concern, if any]

[What this step does and why]

```bash
[exact command]
```

### Step 2: [Action title]

[Continue...]

## Verification

- [ ] [How to confirm success]

## Rollback

1. [How to undo if something went wrong]

## Escalation

| Contact     | Role   | Channel   |
| ----------- | ------ | --------- |
| [Name/Team] | [Role] | [Channel] |

## Post-Incident

- [ ] Write post-mortem if applicable
- [ ] Update this runbook with corrections
- [ ] File preventive tickets

## Sources Inspected

- `[path/to/file-or-dir]` — [why it matters]
````

---

## Data Model

````markdown
# Data Model

## Scope

- Target: [whole repository | app | package | service]
- Docs location: `{scope}/docs/`

## Confidence Note

- Confirmed from repository evidence: [short summary]
- Needs confirmation: [gaps that could not be verified]

## Entity Relationship Diagram

```mermaid
[ER diagram — see references/diagrams.md]
```

## Entities

### [Entity Name]

[Purpose] — Key fields:

| Field   | Type   | Constraints | Description   |
| ------- | ------ | ----------- | ------------- |
| [field] | [type] | PK          | [description] |
| [field] | [type] | FK          | [description] |

[Repeat for each entity]

## Data Lifecycle

[How records are created, updated, archived, deleted]

## Sources Inspected

- `[path/to/file-or-dir]` — [why it matters]
````

---

## API Reference

```markdown
# API Reference

## Scope

- Target: [whole repository | app | package | service]
- Docs location: `{scope}/docs/`

## Confidence Note

- Confirmed from repository evidence: [short summary]
- Needs confirmation: [gaps that could not be verified]

## Base URL

`[base-url-pattern]` — Auth: [method]

## Endpoints

### [Resource Name]

| Method         | Path   | Description   |
| -------------- | ------ | ------------- |
| [GET/POST/...] | [path] | [description] |

[For each endpoint, add request/response shapes and error codes as needed]

## Sources Inspected

- `[path/to/file-or-dir]` — [why it matters]
```

---

## Glossary

```markdown
# Glossary

## Scope

- Target: [whole repository | app | package | service]
- Docs location: `{scope}/docs/`

| Term       | Definition                              |
| ---------- | --------------------------------------- |
| **[Term]** | [Definition in context of this project] |

## Sources Inspected

- `[path/to/file-or-dir]` — [why it matters]
```
