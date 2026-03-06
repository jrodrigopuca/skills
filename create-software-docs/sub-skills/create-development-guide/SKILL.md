---
name: create-development-guide
description: Generate a development guide for the selected scope using only repository-evidenced setup, environment, run, test, lint, and build instructions. | Genera una guía de desarrollo para el alcance seleccionado usando solo instrucciones de setup, entorno, ejecución, test, lint y build evidenciadas por el repositorio.
license: MIT
---

# Create Development Guide

Generate `{scope}/docs/development-guide.md`.

## Responsibilities

- describe prerequisites and local setup
- document environment variables when evidenced
- list real run, test, lint, and build commands
- mention operational and safety notes for development
- record common issues visible from the repository

## Rules

- Never invent commands.
- Prefer commands from scripts, Makefiles, Dockerfiles, CI config, or task runners.
- If a step cannot be verified, label it `Needs confirmation`.
- Include `Sources Inspected`.

See the shared template at [../../references/templates/development-guide.md](../../references/templates/development-guide.md), the shared conventions at [../../references/templates/common.md](../../references/templates/common.md), and the local specialization at [references/template.md](references/template.md).
