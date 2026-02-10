# Build Report Examples

Complete examples showing how to structure reports that **link to official documentation** instead of duplicating solutions.

---

## Example 1: TypeScript Build Failure - Linking to Docs

### Context

- **Project:** E-commerce platform monorepo
- **Tools:** TypeScript, ESLint, Webpack
- **Build command:** `npm run build:all`
- **Focus:** Show how to format reports with doc links, not inline solutions

### Build Output (Raw)

```
> ecommerce-platform@1.0.0 build:all
> lerna run build

lerna notice cli v6.0.0
lerna info Executing command in 3 packages: "npm run build"

@ecommerce/shared:
packages/shared/src/types/Product.ts:15:3 - error TS2322: Type 'string' is not assignable to type 'number'.

15   quantity: "10",
     ~~~~~~~~

packages/shared/src/types/Product.ts:23:5 - error TS2339: Property 'category' does not exist on type 'Product'.

23     category: item.category,
       ~~~~~~~~

@ecommerce/frontend:
packages/frontend/src/components/Cart.tsx:45:7 - error TS2345: Argument of type 'Product[]' is not assignable to parameter of type 'CartItem[]'.

45       calculateTotal(products)
                        ~~~~~~~~

packages/frontend/src/App.tsx
  12:7  warning  'oldComponent' is defined but never used  @typescript-eslint/no-unused-vars
  28:5  warning  Unexpected console statement  no-console

@ecommerce/backend:
packages/backend/src/server.ts:89:12 - error TS2304: Cannot find name 'Express'.

89   const app: Express = express();
               ~~~~~~~

ERROR in packages/frontend/dist/main.js
File size exceeds 500 kB limit (actual: 847 kB)

lerna ERR! npm run build exited 1 in '@ecommerce/shared'
lerna ERR! npm run build exited 1 in '@ecommerce/frontend'
```

### Generated Report

---

# 🔴 BUILD FAILED

**Project:** E-commerce Platform Monorepo  
**Build command:** `npm run build:all`  
**Duration:** 34 seconds  
**Date:** 2024-01-15 14:32:00

---

## 📊 Executive Summary

Build failed with **4 critical errors** across 3 packages. Primary issues are type mismatches in shared package propagating to frontend, and missing type declaration in backend. Additionally, **2 warnings** about code quality and **1 performance warning** about bundle size.

**Impact:** All packages blocked from deployment. Estimated fix time: 15-30 minutes.

---

## ❌ Errors

### 🔴 CRITICAL - TypeScript Type Errors (3 errors)

Type system violations preventing compilation. Root cause analysis shows cascading errors from shared package.

**Affected files:**

- [packages/shared/src/types/Product.ts](packages/shared/src/types/Product.ts#L15) (2 errors)
- [packages/frontend/src/components/Cart.tsx](packages/frontend/src/components/Cart.tsx#L45) (1 error)

---

#### Error 1: TS2322 - Type Assignment Error

```
packages/shared/src/types/Product.ts:15:3
Type 'string' is not assignable to type 'number'
```

**Context:** The `quantity` property expects `number` but receives string `"10"`.

📖 **Official Documentation:**

- [TypeScript: Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)

💡 **Quick hint:** API likely returns strings. Check type conversion (Number(), parseInt()) or update interface to accept string | number. See Type Compatibility docs for details.

---

#### Error 2: TS2339 - Property Does Not Exist

```
packages/shared/src/types/Product.ts:23:5
Property 'category' does not exist on type 'Product'
```

**Context:** Accessing undefined property `category` on Product interface.

📖 **Official Documentation:**

- [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)

💡 **Quick hint:** Add missing property to interface or use optional property if not always present. Verify database schema matches expected interface.

---

#### Error 3: TS2345 - Argument Type Mismatch

```
packages/frontend/src/components/Cart.tsx:45:7
Argument of type 'Product[]' is not assignable to parameter of type 'CartItem[]'
```

**Context:** Function `calculateTotal()` expects CartItem[] but receives Product[].

📖 **Official Documentation:**

- [Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

## 💡 **Quick hint:** Consider mapping Product[] to CartItem[], using generics to accept both types, or making CartItem extend Product. See Generics docs for best approach.

### 🔴 CRITICAL - Missing Type Declaration (1 error)

#### Error 4: TS2304 - Cannot Find Name 'Express'

```
packages/backend/src/server.ts:89:12
Cannot find name 'Express'
```

**Context:** TypeScript can't find Express type. Type definitions package not installed.

📖 **Official Documentation:**

- [DefinitelyTyped @types packages](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)
- [npm @types](https://www.npmjs.com/~types)

💡 **Quick hint:** Install `@types/express` package. See Declaration Files docs for proper setup.

---

## ⚠️ Warnings

### 🟡 HIGH - Code Quality Issues (2 warnings)

#### Warning 1 & 2: Unused Variables and Console Statements

```
packages/frontend/src/App.tsx:12:7 - 'oldComponent' is defined but never used
packages/frontend/src/App.tsx:28:5 - Unexpected console statement
```

📖 **Official Documentation:**

- [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)
- [TypeScript ESLint: no-unused-vars](https://typescript-eslint.io/rules/no-unused-vars/)
- [ESLint: no-console](https://eslint.org/docs/latest/rules/no-console)

💡 **Quick hint:** Remove unused vars or prefix with `_`. Replace console with proper logger. Check ESLint docs for auto-fix options.

---

### 🟢 MEDIUM - Performance Warning (1 warning)

#### Warning 3: Bundle Size Exceeds Limit

```
ERROR in packages/frontend/dist/main.js
File size exceeds 500 kB limit (actual: 847 kB)
```

**Context:** Main bundle 69% over recommended size.

📖 **Official Documentation:**

- [Webpack: Code Splitting](https://webpack.js.org/guides/code-splitting/)
- [Webpack: Performance](https://webpack.js.org/configuration/performance/)
- [Webpack: Bundle Analysis](https://webpack.js.org/guides/code-splitting/#bundle-analysis)

💡 **Quick hint:** Enable code splitting, lazy load routes, analyze bundle with webpack-bundle-analyzer. See Code Splitting guide for implementation.

---

## 📦 Dependencies

| Package        | Current       | Latest  | Status      | Action               |
| -------------- | ------------- | ------- | ----------- | -------------------- |
| typescript     | 5.0.4         | 5.3.3   | ⚠️ Outdated | Update recommended   |
| @types/express | Not installed | 4.17.21 | ❌ Missing  | **Install required** |
| webpack        | 5.89.0        | 5.89.0  | ✅ Current  | None                 |
| eslint         | 8.54.0        | 8.56.0  | ⚠️ Outdated | Update recommended   |

---

## 📈 Build Metrics

| Metric            | Value  | Status |
| ----------------- | ------ | ------ |
| Total errors      | 4      | 🔴     |
| Total warnings    | 3      | 🟡     |
| Build duration    | 34s    | ⚪     |
| Bundle size       | 847 KB | 🔴     |
| Affected packages | 3/3    | 🔴     |

---

## 🎯 Next Steps

### Immediate Actions (Required for build) ✅

**Priority 1: Fix type definitions in shared package**

- 📍 packages/shared/src/types/Product.ts:15 - Convert quantity to number
- 📍 packages/shared/src/types/Product.ts:23 - Add category property
- 📖 [TypeScript: Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)

**Priority 2: Install missing type definitions**

- 📍 packages/backend - Install @types/express
- 📖 [DefinitelyTyped packages](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)

**Priority 3: Fix type conversion in frontend**

- 📍 packages/frontend/src/components/Cart.tsx:45 - Map Product[] to CartItem[]
- 📖 [TypeScript: Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

### Follow-up Actions (Code quality) 🟡

**Clean up warnings:**

- Remove unused variables or prefix with underscore
- Replace console statements with logger
- 📖 [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)

### Optional Improvements (Performance) 🟢

**Optimize bundle size:**

- Implement code splitting in webpack config
- Enable lazy loading for routes
- Analyze bundle with webpack-bundle-analyzer
- 📖 [Webpack: Code Splitting Guide](https://webpack.js.org/guides/code-splitting/)

### Configuration Improvements 📝

- Add pre-commit hooks to catch errors early
  - 📖 [Husky + lint-staged](https://typicode.github.io/husky/)
- Enable stricter TypeScript compiler options
  - 📖 [TSConfig: strict mode](https://www.typescriptlang.org/tsconfig#strict)
- Configure CI checks before merge
  - 📖 [GitHub Actions: Node.js CI](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)

---

## 📚 Resources

- [TypeScript Handbook - Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [Webpack Code Splitting Guide](https://webpack.js.org/guides/code-splitting/)
- [Lerna Monorepo Best Practices](https://lerna.js.org/docs/introduction)

---

_Generated by build-report skill • 15 Jan 2024 14:32_

---

## Example 2: Clean Build with Warnings

### Context

- **Project:** Blog CMS
- **Tools:** Vite, TypeScript, ESLint
- **Build command:** `npm run build`

### Build Output (Raw)

```
> blog-cms@2.1.0 build
> vite build

vite v5.0.10 building for production...
✓ 347 modules transformed.

src/components/Editor.tsx
  45:9  warning  Unexpected console statement  no-console
  67:3  warning  'setError' is assigned a value but never used  @typescript-eslint/no-unused-vars

src/utils/markdown.ts
  12:1  warning  Missing return type on function  @typescript-eslint/explicit-function-return-type

dist/index.html                    2.45 kB
dist/assets/index-b3f5e123.css    45.67 kB │ gzip:  12.34 kB
dist/assets/index-d89a7654.js    234.12 kB │ gzip:  89.45 kB

✓ built in 3.42s
```

### Generated Report

---

# ✅ BUILD SUCCEEDED

**Project:** Blog CMS  
**Build command:** `npm run build`  
**Duration:** 3.42 seconds  
**Date:** 2024-01-15 15:45:22

---

## 📊 Executive Summary

Build completed successfully with **3 code quality warnings**. All warnings are non-blocking and relate to best practices. Production assets generated successfully with good compression ratios.

**Deployment:** ✅ Ready to deploy  
**Recommendations:** Address warnings before next release for code quality.

---

## ⚠️ Warnings

### 🟢 MEDIUM - Code Quality Improvements (3 warnings)

The following warnings don't block the build but should be addressed:

#### Warning 1: Console Statement

```
src/components/Editor.tsx:45:9
Unexpected console statement (no-console)
```

**Context:**

```typescript
// Line 45
console.log("Editor state:", editorState);
```

**Solution:**

```typescript
// Option 1: Remove if debug code
// console.log('Editor state:', editorState);

// Option 2: Use proper debugging
import { logger } from "@/utils/logger";
logger.debug("Editor state:", editorState);

// Option 3: Use ESLint disable (only in dev files)
// eslint-disable-next-line no-console
console.log("Editor state:", editorState);
```

---

#### Warning 2: Unused Variable

```
src/components/Editor.tsx:67:3
'setError' is assigned a value but never used (@typescript-eslint/no-unused-vars)
```

**Context:**

```typescript
## Example 2: Clean Build with Warnings - Simple Format

### Context

- **Project:** Blog CMS
- **Tools:** Vite, TypeScript, ESLint
- **Build command:** `npm run build`
- **Focus:** Show simpler report format for successful builds with warnings

### Generated Report (Simplified)

---

# ✅ BUILD SUCCEEDED

**Project:** Blog CMS
**Build command:** `npm run build`
**Duration:** 3.42 seconds

---

## 📊 Executive Summary

Build completed successfully with **3 code quality warnings**. All warnings are non-blocking ESLint issues. Production assets generated with good compression (64%).

**Deployment:** ✅ Ready to deploy
**Recommendation:** Address warnings before next sprint for codebase health.

---

## ⚠️ Warnings (3 total)

### 🟢 MEDIUM - Code Quality Improvements

**Warning 1: Console Statement**
```

src/components/Editor.tsx:45:9 - Unexpected console statement (no-console)

```

📖 [ESLint: no-console](https://eslint.org/docs/latest/rules/no-console)
💡 Replace with proper logger or remove. Check auto-fix options.

---

**Warning 2: Unused Variable**
```

src/components/Editor.tsx:67:3 - 'setError' is assigned but never used

```

📖 [TypeScript ESLint: no-unused-vars](https://typescript-eslint.io/rules/no-unused-vars/)
💡 Remove unused setState or prefix with underscore if planned for future.

---

**Warning 3: Missing Return Type**
```

src/utils/markdown.ts:12:1 - Missing return type on function

```

📖 [TypeScript ESLint: explicit-function-return-type](https://typescript-eslint.io/rules/explicit-function-return-type/)
💡 Add explicit return type annotation or configure rule to allow inference.

---

## 📦 Build Artifacts

| File | Size | Gzipped | Status |
|------|------|---------|--------|
| index.html | 2.45 KB | - | ✅ |
| assets/index.css | 45.67 KB | 12.34 KB (73%) | ✅ |
| assets/index.js | 234.12 KB | 89.45 KB (62%) | ✅ |

**Total:** 282.24 KB → 101.79 KB gzipped (64% reduction)

---

## 🎯 Next Steps

**Before next release:** Clean up 3 ESLint warnings
**Optional:** Configure auto-fix on save, add pre-commit hooks

## Example 3: CI/CD Pipeline Failure - Focus on Triage

### Context

- **Project:** REST API
- **Environment:** GitHub Actions CI
- **Build command:** `npm run ci` (lint → test → build)
- **Focus:** Show root cause analysis and fix priority

### Generated Report (Abbreviated)

---

# 🔴 CI PIPELINE FAILED

**Pipeline:** GitHub Actions CI (feature/user-management)
**Commit:** a3f7b92
**Failed stages:** Lint (3 errors), Test (2 failures)

---

## 📊 Executive Summary

CI blocked at lint stage with 3 TypeScript ESLint errors. Tests also failed (2/25). Root cause: Using `any` type in 2 files + improper test mocks.

**Impact:** ❌ Cannot merge
**Fix priority:** Lint errors first (blocks tests from running), then test mocks
**Time estimate:** 20-30 minutes

---

## ❌ Errors

### 🔴 CRITICAL - ESLint Errors (3 errors)

**Error 1 & 3: @typescript-eslint/no-explicit-any**
```

src/controllers/userController.ts:34:11 - Promise<any>
src/services/authService.ts:89:7 - validateToken(): any

```

📖 **Official Documentation:**
- [TypeScript ESLint: no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/)
- [TypeScript: Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

💡 **Quick hint:** Define proper return types (UserResponse, TokenValidationResult). CI requires explicit types in strict mode.

---

**Error 2: @typescript-eslint/no-unused-vars**
```

src/controllers/userController.ts:56:5 - 'id' is defined but never used

```

📖 [TypeScript ESLint: no-unused-vars](https://typescript-eslint.io/rules/no-unused-vars/)
💡 Either use the `id` variable or remove it.

---

### 🔴 CRITICAL - Test Failures (2/25 failed)

**Test 1: Assert Failed - authService.test.ts:91**
```

expect(result).toBe(true) // Got: false

```

📖 **Official Documentation:**
- [Jest: Expect API](https://jestjs.io/docs/expect)
- [JWT: Testing Strategies](https://jwt.io/#debugger-io)

💡 **Quick hint:** Test expects boolean but validateToken returns object. Check return type and update assertion or generate valid JWT token for tests.

---

**Test 2: TypeError - userController.test.ts:47**
```

Cannot read property 'create' of undefined

````

📖 **Official Documentation:**
- [Jest: Mock Functions](https://jestjs.io/docs/mock-functions)
- [Jest: ES6 Class Mocks](https://jestjs.io/docs/es6-class-mocks)

💡 **Quick hint:** Mock not properly initialized. Ensure userService.create is mocked in beforeEach. See Jest mocking patterns in docs.

---

## 🎯 Next Steps

### Fix Lint Errors First (blocks CI)

**Step 1:** Replace `any` types with proper interfaces
- userController.ts:34 → Define UserResponse type
- authService.ts:89 → Define TokenValidationResult type
📖 [TypeScript: Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)

**Step 2:** Fix or remove unused `id` variable

### Then Fix Tests

**Step 3:** Fix authService test - update assertion or return type
**Step 4:** Fix userController test - properly mock userService.create
📖 [Jest: Setup and Teardown](https://jestjs.io/docs/setup-teardown)

### Verify

```bash
npm run ci  # Run full pipeline locally before pushing
````

📖 [GitHub Actions: Node.js CI](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)

---

## 📈 Test Results

| Metric      | Value    | Status              |
| ----------- | -------- | ------------------- |
| Test Suites | 7 total  | 2 failed, 5 passed  |
| Tests       | 25 total | 2 failed, 23 passed |
| Pass rate   | 92%      | 🔴                  |
| Duration    | 2.456s   | ✅                  |

---

## 🎯 Next Steps

### Fix Lint Errors (Required)

1. ✅ **Replace `any` types** with proper interfaces
   - [userController.ts](src/controllers/userController.ts#L34): Define `UserResponse` type
   - [authService.ts](src/services/authService.ts#L89): Define `TokenValidationResult` type
2. ✅ **Fix unused variable** in userController.ts line 56
   - Either use the `id` variable or remove it

### Fix Test Failures (Required)

3. ✅ **Fix authService test**
   - Generate valid JWT token in test setup
   - Update assertion to check `.valid` property instead of direct boolean
4. ✅ **Fix userController test**
   - Properly mock `userService.create()` method
   - Ensure mock is passed to controller constructor

### Verify CI Pipeline

5. ✅ **Run locally before pushing**

   ```bash
   npm run ci  # This runs lint + test + build
   ```

6. ✅ **Push and verify**
   - Commit fixes
   - Push to feature branch
   - Verify GitHub Actions passes

---

## 📚 Resources for CI/CD

- [TypeScript: Avoid using `any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)
- [Jest: Mocking Functions](https://jestjs.io/docs/mock-functions)
- [GitHub Actions: Node.js CI](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)

## Example 4: Cross-Tool Error Analysis - Show Pattern Recognition

### Context

- **Project:** Dashboard app
- **Tools:** TypeScript, Webpack, Sass, ESLint
- **Focus:** Show how to analyze errors across multiple tools and find root cause

### Generated Report (Abbreviated)

---

# 🔴 BUILD FAILED - Cross-Tool Errors

**Tools affected:** TypeScript (2), Sass (1), ESLint (1)  
**Build time:** 8.9s  
**Root cause:** File rename incomplete + typo in Sass variable

---

## 📊 Executive Summary

Build failed with 4 errors across 3 different tools. Analysis shows 2 simple fixes will resolve 75% of issues: case-sensitive import mismatch and incomplete Sass variable name.

**Quick wins:** Fix imports and Sass typo (2 minutes) → remaining errors likely resolve automatically.

---

## ❌ Errors (Grouped by Root Cause)

### Group 1: File System Issues (2 errors)

**Error 1: TS2307 - Module Not Found**

```
src/types/chart.ts - Cannot find module './Chart'
```

**Error 2: TS2339 - Property Missing**

```
src/components/Dashboard.tsx - Property 'data' does not exist on ChartProps
```

📖 **Official Documentation:**

- [TypeScript: Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [TypeScript: Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)

💡 **Root cause:** File renamed from `Chart.ts` to `chart.ts` but imports not updated. Error 2 likely cascades from Error 1 - fix import first.

---

### Group 2: Stylesheet Issues (1 error)

**Error 3: Sass Syntax Error**

```
_variables.scss:45 - Expected expression: color: $primary-;
```

📖 **Official Documentation:**

- [Sass: Variables](https://sass-lang.com/documentation/variables)
- [Sass: Syntax](https://sass-lang.com/documentation/syntax)

💡 **Quick hint:** Incomplete variable name (trailing hyphen). Complete to `$primary-color` or `$primary`. Check variable is defined in same file.

---

### Group 3: Code Quality (1 warning)

**Warning: Unused Import**

```
Sidebar.tsx:23 - 'useCallback' is defined but never used
```

📖 [ESLint: no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)  
💡 Remove unused import after fixing critical errors.

---

## 🎯 Next Steps (Priority Order)

**1st:** Fix import case `./Chart` → `./chart` (may auto-resolve Error 2)  
**2nd:** Fix Sass variable `$primary-` → `$primary-color`  
**3rd:** Verify ChartProps still has missing property (might be resolved)  
**4th:** Clean up unused imports

📖 [Webpack: Resolve Configuration](https://webpack.js.org/configuration/resolve/)

---

## Key Insights from Examples

### Pattern 1: Error Cascading

Example 1 and 4 show how one error can cause others:

- Shared package type error → dependent package errors
- Module import error → type definition errors

**Strategy:** Fix root cause first, re-run build to see what remains.

### Pattern 2: Tool-Specific vs Universal Docs

- **TypeScript/ESLint:** Link to specific error code docs
- **Webpack/Vite:** Link to concept guides (module resolution, loaders)
- **Build tools:** Official troubleshooting guides

### Pattern 3: Report Length

- **Build failed:** Longer reports with grouping and priority
- **Build succeeded with warnings:** Shorter, more encouraging tone
- **CI failures:** Include git context (branch, commit)

---

## Report Structure Summary

### Required Sections (ALL reports)

1. **Header:** Build status, project, command, duration
2. **Executive Summary:** 2-3 sentences with impact and priority
3. **Issues:** Grouped errors/warnings with doc links
4. **Next Steps:** Prioritized action list with doc links

### Optional Sections (when relevant)

- **Build Metrics:** Error/warning counts, durations, sizes
- **Build Artifacts:** For successful builds
- **Dependencies:** When packages need installation/update
- **Root Cause Analysis:** For complex cascading errors

---

## What NOT to Include in Reports

❌ **Specific code solutions** - Link to official docs instead  
❌ **Multiple fix options** - Let official docs explain alternatives  
❌ **TypeScript/ESLint concept explanations** - Docs do this better  
❌ **Configuration file examples** - Link to setup guides  
❌ **Package installation commands** - Basic, docs cover it

---

## What TO Include in Reports

✅ **Context:** File locations, affected modules, occurrence counts  
✅ **Root cause analysis:** Why errors are happening  
✅ **Dependency mapping:** Which errors cause others  
✅ **Priority guidance:** What to fix first and why  
✅ **Direct doc links:** Specific to each error code  
✅ **Quick hints:** 1-sentence summary of what docs will explain  
✅ **Impact assessment:** Deployment status, time estimates
