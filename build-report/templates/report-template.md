# Build Report Template

Standard Markdown template for build reports. This template is referenced by the `generate-report` sub-skill.

**Load this file:** Only during report generation step.

---

## Full Report Structure

Use this structure for **Standard Path** builds (10-100 errors):

```markdown
# Build Report - [project-name]

## ✅ Result: [STATUS]

**Status:** ✅ SUCCESS | ⚠️ SUCCESS WITH WARNINGS | 🔴 FAILED
**Duration:** [X]s
**Timestamp:** [date time]
**Branch:** [if available]
**Commit:** [if available]

### Metrics

- Errors: [N]
- Warnings: [N]
- Files with issues: [N]

---

## 📊 Executive Summary

[2-3 sentence summary from AnalyzedErrorsArtifact.analysis]

**Impact:** 🔴 CRITICAL | 🟡 HIGH | 🟢 MEDIUM | ⚪ LOW
**Recommendation:** [Primary action from recommendations.immediate[0]]

### Issues by Category

| Category | Errors | Warnings | Priority |
| -------- | ------ | -------- | -------- |
| Tool 1   | N      | N        | 🔴       |
| Tool 2   | N      | N        | 🟡       |

### Top 3 Issues

1. **[ErrorGroup.pattern]** - [count] occurrences - 🔴 [Priority emoji]
2. **[ErrorGroup.pattern]** - [count] occurrences - 🟡 [Priority emoji]
3. **[ErrorGroup.pattern]** - [count] occurrences - 🟢 [Priority emoji]

---

## 🔴 Errors ([N] total)

[For each ErrorGroup with severity "error", sorted by priority then count]

### [Tool]: [Pattern] ([count] errors)

**Impact:** [ErrorGroup.rootCause or explanation]
**Blocker:** ✅ Yes | ❌ No

#### Error Group [N]: [Pattern] ([count] occurrences)

**Pattern identified:** [ErrorGroup.pattern explanation]

\`\`\`
[file]:[line]:[col] - [code]: [message]
[file]:[line]:[col] - [code]: [message]
\`\`\`

**Files affected:**
- [file 1]
- [file 2]

**Solution hint:**
[ErrorGroup.hint]

**Documentation:**
[For each docLink in ErrorGroup.docLinks]
- [docLink.title](docLink.url)

---

## ⚠️ Warnings ([N] total)

[Similar structure for warning groups]

### [Tool]: [Pattern] ([count] warnings)

**Impact:** [Description]
**Auto-fixable:** ✅ Yes | ⚠️ Partially | ❌ No

#### Warning Group [N]: [Pattern] ([count] occurrences)

\`\`\`
[file]:[line]:[col] - [code]: [message]
\`\`\`

**Solution hint:**
[ErrorGroup.hint]

**Documentation:**
- [Links]

---

## 🚀 Next Steps

### Immediate Action (Critical)

[For each action in recommendations.immediate]
1. ✅ [action.description] - Estimated: [action.estimatedTime]
   - Files: [action.files.join(", ")]

### Backlog (Important)

[For each action in recommendations.backlog]
- [ ] [action.description]

### Useful Commands

\`\`\`bash
# Re-run build
[metadata.buildCommand]

# Type check only (TypeScript)
npx tsc --noEmit

# Lint and auto-fix (ESLint)
npx eslint . --fix
\`\`\`

---

[Optional sections based on activation rules - see orchestration-policy.md]
```

---

## Quick Summary Structure

Use this structure for **Fast Path** builds (< 10 errors):

```markdown
# Build Report - [project-name]

## ✅ Result: [STATUS]

**Status:** [emoji + text]
**Errors:** [N] | **Warnings:** [N]
**Duration:** [X]s

---

## 📊 Quick Summary

[1-2 sentence summary]

**Impact:** [emoji + level]

### Top Issues

1. **[pattern]** - [count] in [files]
2. **[pattern]** - [count] in [files]
3. **[pattern]** - [count] in [files]

---

## 🚀 Immediate Actions

1. ✅ [action] - [time estimate]
2. ✅ [action] - [time estimate]

### Useful Commands

\`\`\`bash
[buildCommand]
\`\`\`

---

_Run with `--full-report` for detailed analysis._
```

---

## Sampled Report Structure

Use this structure for **Sampled Path** builds (100+ errors):

```markdown
# Build Report - [project-name]

## ✅ Result: [STATUS]

**Status:** 🔴 FAILED
**Errors:** [N] | **Warnings:** [N]
**Duration:** [X]s

⚠️ **Note:** This build has a large number of errors. This report shows the top 10 error patterns. [N] additional error types were detected.

---

## 📊 Executive Summary

[Summary emphasizing patterns and root causes]

**Impact:** 🔴 CRITICAL
**Strategy:** Fix top issues first, then re-run for updated analysis

### Error Distribution

| Tool       | Errors | Warnings | % of Total |
| ---------- | ------ | -------- | ---------- |
| TypeScript | N      | N        | XX%        |
| ESLint     | N      | N        | XX%        |
| Webpack    | N      | N        | XX%        |

### Most Affected Modules

1. [module] - [N] errors
2. [module] - [N] errors
3. [module] - [N] errors

---

## 🔴 Top 10 Error Patterns

[For top 10 ErrorGroups only]

### 1. [Tool]: [Pattern] ([count] errors)

**Root cause:** [ErrorGroup.rootCause]
**Affected files:** [count] files

**Solution hint:** [ErrorGroup.hint]

**Documentation:** [docLinks]

---

[Repeat for top 10]

---

## 📊 Additional Errors

[N] additional error types detected but not detailed in this report:

- [ErrorGroup.pattern]: [count] occurrences
- [ErrorGroup.pattern]: [count] occurrences
- ...

---

## 🚀 Next Steps

### Start Here

1. ✅ [Top action from recommendations.immediate]
2. ✅ [Second top action]
3. ✅ [Third top action]

**After fixing these, re-run build for updated analysis.**

### Useful Commands

\`\`\`bash
[buildCommand]
\`\`\`
```

---

## Optional Sections

### Code Context Section

**Activation:** See orchestration-policy.md activation rules

```markdown
## 📝 Code Context

[For selected errors where code context is helpful]

### Error in [file]:[line]

**Current code:**
\`\`\`typescript
// [file]:[line]
[code snippet with error highlighted]
\`\`\`

**Issue:** [Explanation]

**Suggested fix:**
\`\`\`typescript
[code snippet with fix]
\`\`\`
```

### Configuration Suggestions Section

**Activation:** See orchestration-policy.md activation rules

```markdown
## ⚙️ Configuration Suggestions

Based on recurring issues, consider:

[For each recurring pattern that suggests config change]

**[N]. [Suggestion title]**

\`\`\`json
// [config file]
{
  [config snippet]
}
\`\`\`

**Why:** [Explanation of how this prevents the recurring issue]

**Documentation:** [Link to config docs]
```

### Cascading Errors Section

**Activation:** See orchestration-policy.md activation rules

```markdown
## 🔗 Cascading Errors Detected

[For each CascadingError in AnalyzedErrorsArtifact.cascadingErrors]

### Root Error: [pattern]

\`\`\`
[rootError.file]:[line] - [rootError.message]
\`\`\`

**Causes these errors:**
- [causedError.file]:[line] - [causedError.message]
- [causedError.file]:[line] - [causedError.message]

**Fix strategy:** Resolve the root error first. The dependent errors will likely disappear automatically.
```

---

## Template Variables

When using this template, populate with data from `AnalyzedErrorsArtifact`:

| Variable                      | Source                                     |
| ----------------------------- | ------------------------------------------ |
| `[project-name]`              | Derived from metadata.buildCommand or cwd  |
| `[STATUS]`                    | Based on metadata.exitCode                 |
| `[N]` (error count)           | summary.totalErrors                        |
| `[X]s` (duration)             | metadata.duration                          |
| `[Tool]`                      | ErrorGroup.tool                            |
| `[Pattern]`                   | ErrorGroup.pattern                         |
| `[count]`                     | ErrorGroup.count                           |
| `[Priority emoji]`            | Based on ErrorGroup.priority               |
| `[ErrorGroup.hint]`           | ErrorGroup.hint                            |
| `[docLinks]`                  | ErrorGroup.docLinks                        |
| `[action.description]`        | recommendations.immediate[].description    |
| `[action.estimatedTime]`      | recommendations.immediate[].estimatedTime  |
| `[AnalyzedErrorsArtifact.*]`  | See contracts/artifacts.md for full schema |

---

## Formatting Guidelines

### Icons and Emojis

Use consistently:

- ✅ Success / Yes / Action item
- ⚠️ Warning / Partially
- 🔴 Critical / Failed
- 🟡 High priority
- 🟢 Medium priority
- ⚪ Low priority
- ❌ No / Error
- 📊 Summary / Stats
- 🚀 Next steps / Actions
- 📝 Code / Details
- ⚙️ Configuration
- 🔗 Relationships / Links

### Code Blocks

Use appropriate language tags:

- `typescript` for TS/JS code
- `json` for config files (tsconfig, eslintrc)
- `bash` for commands

### Links

Always use Markdown links with descriptive text:

✅ `[TypeScript Type Compatibility](url)`  
❌ `url` (raw URL)

### Severity Colors

In tables and lists, use emoji for visual scanning:

- 🔴 for errors/critical
- ⚠️ for warnings
- ✅ for success/fixable

---

## Usage Notes

1. **This template is a reference, not a rigid structure.** Adapt sections based on activation rules and build characteristics.

2. **Omit empty sections.** If there are no warnings, skip the Warnings section entirely.

3. **Respect token budget.** For very large reports, prefer sampled structure over exhaustive listing.

4. **Link, don't duplicate.** Always link to official documentation rather than explaining solutions inline.

5. **Be actionable.** Every section should guide the user toward fixing issues.
