---
name: create-runbooks
description: Generate operational and troubleshooting runbooks for the selected scope using repository-evidenced procedures, verification steps, rollback instructions, and escalation notes. | Genera runbooks operacionales y de troubleshooting para el alcance seleccionado usando procedimientos evidenciados por el repositorio, pasos de verificación, rollback y escalación.
license: MIT
---

# Create Runbooks

Generate files under `{scope}/docs/runbooks/`.

## Responsibilities

- identify operational and troubleshooting scenarios
- document exact evidenced procedures
- include verification, rollback, and escalation
- warn before destructive operations

## Rules

- One action per step.
- Prefer commands from scripts, CI/CD, task runners, and deployment config.
- If a command or sequence cannot be verified, mark it `Needs confirmation`.
- Include `Sources Inspected` in every runbook.

See the shared templates at [../../references/templates/runbook-operational.md](../../references/templates/runbook-operational.md) and [../../references/templates/runbook-troubleshooting.md](../../references/templates/runbook-troubleshooting.md), the shared conventions at [../../references/templates/common.md](../../references/templates/common.md), and the local references [references/operational-template.md](references/operational-template.md) and [references/troubleshooting-template.md](references/troubleshooting-template.md).
