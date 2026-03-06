# Known Issues Shared Template

Target file: `{scope}/docs/known-issues.md`

## Required Sections

- `# Known Issues`
- `## Scope`
- `## Confidence Note`
- `## Status Model`
- `## Known Issues`
- `## Future Clarifications`
- `## Sources Inspected`

## Template Skeleton

```markdown
# Known Issues

## Scope

- Target: [whole repository | app | package | service]
- Docs location: `{scope}/docs/`

## Confidence Note

- Confirmed from repository evidence: [short summary]
- Needs confirmation: [gaps that could not be verified]

## Status Model

| Status                | Meaning                                         |
| --------------------- | ----------------------------------------------- |
| `open`                | Newly identified and not yet triaged.           |
| `known`               | Confirmed and acknowledged by the team.         |
| `accepted`            | Intentionally tolerated for now.                |
| `deferred`            | Valid issue, but postponed for later work.      |
| `needs-clarification` | Requires more information or a future decision. |
| `monitoring`          | Being watched for change or impact.             |
| `resolved`            | Previously known, now considered closed.        |

## Known Issues

### KI-001: [Short Title]

- Status: `[open | known | accepted | deferred | needs-clarification | monitoring | resolved]`
- Category: `[architecture | api | data | ops | docs | tooling | other]`
- Affects: `[module, service, document, or path]`
- Detected by: `[validation | cleanup | analysis | manual review]`

**Summary**

[What the issue is and why it matters]

**Evidence**

- `[path/to/file-or-dir]` — [why it matters]

**Current Handling**

[How the project or team currently treats this issue, if known]

**Future Clarification or Review**

- Clarification needed: [what remains unclear]
- Re-evaluate when: [event, milestone, or condition]
- Notes: [optional review notes]

## Future Clarifications

| Issue ID | Clarification Needed | Re-evaluate When |
| -------- | -------------------- | ---------------- |
| KI-001   | [pending detail]     | [trigger]        |

## Sources Inspected

- `[path/to/file-or-dir]` — [why it matters]
```
