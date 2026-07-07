# Tool Compatibility: AGENTS.md and Tool-Specific Files

AGENTS.md is the cross-tool standard, and many agents (OpenAI Codex, Cursor, Devin, Jules, Amp, and others) read it natively. Some tools still look for their own file first. This reference shows how to keep **one source of truth** (AGENTS.md) and point everything else at it.

**Golden rule: never maintain two divergent instruction files.** Duplicated content drifts, and an agent following the stale copy is worse than an agent with no instructions.

## Tool-Specific Files

| Tool           | Native file                        | Reads AGENTS.md?                  | Strategy                              |
| -------------- | ---------------------------------- | --------------------------------- | ------------------------------------- |
| Claude Code    | `CLAUDE.md`                        | Not directly                      | Symlink or `@AGENTS.md` import        |
| GitHub Copilot | `.github/copilot-instructions.md`  | No                                | Pointer file                          |
| Cursor         | `.cursor/rules/` (`.cursorrules` legacy) | Recent versions: yes        | Prefer native AGENTS.md; else pointer |
| Gemini CLI     | `GEMINI.md`                        | Configurable                      | Set `contextFileName` to AGENTS.md    |
| Windsurf       | `.windsurf/rules/`                 | Check current version             | Pointer file                          |
| Aider          | `CONVENTIONS.md` (via config)      | Via config                        | Add AGENTS.md to `read:` in config    |
| OpenAI Codex   | `AGENTS.md`                        | ✅ Native                         | Nothing to do                         |

Verify against each tool's current docs before wiring — native AGENTS.md support is spreading quickly, and a pointer file may already be unnecessary.

## Strategy 1: Symlink (cleanest on macOS/Linux)

```bash
ln -s AGENTS.md CLAUDE.md
git add CLAUDE.md
```

One file on disk, two names. **Caveats:** on Windows, symlinks require developer mode or `core.symlinks=true`, and some CI checkouts materialize them as plain text files containing the path. If the team includes Windows users, prefer Strategy 2.

## Strategy 2: Import / Pointer File

**Claude Code** supports imports in CLAUDE.md with `@path` syntax:

```markdown
<!-- CLAUDE.md -->
@AGENTS.md
```

**Tools without import syntax** get a one-line pointer:

```markdown
<!-- .github/copilot-instructions.md -->
Follow the instructions in [AGENTS.md](../AGENTS.md).
```

Pointer files are boring and that's the point: no content to drift.

## Strategy 3: Configuration

**Gemini CLI** — point it at AGENTS.md in `.gemini/settings.json`:

```json
{
  "contextFileName": "AGENTS.md"
}
```

**Aider** — in `.aider.conf.yml`:

```yaml
read: AGENTS.md
```

## Tool-Specific Extras

Sometimes a tool genuinely needs tool-specific rules (e.g., Claude Code hook descriptions, Cursor rule globs). Keep the shared truth in AGENTS.md and add only the tool-specific delta in the tool's file, below the import/pointer:

```markdown
<!-- CLAUDE.md -->
@AGENTS.md

<!-- Claude Code specific -->
- Use the project verify skill before committing.
```

## Migration: Existing CLAUDE.md → AGENTS.md

If the repo already has a good CLAUDE.md and no AGENTS.md:

1. `git mv CLAUDE.md AGENTS.md`
2. Create the pointer: `echo "@AGENTS.md" > CLAUDE.md`
3. Review the content — CLAUDE.md files often accumulate tool-specific or stale rules; prune while migrating
4. Commit both files together

The repo instantly becomes usable by every AGENTS.md-aware tool, and Claude Code behavior is unchanged.
