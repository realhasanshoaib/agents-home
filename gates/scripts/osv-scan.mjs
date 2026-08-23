import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// Baselined OSV scan: only vulnerability records absent from the reviewed
// baseline fail. Start a project with: {"entries": []}
const baselinePath = "scripts/gates/osv-baseline.json";
const scannerArgs = [
  "scan",
  "source",
  "-r",
  "--experimental-exclude",
  "scratchpad",
  "--experimental-exclude",
  ".worktrees",
  "--format",
  "json",
  ".",
];

const baseline = loadBaseline();
const report = runScanner();
const findings = collectFindings(report);
const baselineKeys = new Set(baseline.entries.map((entry) => findingKey(entry)));
const unbaselined = findings.filter((finding) => !baselineKeys.has(findingKey(finding)));

if (unbaselined.length > 0) {
  console.error(`OSV scan failed: ${unbaselined.length} unbaselined vulnerability record(s).`);
  for (const finding of unbaselined.slice(0, 50)) {
    console.error(`- ${finding.id} ${finding.package}@${finding.version} (${finding.ecosystem}) in ${finding.source}`);
  }
  if (unbaselined.length > 50) {
    console.error(`... and ${unbaselined.length - 50} more`);
  }
  process.exit(1);
}

console.log(`OSV scan passed: ${findings.length} current vulnerability record(s) are covered by ${baselinePath}.`);

function loadBaseline() {
  if (!existsSync(baselinePath)) {
    throw new Error(`Missing OSV baseline at ${baselinePath}`);
  }

  const parsed = JSON.parse(readFileSync(baselinePath, "utf8"));
  const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
  const duplicateKeys = findDuplicateKeys(entries.map((entry) => findingKey(entry)));

  if (duplicateKeys.length > 0) {
    throw new Error(`OSV baseline has duplicate entries: ${duplicateKeys.slice(0, 10).join(", ")}`);
  }

  return { ...parsed, entries };
}

function runScanner() {
  const result = spawnSync("osv-scanner", scannerArgs, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

  assertScannerStarted(result);
  writeScannerStderr(result.stderr);

  const parsed = parseScannerOutput(result);
  assertScannerResult(result.status, parsed);

  return parsed;
}

function assertScannerStarted(result) {
  if (result.error?.code === "ENOENT") {
    throw new Error("Install the official OSV-Scanner CLI, then rerun the OSV gate.");
  }
}

function writeScannerStderr(stderr) {
  if (stderr.trim()) {
    process.stderr.write(stderr);
  }
}

function parseScannerOutput(result) {
  if (!result.stdout.trim()) {
    throw new Error(result.stderr.trim() || "OSV-Scanner produced no JSON output.");
  }

  return JSON.parse(result.stdout);
}

function assertScannerResult(status, report) {
  if (status !== 0 && collectFindings(report).length === 0) {
    throw new Error(`OSV-Scanner exited with ${status} without parseable findings.`);
  }
}

function collectFindings(report) {
  const findings = new Map();

  for (const result of report.results ?? []) {
    collectResultFindings(findings, result);
  }

  return [...findings.values()].sort((a, b) => findingKey(a).localeCompare(findingKey(b)));
}

function collectResultFindings(findings, result) {
  const source = normalizeSourcePath(sourcePathForResult(result));

  for (const packageResult of packagesForResult(result)) {
    collectPackageFindings(findings, source, packageResult);
  }
}

function collectPackageFindings(findings, source, packageResult) {
  const packageInfo = packageInfoForResult(packageResult);

  for (const vulnerability of vulnerabilitiesForResult(packageResult)) {
    const finding = createFinding(source, packageInfo, vulnerability);
    findings.set(findingKey(finding), finding);
  }
}

function createFinding(source, packageInfo, vulnerability) {
  return {
    ecosystem: unknownFallback(packageInfo.ecosystem),
    id: vulnerability.id,
    package: unknownFallback(packageInfo.name),
    severity: severityForVulnerability(vulnerability),
    source,
    summary: emptyFallback(vulnerability.summary),
    version: unknownFallback(packageInfo.version),
  };
}

function sourcePathForResult(result) {
  return unknownFallback(result.source?.path);
}

function packagesForResult(result) {
  return result.packages ?? [];
}

function packageInfoForResult(packageResult) {
  return packageResult.package ?? {};
}

function vulnerabilitiesForResult(packageResult) {
  return packageResult.vulnerabilities ?? [];
}

function severityForVulnerability(vulnerability) {
  return vulnerability.database_specific?.severity ?? "UNKNOWN";
}

function unknownFallback(value) {
  return value ?? "unknown";
}

function emptyFallback(value) {
  return value ?? "";
}

function findingKey(finding) {
  return [finding.source, finding.ecosystem, finding.package, finding.version, finding.id].join("|");
}

function normalizeSourcePath(sourcePath) {
  if (!path.isAbsolute(sourcePath)) {
    return sourcePath.replaceAll("\\", "/");
  }

  return path.relative(process.cwd(), sourcePath).replaceAll("\\", "/");
}

function findDuplicateKeys(keys) {
  const seen = new Set();
  const duplicates = new Set();

  for (const key of keys) {
    if (seen.has(key)) {
      duplicates.add(key);
    }
    seen.add(key);
  }

  return [...duplicates];
}
