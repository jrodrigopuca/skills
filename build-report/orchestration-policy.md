# Build Report Orchestration Policy

Policy document defining orchestration rules, context loading strategy, fast paths, activation rules, and degradation modes.

**Load this file:** Only during planning phase or when determining workflow strategy.

---

## Context Loading Strategy

### Core Principle

**Load only what you need for the current step.** The build-report skill has ~76 KB of material. Loading all of it for every step wastes context.

### Files and When to Load Them

| File                           | Size  | Load When                                                       |
| ------------------------------ | ----- | --------------------------------------------------------------- |
| `SKILL.md` (orchestrator)      | ~5 KB | **Always** - Lightweight workflow coordinator                   |
| `orchestration-policy.md`      | ~3 KB | **Planning phase only** - Determine workflow path               |
| `contracts/artifacts.md`       | ~9 KB | **Reference only** - Load if validating artifact shape          |
| `sub-skills/parse-*.md`        | ~4 KB | **Parse step only**                                             |
| `sub-skills/analyze-*.md`      | ~4 KB | **Analysis step only**                                          |
| `sub-skills/generate-*.md`     | ~4 KB | **Report generation step only**                                 |
| `templates/report-template.md` | ~6 KB | **Report generation step only**                                 |
| `references/nodejs-parsers.md` | 19 KB | **Only if custom/complex parsing needed** (rare)                |
| `references/error-docs-map.md` | 16 KB | **Analysis step** - For doc link mapping                        |
| `references/report-examples.md` | 24 KB | **Never during execution** - Training examples only, not needed |

### Token Budget per Step

| Step                | Files Loaded                                  | Est. Tokens |
| ------------------- | --------------------------------------------- | ----------- |
| **Planning**        | SKILL.md + orchestration-policy.md            | ~2,000      |
| **Parse**           | SKILL.md + parse sub-skill                    | ~2,500      |
| **Analyze**         | SKILL.md + analyze sub-skill + error-docs-map | ~7,000      |
| **Generate Report** | SKILL.md + generate sub-skill + template      | ~3,500      |
| **Total (3 steps)** | -                                             | **~15,000** |

**Compare to v1.0:** Loading everything = ~19,000 tokens. **Savings: 21%**

### Hard Constraints

- **For 32K context models:** Skip `references/nodejs-parsers.md` unless explicitly needed for custom tools
- **For 64K+ context models:** Load all necessary files per step
- **Build output itself:** Can be 10K-50K+ tokens. Plan accordingly.

---

## Workflow Paths

### Path Selection

Determine path based on initial assessment:

```
if errors + warnings < 10:
  → FAST PATH (3 steps: parse → quick analyze → summary)
elif errors + warnings < 100:
  → STANDARD PATH (3 steps: parse → full analyze → full report)
else:
  → SAMPLED PATH (3 steps: parse → sampled analyze → sampled report)
```

### Fast Path (< 10 issues)

**Use case:** Quick builds with few issues, need rapid feedback

**Workflow:**
1. **Parse** (minimal): Extract errors, basic categorization, no deep pattern detection
2. **Quick Analyze**: Simple grouping by error code, basic priority assignment
3. **Summary Report**: Executive summary + top issues + immediate actions only

**Sections included:**
- ✅ Result status + metrics
- ✅ Executive summary
- ✅ Top 3 issues (inline, no grouping detail)
- ✅ Immediate actions
- ❌ Detailed error groups
- ❌ Configuration suggestions
- ❌ Code context

**Time estimate:** 1-2 minutes

### Standard Path (10-100 issues)

**Use case:** Typical build failures, need full analysis and actionable report

**Workflow:**
1. **Parse** (standard): Full extraction with context, categorization, tool detection
2. **Full Analyze**: Grouping by pattern, root cause analysis, cascading error detection, priority assignment
3. **Full Report**: Complete structured report with all sections

**Sections included:**
- ✅ Result status + metrics
- ✅ Executive summary with analysis
- ✅ Detailed error groups with doc links
- ✅ Warning groups
- ✅ Cascading error explanation (if detected)
- ✅ Next steps (immediate + backlog)
- ⚠️ Configuration suggestions (if applicable - see activation rules)
- ⚠️ Code context (if requested or < 5 critical errors)

**Time estimate:** 3-5 minutes

### Sampled Path (100+ issues)

**Use case:** Large builds with many issues, need manageable report with insights

**Workflow:**
1. **Parse** (with truncation awareness): Extract first 100 errors, collect summary stats
2. **Sampled Analyze**: Group all errors, but detail only top 10 groups by priority+count
3. **Sampled Report**: Summary-heavy report with top issues highlighted

**Sections included:**
- ✅ Result status + metrics (with "truncated" note)
- ✅ Executive summary emphasizing patterns
- ✅ Top 10 error groups (others listed as summary stats)
- ✅ Distribution analysis (which modules most affected)
- ✅ Immediate actions (top 3 fixes to try first)
- ❌ Detailed listings of all errors
- ❌ Configuration suggestions (too many issues, focus on fixes first)
- ❌ Code context

**Note in report:** "This report shows the top 10 error patterns. [N] additional error types detected. Fix top issues and re-run for updated analysis."

**Time estimate:** 2-4 minutes (faster than standard despite more issues)

---

## Activation Rules

### Configuration Suggestions

**Activate when:**
- ✅ 3+ errors of the same type (suggests config could prevent)
- ✅ Recurring pattern across 5+ files (suggests project-wide setting needed)
- ✅ TypeScript `any` errors (suggests strict mode not enabled)
- ✅ ESLint auto-fixable warnings > 20 (suggests pre-commit hook)

**Skip when:**
- ❌ Fast path (too early for config changes)
- ❌ Sampled path (too many issues, focus on fixes first)
- ❌ Build successful with < 5 warnings

### Code Context

**Activate when:**
- ✅ < 5 critical errors total
- ✅ User explicitly requests it
- ✅ Error is in a single location (not scattered)

**Skip when:**
- ❌ > 10 errors (report would be too long)
- ❌ Error pattern is obvious from message (e.g., missing import)
- ❌ Fast path or sampled path

### Cascading Error Analysis

**Activate when:**
- ✅ Multiple errors in same file after a single error
- ✅ Error message suggests dependency (e.g., "Cannot find name 'X'" followed by "Property 'Y' does not exist on type 'X'")
- ✅ Standard or sampled path (analysis phase has time for this)

**Skip when:**
- ❌ Fast path (skip advanced analysis)
- ❌ All errors appear independent

### Root Cause Analysis

**Activate when:**
- ✅ Standard or sampled path
- ✅ 3+ errors with similar pattern

**Skip when:**
- ❌ Fast path (basic grouping only)
- ❌ Each error is unique (no pattern to analyze)

---

## Degradation Strategy

### When to Degrade

| Situation                                    | Degradation Action                                             |
| -------------------------------------------- | -------------------------------------------------------------- |
| Build output > 50K tokens                    | Truncate to first 1000 errors, note in report                  |
| Context budget exceeded (model < 32K)        | Skip `nodejs-parsers.md`, use built-in basic parsing           |
| Parsing fails for a tool                     | Mark as "unparsed" in report, show raw output snippet          |
| Error-docs-map missing error code            | Show generic message, link to tool's main documentation        |
| 500+ errors after parsing                    | Force sampled path even if user requested standard             |
| Report generation > 2000 lines               | Switch to sampled mode, warn user                              |
| Unknown build tool detected                  | Generic parse (file:line - message), note tool not recognized |
| CI/CD context extraction fails (no branch)   | Skip metadata, report works without it                         |

### Graceful Failures

**Principle:** Always produce *something* useful, even if not perfect.

**Fallback chain:**
1. **Best case:** Full structured report with all sections
2. **Good case:** Partial report with manual sections for unparsed content
3. **Acceptable case:** Summary report with raw output appended
4. **Last resort:** "Build output could not be parsed. Here's the raw output: [...]"

### Error Handling in Sub-Skills

Each sub-skill should:
- ✅ Validate input artifact shape
- ✅ Return partial result if processing fails midway (better than nothing)
- ✅ Include `warnings` field in output artifact for degradation notes
- ✅ Never throw fatal errors - always produce artifact

Example:

```json
{
  "errors": [ /* parsed errors */ ],
  "warnings": [
    "Webpack output could not be fully parsed - some errors may be missing",
    "Error code TS9999 not found in documentation map - generic link provided"
  ]
}
```

---

## Workflow Coordination Rules

### Sub-Agent Invocation

**Pattern:**

```
Orchestrator:
1. Determine path (fast/standard/sampled)
2. Launch parse sub-skill with path context
3. Wait for parsed artifact
4. Launch analyze sub-skill with parsed artifact + path context
5. Wait for analyzed artifact
6. Launch generate sub-skill with analyzed artifact + path context + activation rules
7. Present final report to user
```

### Artifact Passing

- **In-memory:** Pass artifacts as JSON between sub-skills (default)
- **File-based:** Write to `.build-report/artifacts/` if caching requested
- **Always validate:** Check artifact shape before passing to next sub-skill

### User Checkpoints

**Fast path:** No checkpoints (direct to final report)

**Standard path:**
- Checkpoint after parse: Show summary stats, ask if full report needed
- Proceed to analyze + generate

**Sampled path:**
- Checkpoint after parse: Show "100+ errors detected, generating sampled report"
- Proceed to sampled analyze + generate

### Parallelization

**Not recommended** for build-report workflow. Steps are sequential by design:
- Parse produces artifact needed by analyze
- Analyze produces artifact needed by generate

Exception: If generating multiple report variants (e.g., summary + full), generate steps can run in parallel.

---

## Version Policy

This orchestration policy is versioned with the skill:

- **v2.0** (2024-03-09): Initial policy with sub-skill architecture
- Future versions will note breaking changes to workflow or activation rules

---

## Usage in Orchestrator

The orchestrator SKILL.md should:

1. Reference this policy for path selection
2. Apply activation rules when invoking `generate-report`
3. Follow degradation strategy if issues arise
4. Load this file **only during planning** - not during execution steps

Example orchestrator logic:

```markdown
## Workflow

1. **Planning Phase**
   - Load `orchestration-policy.md`
   - Assess build output size and error count
   - Determine path: fast / standard / sampled

2. **Execution Phase**
   - Load only step-specific files per Context Loading Strategy
   - Invoke sub-skills sequentially
   - Pass artifacts between steps
   - Apply activation rules when generating report

3. **Delivery Phase**
   - Present final report to user
   - Offer options (e.g., "Want detailed error analysis for Group 1?")
```
