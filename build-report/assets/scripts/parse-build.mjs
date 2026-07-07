#!/usr/bin/env node
/**
 * parse-build.mjs — turn build tool output (tsc, ESLint, webpack, Vite/esbuild)
 * into compact, grouped JSON so the analysis step reads structure, not noise.
 *
 * Zero dependencies. Node 18+.
 *
 * Usage:
 *   npm run build 2>&1 | node parse-build.mjs
 *   node parse-build.mjs build-output.txt
 *
 * Output (stdout): JSON — { tools, totals, groups[], unparsedErrorHints }
 */

import { readFileSync } from "node:fs";

function readInput() {
  const file = process.argv[2];
  if (file) return readFileSync(file, "utf8");
  try {
    return readFileSync(0, "utf8");
  } catch {
    console.error("Usage: parse-build.mjs <file> (or pipe build output via stdin)");
    process.exit(2);
  }
}

const items = []; // {tool, severity, file, line, col, code, message}
const tools = new Set();
let unparsedErrorHints = 0;

const text = readInput();
const lines = text.split("\n");

// TypeScript:
//   src/x.ts:23:15 - error TS2345: message        (pretty)
//   src/x.ts(23,15): error TS2345: message        (classic)
const tscPretty = /^(.+?\.[cm]?[jt]sx?):(\d+):(\d+)\s+-\s+(error|warning)\s+(TS\d+):\s+(.+)$/;
const tscClassic = /^(.+?\.[cm]?[jt]sx?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s+(.+)$/;

// ESLint stylish:
//   /abs/path/file.ts            (header line)
//     12:8   error  message  rule-id
const eslintEntry = /^\s+(\d+):(\d+)\s+(error|warning)\s+(.+?)\s{2,}(\S+)\s*$/;
const fileHeader = /^([A-Za-z]:)?[/\\]?[\w./\\-]+\.[cm]?[jt]sx?$/;

// Vite / esbuild:
//   ✘ [ERROR] message                then: file:line:col:
const esbuildErr = /^\s*[✘x]\s+\[(ERROR|WARNING)\]\s+(.+)$/;
const esbuildLoc = /^\s{2,}([\w./\\-]+):(\d+):(\d+):?\s*$/;

// webpack:
//   ERROR in ./src/x.ts 12:8-20        (v4)  |  ERROR in ./src/x.ts       (v5, message on next lines)
const webpackErr = /^(ERROR|WARNING) in (.+?)(?:\s+(\d+):(\d+)(?:-\d+)?)?\s*$/;

let currentEslintFile = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  let m = line.match(tscPretty) || line.match(tscClassic);
  if (m) {
    tools.add("typescript");
    items.push({ tool: "typescript", file: m[1], line: +m[2], col: +m[3], severity: m[4], code: m[5], message: m[6].trim() });
    currentEslintFile = null;
    continue;
  }

  m = line.match(eslintEntry);
  if (m && currentEslintFile) {
    tools.add("eslint");
    items.push({ tool: "eslint", file: currentEslintFile, line: +m[1], col: +m[2], severity: m[3], code: m[5], message: m[4].trim() });
    continue;
  }

  if (fileHeader.test(line.trim()) && eslintEntry.test(lines[i + 1] || "")) {
    currentEslintFile = line.trim();
    continue;
  }

  m = line.match(esbuildErr);
  if (m) {
    tools.add("vite/esbuild");
    const loc = (lines[i + 1] || "").match(esbuildLoc) || (lines[i + 2] || "").match(esbuildLoc);
    items.push({
      tool: "vite/esbuild",
      file: loc ? loc[1] : "",
      line: loc ? +loc[2] : undefined,
      col: loc ? +loc[3] : undefined,
      severity: m[1].toLowerCase(),
      code: codeFromMessage(m[2]),
      message: m[2].trim(),
    });
    continue;
  }

  m = line.match(webpackErr);
  if (m) {
    tools.add("webpack");
    const message = (lines.slice(i + 1, i + 4).find((l) => /\w/.test(l) && !/^(ERROR|WARNING) in /.test(l)) || "").trim();
    items.push({
      tool: "webpack",
      file: m[2].trim(),
      line: m[3] ? +m[3] : undefined,
      col: m[4] ? +m[4] : undefined,
      severity: m[1].toLowerCase(),
      code: codeFromMessage(message),
      message: message || "(see output)",
    });
    continue;
  }

  if (/\b(error|ERROR)\b/.test(line) && /:\d+/.test(line)) unparsedErrorHints++;
}

// Derive a stable pseudo-code for tools without error codes, so grouping works.
function codeFromMessage(msg) {
  const known = (msg || "").match(
    /(Could not resolve|Cannot find module|Module not found|is not exported|Unexpected token|Duplicate identifier|out of memory)/i
  );
  return known ? known[1].toLowerCase().replace(/\s+/g, "-") : "generic";
}

function normalizeMessage(msg) {
  return (msg || "")
    .replace(/(['"`])([^'"`]{1,120})\1/g, "'<x>'") // quoted identifiers/paths vary per error
    .replace(/:\d+(:\d+)?/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

// ---------- grouping: by tool + code, subgrouped by normalized message ----------

const groupMap = new Map();
for (const it of items) {
  const key = `${it.tool}::${it.code}`;
  if (!groupMap.has(key)) {
    groupMap.set(key, { tool: it.tool, code: it.code, severity: it.severity, count: 0, normalizedMessage: normalizeMessage(it.message), files: new Set(), sample: [] });
  }
  const g = groupMap.get(key);
  g.count++;
  if (it.severity === "error") g.severity = "error"; // error dominates warning
  g.files.add(it.file);
  if (g.sample.length < 5) g.sample.push({ file: it.file, line: it.line, message: it.message.slice(0, 200) });
}

const groups = [...groupMap.values()]
  .map((g) => ({ ...g, files: [...g.files].slice(0, 8), fileCount: g.files.size }))
  .sort((a, b) => (a.severity === b.severity ? b.count - a.count : a.severity === "error" ? -1 : 1));

const totals = {
  errors: items.filter((i) => i.severity === "error").length,
  warnings: items.filter((i) => i.severity === "warning").length,
};

// Cross-check against tool summary lines when present (tsc "Found N errors", eslint "✖ N problems")
const tscFound = text.match(/^Found (\d+) errors?/m);
const eslintSummary = text.match(/[✖x]\s+(\d+) problems? \((\d+) errors?, (\d+) warnings?\)/);
const reported = {};
if (tscFound) reported.typescript = +tscFound[1];
if (eslintSummary) reported.eslint = { problems: +eslintSummary[1], errors: +eslintSummary[2], warnings: +eslintSummary[3] };

console.log(
  JSON.stringify(
    { tools: [...tools], totals, reportedByTools: reported, groups, unparsedErrorHints },
    null,
    1
  )
);
