# Sub-Skill: Generate Report

**Input:** Analyzed Errors Artifact (see `contracts/artifacts.md`)  
**Output:** Markdown Build Report (final deliverable)  
**References:** `templates/report-template.md` (loaded for report structure)

---

## Purpose

Transform the Analyzed Errors Artifact into a well-formatted, actionable Markdown report following the appropriate template variant (quick summary, standard report, or sampled report).

---

## Workflow

### 1. Determine Report Variant

Based on the path context (passed from orchestrator) or error count:

```
if path === "fast" OR errorGroups.length + warningGroups.length < 10:
  → Quick Summary Report
elif path === "sampled" OR errorGroups.length + warningGroups.length > 100:
  → Sampled Report
else:
  → Standard Full Report
```

### 2. Select Template

Load the appropriate template structure from `templates/report-template.md`:

- **Quick Summary Structure** - For fast path
- **Full Report Structure** - For standard path
- **Sampled Report Structure** - For sampled path

### 3. Populate Header Section

Extract from `metadata`:

```markdown
# Build Report - [project-name]

## ✅ Result: [STATUS]

**Status:** [emoji based on exitCode]
**Duration:** [metadata.duration]
**Timestamp:** [metadata.timestamp]
**Branch:** [metadata.branch] (if available)
**Commit:** [metadata.commit] (if available)

### Metrics

- Errors: [summary.totalErrors]
- Warnings: [summary.totalWarnings]
- Files with issues: [summary.filesWithIssues]
```

**Status emoji logic:**

```
if exitCode === 0 AND totalWarnings === 0:
  → ✅ SUCCESS
elif exitCode === 0 AND totalWarnings > 0:
  → ⚠️ SUCCESS WITH WARNINGS
else:
  → 🔴 FAILED
```

### 4. Generate Executive Summary

Extract from `analysis` and `recommendations`:

```markdown
## 📊 Executive Summary

[Generate 2-3 sentence summary combining:]
- Build outcome (failed/succeeded with warnings)
- Primary issue type (e.g., "TypeScript type errors")
- Affected modules (e.g., "in authentication module")
- Root cause summary (from analysis.rootCauses[0])

**Impact:** [emoji] [impact]
**Recommendation:** [recommendations.immediate[0].description]

### Top 3 Issues

[For top 3 errorGroups sorted by priority then count:]
1. **[errorGroup.pattern]** - [count] occurrences - [priority emoji]
   - Affects: [affectedFiles abbreviated]
   - [hint summary in one line]
```

**Example:**

```markdown
## 📊 Executive Summary

Build failed with 3 TypeScript errors in authentication module.
All errors are type-related, suggesting recent type definition changes.
Fixing the root cause (userId type mismatch) will resolve 2 of 3 errors immediately.

**Impact:** 🔴 CRITICAL - Project does not compile
**Recommendation:** Fix type mismatch in auth module (2 errors), then add User import

### Top 3 Issues

1. **Type mismatch string→number** - 2 occurrences - 🔴 CRITICAL
   - Affects: auth/login.ts, auth/register.ts
   - Function expects number but receives string - convert or update signature

2. **Cannot find name 'User'** - 1 occurrence - 🔴 CRITICAL
   - Affects: utils/validate.ts
   - Missing type import - add import statement
```

### 5. Generate Error Groups Section

**For Standard Report:**

For each errorGroup (sorted by priority desc, then count desc):

```markdown
### [tool]: [pattern] ([count] errors)

**Impact:** [rootCause or explanation]
**Blocker:** [✅ if priority critical else ❌]

#### Error Group [N]: [pattern] ([count] occurrences)

**Pattern identified:** [rootCause or detailed explanation]

\`\`\`
[For each error in group (limit to first 5 if > 5):]
[file]:[line]:[col] - [code]: [message]

[If > 5 errors:]
... and [count - 5] more occurrences
\`\`\`

**Files affected:**
[List unique files from errors array]

**Solution hint:**
[hint]

**Documentation:**
[For each docLink:]
- [[title]](url)
```

**For Sampled Report:**

Only detail top 10 errorGroups, summarize the rest:

```markdown
## 📊 Additional Errors

[count] additional error types detected but not detailed in this report:

[For remaining errorGroups:]
- **[pattern]**: [count] occurrences in [files.length] files
```

**For Quick Summary:**

Skip detailed error groups, only show inline in Top 3 Issues.

### 6. Generate Warnings Section

Similar structure to Error Groups but:

- Add **Auto-fixable** field (check if tool supports auto-fix)
- Lower visual emphasis (use ⚠️ instead of 🔴)
- Can group more aggressively (all "unused vars" together)

**Example:**

```markdown
## ⚠️ Warnings (2 total)

### ESLint: Unused Variables (2 warnings)

**Impact:** 🟢 LOW - Does not affect functionality but reduces code quality
**Auto-fixable:** ⚠️ Partially (1/2 can be auto-fixed)

\`\`\`
src/components/Button.tsx:12:7 - @typescript-eslint/no-unused-vars: 'handleClick' is defined but never used
src/components/Button.tsx:23:10 - @typescript-eslint/no-unused-vars: 'styles' is assigned a value but never used
\`\`\`

**Solution hint:**
Remove unused variables or prefix with underscore if needed later

**Documentation:**
- [TypeScript ESLint: no-unused-vars](https://typescript-eslint.io/rules/no-unused-vars/)
```

### 7. Generate Next Steps Section

Extract from `recommendations`:

```markdown
## 🚀 Next Steps

### Immediate Action (Critical)

[For each action in recommendations.immediate:]
[N]. ✅ [action.description] - Estimated: [action.estimatedTime]
    - Files: [action.files.join(", ")]

### Backlog (Important)

[For each action in recommendations.backlog:]
- [ ] [action.description]

### Useful Commands

\`\`\`bash
# Re-run build
[metadata.buildCommand]

[If TypeScript detected:]
# Type check only (faster feedback)
npx tsc --noEmit

[If ESLint detected:]
# Lint and auto-fix
npx eslint . --fix
\`\`\`
```

### 8. Apply Activation Rules

Check `orchestration-policy.md` activation rules and optionally add sections:

#### Configuration Suggestions

**Activate if:**
- 3+ errors of same type, OR
- Recurring pattern across 5+ files, OR
- TypeScript `any` errors present, OR
- ESLint auto-fixable warnings > 20

**Generate:**

```markdown
## ⚙️ Configuration Suggestions

Based on recurring issues, consider:

**1. [Suggestion title based on pattern]**

\`\`\`json
// [config file path]
{
  [suggested config change]
}
\`\`\`

**Why:** [Explanation of how this prevents the recurring issue]

**Documentation:** [[link title]](url)
```

**Example:**

```markdown
## ⚙️ Configuration Suggestions

**1. Enable TypeScript strict mode**

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true
  }
}
\`\`\`

**Why:** Prevents `any` type usage and catches unused variables at compile time

**Documentation:** [TSConfig: strict mode](https://www.typescriptlang.org/tsconfig#strict)
```

#### Code Context

**Activate if:**
- < 5 critical errors total, AND
- Error is localized to single location, OR
- User explicitly requested it

**Generate:**

```markdown
## 📝 Code Context

### Error in [file]:[line]

**Current code:**
\`\`\`typescript
// [file]:[line]
[code snippet with error highlighted]
  ^^^^^^ [error pointer]
\`\`\`

**Issue:** [Explanation]

**Suggested fix:**
\`\`\`typescript
[code snippet with fix applied]
\`\`\`
```

**Note:** Requires reading source files. If files not accessible, skip this section.

#### Cascading Errors

**Activate if:**
- `cascadingErrors` array is non-empty

**Generate:**

```markdown
## 🔗 Cascading Errors Detected

[For each cascadingError:]

### Root Error: [rootError.code] - [rootError.message]

\`\`\`
[rootError.file]:[line] - [message]
\`\`\`

**Causes these errors:**
[For each causedError:]
- [file]:[line] - [message]

**Fix strategy:** [explanation]
```

### 9. Format and Finalize

Apply formatting rules from `templates/report-template.md`:

- ✅ Use consistent emoji (✅ ⚠️ 🔴 🟡 🟢 ⚪ 📊 🚀 📝 ⚙️ 🔗)
- ✅ Use Markdown links with descriptive text
- ✅ Use appropriate code block language tags (typescript, json, bash)
- ✅ Omit empty sections
- ✅ Add horizontal rules (`---`) between major sections

**Footer:**

```markdown
---

_Generated by build-report skill v2.0 • [timestamp]_
```

---

## Path-Specific Output

### Quick Summary (Fast Path)

**Sections included:**
- ✅ Header (compact)
- ✅ Quick Summary (1-2 sentences)
- ✅ Top 3 Issues (inline)
- ✅ Immediate Actions (max 3)
- ✅ Useful Commands
- ❌ Detailed error groups
- ❌ Configuration suggestions
- ❌ Code context

**Estimated output:** 50-100 lines

### Standard Full Report

**Sections included:**
- ✅ Header
- ✅ Executive Summary
- ✅ Errors (all groups detailed)
- ✅ Warnings (all groups detailed)
- ✅ Next Steps
- ⚠️ Configuration Suggestions (if activated)
- ⚠️ Code Context (if activated)
- ⚠️ Cascading Errors (if detected)

**Estimated output:** 200-800 lines

### Sampled Report

**Sections included:**
- ✅ Header (with truncation note)
- ✅ Executive Summary (pattern-focused)
- ✅ Top 10 Error Patterns (detailed)
- ✅ Additional Errors (summary list)
- ✅ Next Steps (top 3 actions)
- ❌ Configuration suggestions
- ❌ Code context

**Estimated output:** 100-300 lines

---

## Validation

Before delivering report, validate:

1. ✅ Report has required sections (Header, Summary, Next Steps)
2. ✅ All documentation links are properly formatted `[text](url)`
3. ✅ Code blocks have language tags
4. ✅ No empty sections (omit if no content)
5. ⚠️ If report > 1000 lines, warn user about length

---

## Example Output

See `references/report-examples.md` for complete example reports.

**Quick reference of expected output:**

```markdown
# Build Report - my-app

## ✅ Result: 🔴 FAILED

**Status:** FAILED
**Duration:** 4.2s
**Errors:** 3
**Warnings:** 0

---

## 📊 Executive Summary

Build failed with 3 TypeScript errors in authentication module...

**Impact:** 🔴 CRITICAL
**Recommendation:** Fix type mismatch in auth module

### Top 3 Issues
1. **Type mismatch string→number** - 2 occurrences - 🔴 CRITICAL
...

---

## 🔴 Errors (3 total)

### TypeScript: Type Mismatch (2 errors)
...

---

## 🚀 Next Steps

### Immediate Action
1. ✅ Add User import - Estimated: 1min
...
```

---

## Context Budget

**Estimated tokens:**
- This sub-skill file: ~1,500 tokens
- Input (Analyzed Errors Artifact): 1K-10K tokens
- `templates/report-template.md`: ~2,500 tokens
- Output (Markdown report): 500-8K tokens

**Total: ~5.5K-22K tokens** (varies by report size)

---

## Error Handling

If generation fails (missing required fields in artifact):

**Fallback:** Generate minimal report:

```markdown
# Build Report

## ⚠️ Report Generation Issue

The build analysis could not be completed due to missing data.

**Available information:**
- Errors detected: [count or "unknown"]
- Build status: [status or "unknown"]

**Raw analysis artifact:**
\`\`\`json
[Include partial artifact for debugging]
\`\`\`

Please re-run the build report generation or contact support.
```

---

## Final Delivery

Return the complete Markdown report as the final deliverable. The orchestrator will present this to the user.
