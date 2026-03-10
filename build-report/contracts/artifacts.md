# Build Report Artifacts Contract

This document defines the structured artifacts produced and consumed by build-report sub-skills.

---

## Overview

The build-report workflow produces three primary artifacts:

1. **Parsed Errors Artifact** - Raw structured errors from build output
2. **Analyzed Errors Artifact** - Grouped, prioritized, and root-cause analyzed errors
3. **Report Artifact** - Final markdown report

Each artifact is a structured JSON/Markdown document that serves as input to the next stage.

---

## 1. Parsed Errors Artifact

**Producer:** `parse-build-output` sub-skill  
**Consumer:** `analyze-errors` sub-skill  
**Format:** JSON

### Shape

```typescript
interface ParsedErrorsArtifact {
  metadata: {
    buildCommand: string;
    timestamp: string;
    duration?: string;
    exitCode?: number;
    branch?: string;
    commit?: string;
  };
  toolsDetected: string[]; // ["typescript", "eslint", "webpack", "vite"]
  errors: ParsedError[];
  warnings: ParsedError[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    filesWithIssues: number;
    truncated: boolean; // true if output was too large
  };
}

interface ParsedError {
  tool: string; // "TypeScript" | "ESLint" | "Webpack" | "Vite"
  severity: "error" | "warning";
  code?: string; // "TS2345", "@typescript-eslint/no-unused-vars", etc.
  message: string;
  file?: string;
  line?: number;
  column?: number;
  category?: string; // "type", "syntax", "module-resolution", etc.
  context?: string; // Code snippet or additional context
}
```

### Example

```json
{
  "metadata": {
    "buildCommand": "npm run build",
    "timestamp": "2024-01-15T14:32:00Z",
    "duration": "12.4s",
    "exitCode": 1
  },
  "toolsDetected": ["typescript", "eslint"],
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
    }
  ],
  "warnings": [
    {
      "tool": "ESLint",
      "severity": "warning",
      "code": "@typescript-eslint/no-unused-vars",
      "message": "'handleClick' is defined but never used",
      "file": "src/components/Button.tsx",
      "line": 12,
      "column": 7,
      "category": "quality"
    }
  ],
  "summary": {
    "totalErrors": 3,
    "totalWarnings": 2,
    "filesWithIssues": 4,
    "truncated": false
  }
}
```

---

## 2. Analyzed Errors Artifact

**Producer:** `analyze-errors` sub-skill  
**Consumer:** `generate-report` sub-skill  
**Format:** JSON

### Shape

```typescript
interface AnalyzedErrorsArtifact {
  metadata: ParsedErrorsArtifact["metadata"]; // Pass-through from parsed artifact
  
  impact: "critical" | "high" | "medium" | "low";
  
  errorGroups: ErrorGroup[];
  warningGroups: ErrorGroup[];
  
  cascadingErrors: CascadingError[]; // Errors that cause other errors
  
  recommendations: {
    immediate: Action[];
    backlog: Action[];
  };
  
  analysis: {
    rootCauses: string[]; // High-level root causes identified
    affectedModules: string[]; // Module/directory patterns
    estimatedFixTime: string; // "15-30 minutes", "1-2 hours"
  };
}

interface ErrorGroup {
  id: string; // Unique identifier for the group
  tool: string;
  code?: string;
  pattern: string; // Human description of the pattern
  priority: "critical" | "high" | "medium" | "low";
  count: number;
  errors: ParsedError[]; // Errors belonging to this group
  rootCause?: string; // Identified root cause
  affectedFiles: string[];
  
  // Documentation links
  docLinks: {
    url: string;
    title: string;
  }[];
  
  // Quick hint (1-2 sentences)
  hint?: string;
}

interface CascadingError {
  rootError: ParsedError;
  causedErrors: ParsedError[]; // Errors that stem from the root
  explanation: string;
}

interface Action {
  description: string;
  estimatedTime: string;
  files: string[];
  priority: "critical" | "high" | "medium" | "low";
}
```

### Example

```json
{
  "metadata": { /* ... same as ParsedErrorsArtifact ... */ },
  
  "impact": "critical",
  
  "errorGroups": [
    {
      "id": "ts-type-mismatch-string-number",
      "tool": "TypeScript",
      "code": "TS2345",
      "pattern": "Type mismatch: string → number",
      "priority": "critical",
      "count": 2,
      "errors": [ /* ... */ ],
      "rootCause": "userId parameter changed from string to number but callsites not updated",
      "affectedFiles": ["src/auth/login.ts", "src/auth/register.ts"],
      "docLinks": [
        {
          "url": "https://www.typescriptlang.org/docs/handbook/type-compatibility.html",
          "title": "Type Compatibility"
        }
      ],
      "hint": "Convert value to number before calling or update function signature to accept both types"
    }
  ],
  
  "warningGroups": [ /* ... */ ],
  
  "cascadingErrors": [
    {
      "rootError": { /* Missing import error */ },
      "causedErrors": [ /* Property does not exist errors */ ],
      "explanation": "Import of User type missing causes subsequent property access errors"
    }
  ],
  
  "recommendations": {
    "immediate": [
      {
        "description": "Fix type mismatch in auth module",
        "estimatedTime": "5 minutes",
        "files": ["src/auth/login.ts", "src/auth/register.ts"],
        "priority": "critical"
      }
    ],
    "backlog": [ /* ... */ ]
  },
  
  "analysis": {
    "rootCauses": ["Type definition changes in auth module", "Missing User import"],
    "affectedModules": ["src/auth", "src/utils"],
    "estimatedFixTime": "15-30 minutes"
  }
}
```

---

## 3. Report Artifact

**Producer:** `generate-report` sub-skill  
**Consumer:** User (final output)  
**Format:** Markdown

### Structure

```markdown
# Build Report - [project-name]

## ✅ Result: [STATUS]

**Status:** ✅ SUCCESS | ⚠️ SUCCESS WITH WARNINGS | 🔴 FAILED
**Duration:** [X]s
**Timestamp:** [date time]
[Branch/Commit if available]

### Metrics
- Errors: [N]
- Warnings: [N]
- Files with issues: [N]

---

## 📊 Executive Summary

[2-3 sentence summary from AnalyzedErrorsArtifact.analysis]

**Impact:** [critical|high|medium|low emoji]
**Recommendation:** [Primary action from recommendations.immediate[0]]

### Top 3 Issues
1. [ErrorGroup.pattern] - [count] occurrences - [priority emoji]
2. ...
3. ...

---

## 🔴 Errors ([N] total)

[For each ErrorGroup with priority critical/high]

### [Tool]: [Pattern] ([count] errors)

**Impact:** [ErrorGroup.rootCause or explanation]
**Blocker:** ✅ Yes | ❌ No

#### Error Group [N]: [Pattern] ([count] occurrences)

```
[file]:[line]:[col] - [code]: [message]
...
```

**Files affected:**
- [file 1]
- [file 2]

**Solution hint:**
[ErrorGroup.hint]

**Documentation:**
- [docLinks]

---

## ⚠️ Warnings ([N] total)

[Similar structure for warning groups]

---

## 🚀 Next Steps

### Immediate Action (Critical)
[From recommendations.immediate]

### Backlog (Important)
[From recommendations.backlog]

### Useful Commands
[Tool-specific commands for re-running build, fixing issues]
```

### Report Variants

The report can be generated in different modes:

1. **Quick Summary** (fast path, < 10 errors)
   - Executive Summary only
   - Top 3 issues
   - Immediate actions

2. **Standard Report** (10-100 errors)
   - Full structure as above
   - All error groups shown
   - Configuration suggestions (if applicable)

3. **Sampled Report** (100+ errors)
   - Executive Summary
   - Top 10 error groups
   - Note about truncation
   - Summary statistics

---

## Artifact Storage and Reuse

### Storage Strategy

Artifacts can be stored for reuse:

1. **In-memory** (default): Artifacts passed between sub-skills in single session
2. **File-based**: Write artifacts to `.build-report/` directory for caching
3. **CI/CD integration**: Store as build artifacts for historical comparison

### Reuse Patterns

**Pattern 1: Generate multiple report variants**
```
parse → analyze → generate (quick summary)
                → generate (full report)
                → generate (CI-focused report)
```

**Pattern 2: Incremental analysis**
```
parse → analyze (initial)
      → analyze (with code context) [if user requests details]
```

**Pattern 3: Historical comparison**
```
parse (current) + parse (previous) → compare → report with deltas
```

---

## Validation Rules

### Parsed Errors Artifact

- ✅ Must have at least one of `errors` or `warnings` non-empty
- ✅ `metadata.buildCommand` is required
- ⚠️ If `summary.truncated = true`, note in report generation

### Analyzed Errors Artifact

- ✅ Must have at least one errorGroup or warningGroup
- ✅ Each ErrorGroup must have `count >= 1` and `errors.length >= 1`
- ✅ `recommendations.immediate` should not be empty if impact is "critical" or "high"
- ⚠️ If cascadingErrors detected, prioritize fixing root errors first

### Report Artifact

- ✅ Must include Executive Summary
- ✅ Must include Next Steps section
- ✅ Documentation links must be valid URLs
- ⚠️ If report exceeds 1000 lines, consider sampled mode

---

## Versioning

This contract is versioned independently from the skill:

- **v1.0** (2024-03-09): Initial contract definition with three artifacts
- Future versions will maintain backward compatibility or provide migration guides

---

## Usage in Sub-Skills

Each sub-skill should:

1. **Declare input artifact** in its SKILL.md header
2. **Declare output artifact** in its SKILL.md header
3. **Validate input** against contract before processing
4. **Produce valid output** conforming to contract shape
5. **Include example artifacts** in sub-skill documentation

Example header:

```markdown
# Sub-Skill: parse-build-output

**Input:** Raw build output (string)  
**Output:** Parsed Errors Artifact (see contracts/artifacts.md)  
**References:** references/nodejs-parsers.md (lazy-loaded for parsing strategies)
```
