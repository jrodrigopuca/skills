# Node.js Build Tools - Parsing Strategies

Detailed parsing strategies for common Node.js build tools output formats.

---

## TypeScript Compiler (tsc)

### Output Format

TypeScript outputs errors in a consistent format:

```
[file]:[line]:[column] - error TS[code]: [message]
```

**Example:**

```
src/auth/login.ts:23:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

23   calculate(userId);
                ~~~~~~

Found 1 error in src/auth/login.ts:23
```

### Parsing Strategy

**Regex pattern:**

```regex
^(.+):(\d+):(\d+) - error TS(\d+): (.+)$
```

**Capture groups:**

1. File path
2. Line number
3. Column number
4. Error code (numeric part)
5. Error message

**Example parsing code:**

```javascript
const tsErrorPattern = /^(.+):(\d+):(\d+) - error TS(\d+): (.+)$/;

function parseTypeScriptError(line) {
	const match = line.match(tsErrorPattern);
	if (!match) return null;

	return {
		tool: "TypeScript",
		file: match[1],
		line: parseInt(match[2]),
		column: parseInt(match[3]),
		code: `TS${match[4]}`,
		message: match[5],
		severity: "error",
		category: categorizeTypeScriptError(match[4]),
	};
}
```

### Error Categories

TypeScript errors can be categorized by code range:

| Code Range | Category           | Priority    |
| ---------- | ------------------ | ----------- |
| TS1xxx     | Syntax errors      | 🔴 CRITICAL |
| TS2xxx     | Type errors        | 🔴 CRITICAL |
| TS4xxx     | Module resolution  | 🔴 CRITICAL |
| TS5xxx     | Configuration      | 🟡 HIGH     |
| TS6xxx     | Message/Diagnostic | ⚪ INFO     |
| TS7xxx     | Reserved           | -           |

**Categorization function:**

```javascript
function categorizeTypeScriptError(code) {
	const num = parseInt(code);
	if (num >= 1000 && num < 2000) return "syntax";
	if (num >= 2000 && num < 3000) return "type";
	if (num >= 4000 && num < 5000) return "module";
	if (num >= 5000 && num < 6000) return "config";
	return "other";
}
```

### Common TypeScript Errors

#### TS2345 - Type Mismatch

```
error TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'.
```

**Pattern:** Type incompatibility in function calls
**Grouping:** By expected vs actual type pair

#### TS2304 - Cannot Find Name

```
error TS2304: Cannot find name 'X'.
```

**Pattern:** Undefined variable/type
**Grouping:** By missing name

#### TS2339 - Property Does Not Exist

```
error TS2339: Property 'X' does not exist on type 'Y'.
```

**Pattern:** Accessing non-existent property
**Grouping:** By object type

#### TS2307 - Cannot Find Module

```
error TS2307: Cannot find module 'X' or its corresponding type declarations.
```

**Pattern:** Module import error
**Grouping:** By missing module

#### TS2322 - Type Assignment

```
error TS2322: Type 'X' is not assignable to type 'Y'.
```

**Pattern:** Variable assignment type mismatch
**Grouping:** By types involved

### Multi-line Error Context

TypeScript often includes context after the error:

```
src/file.ts:23:15 - error TS2345: [message]

23   calculate(userId);
                ~~~~~~
```

**Parsing strategy:**

- Primary line contains the error
- Following lines (indented) are context
- Stop at next error or empty line
- Include context in detailed view

---

## ESLint

### Output Format

ESLint has multiple output formats:

**Standard format (stylish):**

```
[file]
  [line]:[column]  [severity]  [message]  [ruleId]
```

**Compact format:**

```
[file]: line [line], col [column], [Severity] - [message] ([ruleId])
```

**Example (stylish):**

```
src/components/Button.tsx
  12:7   warning  'handleClick' is defined but never used  @typescript-eslint/no-unused-vars
  23:10  warning  'styles' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 2 problems (0 errors, 2 warnings)
```

### Parsing Strategy

**Regex patterns:**

For stylish format:

```regex
^  (\d+):(\d+)\s+(error|warning)\s+(.+?)\s+([a-z-/@]+)$
```

For compact format:

```regex
^(.+): line (\d+), col (\d+), (Error|Warning) - (.+?) \(([a-z-/@]+)\)$
```

**Example parsing:**

```javascript
const eslintStylePattern =
	/^  (\d+):(\d+)\s+(error|warning)\s+(.+?)\s+([a-z-/@]+)$/;
const currentFile = null; // Track current file

function parseESLintError(line, prevLine) {
	// Check if it's a file path (no leading spaces, ends with extension)
	if (!line.startsWith(" ") && /\.(ts|tsx|js|jsx)$/.test(line)) {
		currentFile = line.trim();
		return null;
	}

	// Try to match error/warning line
	const match = line.match(eslintStylePattern);
	if (!match || !currentFile) return null;

	return {
		tool: "ESLint",
		file: currentFile,
		line: parseInt(match[1]),
		column: parseInt(match[2]),
		severity: match[3],
		message: match[4],
		code: match[5], // rule ID
		category: categorizeESLintRule(match[5]),
	};
}
```

### Error Categories

ESLint rules can be categorized:

| Category          | Rules                      | Priority  |
| ----------------- | -------------------------- | --------- |
| **Errors**        | All `error` severity       | 🟡 HIGH   |
| **Code Quality**  | complexity, no-unused-vars | 🟢 MEDIUM |
| **Style**         | indent, quotes, semi       | ⚪ LOW    |
| **TypeScript**    | @typescript-eslint/\*      | 🟡 HIGH   |
| **React**         | react/\*                   | 🟡 HIGH   |
| **Accessibility** | jsx-a11y/\*                | 🟡 HIGH   |

**Categorization function:**

```javascript
function categorizeESLintRule(ruleId) {
	if (ruleId.startsWith("@typescript-eslint/")) return "typescript";
	if (ruleId.startsWith("react/")) return "react";
	if (ruleId.startsWith("jsx-a11y/")) return "accessibility";
	if (ruleId.includes("import/")) return "imports";
	if (["indent", "quotes", "semi", "comma-dangle"].includes(ruleId))
		return "style";
	if (["no-unused-vars", "no-console", "complexity"].includes(ruleId))
		return "quality";
	return "other";
}
```

### Common ESLint Rules

#### @typescript-eslint/no-unused-vars

```
warning: 'variable' is defined but never used
```

**Auto-fixable:** Partially (can't auto-determine if needed)
**Grouping:** By file

#### @typescript-eslint/no-explicit-any

```
warning: Unexpected any. Specify a different type.
```

**Auto-fixable:** No
**Grouping:** By file/module

#### react/prop-types

```
error: 'prop' is missing in props validation
```

**Auto-fixable:** No
**Grouping:** By component

#### no-console

```
warning: Unexpected console statement.
```

**Auto-fixable:** No
**Grouping:** All together

### Summary Line

ESLint includes a summary at the end:

```
✖ 147 problems (23 errors, 124 warnings)
  5 errors and 89 warnings potentially fixable with the `--fix` option.
```

**Parsing:**

```javascript
const summaryPattern = /✖ (\d+) problems? \((\d+) errors?, (\d+) warnings?\)/;
const fixablePattern = /(\d+) errors? and (\d+) warnings? potentially fixable/;

function parseESLintSummary(output) {
	const summaryMatch = output.match(summaryPattern);
	const fixableMatch = output.match(fixablePattern);

	return {
		total: summaryMatch ? parseInt(summaryMatch[1]) : 0,
		errors: summaryMatch ? parseInt(summaryMatch[2]) : 0,
		warnings: summaryMatch ? parseInt(summaryMatch[3]) : 0,
		autoFixable: fixableMatch
			? {
					errors: parseInt(fixableMatch[1]),
					warnings: parseInt(fixableMatch[2]),
				}
			: null,
	};
}
```

---

## Webpack

### Output Format

Webpack errors come in different forms:

**Module errors:**

```
ERROR in [file]
Module not found: Error: Can't resolve '[module]' in '[path]'
```

**Loader errors:**

```
ERROR in [file]
Module build failed (from [loader]):
[error details]
```

**Configuration errors:**

```
[webpack-cli] Error: [message]
```

**Example:**

```
ERROR in ./src/components/Button.tsx
Module not found: Error: Can't resolve '@/styles/button.css' in '/project/src/components'
 @ ./src/components/Button.tsx 3:0-36

ERROR in ./src/utils/format.ts
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: Unexpected token (12:15)
```

### Parsing Strategy

**Regex patterns:**

```regex
^ERROR in (.+)$
^Module not found: Error: Can't resolve '(.+)' in '(.+)'$
^Module build failed.*:$
```

**Example parsing:**

```javascript
function parseWebpackError(lines, startIndex) {
	const errorLine = lines[startIndex];
	const match = errorLine.match(/^ERROR in (.+)$/);
	if (!match) return null;

	const file = match[1];
	let message = "";
	let category = "unknown";

	// Check next lines for error details
	const nextLine = lines[startIndex + 1];

	if (nextLine?.includes("Module not found")) {
		const moduleMatch = nextLine.match(/Can't resolve '(.+)' in '(.+)'/);
		message = nextLine;
		category = "module-resolution";
	} else if (nextLine?.includes("Module build failed")) {
		// Collect multiple lines for build errors
		message = lines.slice(startIndex + 1, startIndex + 5).join("\n");
		category = "build-error";
	}

	return {
		tool: "Webpack",
		file: file,
		message: message,
		category: category,
		severity: "error",
	};
}
```

### Error Categories

| Category              | Pattern                             | Priority    |
| --------------------- | ----------------------------------- | ----------- |
| **Module Resolution** | "Module not found", "Can't resolve" | 🔴 CRITICAL |
| **Build Errors**      | "Module build failed"               | 🔴 CRITICAL |
| **Configuration**     | "[webpack-cli] Error"               | 🔴 CRITICAL |
| **Warnings**          | "WARNING in", "asset size limit"    | 🟢 MEDIUM   |

### Common Webpack Errors

#### Module Not Found

```
ERROR in ./src/file.tsx
Module not found: Error: Can't resolve 'module-name'
```

**Pattern:** Missing dependency or incorrect path
**Grouping:** By missing module name

#### Module Build Failed

```
ERROR in ./src/file.tsx
Module build failed (from babel-loader):
SyntaxError: Unexpected token
```

**Pattern:** Syntax error during transpilation
**Grouping:** By loader and error type

#### Asset Size Warnings

```
WARNING in asset size limit: The following asset(s) exceed the recommended size limit
```

**Pattern:** Bundle size too large
**Grouping:** All together

---

## Vite

### Output Format

Vite uses colors and symbols:

```
✘ [ERROR] [message]

  [file]:[line]:[column]:
    [line content]
    [pointer to error]
```

**Example:**

```
✘ [ERROR] Could not resolve "react-dom/client"

    src/main.tsx:2:27:
      2 │ import ReactDOM from 'react-dom/client'
        │                          ~~~~~~~~~~~~~~~~~~~
        ╵                          "react-dom/client"

  You can mark the path "react-dom/client" as external to exclude it from the bundle
```

### Parsing Strategy

**Regex patterns:**

```regex
^✘ \[ERROR\] (.+)$
^\s+(\S+):(\d+):(\d+):$
```

**Example parsing:**

```javascript
function parseViteError(lines, startIndex) {
	const errorLine = lines[startIndex];
	const match = errorLine.match(/^✘ \[ERROR\] (.+)$/);
	if (!match) return null;

	const message = match[1];

	// Look for file location in next lines
	let file = null,
		line = null,
		column = null;
	for (let i = startIndex + 1; i < startIndex + 5; i++) {
		const locationMatch = lines[i]?.match(/^\s+(\S+):(\d+):(\d+):$/);
		if (locationMatch) {
			file = locationMatch[1];
			line = parseInt(locationMatch[2]);
			column = parseInt(locationMatch[3]);
			break;
		}
	}

	return {
		tool: "Vite",
		file: file,
		line: line,
		column: column,
		message: message,
		severity: "error",
		category: categorizeViteError(message),
	};
}

function categorizeViteError(message) {
	if (message.includes("Could not resolve")) return "module-resolution";
	if (message.includes("Transform failed")) return "build-error";
	if (message.includes("Parse error")) return "syntax";
	return "other";
}
```

### Common Vite Errors

#### Could Not Resolve

```
✘ [ERROR] Could not resolve "module-name"
```

**Pattern:** Module import error
**Grouping:** By module name

#### Transform Failed

```
✘ [ERROR] Transform failed with 1 error:
[file]:[line]:[column]: ERROR: [message]
```

**Pattern:** Build/transpilation error
**Grouping:** By file and error type

---

## npm/yarn/pnpm Build Scripts

### Output Format

Package managers wrap tool outputs:

```
> [package]@[version] [script]
> [command]

[tool output]

npm ERR! code ELIFECYCLE
npm ERR! errno 1
```

### Parsing Strategy

**Identify the actual build tool:**

```javascript
function identifyBuildTool(output) {
	if (output.includes("tsc")) return "typescript";
	if (output.includes("eslint")) return "eslint";
	if (output.includes("webpack")) return "webpack";
	if (output.includes("vite")) return "vite";
	return "unknown";
}
```

**Extract tool output:**

```javascript
function extractBuildOutput(npmOutput) {
	const lines = npmOutput.split("\n");
	const startPattern = /^> .+ [a-z]+$/; // "> package@version script"
	const errorPattern = /^npm ERR!/;

	let collecting = false;
	let buildOutput = [];

	for (const line of lines) {
		if (startPattern.test(line)) {
			collecting = true;
			continue;
		}
		if (errorPattern.test(line)) {
			collecting = false;
			break;
		}
		if (collecting && line.trim()) {
			buildOutput.push(line);
		}
	}

	return buildOutput.join("\n");
}
```

---

## Complete Parsing Pipeline

### Step 1: Detect Tools

```javascript
function detectTools(output) {
	const tools = new Set();

	if (/- error TS\d+:/.test(output)) tools.add("typescript");
	if (/error|warning\s+\S+\s+[a-z-/@]+$/.test(output)) tools.add("eslint");
	if (/ERROR in \.\//.test(output)) tools.add("webpack");
	if (/✘ \[ERROR\]/.test(output)) tools.add("vite");

	return Array.from(tools);
}
```

### Step 2: Parse Each Tool

```javascript
function parseAllErrors(output) {
	const tools = detectTools(output);
	const errors = [];

	for (const tool of tools) {
		switch (tool) {
			case "typescript":
				errors.push(...parseTypeScriptErrors(output));
				break;
			case "eslint":
				errors.push(...parseESLintErrors(output));
				break;
			case "webpack":
				errors.push(...parseWebpackErrors(output));
				break;
			case "vite":
				errors.push(...parseViteErrors(output));
				break;
		}
	}

	return errors;
}
```

### Step 3: Group and Prioritize

```javascript
function groupErrors(errors) {
	const groups = new Map();

	for (const error of errors) {
		const key = `${error.tool}-${error.code || error.category}`;
		if (!groups.has(key)) {
			groups.set(key, {
				tool: error.tool,
				code: error.code,
				category: error.category,
				errors: [],
				priority: calculatePriority(error),
			});
		}
		groups.get(key).errors.push(error);
	}

	return Array.from(groups.values()).sort((a, b) => b.priority - a.priority);
}

function calculatePriority(error) {
	// Critical: Build-blocking errors
	if (
		error.severity === "error" &&
		["typescript", "webpack", "vite"].includes(error.tool)
	) {
		return 100;
	}

	// High: ESLint errors, TypeScript in non-strict mode
	if (error.severity === "error") return 75;

	// Medium: Code quality warnings
	if (
		error.severity === "warning" &&
		["no-unused-vars", "complexity"].includes(error.code)
	) {
		return 50;
	}

	// Low: Style warnings
	return 25;
}
```

---

## Testing Parsing

### Test Cases

```javascript
// Test TypeScript parsing
const tsOutput = `
src/file.ts:23:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
`;

const parsed = parseTypeScriptError(tsOutput);
assert(parsed.code === "TS2345");
assert(parsed.line === 23);

// Test ESLint parsing
const eslintOutput = `
src/file.ts
  12:7  warning  'variable' is defined but never used  @typescript-eslint/no-unused-vars
`;

const eslintParsed = parseESLintError(eslintOutput);
assert(eslintParsed.code === "@typescript-eslint/no-unused-vars");

// Test Webpack parsing
const webpackOutput = `
ERROR in ./src/file.tsx
Module not found: Error: Can't resolve 'react'
`;

const webpackParsed = parseWebpackError(webpackOutput);
assert(webpackParsed.category === "module-resolution");
```

---

## Edge Cases

### Multi-file Errors

Some errors span multiple files:

```
ERROR in Entry module not found: Error: Can't resolve './src/index' in '/project'
```

**Strategy:** Treat as project-level error, not file-specific

### Truncated Output

CI systems may truncate long output:

```
[... 200 more lines]
```

**Strategy:** Note in report that output was truncated, show sampled errors

### ANSI Color Codes

Terminal output includes color codes:

```
\x1b[31merror\x1b[0m TS2345
```

**Strategy:** Strip ANSI codes before parsing:

```javascript
function stripAnsi(text) {
	return text.replace(/\x1b\[[0-9;]*m/g, "");
}
```

### Mixed Languages

Projects with mixed TypeScript and JavaScript:

```
src/old-file.js:45 - warning: Consider using semicolons
src/new-file.ts:12 - error TS2304: Cannot find name
```

**Strategy:** Parse both, group separately, note language in report

---

## Performance Considerations

### Large Outputs

For outputs with 1000+ errors:

1. **Sampling:** Show top 10 of each group, note truncation
2. **Streaming:** Parse line-by-line, don't load entire output
3. **Caching:** Cache parsed results for re-runs

### Regex Optimization

- Compile regex patterns once
- Use non-capturing groups where possible: `(?:...)` vs `(...)`
- Limit backtracking with atomic groups

```javascript
// Optimized patterns
const patterns = {
	typescript: /^(.+):(\d+):(\d+) - error TS(\d+): (.+)$/,
	eslint: /^  (\d+):(\d+)\s+(?:error|warning)\s+(.+?)\s+([a-z-/@]+)$/,
};

// Reuse compiled patterns
function parse(line) {
	return line.match(patterns.typescript) || line.match(patterns.eslint);
}
```

---

## Extensibility

### Adding New Tools

To add support for a new build tool:

1. **Identify output format:** Analyze error messages
2. **Create regex patterns:** Match error lines
3. **Write parser function:** Extract structured data
4. **Categorize errors:** Map to priority levels
5. **Add to pipeline:** Register in tool detection
6. **Test thoroughly:** Use real-world examples

### Example: Adding Prettier

```javascript
// Prettier output format
// [error] file.js: SyntaxError: Unexpected token (1:5)

function parsePrettierError(line) {
	const match = line.match(/^\[error\] (.+): (.+?) \((\d+):(\d+)\)$/);
	if (!match) return null;

	return {
		tool: "Prettier",
		file: match[1],
		message: match[2],
		line: parseInt(match[3]),
		column: parseInt(match[4]),
		severity: "error",
		category: "formatting",
	};
}

// Register in tool detection
function detectTools(output) {
	// ... existing tools
	if (/^\[error\] .+: .+? \(\d+:\d+\)$/.test(output)) {
		tools.add("prettier");
	}
	return tools;
}
```
