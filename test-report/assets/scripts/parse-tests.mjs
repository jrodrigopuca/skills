#!/usr/bin/env node
/**
 * parse-tests.mjs — turn test runner output into compact, grouped JSON.
 *
 * Deterministic parsing belongs in code; analysis belongs in the model.
 * Zero dependencies. Node 18+.
 *
 * Usage:
 *   node parse-tests.mjs results.json          # Jest/Vitest/Playwright JSON
 *   node parse-tests.mjs results.xml           # JUnit XML
 *   npx vitest run --reporter=json | node parse-tests.mjs
 *   node parse-tests.mjs raw-output.txt        # pasted text (best effort)
 *
 * Output (stdout): JSON — { runner, totals, groups[], flaky[], unparsedLines }
 */

import { readFileSync } from "node:fs";

// ---------- input ----------

function readInput() {
  const file = process.argv[2];
  if (file) return readFileSync(file, "utf8");
  try {
    return readFileSync(0, "utf8"); // stdin
  } catch {
    console.error("Usage: parse-tests.mjs <file> (or pipe output via stdin)");
    process.exit(2);
  }
}

// ---------- normalization & classification ----------

function normalizeMessage(msg) {
  return (msg || "")
    .split("\n")[0]
    .replace(/([A-Za-z]:)?[/\\][\w./\\-]+[/\\]/g, "") // path prefixes
    .replace(/:\d+(:\d+)?/g, "")                       // line:col
    .replace(/\b0x[0-9a-f]+\b/gi, "<id>")
    .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, "<id>")
    .replace(/\(\d+(\.\d+)?\s*m?s\)/g, "")             // durations
    .replace(/\d{4}-\d{2}-\d{2}T[\d:.]+Z?/g, "<t>")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

function classify(message, { isSetup = false, passedOnRetry = false } = {}) {
  const m = (message || "").toLowerCase();
  if (passedOnRetry) return "flaky";
  if (isSetup) return "cascade";
  if (/(cannot find module|failed to run|before(all|each)|fixture|conftest|error at setup)/.test(m)) return "cascade";
  if (/snapshot/.test(m)) return "snapshot";
  if (/(timed? ?out|exceeded timeout|timeouterror)/.test(m)) return "timeout";
  if (/(econnrefused|eaddrinuse|enotfound|missing.+env|connection refused)/.test(m)) return "infra";
  if (/(assert|expect|tobe|toequal|received)/.test(m)) return "assertion";
  return "other";
}

// ---------- format parsers → [{file, name, line?, message, isSetup?, passedOnRetry?}] ----------

function parseJestJson(data) {
  const failures = [];
  const flaky = [];
  for (const suite of data.testResults || []) {
    const file = suite.name || suite.testFilePath || "";
    const asserts = suite.assertionResults || [];
    const failedAsserts = asserts.filter((a) => a.status === "failed");
    if ((suite.status === "failed" || suite.failureMessage) && failedAsserts.length === 0) {
      failures.push({ file, name: "(test suite failed to run)", message: suite.message || suite.failureMessage || "suite failed", isSetup: true });
    }
    for (const a of failedAsserts) {
      failures.push({ file, name: a.fullName || a.title, message: (a.failureMessages || []).join("\n") });
    }
  }
  return {
    runner: "jest/vitest-json",
    failures,
    flaky,
    totals: { failed: data.numFailedTests ?? null, passed: data.numPassedTests ?? null, skipped: data.numPendingTests ?? null },
  };
}

function parsePlaywrightJson(data) {
  const failures = [];
  const flaky = [];
  const walk = (suite, filePath) => {
    const file = suite.file || filePath || "";
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const lastError = (test.results || []).map((r) => r.error?.message).filter(Boolean).pop() || "";
        const entry = { file: spec.file || file, name: spec.title, line: spec.line, message: lastError };
        if (test.status === "flaky") flaky.push({ ...entry, passedOnRetry: true });
        else if (test.status === "unexpected") failures.push(entry);
      }
    }
    for (const child of suite.suites || []) walk(child, file);
  };
  for (const s of data.suites || []) walk(s, "");
  const st = data.stats || {};
  return {
    runner: "playwright-json",
    failures,
    flaky,
    totals: { failed: st.unexpected ?? failures.length, passed: st.expected ?? null, skipped: st.skipped ?? null, flaky: st.flaky ?? flaky.length },
  };
}

function parseJunitXml(text) {
  const failures = [];
  const decode = (s) =>
    (s || "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
  const caseRe = /<testcase\b([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g;
  const attr = (attrs, name) => (attrs.match(new RegExp(`${name}="([^"]*)"`)) || [])[1] || "";
  let m;
  let total = 0;
  while ((m = caseRe.exec(text))) {
    total++;
    const [, attrs, body = ""] = m;
    const fail = body.match(/<failure\b([^>]*)>?([\s\S]*?)(?:<\/failure>|$)/);
    const err = body.match(/<error\b([^>]*)>?([\s\S]*?)(?:<\/error>|$)/);
    const hit = fail || err;
    if (!hit) continue;
    const msg = decode(attr(hit[1] || "", "message")) || decode((hit[2] || "").replace(/<!\[CDATA\[|\]\]>/g, "")).split("\n")[0];
    failures.push({
      file: attr(attrs, "file") || attr(attrs, "classname"),
      name: attr(attrs, "name"),
      message: msg,
      isSetup: Boolean(err),
    });
  }
  return { runner: "junit-xml", failures, flaky: [], totals: { failed: failures.length, passed: total - failures.length || null } };
}

function parseText(text) {
  const failures = [];
  const flaky = [];
  const lines = text.split("\n");
  let runner = "unknown-text";
  let unparsedFailureHints = 0;

  // pytest: FAILED path::test - msg | ERROR path::test - msg
  const pytestRe = /^(FAILED|ERROR)\s+([^\s:]+)(?:::(\S+))?(?:\s+-\s+(.*))?$/;
  // playwright text: "  1) [chromium] › e2e/x.spec.ts:12:5 › title"
  const pwRe = /^\s*\d+\)\s+(?:\[[^\]]+\]\s+›\s+)?(.+?\.(?:spec|test)\.[cm]?[jt]sx?):(\d+):\d+\s+›\s+(.+)$/;
  // jest "  ● name" / vitest "   × name" and "FAIL file > chain"
  const vitestFailRe = /^\s*FAIL\s+(\S+)\s+>\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    let m = line.match(pytestRe);
    if (m) {
      runner = "pytest-text";
      failures.push({ file: m[2], name: m[3] || "(module)", message: m[4] || m[1], isSetup: m[1] === "ERROR" });
      continue;
    }

    m = line.match(pwRe);
    if (m) {
      runner = "playwright-text";
      const message = (lines.slice(i + 1, i + 8).find((l) => /\S/.test(l) && !/^\s*\d+\)/.test(l)) || "").trim();
      const entry = { file: m[1], name: m[3].trim(), line: Number(m[2]), message };
      // playwright prints flaky tests under a "N flaky" section without "N)" numbering — numbered entries are failures
      failures.push(entry);
      continue;
    }

    m = line.match(vitestFailRe);
    if (m) {
      runner = "vitest-text";
      const message = (lines.slice(i + 1, i + 6).find((l) => /\w/.test(l)) || "").trim();
      failures.push({ file: m[1], name: m[2].trim(), message });
      continue;
    }

    // jest "●" blocks
    m = line.match(/^\s*●\s+(.+)$/);
    if (m) {
      if (runner === "unknown-text") runner = "jest-text";
      const name = m[1].trim();
      if (/^Test suite failed to run/i.test(name)) {
        const fileLine = lines.slice(Math.max(0, i - 10), i).reverse().find((l) => /^FAIL\s/.test(l));
        const message = (lines.slice(i + 1, i + 6).find((l) => /\w/.test(l)) || "").trim();
        failures.push({ file: (fileLine || "").replace(/^FAIL\s+/, "").trim(), name, message, isSetup: true });
      } else if (!/passed|Summary/i.test(name)) {
        const block = lines.slice(i + 1, i + 12);
        const message = (block.find((l) => /\w/.test(l)) || "").trim();
        const at = block.map((l) => l.match(/\(?([\w./\\-]+\.[cm]?[jt]sx?):(\d+):\d+\)?/)).find(Boolean);
        failures.push({ file: at ? at[1] : "", name: name.replace(/\s*›\s*/g, " > "), line: at ? Number(at[2]) : undefined, message });
      }
      continue;
    }

    if (/^\s*[×✕✗]\s+/.test(line)) unparsedFailureHints++;
  }

  // playwright flaky section: "  1 flaky" followed by indented test lines
  const flakyIdx = lines.findIndex((l) => /^\s*\d+\s+flaky\s*$/.test(l));
  if (flakyIdx !== -1) {
    for (let j = flakyIdx + 1; j < lines.length; j++) {
      const fm = lines[j].match(/^\s+(?:\[[^\]]+\]\s+›\s+)?(.+?):(\d+):\d+\s+›\s+(.+)$/);
      if (!fm) break;
      flaky.push({ file: fm[1], name: fm[3].trim(), line: Number(fm[2]), message: "passed on retry", passedOnRetry: true });
    }
  }

  // totals from summary lines (best effort across runners; anchored to avoid
  // matching numbers inside error messages)
  const totals = {};
  const jsSummary = text.match(/^\s*Tests?:?\s+(\d+) failed(?:\s*\|\s*|,\s*)(\d+) passed/im);
  const pySummary = text.match(/^=+\s+(\d+) failed(?:, (\d+) errors?)?(?:, (\d+) passed)?/im);
  if (jsSummary) {
    totals.failed = Number(jsSummary[1]);
    totals.passed = Number(jsSummary[2]);
  } else if (pySummary) {
    totals.failed = Number(pySummary[1]) + (pySummary[2] ? Number(pySummary[2]) : 0);
    if (pySummary[3]) totals.passed = Number(pySummary[3]);
  }

  return { runner, failures, flaky, totals, unparsedFailureHints };
}

// ---------- grouping ----------

function group(failures) {
  const groups = new Map();
  for (const f of failures) {
    const category = classify(f.message, { isSetup: f.isSetup });
    const key = `${category}::${normalizeMessage(f.message) || `(no message) ${f.file}`}`;
    if (!groups.has(key)) {
      groups.set(key, { category, normalizedMessage: normalizeMessage(f.message), count: 0, files: new Set(), tests: [] });
    }
    const g = groups.get(key);
    g.count++;
    g.files.add(f.file);
    if (g.tests.length < 5) g.tests.push({ file: f.file, name: f.name, line: f.line });
    if (!g.sampleMessage) g.sampleMessage = (f.message || "").split("\n").slice(0, 3).join("\n").slice(0, 400);
  }
  const order = { infra: 0, cascade: 1, assertion: 2, other: 3, timeout: 4, snapshot: 5 };
  return [...groups.values()]
    .map((g) => ({ ...g, files: [...g.files].slice(0, 5) }))
    .sort((a, b) => (order[a.category] ?? 9) - (order[b.category] ?? 9) || b.count - a.count);
}

// ---------- main ----------

const raw = readInput().trim();
let parsed;

try {
  if (raw.startsWith("{") || raw.startsWith("[")) {
    const data = JSON.parse(raw);
    parsed = data.suites || data.config?.projects ? parsePlaywrightJson(data) : parseJestJson(data);
  } else if (raw.startsWith("<")) {
    parsed = parseJunitXml(raw);
  } else {
    parsed = parseText(raw);
  }
} catch (e) {
  console.error(`Parse error: ${e.message} — falling back to text mode`);
  parsed = parseText(raw);
}

const result = {
  runner: parsed.runner,
  totals: { ...parsed.totals, failedParsed: parsed.failures.length, flaky: parsed.flaky.length || parsed.totals?.flaky || 0 },
  groups: group(parsed.failures),
  flaky: parsed.flaky.map((f) => ({ file: f.file, name: f.name, line: f.line })),
  unparsedFailureHints: parsed.unparsedFailureHints || 0,
};

console.log(JSON.stringify(result, null, 1));
