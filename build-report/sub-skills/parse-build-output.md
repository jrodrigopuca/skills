# Sub-Skill: Parse Build Output

**Input:** Raw build output (string)  
**Output:** Parsed Errors Artifact (see `contracts/artifacts.md`)  
**References:** `references/nodejs-parsers.md` (lazy-loaded for advanced parsing)

---

## Purpose

Extract structured error and warning data from Node.js build tool outputs (TypeScript, ESLint, Webpack, Vite, and others).

---

## Workflow

### 1. Detect Build Tools

Scan the output to identify which tools are present:

**Detection patterns:**

```javascript
TypeScript: /- error TS\d+:/
ESLint:     /\s+\d+:\d+\s+(error|warning)\s+.+\s+[@a-z-/]+$/
Webpack:    /^ERROR in \.\//
Vite:       /^✘ \[ERROR\]/
```

**Result:** Array of detected tools (e.g., `["typescript", "eslint"]`)

### 2. Parse Errors by Tool

For each detected tool, extract structured errors:

#### TypeScript

**Pattern:** `[file]:[line]:[column] - error TS[code]: [message]`

**Example:**
```
src/auth/login.ts:23:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

**Extracted:**
```json
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
```

**Categorization by code range:**
- TS1xxx → "syntax"
- TS2xxx → "type"
- TS4xxx → "module-resolution"
- TS5xxx → "config"

#### ESLint

**Pattern:** `[file]\n  [line]:[column]  [severity]  [message]  [ruleId]`

**Example:**
```
src/components/Button.tsx
  12:7  warning  'handleClick' is defined but never used  @typescript-eslint/no-unused-vars
```

**Extracted:**
```json
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
```

**Categorization by rule ID:**
- `@typescript-eslint/*` → "typescript"
- `react/*` → "react"
- `no-unused-vars`, `no-console` → "quality"
- `indent`, `quotes`, `semi` → "style"

#### Webpack

**Pattern:** `ERROR in [file]\n[error details]`

**Example:**
```
ERROR in ./src/components/Button.tsx
Module not found: Error: Can't resolve '@/styles/button.css' in '/project/src/components'
```

**Extracted:**
```json
{
  "tool": "Webpack",
  "severity": "error",
  "message": "Module not found: Error: Can't resolve '@/styles/button.css'",
  "file": "./src/components/Button.tsx",
  "category": "module-resolution"
}
```

**Categorization:**
- "Module not found" → "module-resolution"
- "Module build failed" → "build-error"
- "WARNING in asset size" → "performance"

#### Vite

**Pattern:** `✘ [ERROR] [message]\n  [file]:[line]:[column]:`

**Example:**
```
✘ [ERROR] Could not resolve "react-dom/client"

    src/main.tsx:2:27:
      2 │ import ReactDOM from 'react-dom/client'
```

**Extracted:**
```json
{
  "tool": "Vite",
  "severity": "error",
  "message": "Could not resolve \"react-dom/client\"",
  "file": "src/main.tsx",
  "line": 2,
  "column": 27,
  "category": "module-resolution"
}
```

**Categorization:**
- "Could not resolve" → "module-resolution"
- "Transform failed" → "build-error"
- "Parse error" → "syntax"

### 3. Extract Metadata

From the build output, extract:

- **Build command:** Look for `> [package]@[version] [script]` or user-provided context
- **Duration:** Look for patterns like `built in 3.42s` or `Duration: 12.4s`
- **Exit code:** Usually provided by the user or CI context
- **Timestamp:** Current time if not in output
- **Branch/Commit:** Look for git context (e.g., `On branch feature/user-management`) or CI environment variables

### 4. Handle Edge Cases

#### Truncated Output

If output appears truncated (e.g., ends with `[... 200 more lines]`):

```json
{
  "summary": {
    "truncated": true
  }
}
```

#### ANSI Color Codes

Strip before parsing:

```javascript
output = output.replace(/\x1b\[[0-9;]*m/g, '');
```

#### Unknown Tools

If errors detected but tool not recognized:

```json
{
  "tool": "Unknown",
  "severity": "error",
  "message": "[raw error line]",
  "category": "unparsed"
}
```

Mark in artifact warnings:

```json
{
  "warnings": ["Unknown build tool detected - some errors may not be fully parsed"]
}
```

### 5. Produce Parsed Errors Artifact

Assemble the final artifact according to `contracts/artifacts.md`:

```json
{
  "metadata": {
    "buildCommand": "npm run build",
    "timestamp": "2024-01-15T14:32:00Z",
    "duration": "12.4s",
    "exitCode": 1
  },
  "toolsDetected": ["typescript", "eslint"],
  "errors": [ /* array of ParsedError */ ],
  "warnings": [ /* array of ParsedError */ ],
  "summary": {
    "totalErrors": 3,
    "totalWarnings": 2,
    "filesWithIssues": 4,
    "truncated": false
  }
}
```

---

## Performance Optimization

### For Large Builds (100+ errors)

1. **Stop parsing after 1000 errors** - Set `summary.truncated = true`
2. **Sample remaining errors** - Collect statistics but don't parse every line
3. **Note in artifact:** Add warning about truncation

### Regex Compilation

Compile patterns once, reuse:

```javascript
const patterns = {
  typescript: /^(.+):(\d+):(\d+) - error TS(\d+): (.+)$/,
  eslint: /^  (\d+):(\d+)\s+(error|warning)\s+(.+?)\s+([a-z-/@]+)$/,
  webpack: /^ERROR in (.+)$/,
  vite: /^✘ \[ERROR\] (.+)$/
};
```

---

## Advanced Parsing

### When to Load `references/nodejs-parsers.md`

**Load when:**
- ✅ Custom/unknown tool detected
- ✅ User explicitly requests detailed parsing
- ✅ Standard patterns fail (need fallback strategies)

**Skip when:**
- ❌ All tools recognized and parsing succeeding
- ❌ Fast path (basic parsing sufficient)

The `nodejs-parsers.md` reference contains:
- Detailed regex patterns with capture groups
- Edge case handling (multi-line errors, context extraction)
- Performance optimization strategies
- Extensibility guide for adding new tools

---

## Validation

Before returning artifact, validate:

1. ✅ At least one of `errors` or `warnings` is non-empty (if build failed)
2. ✅ `metadata.buildCommand` is set
3. ✅ Each ParsedError has required fields (tool, severity, message)
4. ✅ Counts match: `summary.totalErrors === errors.length`

If validation fails, include in artifact warnings field.

---

## Example Input/Output

### Input (Raw Build Output)

```
$ npm run build

> app@1.0.0 build
> tsc

src/auth/login.ts:23:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
src/utils/validate.ts:12:8 - error TS2304: Cannot find name 'User'.

Found 2 errors in 2 files.
```

### Output (Parsed Errors Artifact)

```json
{
  "metadata": {
    "buildCommand": "npm run build",
    "timestamp": "2024-01-15T14:32:00Z",
    "duration": "4.2s",
    "exitCode": 1
  },
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
      "code": "TS2304",
      "message": "Cannot find name 'User'",
      "file": "src/utils/validate.ts",
      "line": 12,
      "column": 8,
      "category": "type"
    }
  ],
  "warnings": [],
  "summary": {
    "totalErrors": 2,
    "totalWarnings": 0,
    "filesWithIssues": 2,
    "truncated": false
  }
}
```

---

## Error Handling

If parsing completely fails:

```json
{
  "metadata": {
    "buildCommand": "[unknown]",
    "timestamp": "2024-01-15T14:32:00Z"
  },
  "toolsDetected": [],
  "errors": [
    {
      "tool": "Unknown",
      "severity": "error",
      "message": "Build output could not be parsed. See raw output.",
      "category": "unparsed"
    }
  ],
  "warnings": ["Build output parsing failed - returning generic error"],
  "summary": {
    "totalErrors": 1,
    "totalWarnings": 0,
    "filesWithIssues": 0,
    "truncated": false
  },
  "rawOutput": "[original build output]"
}
```

The `analyze-errors` sub-skill will handle this gracefully and generate a minimal report.

---

## Context Budget

**Estimated tokens:**
- This sub-skill file: ~1,200 tokens
- Input (build output): 1K-50K tokens (variable)
- Output (artifact): 500-5K tokens (variable)
- `nodejs-parsers.md` (if loaded): +4,700 tokens

**Total: ~3K-10K tokens** (without advanced parsing)  
**With advanced parsing: ~7K-15K tokens**

---

## Next Step

After producing the Parsed Errors Artifact, pass it to the `analyze-errors` sub-skill for grouping, root cause analysis, and prioritization.
