# Solutions Database

Comprehensive solutions for common Node.js build errors.

---

## TypeScript Errors

### TS2345: Argument Type Mismatch

**Error message:**

```
Argument of type 'X' is not assignable to parameter of type 'Y'
```

**Common causes:**

1. Passing wrong type to function
2. Missing type conversion
3. Union type narrowing needed
4. Async/Promise handling

**Solutions:**

#### Solution 1: Type Assertion

```typescript
// ❌ Error
calculate(userId); // userId is string, expects number

// ✅ Fix
calculate(Number(userId));
calculate(parseInt(userId, 10));
```

#### Solution 2: Type Guard

```typescript
// ❌ Error
function handle(value: string | number) {
	value.toFixed(2); // Error: toFixed doesn't exist on string
}

// ✅ Fix
function handle(value: string | number) {
	if (typeof value === "number") {
		value.toFixed(2);
	}
}
```

#### Solution 3: Generic Constraints

```typescript
// ❌ Error
function process<T>(item: T) {
	item.length; // Error: length doesn't exist on type T
}

// ✅ Fix
function process<T extends { length: number }>(item: T) {
	item.length; // OK
}
```

---

### TS2304: Cannot Find Name

**Error message:**

```
Cannot find name 'X'
```

**Common causes:**

1. Variable not imported
2. Typo in variable name
3. Missing type declaration
4. Scope issue

**Solutions:**

#### Solution 1: Add Import

```typescript
// ❌ Error
const result = React.useState(); // Cannot find name 'React'

// ✅ Fix
import React from "react";
const result = React.useState();
```

#### Solution 2: Install Types

```typescript
// ❌ Error
import express from "express"; // Cannot find module 'express'

// ✅ Fix - Install type definitions
// npm install --save-dev @types/express
import express from "express";
```

#### Solution 3: Declare Global

```typescript
// ❌ Error
const env = process.env.API_KEY;  // Cannot find name 'process'

// ✅ Fix - Add to tsconfig.json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

#### Solution 4: Declare Custom Type

```typescript
// ❌ Error
const config: AppConfig = {}; // Cannot find name 'AppConfig'

// ✅ Fix - Create type file
// src/types/app.d.ts
declare interface AppConfig {
	apiUrl: string;
	timeout: number;
}
```

---

### TS2339: Property Does Not Exist

**Error message:**

```
Property 'X' does not exist on type 'Y'
```

**Common causes:**

1. Accessing non-existent property
2. Wrong type annotation
3. Optional chaining needed
4. Type assertion needed

**Solutions:**

#### Solution 1: Fix Property Name

```typescript
// ❌ Error
user.userName; // Property 'userName' does not exist on type 'User'

// ✅ Fix
user.username; // Correct property name
```

#### Solution 2: Optional Chaining

```typescript
// ❌ Error
const city = user.address.city; // address might be undefined

// ✅ Fix
const city = user.address?.city;
const city = user.address?.city ?? "Unknown";
```

#### Solution 3: Type Assertion

```typescript
// ❌ Error
const response = await fetch(url);
response.data; // Property 'data' does not exist on type 'Response'

// ✅ Fix
interface ApiResponse extends Response {
	data: any;
}
const response = (await fetch(url)) as ApiResponse;
response.data;
```

#### Solution 4: Extend Interface

```typescript
// ❌ Error
window.myCustomProperty; // Property 'myCustomProperty' does not exist

// ✅ Fix - Create global.d.ts
declare global {
	interface Window {
		myCustomProperty: string;
	}
}
```

---

### TS2307: Cannot Find Module

**Error message:**

```
Cannot find module 'X' or its corresponding type declarations
```

**Common causes:**

1. Module not installed
2. Missing type definitions
3. Wrong import path
4. Path mapping not configured

**Solutions:**

#### Solution 1: Install Package

```bash
# ❌ Error: Cannot find module 'lodash'

# ✅ Fix
npm install lodash
npm install --save-dev @types/lodash
```

#### Solution 2: Configure Path Mapping

```typescript
// ❌ Error: Cannot find module '@/utils/helpers'

// ✅ Fix - tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### Solution 3: Fix Relative Path

```typescript
// ❌ Error
import { helper } from "utils/helper"; // Cannot find module

// ✅ Fix
import { helper } from "./utils/helper";
import { helper } from "../utils/helper";
```

#### Solution 4: Add Module Declaration

```typescript
// ❌ Error: Cannot find module '*.svg'

// ✅ Fix - custom.d.ts
declare module "*.svg" {
	const content: string;
	export default content;
}

declare module "*.css" {
	const classes: { [key: string]: string };
	export default classes;
}
```

---

### TS2322: Type Not Assignable

**Error message:**

```
Type 'X' is not assignable to type 'Y'
```

**Common causes:**

1. Variable type mismatch
2. Missing properties
3. Readonly conflicts
4. Union type issues

**Solutions:**

#### Solution 1: Fix Initial Value

```typescript
// ❌ Error
const count: number = ""; // Type 'string' not assignable to 'number'

// ✅ Fix
const count: number = 0;
const count = 0; // Type inference
```

#### Solution 2: Add Missing Properties

```typescript
// ❌ Error
interface User {
	id: number;
	name: string;
	email: string;
}

const user: User = {
	id: 1,
	name: "John",
}; // Missing property 'email'

// ✅ Fix
const user: User = {
	id: 1,
	name: "John",
	email: "john@example.com",
};
```

#### Solution 3: Handle Readonly

```typescript
// ❌ Error
const arr: readonly number[] = [1, 2, 3];
const mutable: number[] = arr; // readonly not assignable to mutable

// ✅ Fix
const mutable: number[] = [...arr]; // Create mutable copy
const mutable: readonly number[] = arr; // Keep readonly
```

---

### TS2571: Object is of Type Unknown

**Error message:**

```
Object is of type 'unknown'
```

**Common causes:**

1. try-catch error object
2. API response without typing
3. User input
4. Third-party library

**Solutions:**

#### Solution 1: Type Guard

```typescript
// ❌ Error
try {
	// code
} catch (error) {
	console.log(error.message); // Object is of type 'unknown'
}

// ✅ Fix
try {
	// code
} catch (error) {
	if (error instanceof Error) {
		console.log(error.message);
	}
}
```

#### Solution 2: Type Assertion with Validation

```typescript
// ❌ Error
const data: unknown = await response.json();
console.log(data.user); // Object is of type 'unknown'

// ✅ Fix
interface ApiData {
	user: string;
}

function isApiData(obj: unknown): obj is ApiData {
	return typeof obj === "object" && obj !== null && "user" in obj;
}

const data: unknown = await response.json();
if (isApiData(data)) {
	console.log(data.user); // OK
}
```

---

## ESLint Errors

### @typescript-eslint/no-unused-vars

**Error message:**

```
'variable' is defined but never used
```

**Solutions:**

#### Solution 1: Remove Unused Variable

```typescript
// ❌ Warning
function calculate(a: number, b: number) {
	const result = a + b;
	const temp = a * 2; // Never used
	return result;
}

// ✅ Fix
function calculate(a: number, b: number) {
	const result = a + b;
	return result;
}
```

#### Solution 2: Use Underscore Prefix

```typescript
// ❌ Warning
function handler(event: Event, context: Context) {
	console.log(event);
	// context is never used
}

// ✅ Fix: Signal intention
function handler(event: Event, _context: Context) {
	console.log(event);
}
```

#### Solution 3: Disable for Specific Case

```typescript
// Only use when truly necessary
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _keepForReference = legacyFunction();
```

---

### @typescript-eslint/no-explicit-any

**Error message:**

```
Unexpected any. Specify a different type.
```

**Solutions:**

#### Solution 1: Use Unknown

```typescript
// ❌ Warning
function process(data: any) {
	console.log(data);
}

// ✅ Fix
function process(data: unknown) {
	if (typeof data === "string") {
		console.log(data.toUpperCase());
	}
}
```

#### Solution 2: Define Proper Type

```typescript
// ❌ Warning
const config: any = loadConfig();

// ✅ Fix
interface Config {
	apiUrl: string;
	timeout: number;
	debug?: boolean;
}

const config: Config = loadConfig();
```

#### Solution 3: Use Generic

```typescript
// ❌ Warning
function identity(value: any): any {
	return value;
}

// ✅ Fix
function identity<T>(value: T): T {
	return value;
}
```

---

### no-console

**Error message:**

```
Unexpected console statement
```

**Solutions:**

#### Solution 1: Use Logger

```typescript
// ❌ Warning
console.log("Debug info");
console.error("Error occurred");

// ✅ Fix: Create logger utility
// utils/logger.ts
export const logger = {
	info: (msg: string) =>
		process.env.NODE_ENV !== "production" && console.log(msg),
	error: (msg: string) => console.error(msg),
	debug: (msg: string) => process.env.DEBUG && console.log(msg),
};

// Usage
import { logger } from "./utils/logger";
logger.info("Debug info");
logger.error("Error occurred");
```

#### Solution 2: Disable in Dev Files

```typescript
// In development-only files
/* eslint-disable no-console */
console.log("Development debug info");
```

---

### react/prop-types

**Error message:**

```
'prop' is missing in props validation
```

**Solutions:**

#### Solution 1: Use TypeScript (Recommended)

```typescript
// ❌ Warning
export function Button(props) {
  return <button>{props.label}</button>;
}

// ✅ Fix
interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

#### Solution 2: Disable Rule (if using TypeScript)

```javascript
// .eslintrc.js
module.exports = {
	rules: {
		"react/prop-types": "off", // TypeScript handles this
	},
};
```

---

### react/jsx-key

**Error message:**

```
Missing "key" prop for element in iterator
```

**Solutions:**

#### Solution 1: Add Unique Key

```tsx
// ❌ Error
const list = items.map((item) => <li>{item.name}</li>);

// ✅ Fix
const list = items.map((item) => <li key={item.id}>{item.name}</li>);
```

#### Solution 2: Use Index (Last Resort)

```tsx
// Only if items are static and never reordered
const list = items.map((item, index) => <li key={index}>{item.name}</li>);
```

---

## Webpack Errors

### Module Not Found

**Error message:**

```
Module not found: Error: Can't resolve 'X' in 'Y'
```

**Solutions:**

#### Solution 1: Install Dependency

```bash
# ❌ Error: Can't resolve 'react'

# ✅ Fix
npm install react
```

#### Solution 2: Fix Import Path

```javascript
// ❌ Error: Can't resolve '@/components/Button'

// ✅ Fix - webpack.config.js
module.exports = {
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src/"),
		},
	},
};
```

#### Solution 3: Add Extension

```javascript
// ❌ Error: Can't resolve './component'

// ✅ Fix - webpack.config.js
module.exports = {
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
	},
};
```

---

### Module Parse Failed

**Error message:**

```
Module parse failed: Unexpected token
You may need an appropriate loader to handle this file type
```

**Solutions:**

#### Solution 1: Add Loader

```javascript
// ❌ Error parsing .tsx files

// ✅ Fix - webpack.config.js
module.exports = {
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
};
```

#### Solution 2: Configure Babel

```javascript
// ❌ Error parsing JSX

// ✅ Fix - webpack.config.js
module.exports = {
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-react"],
					},
				},
			},
		],
	},
};
```

---

### Asset Size Limit Exceeded

**Error message:**

```
WARNING in asset size limit: The following asset(s) exceed the recommended size limit
```

**Solutions:**

#### Solution 1: Code Splitting

```javascript
// webpack.config.js
module.exports = {
	optimization: {
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					priority: 10,
				},
			},
		},
	},
};
```

#### Solution 2: Lazy Loading

```javascript
// ❌ Import everything upfront
import HeavyComponent from "./HeavyComponent";

// ✅ Lazy load
const HeavyComponent = React.lazy(() => import("./HeavyComponent"));
```

#### Solution 3: Increase Limit

```javascript
// Only if justified
module.exports = {
	performance: {
		maxAssetSize: 500000, // 500 KB
		maxEntrypointSize: 500000,
	},
};
```

---

## Vite Errors

### Could Not Resolve

**Error message:**

```
✘ [ERROR] Could not resolve "X"
```

**Solutions:**

#### Solution 1: Install Package

```bash
# ❌ Error: Could not resolve "react-dom/client"

# ✅ Fix
npm install react-dom
```

#### Solution 2: Add Alias

```javascript
// ❌ Error: Could not resolve "@/components"

// ✅ Fix - vite.config.ts
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
```

---

### Transform Failed

**Error message:**

```
✘ [ERROR] Transform failed with 1 error
```

**Solutions:**

#### Solution 1: Fix Syntax Error

```typescript
// ❌ Error
const value = ;  // Syntax error

// ✅ Fix
const value = 0;
```

#### Solution 2: Add Plugin

```javascript
// ❌ Error transforming .css files

// ✅ Fix - vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
	css: {
		modules: {
			localsConvention: "camelCase",
		},
	},
});
```

---

## Dependency Issues

### Peer Dependency Not Installed

**Error message:**

```
npm WARN XXX requires a peer of YYY but none is installed
```

**Solutions:**

#### Solution 1: Install Peer Dependency

```bash
# ❌ Warning: react-router-dom requires react

# ✅ Fix
npm install react react-dom
```

#### Solution 2: Check Compatibility

```bash
# Check what version is needed
npm info react-router-dom peerDependencies

# Install compatible version
npm install react@^18.0.0
```

---

### Version Conflict

**Error message:**

```
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! Could not resolve dependency:
npm ERR! peer X@"Y" from Z
```

**Solutions:**

#### Solution 1: Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update to compatible versions
npm update
```

#### Solution 2: Use --force (Caution)

```bash
# Only if you understand the implications
npm install --force
```

#### Solution 3: Use --legacy-peer-deps

```bash
# For gradual migration
npm install --legacy-peer-deps
```

---

## Configuration Errors

### tsconfig.json Issues

**Common problems and solutions:**

#### Problem: Imports Not Resolved

```json
// ❌ Imports with @ not working

// ✅ Fix
{
	"compilerOptions": {
		"baseUrl": ".",
		"paths": {
			"@/*": ["src/*"],
			"@components/*": ["src/components/*"],
			"@utils/*": ["src/utils/*"]
		}
	}
}
```

#### Problem: JSX Not Recognized

```json
// ❌ Cannot use JSX unless --jsx flag is provided

// ✅ Fix
{
	"compilerOptions": {
		"jsx": "react-jsx" // or "react" for older React
	}
}
```

#### Problem: Module Resolution Issues

```json
// ❌ Can't find node modules

// ✅ Fix
{
	"compilerOptions": {
		"moduleResolution": "node",
		"esModuleInterop": true,
		"allowSyntheticDefaultImports": true
	}
}
```

---

### .eslintrc Issues

**Common problems and solutions:**

#### Problem: Parser Error

```json
// ❌ Parsing error: Cannot read property 'map' of undefined

// ✅ Fix
{
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": 2020,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		},
		"project": "./tsconfig.json"
	}
}
```

#### Problem: Rules Not Working

```json
// ❌ TypeScript rules not applied

// ✅ Fix
{
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended"
	],
	"plugins": ["@typescript-eslint", "react"]
}
```

---

## Quick Reference Matrix

| Error Code                 | Category          | Priority    | Auto-fix | Typical Solution             |
| -------------------------- | ----------------- | ----------- | -------- | ---------------------------- |
| TS2345                     | Type mismatch     | 🔴 Critical | No       | Add type conversion or guard |
| TS2304                     | Missing name      | 🔴 Critical | No       | Add import or type           |
| TS2339                     | Missing property  | 🔴 Critical | No       | Fix property name or type    |
| TS2307                     | Module not found  | 🔴 Critical | No       | Install package or fix path  |
| TS2322                     | Assignment error  | 🔴 Critical | No       | Fix type or value            |
| no-unused-vars             | Code quality      | 🟢 Medium   | Yes      | Remove or use underscore     |
| no-explicit-any            | Type safety       | 🟡 High     | No       | Use proper type or unknown   |
| no-console                 | Best practice     | ⚪ Low      | No       | Use logger utility           |
| react/prop-types           | React validation  | 🟡 High     | No       | Use TypeScript interfaces    |
| react/jsx-key              | React requirement | 🟡 High     | No       | Add key prop                 |
| Module not found (Webpack) | Build error       | 🔴 Critical | No       | Install or configure alias   |
| Asset size limit           | Performance       | 🟢 Medium   | No       | Code splitting               |
| Could not resolve (Vite)   | Build error       | 🔴 Critical | No       | Install or add alias         |

---

## Solution Selection Strategy

When multiple solutions exist:

1. **Fastest:** Quick fixes that don't change architecture
2. **Safest:** Solutions that maintain type safety
3. **Best Practice:** Long-term maintainable approaches
4. **Last Resort:** Disabling rules or using 'any'

**Decision tree:**

```
Is there a quick fix (1-2 lines)?
  → Yes: Apply it
  → No: ↓

Does it require package installation?
  → Yes: Install and configure
  → No: ↓

Does it require configuration change?
  → Yes: Update config file
  → No: ↓

Does it require refactoring?
  → Yes: Suggest refactoring approach
  → No: Document as limitation
```
