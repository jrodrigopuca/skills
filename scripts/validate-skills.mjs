#!/usr/bin/env node
/**
 * validate-skills.mjs — suite self-validation.
 *
 * Checks every skill directory (any top-level dir containing SKILL.md):
 *   1. Frontmatter: name, description, license, metadata.version present
 *   2. name matches the directory name
 *   3. description mentions "Trigger" (frontmatter is the activation surface)
 *   4. SKILL.md line budget (<= 350 lines)
 *   5. Relative markdown links resolve to existing files/dirs
 *   6. assets/scripts/*: executable bit, bash -n for shell, node --check for .mjs
 *   7. README.md lists every skill directory
 *
 * Exit 0 = clean, 1 = errors. Warnings don't fail the build.
 */

import { readFileSync, readdirSync, statSync, existsSync, accessSync, constants } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const LINE_BUDGET = 350;
const errors = [];
const warnings = [];

const skillDirs = readdirSync(ROOT)
  .filter((d) => !d.startsWith(".") && statSync(join(ROOT, d)).isDirectory())
  .filter((d) => existsSync(join(ROOT, d, "SKILL.md")))
  .sort();

if (skillDirs.length === 0) {
  console.error("No skill directories found — is this the repo root?");
  process.exit(1);
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = m[1];
  const get = (key) => {
    const r = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
    return r ? r[1].trim() : null;
  };
  // description may be a folded block (">") — capture until the next top-level key
  let description = get("description") || "";
  if (description === ">" || description === ">-" || description === "") {
    const block = fm.match(/^description:\s*>?-?\s*\n((?:[ \t]+.*\n?)+)/m);
    if (block) description = block[1].replace(/\s+/g, " ").trim();
  }
  return {
    name: get("name"),
    description,
    license: get("license"),
    version: (fm.match(/^\s+version:\s*"?([\d.]+)"?/m) || [])[1] || null,
  };
}

function* markdownFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* markdownFiles(p);
    else if (entry.endsWith(".md")) yield p;
  }
}

for (const skill of skillDirs) {
  const dir = join(ROOT, skill);
  const skillMd = join(dir, "SKILL.md");
  const text = readFileSync(skillMd, "utf8");
  const rel = (p) => p.replace(ROOT + "/", "");

  // 1-2. frontmatter
  const fm = parseFrontmatter(text);
  if (!fm) {
    errors.push(`${skill}: SKILL.md has no frontmatter`);
    continue;
  }
  if (!fm.name) errors.push(`${skill}: frontmatter missing 'name'`);
  else if (fm.name !== skill) errors.push(`${skill}: frontmatter name '${fm.name}' != directory name`);
  if (!fm.description) errors.push(`${skill}: frontmatter missing 'description'`);
  if (!fm.license) errors.push(`${skill}: frontmatter missing 'license'`);
  if (!fm.version) warnings.push(`${skill}: frontmatter missing 'metadata.version'`);

  // 3. trigger in description
  if (fm.description && !/trigger/i.test(fm.description)) {
    errors.push(`${skill}: description has no 'Trigger:' — activation depends on it`);
  }
  if (fm.description && fm.description.length > 1024) {
    errors.push(`${skill}: description exceeds 1024 chars (${fm.description.length})`);
  }

  // 4. line budget
  const lineCount = text.split("\n").length;
  if (lineCount > LINE_BUDGET) {
    errors.push(`${skill}: SKILL.md is ${lineCount} lines (budget ${LINE_BUDGET}) — move detail to references/`);
  }

  // 5. relative links resolve (all .md files in the skill)
  // - fenced code blocks are stripped: links inside examples are illustrative
  // - files under a templates/ directory are scaffolds for OTHER repos; their
  //   relative links are placeholders by design
  for (const mdFile of markdownFiles(dir)) {
    if (/\/templates\/|example/i.test(mdFile)) continue;
    const content = readFileSync(mdFile, "utf8").replace(/```[\s\S]*?```/g, "").replace(/^(?:    |\t).*$/gm, "");
    for (const link of content.matchAll(/\[[^\]]*\]\(([^)#\s]+?)(?:#[^)]*)?\)/g)) {
      const target = link[1];
      if (/^(https?:|mailto:)/.test(target)) continue;
      if (target.includes("{") || target.includes("<")) continue; // template placeholder
      if (!target.includes("/") && !target.includes(".")) continue; // bare placeholder like (url)
      const resolved = join(dirname(mdFile), target);
      if (!existsSync(resolved)) {
        errors.push(`${rel(mdFile)}: broken link → ${target}`);
      }
    }
  }

  // 6. scripts
  const scriptsDir = join(dir, "assets", "scripts");
  if (existsSync(scriptsDir)) {
    for (const s of readdirSync(scriptsDir)) {
      const sp = join(scriptsDir, s);
      if (statSync(sp).isDirectory()) continue;
      try {
        accessSync(sp, constants.X_OK);
      } catch {
        if (!s.endsWith(".mjs")) errors.push(`${skill}: script not executable → assets/scripts/${s}`);
      }
      const shebang = readFileSync(sp, "utf8").split("\n")[0];
      try {
        if (s.endsWith(".mjs") || /node/.test(shebang)) execFileSync("node", ["--check", sp], { stdio: "pipe" });
        else if (/bash|sh/.test(shebang)) execFileSync("bash", ["-n", sp], { stdio: "pipe" });
      } catch (e) {
        errors.push(`${skill}: script fails syntax check → assets/scripts/${s}\n    ${String(e.stderr || e.message).trim().split("\n")[0]}`);
      }
    }
  }

  console.log(`✓ checked ${skill} (${lineCount} lines)`);
}

// 7. README sync
const readme = readFileSync(join(ROOT, "README.md"), "utf8");
for (const skill of skillDirs) {
  if (!readme.includes(`(${skill}/)`) && !readme.includes(`[${skill}]`)) {
    errors.push(`README.md: skill '${skill}' is not listed`);
  }
}
const skillCountMatch = readme.match(/Colección de (\d+) skills/);
if (skillCountMatch && Number(skillCountMatch[1]) !== skillDirs.length) {
  errors.push(`README.md: says ${skillCountMatch[1]} skills, repo has ${skillDirs.length}`);
}

// ---------- summary ----------

console.log(`\n${skillDirs.length} skills checked.`);
if (warnings.length) {
  console.log(`\n⚠ Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
  console.error(`\n✖ Errors (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("\n✔ Suite is valid.");
