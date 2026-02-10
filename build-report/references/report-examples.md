# Build Report Examples

Complete examples of build reports for different scenarios.

---

## Example 1: Monorepo TypeScript Build

### Context

- **Project:** E-commerce platform monorepo
- **Tools:** TypeScript, ESLint, Webpack
- **Packages:** 3 (frontend, backend, shared)
- **Build command:** `npm run build:all`

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

Type system violations preventing compilation. These must be fixed before build can succeed.

**Affected files:**

- [packages/shared/src/types/Product.ts](packages/shared/src/types/Product.ts#L15) (2 errors)
- [packages/frontend/src/components/Cart.tsx](packages/frontend/src/components/Cart.tsx#L45) (1 error)

#### Error 1: TS2322 - Type Assignment Error

```
packages/shared/src/types/Product.ts:15:3
Type 'string' is not assignable to type 'number'
```

**Problem:** The `quantity` property is defined as `number` but receives a string value.

**Solution:**

```typescript
// ❌ Current code
interface Product {
	id: string;
	name: string;
	quantity: number; // Expects number
}

const product: Product = {
	id: "prod-123",
	name: "Laptop",
	quantity: "10", // ❌ Passing string
};

// ✅ Fix option 1: Convert to number
const product: Product = {
	id: "prod-123",
	name: "Laptop",
	quantity: 10, // Parse to number
};

// ✅ Fix option 2: If data comes from API
const product: Product = {
	id: apiData.id,
	name: apiData.name,
	quantity: Number(apiData.quantity), // Convert string to number
};
```

**Root cause:** Likely receiving data from API as strings but interface expects numbers.

---

#### Error 2: TS2339 - Property Does Not Exist

```
packages/shared/src/types/Product.ts:23:5
Property 'category' does not exist on type 'Product'
```

**Problem:** Attempting to access `category` property that isn't defined in the `Product` interface.

**Solution:**

```typescript
// ❌ Current code
interface Product {
	id: string;
	name: string;
	quantity: number;
	// 'category' is missing
}

// Usage
const mappedProduct = {
	category: item.category, // ❌ Property doesn't exist
	// ...
};

// ✅ Fix: Add missing property
interface Product {
	id: string;
	name: string;
	quantity: number;
	category: string; // Add this property
}
```

**Next steps:**

1. Add `category: string` to Product interface
2. Update all Product instances to include category
3. Verify database schema matches

---

#### Error 3: TS2345 - Argument Type Mismatch

```
packages/frontend/src/components/Cart.tsx:45:7
Argument of type 'Product[]' is not assignable to parameter of type 'CartItem[]'
```

**Problem:** Function expects `CartItem[]` but receives `Product[]`. These are different types.

**Solution:**

```typescript
// ❌ Current code
function calculateTotal(items: CartItem[]): number {
	return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Usage
calculateTotal(products); // ❌ products is Product[], not CartItem[]

// ✅ Fix option 1: Convert Product to CartItem
const cartItems: CartItem[] = products.map((product) => ({
	productId: product.id,
	name: product.name,
	price: product.price,
	quantity: product.quantity,
}));
calculateTotal(cartItems);

// ✅ Fix option 2: Make function accept both types
function calculateTotal(items: (CartItem | Product)[]): number {
	return items.reduce((sum, item) => {
		const price = "price" in item ? item.price : item.unitPrice;
		return sum + price * item.quantity;
	}, 0);
}

// ✅ Fix option 3: Extend interface
interface CartItem extends Product {
	quantity: number;
	addedAt: Date;
}
```

**Recommendation:** Option 1 is cleanest if Product and CartItem have different shapes. Creates clear separation of concerns.

---

### 🔴 CRITICAL - Missing Type Declaration (1 error)

#### Error 4: TS2304 - Cannot Find Name 'Express'

```
packages/backend/src/server.ts:89:12
Cannot find name 'Express'
```

**Problem:** TypeScript can't find the `Express` type. Type definitions not installed.

**Solution:**

```bash
# Install Express type definitions
cd packages/backend
npm install --save-dev @types/express

# Or from root of monorepo
npm install --save-dev @types/express --workspace=@ecommerce/backend
```

**Then update imports:**

```typescript
// ❌ Current code
const app: Express = express();

// ✅ After installing @types/express
import express, { Express } from "express";
const app: Express = express();

// Or simpler (let TypeScript infer)
import express from "express";
const app = express(); // Type inferred as Express.Application
```

---

## ⚠️ Warnings

### 🟡 HIGH - Code Quality Issues (2 warnings)

Non-blocking issues that should be addressed before deployment.

#### Warning 1: Unused Variable

```
packages/frontend/src/App.tsx:12:7
'oldComponent' is defined but never used (@typescript-eslint/no-unused-vars)
```

**Solution:**

```typescript
// ❌ Remove if truly unused
const oldComponent = <OldUI />;  // Delete this line

// ✅ Or if keeping for reference
const _oldComponent = <OldUI />;  // _ prefix signals intention
```

---

#### Warning 2: Console Statement

```
packages/frontend/src/App.tsx:28:5
Unexpected console statement (no-console)
```

**Solution:**

```typescript
// ❌ Current
console.log("Debug info");

// ✅ Use proper logger
import { logger } from "@/utils/logger";
logger.debug("Debug info");

// ✅ Or remove if not needed
// console.log('Debug info');  // Remove
```

---

### 🟢 MEDIUM - Performance Warning (1 warning)

#### Warning 3: Bundle Size Exceeds Limit

```
ERROR in packages/frontend/dist/main.js
File size exceeds 500 kB limit (actual: 847 kB)
```

**Problem:** Main bundle is 69% larger than recommended (847 KB vs 500 KB limit).

**Solutions (in order of impact):**

1. **Code splitting** (recommended):

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
				common: {
					minChunks: 2,
					priority: 5,
					reuseExistingChunk: true,
				},
			},
		},
	},
};
```

2. **Lazy load routes:**

```typescript
// ❌ Import all routes upfront
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// ✅ Lazy load
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
```

3. **Analyze bundle:**

```bash
npm install --save-dev webpack-bundle-analyzer
# Then check what's taking space
npm run build -- --analyze
```

**Expected impact:** Should reduce main bundle to ~300-400 KB.

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

### Immediate Actions (Required for build)

1. ✅ **Fix Product interface** in `shared/src/types/Product.ts`
   - Change `quantity: "10"` to `quantity: 10` (line 15)
   - Add `category: string` property to interface
2. ✅ **Install @types/express** in backend package

   ```bash
   npm install --save-dev @types/express --workspace=@ecommerce/backend
   ```

3. ✅ **Fix type mismatch** in `frontend/src/components/Cart.tsx`
   - Convert `Product[]` to `CartItem[]` before passing to `calculateTotal()`

### Follow-up Actions (Recommended)

4. 🟡 **Remove unused variable** in `App.tsx` line 12
5. 🟡 **Replace console.log** with logger utility
6. 🟢 **Implement code splitting** to reduce bundle size

### Configuration Improvements

7. 📝 **Add pre-commit hook** to catch unused vars before commit
8. 📝 **Configure bundle size limits** in CI/CD
9. 📝 **Update TypeScript** to latest version (5.3.3)

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
// Line 67
const [error, setError] = useState<string | null>(null);
```

**Solution:**

```typescript
// Option 1: Remove if not needed
const [error] = useState<string | null>(null);

// Option 2: Actually use it
const handleSave = async () => {
	try {
		await saveContent(content);
	} catch (err) {
		setError(err.message); // Now it's used
	}
};

// Option 3: Keep for future use (signal intention)
const [error, _setError] = useState<string | null>(null);
```

---

#### Warning 3: Missing Return Type

```
src/utils/markdown.ts:12:1
Missing return type on function (@typescript-eslint/explicit-function-return-type)
```

**Context:**

```typescript
// Line 12
export function parseMarkdown(content) {
	// ...
}
```

**Solution:**

```typescript
// ✅ Add explicit return type
export function parseMarkdown(content: string): ParsedMarkdown {
	// ...
}

// Or if complex, let TypeScript infer but document
export function parseMarkdown(content: string) {
	// Automatically inferred as string
	return marked.parse(content);
}
```

---

## 📦 Build Artifacts

### Generated Files

| File                    | Size      | Gzipped                  | Status |
| ----------------------- | --------- | ------------------------ | ------ |
| index.html              | 2.45 KB   | -                        | ✅     |
| assets/index-[hash].css | 45.67 KB  | 12.34 KB (73% reduction) | ✅     |
| assets/index-[hash].js  | 234.12 KB | 89.45 KB (62% reduction) | ✅     |

**Total size:** 282.24 KB  
**Total gzipped:** 101.79 KB (64% reduction)

---

## 📈 Build Metrics

| Metric              | Value | Status |
| ------------------- | ----- | ------ |
| Errors              | 0     | ✅     |
| Warnings            | 3     | 🟢     |
| Build duration      | 3.42s | ✅     |
| Modules transformed | 347   | ✅     |
| Compression ratio   | 64%   | ✅     |

---

## 🎯 Next Steps

### Before Next Release

1. 🟢 Remove or replace `console.log` statements in production code
2. 🟢 Either use `setError` function or remove unused state
3. 🟢 Add explicit return types to utility functions

### Optional Improvements

4. 📝 Configure ESLint to auto-fix these warnings on save
5. 📝 Add pre-commit hook to prevent console statements
6. 📝 Consider extracting markdown utilities to shared package

---

_Generated by build-report skill • 15 Jan 2024 15:45_

---

## Example 3: CI/CD Pipeline Failure

### Context

- **Project:** REST API
- **Tools:** TypeScript, Jest, ESLint
- **Environment:** GitHub Actions CI
- **Build command:** `npm run ci`

### Build Output (Raw)

```
> api-service@3.2.1 ci
> npm run lint && npm run test && npm run build

> api-service@3.2.1 lint
> eslint src/**/*.ts

src/controllers/userController.ts
  34:11  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  56:5   error  'id' is defined but never used  @typescript-eslint/no-unused-vars

src/services/authService.ts
  89:7  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

✖ 3 problems (3 errors, 0 warnings)

npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! api-service@3.2.1 lint: `eslint src/**/*.ts`
npm ERR! Exit status 1

> api-service@3.2.1 test
> jest

 FAIL  src/services/authService.test.ts
  ● AuthService › should validate token

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      89 |   it('should validate token', () => {
      90 |     const result = authService.validateToken('valid-token');
    > 91 |     expect(result).toBe(true);
         |                    ^
      92 |   });

 FAIL  src/controllers/userController.test.ts
  ● UserController › should create user

    TypeError: Cannot read property 'create' of undefined

      45 |   it('should create user', async () => {
      46 |     const user = await userController.createUser(mockRequest);
    > 47 |     expect(user).toBeDefined();
         |     ^
      48 |   });

Test Suites: 2 failed, 5 passed, 7 total
Tests:       2 failed, 23 passed, 25 total
Snapshots:   0 total
Time:        2.456 s

npm ERR! Test failed. See above for more details.
```

### Generated Report

---

# 🔴 CI PIPELINE FAILED

**Project:** API Service  
**Pipeline:** GitHub Actions CI  
**Command:** `npm run ci`  
**Date:** 2024-01-15 16:20:15  
**Commit:** a3f7b92  
**Branch:** feature/user-management

---

## 📊 Executive Summary

CI pipeline failed at **lint stage** with 3 ESLint errors. Additional **2 test failures** were detected when tests ran. All issues must be resolved before merge.

**Impact:** ❌ Cannot merge to main  
**Estimated fix time:** 20-30 minutes  
**Failed stages:** Lint (3 errors), Test (2 failures)

---

## ❌ Errors

### 🔴 CRITICAL - ESLint Errors (3 errors)

Linting errors in strict mode block the CI pipeline.

#### Error 1 & 3: No Explicit Any

```
src/controllers/userController.ts:34:11
src/services/authService.ts:89:7
Unexpected any. Specify a different type (@typescript-eslint/no-explicit-any)
```

**Problem:** Using `any` type defeats TypeScript's type system.

**Context (userController.ts:34):**

```typescript
// Line 34
async createUser(req: Request, res: Response): Promise<any> {
  //                                                     ^^^
```

**Solution:**

```typescript
// ✅ Define proper return type
interface UserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

async createUser(req: Request, res: Response): Promise<UserResponse> {
  const user = await this.userService.create(req.body);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  };
}
```

**Context (authService.ts:89):**

```typescript
// Line 89
validateToken(token: string): any {
  //                         ^^^
}
```

**Solution:**

```typescript
// ✅ Define token validation result
type TokenValidationResult = {
  valid: boolean;
  userId?: string;
  error?: string;
};

validateToken(token: string): TokenValidationResult {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { valid: true, userId: decoded.userId };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
```

---

#### Error 2: Unused Variable

```
src/controllers/userController.ts:56:5
'id' is defined but never used (@typescript-eslint/no-unused-vars)
```

**Context:**

```typescript
// Line 56
const id = req.params.id;
// id is extracted but never used
```

**Solution:**

```typescript
// ✅ Use the variable
const id = req.params.id;
const user = await this.userService.findById(id);

// Or remove if not needed
// const id = req.params.id;  // Remove this line
```

---

### 🔴 CRITICAL - Test Failures (2 failures)

#### Test Failure 1: Assertion Failed

```
src/services/authService.test.ts:91
AuthService › should validate token
expect(received).toBe(expected)
Expected: true
Received: false
```

**Problem:** `validateToken()` returns `false` for valid token in test.

**Root cause analysis:**

```typescript
// Test code
it("should validate token", () => {
	const result = authService.validateToken("valid-token");
	expect(result).toBe(true); // Fails
});
```

**Likely issues:**

1. Test token isn't actually valid
2. Test expects boolean but function returns object
3. Secret key mismatch in test environment

**Solution:**

```typescript
// ✅ Fix test setup
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

describe("AuthService", () => {
	let authService: AuthService;
	let validToken: string;

	beforeEach(() => {
		authService = new AuthService();
		// Generate actual valid token for tests
		validToken = jwt.sign({ userId: "123" }, SECRET_KEY);
	});

	it("should validate token", () => {
		const result = authService.validateToken(validToken);
		expect(result.valid).toBe(true); // Fixed: check .valid property
		expect(result.userId).toBe("123");
	});
});
```

---

#### Test Failure 2: TypeError

```
src/controllers/userController.test.ts:47
UserController › should create user
TypeError: Cannot read property 'create' of undefined
```

**Problem:** `userService.create()` is `undefined`, mock not set up correctly.

**Solution:**

```typescript
// ✅ Fix mock setup
describe("UserController", () => {
	let userController: UserController;
	let mockUserService: jest.Mocked<UserService>;

	beforeEach(() => {
		// Properly mock the service
		mockUserService = {
			create: jest.fn().mockResolvedValue({
				id: "1",
				username: "testuser",
				email: "test@example.com",
				createdAt: new Date(),
			}),
			findById: jest.fn(),
			// ... other methods
		} as any;

		userController = new UserController(mockUserService);
	});

	it("should create user", async () => {
		const mockRequest = {
			body: { username: "testuser", email: "test@example.com" },
		} as Request;

		const user = await userController.createUser(mockRequest);

		expect(user).toBeDefined();
		expect(mockUserService.create).toHaveBeenCalledWith(mockRequest.body);
	});
});
```

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

---

_Generated by build-report skill • 15 Jan 2024 16:20_

---

## Example 4: Mixed Tool Failures

### Context

- **Project:** Dashboard app
- **Tools:** TypeScript + Webpack + ESLint + Sass
- **Complex:** Multiple overlapping errors

### Build Output (Raw)

```
> dashboard@1.5.0 build
> webpack --mode production

Hash: 3f8b9c7d2a1e4f6g
Version: webpack 5.89.0
Time: 8943ms

ERROR in ./src/types/chart.ts
Module build failed (from ./node_modules/ts-loader/index.js):
error TS2307: Cannot find module './Chart' or its corresponding type declarations.

ERROR in ./src/components/Dashboard.tsx
Module build failed (from ./node_modules/ts-loader/index.js):
error TS2339: Property 'data' does not exist on type 'ChartProps'.

ERROR in ./src/styles/main.scss
Module build failed (from ./node_modules/sass-loader/dist/cjs.js):
SassError: Expected expression.
   ╷
45 │   color: $primary-;
   │                   ^
   ╵
  src/styles/_variables.scss 45:19  @import
  src/styles/main.scss 2:9          root stylesheet

./src/components/Sidebar.tsx
  23:10  error  'useCallback' is defined but never used  react-hooks/exhaustive-deps

webpack 5.89.0 compiled with 4 errors and 1 warning in 8943ms
```

### Generated Report

---

# 🔴 BUILD FAILED - Multiple Tool Errors

**Project:** Dashboard  
**Build command:** `webpack --mode production`  
**Duration:** 8.9 seconds  
**Tools:** TypeScript, Webpack, Sass, ESLint

---

## 📊 Executive Summary

Build failed with **4 errors** across multiple tools (TypeScript, Sass) and **1 warning** from ESLint. Issues span module resolution, type definitions, and stylesheet syntax.

**Primary cause:** Incomplete file rename (Chart → chart) and Sass variable typo.  
**Estimated fix time:** 10 minutes

---

## ❌ Errors

### 🔴 CRITICAL - Module Resolution (1 error)

#### Error 1: Cannot Find Module './Chart'

```
src/types/chart.ts
Module build failed: Cannot find module './Chart' or its corresponding type declarations (TS2307)
```

**Problem:** Case-sensitive import mismatch. File is `chart.ts` but importing `Chart`.

**Solution:**

```typescript
// ❌ Wrong case
import { ChartConfig } from "./Chart";

// ✅ Fix: Match actual filename
import { ChartConfig } from "./chart";
```

**Prevention:** Enable case-sensitive paths in webpack:

```javascript
// webpack.config.js
module.exports = {
	resolve: {
		// Force case-sensitive paths
		extensions: [".ts", ".tsx", ".js"],
	},
};
```

---

### 🔴 CRITICAL - Type Error (1 error)

#### Error 2: Property Does Not Exist

```
src/components/Dashboard.tsx
Property 'data' does not exist on type 'ChartProps' (TS2339)
```

**Problem:** `ChartProps` interface doesn't include `data` property.

**Solution:**

```typescript
// Current ChartProps (incomplete)
interface ChartProps {
	title: string;
	type: "line" | "bar";
	// 'data' is missing
}

// ✅ Add missing property
interface ChartProps {
	title: string;
	type: "line" | "bar";
	data: Array<{
		label: string;
		value: number;
	}>;
}
```

---

### 🔴 CRITICAL - Sass Syntax Error (1 error)

#### Error 3: Sass Expected Expression

```
src/styles/_variables.scss:45:19
SassError: Expected expression
color: $primary-;
                ^
```

**Problem:** Incomplete Sass variable name `$primary-` (trailing hyphen).

**Solution:**

```scss
// ❌ Incomplete variable
.button {
	color: $primary-; // Typo: ends with hyphen
}

// ✅ Fix: Complete variable name
.button {
	color: $primary-color; // or just $primary
}
```

**Check \_variables.scss:**

```scss
// Ensure variable is defined
$primary-color: #007bff;
$secondary-color: #6c757d;
```

---

### 🟡 HIGH - React Hook Warning (1 warning)

#### Warning 1: Unused Hook Import

```
src/components/Sidebar.tsx:23:10
'useCallback' is defined but never used (react-hooks/exhaustive-deps)
```

**Solution:**

```typescript
// ❌ Imported but not used
import { useState, useEffect, useCallback } from "react";
//                             ^^^^^^^^^^^ Not used

// ✅ Remove unused import
import { useState, useEffect } from "react";
```

---

## 📈 Build Metrics

| Metric     | Value          | Status  |
| ---------- | -------------- | ------- |
| Errors     | 4              | 🔴      |
| Warnings   | 1              | 🟡      |
| Build time | 8.9s           | 🟡 Slow |
| Compiler   | Webpack 5.89.0 | ✅      |

---

## 🎯 Next Steps

### Critical Fixes (Required)

1. ✅ **Fix import case** in [chart.ts](src/types/chart.ts)
   - Change `'./Chart'` to `'./chart'`
2. ✅ **Add `data` property** to `ChartProps` interface
   - Define data structure in types file

3. ✅ **Fix Sass variable** in [\_variables.scss](src/styles/_variables.scss#L45)
   - Complete `$primary-` to `$primary-color`

### Quality Improvements

4. 🟢 **Remove unused import** in Sidebar.tsx
5. 📝 **Add ESLint rule** to catch unused React hooks
6. 📝 **Investigate slow build** (8.9s is high for this project size)

---

_Generated by build-report skill • 15 Jan 2024 17:05_

---

## Report Format Guidelines

### When to Include Each Section

**✅ BUILD SUCCEEDED:**

- Executive Summary (brief, celebration)
- Warnings (if any)
- Build Artifacts
- Build Metrics
- Next Steps (optional improvements)

**🔴 BUILD FAILED:**

- Executive Summary (impact assessment)
- Errors (detailed, with solutions)
- Warnings (if any, lower priority)
- Dependencies (if relevant)
- Build Metrics
- Next Steps (prioritized fixes)

### Section Priority

1. **Always include:**
   - Build status header
   - Executive summary
   - Primary issue section (errors or warnings)
   - Next steps

2. **Include when relevant:**
   - Dependencies (when installation/updates needed)
   - Build artifacts (successful builds)
   - Build metrics (always useful)
   - Resources (for learning)

3. **Optional:**
   - Configuration suggestions
   - Performance recommendations
   - Team collaboration notes

### Tone Guidelines

- **Failed builds:** Helpful, solution-focused, not blaming
- **Successful builds:** Encouraging, still note improvements
- **Warnings:** Balanced, explain why they matter
- **CI failures:** Include context (commit, branch, author impact)

### Length Guidelines

- **Summary:** 2-3 sentences
- **Error explanation:** 3-5 sentences + code example
- **Solution:** Code example + 1-2 sentences explanation
- **Full report:** Enough detail to fix without asking questions
