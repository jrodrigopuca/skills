# Sub-Skill: Analyze Errors

**Input:** Parsed Errors Artifact (see `contracts/artifacts.md`)  
**Output:** Analyzed Errors Artifact (see `contracts/artifacts.md`)  
**References:** `references/error-docs-map.md` (loaded for documentation linking)

---

## Purpose

Group parsed errors by pattern, identify root causes, detect cascading errors, assign priorities, and map errors to official documentation.

---

## Workflow

### 1. Group Errors by Pattern

Errors are grouped using multiple strategies:

#### Strategy A: By Error Code

Group identical error codes together:

```
TS2345 errors → Group 1
TS2304 errors → Group 2
```

#### Strategy B: By Message Pattern

Group similar messages even with different codes:

```
"Cannot find name 'X'" (TS2304, TS2552) → Group 1
"Type 'X' not assignable to 'Y'" (TS2322, TS2345) → Group 2
```

#### Strategy C: By File/Module

Group errors in same module:

```
src/auth/* → Group 1
src/utils/* → Group 2
```

#### Strategy D: By Root Cause (Advanced)

Identify underlying issue:

```
Missing User import causes:
- TS2304: Cannot find name 'User'
- TS2339: Property 'name' does not exist on type 'User' (because User not found)
→ Group as "Missing User import" with cascading errors
```

**Grouping priority:** Use Strategy D when possible, fallback to A/B, then C as last resort.

### 2. Assign Priorities

For each error group, assign priority based on:

| Priority     | Criteria                                                           |
| ------------ | ------------------------------------------------------------------ |
| **CRITICAL** | `severity === "error"` AND `tool` in ["TypeScript", "Webpack", "Vite"] |
| **HIGH**     | `severity === "error"` AND `tool === "ESLint"` AND `category === "quality"` |
| **HIGH**     | `severity === "warning"` AND `count > 10` (many occurrences)           |
| **MEDIUM**   | `severity === "warning"` AND `category === "quality"`                   |
| **LOW**      | `severity === "warning"` AND `category === "style"`                     |
| **LOW**      | Deprecation warnings, bundle size warnings                               |

**Special cases:**

- If error prevents build compilation → **CRITICAL** (always)
- If warning has auto-fix available → downgrade priority (less urgent)

### 3. Identify Root Causes

For each error group with 2+ occurrences, attempt to identify root cause:

#### Pattern Analysis

Look for common themes:

```
5 errors: "Property 'X' does not exist on type 'User'" in different files
→ Root cause: "User interface missing properties" or "Wrong User type imported"
```

#### Cascading Detection

Identify errors that stem from a single root error:

**Example:**

```
Root: src/types/user.ts:5 - TS2304: Cannot find name 'User'

Caused:
- src/auth/login.ts:12 - TS2339: Property 'name' does not exist on type 'User'
- src/auth/register.ts:23 - TS2339: Property 'email' does not exist on type 'User'
```

**Detection logic:**

1. Find errors in same module/feature area
2. Check if later errors reference entities from earlier errors
3. If yes, mark as cascading with root error

**Result:**

```json
{
  "cascadingErrors": [
    {
      "rootError": { /* TS2304 error */ },
      "causedErrors": [ /* TS2339 errors */ ],
      "explanation": "Missing User import causes subsequent property access errors"
    }
  ]
}
```

#### Common Root Causes

- **Type definition changes:** Function signature changed but callsites not updated
- **Missing imports:** Type/module not imported, causes subsequent errors
- **Configuration issues:** tsconfig/eslintrc misconfigured, affects multiple files
- **Dependency problems:** Package not installed or version mismatch

### 4. Map to Documentation

For each error group, find official documentation links using `references/error-docs-map.md`.

**Lookup process:**

1. Check if `error.code` exists in error-docs-map
2. If yes, retrieve doc links
3. If no, use generic documentation for the tool
4. Add 1-sentence "hint" summarizing what the docs will explain

**Example:**

```json
{
  "docLinks": [
    {
      "url": "https://www.typescriptlang.org/docs/handbook/type-compatibility.html",
      "title": "Type Compatibility"
    },
    {
      "url": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions",
      "title": "Type Assertions"
    }
  ],
  "hint": "Convert value to number before calling or update function signature to accept both types"
}
```

**Fallback for unknown codes:**

```json
{
  "docLinks": [
    {
      "url": "https://www.typescriptlang.org/docs/handbook/error-reference.html",
      "title": "TypeScript Error Reference"
    }
  ],
  "hint": "See error reference for guidance"
}
```

### 5. Generate Recommendations

Based on analysis, create prioritized action list:

#### Immediate Actions (Critical priority)

**Criteria:**
- Fixes CRITICAL errors
- Blocks build from succeeding
- Estimated time: < 30 minutes each

**Format:**

```json
{
  "immediate": [
    {
      "description": "Fix type mismatch in auth module",
      "estimatedTime": "5 minutes",
      "files": ["src/auth/login.ts", "src/auth/register.ts"],
      "priority": "critical"
    },
    {
      "description": "Add missing User import in utils/validate.ts",
      "estimatedTime": "1 minute",
      "files": ["src/utils/validate.ts"],
      "priority": "critical"
    }
  ]
}
```

#### Backlog Actions (Important but not blocking)

**Criteria:**
- Fixes HIGH/MEDIUM warnings
- Improves code quality
- Can be done later

**Format:**

```json
{
  "backlog": [
    {
      "description": "Remove 15 unused variables across components",
      "estimatedTime": "10 minutes",
      "files": ["src/components/*.tsx"],
      "priority": "medium"
    }
  ]
}
```

### 6. Perform Analysis Summary

Generate high-level insights:

**Root Causes (top 3):**

```json
{
  "rootCauses": [
    "Type definition changes in auth module",
    "Missing User import",
    "Unused variables from refactoring"
  ]
}
```

**Affected Modules:**

```json
{
  "affectedModules": [
    "src/auth",
    "src/utils",
    "src/components"
  ]
}
```

**Estimated Fix Time:**

```
total_immediate_time + (total_backlog_time * 0.5)
→ "15-30 minutes" or "1-2 hours"
```

### 7. Determine Impact Level

Overall impact based on highest priority group:

```
if any CRITICAL groups:
  impact = "critical"
elif any HIGH groups with count > 5:
  impact = "high"
elif any HIGH groups:
  impact = "medium"
else:
  impact = "low"
```

### 8. Produce Analyzed Errors Artifact

Assemble final artifact according to `contracts/artifacts.md`:

```json
{
  "metadata": { /* pass-through from ParsedErrorsArtifact */ },
  
  "impact": "critical",
  
  "errorGroups": [
    {
      "id": "ts-type-mismatch-string-number",
      "tool": "TypeScript",
      "code": "TS2345",
      "pattern": "Type mismatch: string → number",
      "priority": "critical",
      "count": 2,
      "errors": [ /* ParsedError objects */ ],
      "rootCause": "userId parameter changed from string to number but callsites not updated",
      "affectedFiles": ["src/auth/login.ts", "src/auth/register.ts"],
      "docLinks": [ /* documentation links */ ],
      "hint": "Convert value to number before calling or update function signature"
    }
  ],
  
  "warningGroups": [ /* similar structure */ ],
  
  "cascadingErrors": [ /* detected cascading patterns */ ],
  
  "recommendations": {
    "immediate": [ /* critical actions */ ],
    "backlog": [ /* important actions */ ]
  },
  
  "analysis": {
    "rootCauses": [ /* top 3 */ ],
    "affectedModules": [ /* modules */ ],
    "estimatedFixTime": "15-30 minutes"
  }
}
```

---

## Path-Specific Behavior

### Fast Path (< 10 errors)

**Simplified analysis:**
- Skip root cause analysis (basic grouping only)
- Skip cascading error detection
- Group by error code only (Strategy A)
- Generate 1-2 immediate actions

**Impact:** Faster analysis, less context needed

### Standard Path (10-100 errors)

**Full analysis:**
- All grouping strategies
- Root cause identification
- Cascading error detection
- Detailed recommendations

### Sampled Path (100+ errors)

**Top-heavy analysis:**
- Group all errors
- Analyze top 10 groups in detail
- For remaining groups: basic stats only (count, files)
- Focus recommendations on top 3 fixes

---

## Validation

Before returning artifact, validate:

1. ✅ At least one errorGroup or warningGroup exists
2. ✅ Each group has `count >= 1` and `errors.length >= 1`
3. ✅ `recommendations.immediate` not empty if impact is "critical" or "high"
4. ✅ All `docLinks` are valid URLs

If validation fails, note in artifact (don't fail completely).

---

## Example Input/Output

### Input (Parsed Errors Artifact)

```json
{
  "metadata": { "buildCommand": "npm run build", "timestamp": "..." },
  "toolsDetected": ["typescript"],
  "errors": [
    {
      "tool": "TypeScript",
      "severity": "error",
      "code": "TS2345",
      "message": "Argument of type 'string' is not assignable to parameter of type 'number'",
      "file": "src/auth/login.ts",
      "line": 23,
      "column": 15,
      "category": "type"
    },
    {
      "tool": "TypeScript",
      "severity": "error",
      "code": "TS2345",
      "message": "Argument of type 'string' is not assignable to parameter of type 'number'",
      "file": "src/auth/register.ts",
      "line": 45,
      "column": 20,
      "category": "type"
    },
    {
      "tool": "TypeScript",
      "severity": "error",
      "code": "TS2304",
      "message": "Cannot find name 'User'",
      "file": "src/utils/validate.ts",
      "line": 12,
      "column": 8,
      "category": "type"
    }
  ],
  "warnings": [],
  "summary": { "totalErrors": 3, "totalWarnings": 0, "filesWithIssues": 3, "truncated": false }
}
```

### Output (Analyzed Errors Artifact)

```json
{
  "metadata": { "buildCommand": "npm run build", "timestamp": "..." },
  
  "impact": "critical",
  
  "errorGroups": [
    {
      "id": "ts-2345-string-number",
      "tool": "TypeScript",
      "code": "TS2345",
      "pattern": "Type mismatch: string → number",
      "priority": "critical",
      "count": 2,
      "errors": [ /* 2 TS2345 errors */ ],
      "rootCause": "userId parameter changed from string to number but callsites not updated",
      "affectedFiles": ["src/auth/login.ts", "src/auth/register.ts"],
      "docLinks": [
        {
          "url": "https://www.typescriptlang.org/docs/handbook/type-compatibility.html",
          "title": "Type Compatibility"
        }
      ],
      "hint": "Convert value to number before calling or update function signature to accept both types"
    },
    {
      "id": "ts-2304-missing-user",
      "tool": "TypeScript",
      "code": "TS2304",
      "pattern": "Cannot find name 'User'",
      "priority": "critical",
      "count": 1,
      "errors": [ /* TS2304 error */ ],
      "rootCause": "Missing User type import",
      "affectedFiles": ["src/utils/validate.ts"],
      "docLinks": [
        {
          "url": "https://www.typescriptlang.org/docs/handbook/modules.html",
          "title": "TypeScript Modules"
        }
      ],
      "hint": "Add import for User type from appropriate module"
    }
  ],
  
  "warningGroups": [],
  
  "cascadingErrors": [],
  
  "recommendations": {
    "immediate": [
      {
        "description": "Add User import in src/utils/validate.ts",
        "estimatedTime": "1 minute",
        "files": ["src/utils/validate.ts"],
        "priority": "critical"
      },
      {
        "description": "Fix userId type conversion in auth module (2 files)",
        "estimatedTime": "5 minutes",
        "files": ["src/auth/login.ts", "src/auth/register.ts"],
        "priority": "critical"
      }
    ],
    "backlog": []
  },
  
  "analysis": {
    "rootCauses": [
      "Type definition changes in auth module",
      "Missing User import"
    ],
    "affectedModules": ["src/auth", "src/utils"],
    "estimatedFixTime": "5-10 minutes"
  }
}
```

---

## Context Budget

**Estimated tokens:**
- This sub-skill file: ~2,000 tokens
- Input (Parsed Errors Artifact): 500-5K tokens
- `error-docs-map.md` (always loaded): ~4,000 tokens
- Output (Analyzed Errors Artifact): 1K-10K tokens

**Total: ~7.5K-21K tokens** (varies by error count)

---

## Next Step

After producing the Analyzed Errors Artifact, pass it to the `generate-report` sub-skill to create the final Markdown report.
