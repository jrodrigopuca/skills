# Error Documentation Map

Quick reference for linking build errors to official documentation. This file maps error codes to their official documentation URLs - detailed solutions should come from the official docs, not this skill.

---

## TypeScript Errors

### Common Type Errors

| Error Code  | Description                     | Official Documentation                                                                                                                                                                                                                          |
| ----------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TS2345**  | Argument type mismatch          | [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) • [Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)                                              |
| **TS2304**  | Cannot find name                | [Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html) • [Modules](https://www.typescriptlang.org/docs/handbook/modules.html)                                                                         |
| **TS2339**  | Property does not exist         | [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) • [Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)                                                            |
| **TS2307**  | Cannot find module              | [Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html) • [Triple-Slash Directives](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)                                                 |
| **TS2322**  | Type not assignable             | [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) • [Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)                                                                  |
| **TS2571**  | Object is of type unknown       | [Unknown Type](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-unknown-type) • [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)                                                                   |
| **TS2552**  | Cannot find name (typo)         | [Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)                                                                                                                                                |
| **TS2769**  | No overload matches call        | [Function Overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)                                                                                                                                          |
| **TS7006**  | Parameter implicitly has any    | [Type Annotations](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-annotations-on-variables) • [Strict Mode](https://www.typescriptlang.org/tsconfig#strict)                                                            |
| **TS7016**  | Could not find declaration file | [@types Packages](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)                                                                                                                                              |
| **TS7053**  | Element implicitly has any      | [Index Signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)                                                                                                                                                |
| **TS18046** | Variable possibly undefined     | [Optional Chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining) • [Nullish Coalescing](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing) |

**General TypeScript Resources:**

- [Error Reference (All Codes)](https://www.typescriptlang.org/docs/handbook/error-reference.html)
- [Type System Deep Dive](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [tsconfig.json Reference](https://www.typescriptlang.org/tsconfig)

---

## ESLint Rules

### TypeScript ESLint Plugin

| Rule                                                 | Description                      | Official Documentation                                                         |
| ---------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------ |
| **@typescript-eslint/no-unused-vars**                | Variables defined but never used | [Rule Docs](https://typescript-eslint.io/rules/no-unused-vars/)                |
| **@typescript-eslint/no-explicit-any**               | Disallow any type                | [Rule Docs](https://typescript-eslint.io/rules/no-explicit-any/)               |
| **@typescript-eslint/no-unsafe-assignment**          | Unsafe type assignment           | [Rule Docs](https://typescript-eslint.io/rules/no-unsafe-assignment/)          |
| **@typescript-eslint/no-unsafe-member-access**       | Unsafe member access             | [Rule Docs](https://typescript-eslint.io/rules/no-unsafe-member-access/)       |
| **@typescript-eslint/no-unsafe-call**                | Unsafe function call             | [Rule Docs](https://typescript-eslint.io/rules/no-unsafe-call/)                |
| **@typescript-eslint/explicit-function-return-type** | Missing return type              | [Rule Docs](https://typescript-eslint.io/rules/explicit-function-return-type/) |

### Core ESLint Rules

| Rule               | Description                  | Official Documentation                                           |
| ------------------ | ---------------------------- | ---------------------------------------------------------------- |
| **no-console**     | Console statements           | [Rule Docs](https://eslint.org/docs/latest/rules/no-console)     |
| **no-unused-vars** | Unused variables             | [Rule Docs](https://eslint.org/docs/latest/rules/no-unused-vars) |
| **no-undef**       | Undefined variables          | [Rule Docs](https://eslint.org/docs/latest/rules/no-undef)       |
| **no-debugger**    | Debugger statements          | [Rule Docs](https://eslint.org/docs/latest/rules/no-debugger)    |
| **prefer-const**   | Use const for immutable vars | [Rule Docs](https://eslint.org/docs/latest/rules/prefer-const)   |
| **no-var**         | Disallow var keyword         | [Rule Docs](https://eslint.org/docs/latest/rules/no-var)         |

### React ESLint Plugin

| Rule                            | Description               | Official Documentation                                                                                      |
| ------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **react/prop-types**            | Missing prop validation   | [Rule Docs](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md)         |
| **react/jsx-key**               | Missing key prop          | [Rule Docs](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-key.md)            |
| **react/jsx-no-undef**          | Undefined React component | [Rule Docs](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md)       |
| **react/react-in-jsx-scope**    | Missing React import      | [Rule Docs](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md) |
| **react-hooks/rules-of-hooks**  | Invalid hook usage        | [Rule Docs](https://react.dev/reference/rules/rules-of-hooks)                                               |
| **react-hooks/exhaustive-deps** | Missing hook dependencies | [Rule Docs](https://react.dev/reference/rules/exhaustive-deps)                                              |

**General ESLint Resources:**

- [Rules Reference (All Rules)](https://eslint.org/docs/latest/rules/)
- [Configuring ESLint](https://eslint.org/docs/latest/use/configure/)
- [TypeScript ESLint Docs](https://typescript-eslint.io/)

---

## Webpack Errors

### Common Webpack Errors

| Error Pattern             | Description            | Official Documentation                                                                                                                           |
| ------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Module not found**      | Can't resolve module   | [Module Resolution](https://webpack.js.org/concepts/module-resolution/) • [Resolve Configuration](https://webpack.js.org/configuration/resolve/) |
| **Module parse failed**   | Loader error or syntax | [Loaders](https://webpack.js.org/concepts/loaders/) • [Asset Modules](https://webpack.js.org/guides/asset-modules/)                              |
| **Module build failed**   | Compilation error      | [Build Performance](https://webpack.js.org/guides/build-performance/)                                                                            |
| **Asset size limit**      | Bundle too large       | [Performance](https://webpack.js.org/configuration/performance/) • [Code Splitting](https://webpack.js.org/guides/code-splitting/)               |
| **Entrypoint size limit** | Entry bundle too large | [Performance](https://webpack.js.org/configuration/performance/)                                                                                 |
| **Circular dependency**   | Circular imports       | [Dependency Graph](https://webpack.js.org/concepts/dependency-graph/)                                                                            |

**General Webpack Resources:**

- [Configuration Reference](https://webpack.js.org/configuration/)
- [Troubleshooting](https://webpack.js.org/configuration/stats/#errors-and-warnings)
- [Migration Guide](https://webpack.js.org/migrate/5/)

---

## Vite Errors

### Common Vite Errors

| Error Pattern         | Description          | Official Documentation                                                                                                         |
| --------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Could not resolve** | Module not found     | [Dependencies](https://vitejs.dev/guide/dep-pre-bundling.html) • [Static Asset Handling](https://vitejs.dev/guide/assets.html) |
| **Transform failed**  | Build/syntax error   | [Features](https://vitejs.dev/guide/features.html) • [Plugin API](https://vitejs.dev/guide/api-plugin.html)                    |
| **Parse error**       | Syntax error         | [Features](https://vitejs.dev/guide/features.html)                                                                             |
| **Plugin error**      | Plugin configuration | [Using Plugins](https://vitejs.dev/guide/using-plugins.html)                                                                   |
| **Optimize deps**     | Pre-bundling issue   | [Dependency Optimization](https://vitejs.dev/guide/dep-pre-bundling.html)                                                      |

**General Vite Resources:**

- [Troubleshooting Guide](https://vitejs.dev/guide/troubleshooting.html)
- [Configuration Reference](https://vitejs.dev/config/)
- [Migration from Webpack](https://vitejs.dev/guide/migration.html)

---

## npm/yarn/pnpm Errors

### Package Manager Errors

| Error Code     | Description               | Official Documentation                                                                                                                                                                        |
| -------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ERESOLVE**   | Dependency conflict       | [npm: Dependency Conflicts](https://docs.npmjs.com/cli/v9/using-npm/dependency-resolution) • [Peer Dependencies](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#peerdependencies) |
| **ELIFECYCLE** | Script exit code non-zero | [npm scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts)                                                                                                                                |
| **ENOENT**     | File or package not found | [npm install](https://docs.npmjs.com/cli/v9/commands/npm-install)                                                                                                                             |
| **EACCES**     | Permission denied         | [npm permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)                                                                               |

---

## Configuration Files

### Common Configuration Issues

| File                  | Issue Type               | Official Documentation                                                          |
| --------------------- | ------------------------ | ------------------------------------------------------------------------------- |
| **tsconfig.json**     | Compiler options         | [TSConfig Reference](https://www.typescriptlang.org/tsconfig)                   |
| **.eslintrc.js**      | Rule configuration       | [Configuring ESLint](https://eslint.org/docs/latest/use/configure/)             |
| **webpack.config.js** | Build configuration      | [Webpack Configuration](https://webpack.js.org/configuration/)                  |
| **vite.config.js**    | Build configuration      | [Vite Configuration](https://vitejs.dev/config/)                                |
| **package.json**      | Scripts and dependencies | [package.json Docs](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) |

---

## Usage in Reports

When generating reports, use this format:

```markdown
### Error: TS2345 - Argument Type Mismatch

**Occurrences:** 3 files, 8 locations

📍 **Affected files:**

- src/auth/login.ts:23
- src/auth/register.ts:45
- src/utils/validate.ts:12 (6 occurrences)

📖 **Official Documentation:**

- [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

💡 **Quick context:** Function expects number but receives string. Consider type conversion, type guards, or updating function signature. See docs for detailed solutions.
```

**Do NOT include:**

- Specific code examples (link to docs instead)
- Multiple solution options (docs cover this better)
- Explanations of TypeScript concepts (redundant with docs)

**DO include:**

- Error code and brief description
- File locations and occurrences
- Direct links to relevant documentation sections
- Brief 1-sentence context hint

---

## Maintenance

This file should be updated when:

- ✅ New common error codes are frequently encountered
- ✅ Documentation URLs change (TypeScript/ESLint updates)
- ✅ New tools are added to parsing (e.g., Rollup, esbuild)

This file should NOT contain:

- ❌ Detailed solutions (that's what official docs are for)
- ❌ Code examples (link to docs instead)
- ❌ Explanations (let docs explain)
