---
name: build-report
description: Generate structured, actionable build reports from Node.js build outputs (TypeScript, ESLint, Webpack, Vite). Groups errors by pattern, prioritizes issues, and suggests documented solutions. Use when analyzing build failures, debugging compilation errors, or reviewing warnings. Supports English and Spanish. | Genera reportes estructurados y accionables de builds Node.js (TypeScript, ESLint, Webpack, Vite). Agrupa errores por patrón, prioriza issues y sugiere soluciones documentadas. Usar para analizar fallos de build, debuggear errores de compilación o revisar warnings.
license: MIT
---

# Build Report Generator

Generate structured, actionable reports from build outputs for Node.js projects.

## Overview

Build Report transforms raw build outputs into organized, prioritized reports. Instead of duplicating official documentation, this skill focuses on:

- **Parsing and extracting** errors from multiple tools (TypeScript, ESLint, Webpack, Vite)
- **Grouping** similar errors by pattern and root cause
- **Prioritizing** issues by impact and severity
- **Analyzing dependencies** between errors (what to fix first)
- **Linking to official docs** for detailed solutions
- **Executive summary** for quick decision making

This skill complements (not replaces) official documentation by providing triage, context, and actionable next steps.

## Prerequisites

- Node.js project with npm/yarn/pnpm
- Build tools: TypeScript, ESLint, Webpack, Vite, or similar
- Build output (from console or CI/CD logs)
- Optional: Git for historical comparisons

## Instructions

### 1. Capture the Build Output

Collect the complete build output including:

```bash
# Full build command output
npm run build

# Or from CI/CD logs
# Copy the entire build section
```

**What to include:**

- Full command that was run
- All stdout and stderr output
- Exit code (if available)
- Timestamp and duration (if available)

### 2. Identify Build Tools and Errors

Scan the output to detect which build tools are present:

**TypeScript errors:**

```
src/file.ts:23:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

**ESLint warnings:**

```
src/file.ts:12:7 warning 'variable' is defined but never used @typescript-eslint/no-unused-vars
```

**Webpack errors:**

```
ERROR in ./src/components/Button.tsx
Module not found: Error: Can't resolve '@/styles/button.css'
```

**Vite errors:**

```
✘ [ERROR] Could not resolve "react-dom/client"
```

### 3. Parse and Extract Structured Data

For each error/warning, extract:

- **File path:** Full or relative path to the file
- **Line number:** Where the issue occurs
- **Column number:** (if available)
- **Error code:** TS2345, E501, etc.
- **Message:** The error description
- **Severity:** error or warning
- **Tool:** TypeScript, ESLint, Webpack, etc.

**Example parsing:**

```
Input: "src/auth/login.ts:23:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'."

Extracted:
{
  file: "src/auth/login.ts",
  line: 23,
  column: 15,
  code: "TS2345",
  message: "Argument of type 'string' is not assignable to parameter of type 'number'",
  severity: "error",
  tool: "TypeScript"
}
```

### 4. Group Errors by Pattern

Group similar errors together:

**Grouping strategies:**

1. **By error code:** All TS2345 errors together
2. **By message pattern:** Similar error messages
3. **By file/module:** All errors in `auth/` module
4. **By root cause:** Same underlying issue

**Example groups:**

```
Group 1: Type mismatch string→number (TS2345)
├─ src/auth/login.ts:23
├─ src/auth/register.ts:45
└─ src/auth/validate.ts:12
(4 occurrences)

Group 2: Cannot find name 'User' (TS2304)
└─ src/utils/validate.ts:12
(1 occurrence)
```

### 5. Prioritize Issues

Assign priority based on:

| Priority        | Criteria                                        | Symbol      |
| --------------- | ----------------------------------------------- | ----------- |
| 🔴 **CRITICAL** | Build blocker (errors that prevent compilation) | MUST FIX    |
| 🟡 **HIGH**     | Reduces code quality significantly              | SHOULD FIX  |
| 🟢 **MEDIUM**   | Code quality issues, non-blocking               | NICE TO FIX |
| ⚪ **LOW**      | Style/formatting, deprecation warnings          | OPTIONAL    |

**Priority rules:**

- All TypeScript errors → 🔴 CRITICAL
- ESLint errors → 🟡 HIGH
- ESLint warnings (complexity, unused vars) → 🟡 HIGH to 🟢 MEDIUM
- Deprecation warnings → ⚪ LOW
- Bundle size warnings → 🟢 MEDIUM

### 6. Find Solutions and Documentation

For each error group, provide:

**Solution steps:**

1. Specific actions to resolve the issue
2. Code examples (before/after)
3. Alternative approaches if applicable

**Documentation links:**

- Official documentation for the error code
- Related Stack Overflow questions
- Framework-specific guides

**Common solutions database:**

- See [references/solutions-database.md](references/solutions-database.md) for error code mappings

**Example solution:**

````markdown
**Solution for TS2345 (Type Mismatch):**

1. Option A: Convert the value to expected type
   ```typescript
   calculate(Number(userId)); // string → number
   ```
````

2. Option B: Update the parameter type

   ```typescript
   function calculate(id: string | number) { ... }
   ```

3. Option C: Fix the source type
   ```typescript
   const userId: number = getNumericUserId();
   ```

**Documentation:**

- [TypeScript Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

````

### 7. Generate Executive Summary

Create a concise overview:

```markdown
## 📊 Executive Summary

Build FAILED after 12.4s with 23 errors and 124 warnings.

**Impact:** 🔴 CRITICAL - Project does not compile
**Priority:** Resolve TypeScript errors in auth module (8 errors)

### Top Issues:
1. 🔴 TypeScript: 8 type errors (auth module) - BLOCKER
2. 🟡 ESLint: 52 unused variables (15 files) - HIGH
3. 🟢 Webpack: 3 bundle size warnings - MEDIUM
````

**Include:**

- Overall status (SUCCESS, SUCCESS WITH WARNINGS, FAILED)
- Total errors and warnings count
- Impact level
- Top 3 issues to address
- Quick recommendation

### 8. Format the Complete Report

Use the following structure:

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
- Files processed: [N]
- Files with issues: [N]

---

## 📊 Executive Summary

[2-3 sentence summary]

**Impact:** 🔴 CRITICAL | 🟡 HIGH | 🟢 MEDIUM | ⚪ LOW
**Recommendation:** [Primary action]

### Issues by Category

| Category | Errors | Warnings | Priority |
| -------- | ------ | -------- | -------- |
| Tool 1   | N      | N        | 🔴       |
| Tool 2   | N      | N        | 🟡       |

### Top 3 Issues

1. **[Error type]** - [N] occurrences - 🔴 [Priority]
2. **[Error type]** - [N] occurrences - 🟡 [Priority]
3. **[Error type]** - [N] occurrences - 🟢 [Priority]

---

## 🔴 Errors ([N] total)

### [Tool]: [Error Type] ([N] errors)

**Impact:** [Description]
**Blocker:** ✅ Yes | ❌ No

#### Error Group [N]: [Description] ([N] occurrences)

**Pattern identified:** [Explanation]
```

[file]:[line]:[col] - [code]: [message]
[file]:[line]:[col] - [code]: [message]

````

**Files affected:**
- [file 1] (lines [X-Y])
- [file 2] (lines [X-Y])

**Solution:**
1. [Step 1]
2. [Step 2]

**Documentation:**
- [Link 1]
- [Link 2]

---

## ⚠️ Warnings ([N] total)

[Similar structure as Errors]

---

## 🚀 Next Steps

### Immediate Action (Critical)
1. ✅ [Action 1] - Estimated: [X]min
2. ✅ [Action 2] - Estimated: [X]min

### Backlog (Important)
- [ ] [Action 3]
- [ ] [Action 4]

### Useful Commands
```bash
# Re-run build
[command]

# Auto-fix issues
[command]
````

````

### 9. Include Code Context (Optional)

For critical errors, show the problematic code:

```markdown
**Code context:**
```typescript
// src/auth/login.ts:23
function handleLogin(userId: string) {
  const result = calculate(userId);  // ❌ Error here
  //                        ^^^^^^
  //                        Type 'string' not assignable to 'number'
  return result;
}
````

**After fix:**

```typescript
function handleLogin(userId: string) {
	const result = calculate(Number(userId)); // ✅ Fixed
	return result;
}
```

````

### 10. Suggest Configuration Improvements (Optional)

Based on detected issues, suggest config changes:

```markdown
## ⚙️ Configuration Suggestions

Based on recurring issues, consider:

1. **Enable TypeScript strict mode:**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noUnusedLocals": true
     }
   }
````

2. **Configure pre-commit hooks:**
   ```bash
   npm install --save-dev husky lint-staged
   npx husky add .husky/pre-commit "npm run lint"
   ```

````

## Report Format Template

Quick reference template:

```markdown
# Build Report - [project-name]

## Result
[STATUS emoji] + metrics

## Executive Summary
- Impact level
- Top 3 issues
- Recommendation

## Errors (if any)
- Grouped by pattern
- With solutions
- With documentation links

## Warnings (if any)
- Grouped by priority
- Quick fixes

## Next Steps
- Immediate actions
- Backlog items
- Useful commands
````

## Output

The skill generates:

- **Structured Markdown report** - Clear sections, collapsible if needed
- **Grouped issues** - Similar errors together, not scattered
- **Prioritized actions** - What to fix first
- **Documented solutions** - How to fix each issue type
- **Useful commands** - Ready to copy-paste
- **File locations** - Exact line numbers
- **Comparison data** - Optional comparison with previous builds

## Examples

### Example 1: TypeScript Build Failed

**Request:** "Analyze this build output and generate a report"

**Input (Build output):**

```bash
$ npm run build

> app@1.0.0 build
> tsc

src/auth/login.ts:23:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
src/auth/register.ts:45:20 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
src/utils/validate.ts:12:8 - error TS2304: Cannot find name 'User'.

Found 3 errors in 3 files.
```

**Output (Generated report):**

```markdown
# Build Report - my-app

## ✅ Result: 🔴 FAILED

**Status:** FAILED
**Duration:** 4.2s
**Errors:** 3
**Warnings:** 0

---

## 📊 Executive Summary

Build failed with 3 TypeScript errors in authentication module.
All errors are type-related, suggesting recent type definition changes.

**Impact:** 🔴 CRITICAL - Project does not compile
**Recommendation:** Fix type mismatch in auth module (2 errors), then add User import

### Issues by Category

| Category   | Errors | Warnings | Priority    |
| ---------- | ------ | -------- | ----------- |
| TypeScript | 3      | 0        | 🔴 CRITICAL |

### Top 3 Issues

1. **Type mismatch string→number** - 2 occurrences - 🔴 CRITICAL
   - Affects: auth/login.ts, auth/register.ts
   - Solution: Convert userId to number or update function signature

2. **Cannot find name 'User'** - 1 occurrence - 🔴 CRITICAL
   - Affects: utils/validate.ts
   - Solution: Add import for User type

---

## 🔴 Errors (3 total)

### TypeScript: Type Mismatch (2 errors)

**Impact:** Build blocker - function expects number but receives string
**Blocker:** ✅ Yes

#### Error Group 1: string→number parameter (2 occurrences)

**Pattern identified:** The `userId` parameter changed from string to number but callsites were not updated.
```

src/auth/login.ts:23:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
src/auth/register.ts:45:20 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

````

**Files affected:**
- src/auth/login.ts (line 23)
- src/auth/register.ts (line 45)

**Solution:**

1. **Option A:** Convert to number before calling:
   ```typescript
   const result = calculate(Number(userId));
   // or
   const result = calculate(parseInt(userId, 10));
````

2. **Option B:** Update function to accept both types:

   ```typescript
   function calculate(id: string | number): Result {
   	const numericId = typeof id === "string" ? Number(id) : id;
   	// ...
   }
   ```

3. **Option C:** Update userId type at source:
   ```typescript
   const userId: number = getNumericUserId();
   ```

**Documentation:**

- [TypeScript Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)

---

### TypeScript: Missing Import (1 error)

**Impact:** Build blocker - type not found
**Blocker:** ✅ Yes

#### Error Group 2: Cannot find name 'User' (1 occurrence)

```
src/utils/validate.ts:12:8 - error TS2304: Cannot find name 'User'.
```

**Files affected:**

- src/utils/validate.ts (line 12)

**Solution:**

Add the missing import at the top of the file:

```typescript
import { User } from "@/types/user";
// or
import type { User } from "@/types/user";
```

If you're not sure where User is defined, search for it:

```bash
git grep "export.*User" src/
```

**Documentation:**

- [TypeScript Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [Import Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)

---

## 🚀 Next Steps

### Immediate Action (Critical)

1. ✅ Add User import in src/utils/validate.ts - Estimated: 1min
2. ✅ Fix userId type in auth module (2 files) - Estimated: 5min

### Useful Commands

```bash
# Re-run build
npm run build

# Type check only (faster feedback)
npx tsc --noEmit

# See all type errors with details
npx tsc --noEmit --pretty
```

````

---

### Example 2: ESLint Warnings Only

**Request:** "Generate a build report focusing on code quality issues"

**Input:**
```bash
$ npm run build

> app@1.0.0 build
> eslint src/ && webpack

src/components/Button.tsx
  12:7  warning  'handleClick' is defined but never used  @typescript-eslint/no-unused-vars
  23:10 warning  'styles' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 2 problems (0 errors, 2 warnings)
✖ 1 problem (0 errors, 1 warning) potentially fixable with the `--fix` option.

webpack compiled successfully in 8.2s
````

**Output:**

```markdown
# Build Report - my-app

## ✅ Result: ⚠️ SUCCESS WITH WARNINGS

**Status:** SUCCESS WITH WARNINGS
**Duration:** 8.2s
**Errors:** 0
**Warnings:** 2

---

## 📊 Executive Summary

Build completed successfully with 2 ESLint warnings.
Both are unused variable warnings - can be auto-fixed.

**Impact:** 🟢 LOW - Build successful, code quality improvements available
**Recommendation:** Run eslint --fix to auto-clean unused variables

### Issues by Category

| Category | Errors | Warnings | Priority  |
| -------- | ------ | -------- | --------- |
| ESLint   | 0      | 2        | 🟢 MEDIUM |

---

## ⚠️ Warnings (2 total)

### ESLint: Unused Variables (2 warnings)

**Impact:** 🟢 LOW - Does not affect functionality but reduces code quality
**Auto-fixable:** ⚠️ Partially (1/2 can be auto-fixed)
**Recommendation:** Remove unused variables
```

src/components/Button.tsx:12:7 - warning: 'handleClick' is defined but never used (@typescript-eslint/no-unused-vars)
src/components/Button.tsx:23:10 - warning: 'styles' is assigned a value but never used (@typescript-eslint/no-unused-vars)

````

**Solution:**

**Quick fix:**
```bash
# Auto-fix what's possible
npx eslint src/components/Button.tsx --fix
````

**Manual fix:**
If the variables will be used later, prefix with underscore:

```typescript
// Before
const handleClick = () => { ... };  // ❌ Warning

// After
const _handleClick = () => { ... };  // ✅ No warning
```

Or simply remove if truly unused:

```typescript
// Just delete the unused lines
```

**Documentation:**

- [ESLint no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
- [TypeScript ESLint no-unused-vars](https://typescript-eslint.io/rules/no-unused-vars/)

---

## 🚀 Next Steps

### Nice-to-have (Improvements)

- [ ] Auto-fix unused variables with `eslint --fix`
- [ ] Review if variables will be used soon (keep with `_` prefix)

### Useful Commands

```bash
# Auto-fix all fixable issues
npx eslint src/ --fix

# Re-run lint
npm run lint

# Re-run build
npm run build
```

```

## Resources

**Official Documentation (primary source for solutions):**
- [TypeScript Error Reference](https://www.typescriptlang.org/docs/handbook/error-reference.html) - Official TS error codes
- [ESLint Rules](https://eslint.org/docs/latest/rules/) - Complete ESLint rules documentation
- [Webpack Errors](https://webpack.js.org/configuration/stats/#errors-and-warnings) - Webpack error handling
- [Vite Error Reference](https://vitejs.dev/guide/troubleshooting.html) - Vite common errors

**Skill References:**
- [references/nodejs-parsers.md](references/nodejs-parsers.md) - Parsing strategies for Node.js build tools
- [references/error-docs-map.md](references/error-docs-map.md) - Error code → official docs mapping
- [references/report-examples.md](references/report-examples.md) - Complete report examples
```
