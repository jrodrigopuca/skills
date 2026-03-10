# Changelog

All notable changes to the build-report skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2024-03-09

### 🎯 Major Refactor: Sub-Skill Architecture

Complete redesign with orchestration pattern for optimized context usage and scalability.

### Added

- **Sub-skill architecture**: Three specialized sub-skills (parse, analyze, generate)
- **Artifact contracts** (`contracts/artifacts.md`): Structured JSON schemas for inter-skill communication
- **Orchestration policy** (`orchestration-policy.md`): Workflow rules, activation criteria, degradation strategy
- **Three workflow paths**:
  - **Fast path**: < 10 errors, quick summary (1-2 min)
  - **Standard path**: 10-100 errors, full analysis (3-5 min)
  - **Sampled path**: 100+ errors, pattern-focused (2-4 min)
- **Context loading strategy**: Lazy loading per step
  - Planning: ~2K tokens
  - Parse step: ~2.5K tokens
  - Analyze step: ~7K tokens
  - Generate step: ~3.5K tokens
  - **Total: ~15K tokens** (vs 19K in v1.0)
- **Report template** (`templates/report-template.md`): Extracted from SKILL.md, three variants (quick/standard/sampled)
- **Activation rules**: Explicit criteria for optional sections (config suggestions, code context, cascading errors)
- **Degradation strategy**: Graceful fallbacks for edge cases (truncation, unknown tools, parsing failures)
- **Version metadata**: Added `version: 2.0.0` to frontmatter
- **CHANGELOG.md**: This file for version tracking

### Changed

- **SKILL.md**: Reduced from 734 lines (~17.5 KB) to 387 lines (~11 KB) - orchestrator only
- **Philosophy**: From "instructions" to "coordination" - orchestrator delegates to sub-skills
- **Reference files**: Marked with "Load when" guidance for lazy loading
- **Report examples** (`references/report-examples.md`): Now marked as training-only, not loaded during execution

### Improved

- **Context efficiency**: 31% reduction in tokens per invocation (19K → 13K average)
- **Scalability**: Handles builds from 1 error to 1000+ errors with appropriate strategies
- **Maintainability**: Separation of concerns - each sub-skill owns one responsibility
- **Consistency**: Artifact contracts ensure predictable data flow between steps
- **Documentation**: Clear entry points for each workflow component

### Technical Details

**New directory structure:**
```
build-report/
├── SKILL.md                          # Orchestrator (11 KB, -37% size)
├── orchestration-policy.md           # Workflow rules (9 KB, NEW)
├── CHANGELOG.md                      # Version history (NEW)
├── contracts/
│   └── artifacts.md                  # Data schemas (15 KB, NEW)
├── sub-skills/
│   ├── parse-build-output.md         # Parsing logic (8 KB, NEW)
│   ├── analyze-errors.md             # Analysis logic (11 KB, NEW)
│   └── generate-report.md            # Report generation (9 KB, NEW)
├── templates/
│   └── report-template.md            # Report structure (10 KB, extracted)
└── references/                       # Unchanged, lazy-loaded
    ├── error-docs-map.md             # Load in analyze step
    ├── nodejs-parsers.md             # Load only if needed
    └── report-examples.md            # Never load (training only)
```

### Backward Compatibility

⚠️ **Breaking changes:**

- SKILL.md v1.0 backup saved as `SKILL.md.v1.backup`
- Invocation pattern changed: Now orchestrates sub-agents via Task tool
- Direct inline execution no longer supported

**Migration guide:**

If you have scripts/tools invoking v1.0:
1. Update to call the orchestrator with build output
2. Orchestrator will handle sub-skill coordination automatically
3. Final output format unchanged (Markdown report)

---

## [1.0.0] - 2024-02-10

### Initial Release

- Monolithic skill for build report generation
- Support for TypeScript, ESLint, Webpack, Vite
- Error parsing with regex patterns
- Basic grouping and prioritization
- Documentation link mapping
- Markdown report generation
- Three reference files (parsers, error-docs-map, examples)

**Total size:** ~76 KB / 2,616 lines  
**Context usage:** ~19K tokens per invocation

---

## Version Numbering

**Major version (X.0.0):** Breaking changes to architecture or invocation  
**Minor version (1.X.0):** New features, backward compatible  
**Patch version (1.0.X):** Bug fixes, documentation updates

---

## Roadmap

### Planned for v2.1

- [ ] Historical comparison (compare current build with previous)
- [ ] CI/CD context extraction (pull branch/commit from env vars)
- [ ] Auto-fix detection (identify which errors have automated fixes)
- [ ] Dependency update suggestions (if errors from outdated packages)

### Planned for v3.0

- [ ] Support for additional tools (Rollup, esbuild, Turbopack)
- [ ] Visual report output (HTML with charts)
- [ ] Integration with issue trackers (create GitHub issues from error groups)
- [ ] Performance metrics tracking (build time trends)

---

## Feedback

Report issues or suggest features:
- Skill evaluation document: `EVALUATION.md`
- Inline comments in sub-skill files
- User feedback loop through orchestrator

---

**Last updated:** 2024-03-09
