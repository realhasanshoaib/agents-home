import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// ADAPT: list each workspace's source root (e.g. "apps/web/src", "packages/core/src").
const sourceRoots = ["src"];
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const importPatterns = [/\bfrom\s+["']([^"']+)["']/g, /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g, /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g];
const testNamePattern = /(?:^|[./-])(?:test|spec)\.[cm]?[jt]sx?$/;
const ignoredPathPatterns = [
  /(^|\/)__tests__(\/|$)/,
  /(^|\/)__mocks__(\/|$)/,
  /(^|\/)node_modules(\/|$)/,
  /(^|\/)\.turbo(\/|$)/,
  /(^|\/)coverage(\/|$)/,
  /(^|\/)dist(\/|$)/,
  /(^|\/)build(\/|$)/,
  /(^|\/)assets(\/|$)/,
  /(^|\/)public(\/|$)/,
  /(^|\/)docs(\/|$)/,
  /(^|\/)scratchpad(\/|$)/,
  /(^|\/)scripts(\/|$)/,
  /(^|\/)migrations(\/|$)/,
  /(^|\/)_generated(\/|$)/,
  /(^|\/)routeTree\.gen\.ts$/,
];
const ignoredBasenames = new Set(["__root", "index", "types", "vite-env"]);
const explicitPolicyExclusions = loadExplicitPolicyExclusions();

const tracked = git(["ls-files", ...sourceRoots]).filter((file) => existsSync(file));
const files = [...new Set(tracked)].sort();
const allFiles = new Set(files);
const testedFiles = findTestedFiles(files, allFiles);
const missing = [];

for (const file of files) {
  if (!isMeaningfulSource(file)) {
    continue;
  }

  if (explicitPolicyExclusions.has(file)) {
    continue;
  }

  if (!hasNearbyTest(file, allFiles, testedFiles)) {
    missing.push(file);
  }
}

if (missing.length > 0) {
  console.error("Test presence failed. Add a nearby .test/.spec file or extend scripts/gates/test-presence-exclusions.json with a reviewed reason:");
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Test presence passed.");

function git(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(" ")} failed`);
  }
  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isMeaningfulSource(file) {
  const normalized = file.replaceAll("\\", "/");
  const extension = path.extname(normalized);
  return sourceExtensions.has(extension) && !isExcludedSourcePath(normalized, extension);
}

function isExcludedSourcePath(normalized, extension) {
  const basename = path.basename(normalized, extension);
  const exclusions = [
    normalized.endsWith(".d.ts"),
    testNamePattern.test(normalized),
    ignoredPathPatterns.some((pattern) => pattern.test(normalized)),
    ignoredBasenames.has(basename),
    /\.config\.[cm]?[jt]s$/.test(normalized),
    /\.types\.[cm]?[jt]s$/.test(normalized),
    /\.(styles?|css|svg)\.[cm]?[jt]sx?$/.test(normalized),
  ];

  return exclusions.some(Boolean);
}

function hasNearbyTest(file, allFiles, testedFiles) {
  const extension = path.extname(file);
  const withoutExtension = file.slice(0, -extension.length);
  const directory = path.dirname(file);
  const basename = path.basename(withoutExtension);
  const candidates = [
    `${withoutExtension}.test${extension}`,
    `${withoutExtension}.spec${extension}`,
    `${withoutExtension}.test.ts`,
    `${withoutExtension}.test.tsx`,
    `${withoutExtension}.test.js`,
    `${withoutExtension}.test.mjs`,
    path.join(directory, "__tests__", `${basename}.test${extension}`),
    path.join(directory, "__tests__", `${basename}.test.ts`),
    path.join(directory, "__tests__", `${basename}.test.tsx`),
  ].map((candidate) => candidate.replaceAll("\\", "/"));

  return testedFiles.has(file) || candidates.some((candidate) => allFiles.has(candidate) || existsSync(candidate));
}

function findTestedFiles(files, allFiles) {
  const tested = new Set();

  for (const testFile of files.filter((file) => testNamePattern.test(file))) {
    const content = readFileSync(testFile, "utf8");
    const directory = path.dirname(testFile);
    for (const specifier of findLocalImportSpecifiers(content)) {
      for (const resolved of resolveImportTargets(directory, specifier, allFiles)) {
        tested.add(resolved);
      }
    }
  }

  return tested;
}

function findLocalImportSpecifiers(content) {
  return importPatterns.flatMap((pattern) => [...content.matchAll(pattern)].map((match) => match[1])).filter((specifier) => specifier.startsWith("."));
}

function resolveImportTargets(directory, specifier, allFiles) {
  const base = path.normalize(path.join(directory, specifier)).replaceAll("\\", "/");
  const candidates = [];

  if (sourceExtensions.has(path.extname(base))) {
    candidates.push(base);
  }

  for (const extension of sourceExtensions) {
    candidates.push(`${base}${extension}`);
    candidates.push(`${base}/index${extension}`);
  }

  return candidates.filter((candidate) => allFiles.has(candidate));
}

function loadExplicitPolicyExclusions() {
  const exclusionPath = "scripts/gates/test-presence-exclusions.json";
  if (!existsSync(exclusionPath)) {
    return new Set();
  }

  const exclusions = readExclusionPolicy(exclusionPath);
  assertValidExclusionPolicy(exclusions);
  return new Set(Object.keys(exclusions));
}

function readExclusionPolicy(exclusionPath) {
  const parsed = JSON.parse(readFileSync(exclusionPath, "utf8"));
  return parsed.exclusions ?? {};
}

function assertValidExclusionPolicy(exclusions) {
  const failures = Object.entries(exclusions)
    .filter(([, reason]) => !hasMeaningfulExclusionReason(reason))
    .map(([file]) => `${file} is missing a meaningful exclusion reason`);

  if (failures.length === 0) {
    return;
  }

  console.error("Test presence exclusion policy failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

function hasMeaningfulExclusionReason(reason) {
  return typeof reason === "string" && reason.trim().length >= 16;
}
