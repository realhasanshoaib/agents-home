import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

// Gate self-integrity: no placeholder/no-op package scripts anywhere in the
// workspace, and the commit gate never runs dev/deploy/release lanes or
// mutates the tree.
const rootPackageJson = JSON.parse(readFileSync("package.json", "utf8"));
const workspacePackages = [
  "package.json",
  ...expandWorkspacePackages(rootPackageJson.workspaces ?? readPnpmWorkspacePackages()),
];

const failures = [];
const noOpPattern = /^(?:echo(?:\s+["']?[^"']*["']?)?|true|exit\s+0)$/i;
const placeholderPattern = /\b(?:No linter configured yet|No tests configured yet|TODO: document|generated contract stub)\b/i;
const forbiddenLanePattern = /^(?:deploy|dev|release|ship)(?:$|[:.-])/;

for (const packagePath of workspacePackages) {
  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
  const scripts = packageJson.scripts ?? {};

  for (const [name, command] of Object.entries(scripts)) {
    const trimmed = command.trim();
    const label = `${packagePath} script "${name}"`;

    if (noOpPattern.test(trimmed)) {
      failures.push(`${label} is a no-op placeholder: ${trimmed}`);
    }

    if (placeholderPattern.test(command)) {
      failures.push(`${label} contains placeholder text: ${command}`);
    }

    if (command.includes("--passWithNoTests")) {
      failures.push(`${label} uses --passWithNoTests`);
    }

    if (/<NONEXISTENT>/i.test(command)) {
      failures.push(`${label} references <NONEXISTENT>`);
    }
  }
}

const rootScripts = rootPackageJson.scripts ?? {};
const commitScript = readFileSync("scripts/gates/commit.sh", "utf8");
const referencedScripts = [...commitScript.matchAll(/pnpm\s+run\s+([A-Za-z0-9:_-]+)/g)].map((match) => match[1]);

for (const name of referencedScripts) {
  if (!rootScripts[name]) {
    failures.push(`scripts/gates/commit.sh references missing package script "${name}"`);
  }

  if (forbiddenLanePattern.test(name)) {
    failures.push(`scripts/gates/commit.sh must not run live/dev/deploy/release lane "${name}"`);
  }
}

if (/\b(?:fastlane|wrangler\s+deploy|convex\s+deploy|terraform\s+apply|pnpm\s+run\s+deploy)\b/i.test(commitScript)) {
  failures.push("scripts/gates/commit.sh must not run deployment or release lanes");
}

if (/\b(?:--write|--fix|git\s+add|git\s+commit|git\s+push)\b/.test(commitScript)) {
  failures.push("scripts/gates/commit.sh must not mutate, stage, commit, or push changes");
}

if (failures.length > 0) {
  console.error("Gate hygiene failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Gate hygiene passed.");

function expandWorkspacePackages(workspaces) {
  return [...new Set(workspaces.flatMap(expandWorkspacePackagePaths))].sort();
}

function readPnpmWorkspacePackages() {
  if (!existsSync("pnpm-workspace.yaml")) {
    return [];
  }

  return readFileSync("pnpm-workspace.yaml", "utf8")
    .split("\n")
    .map((line) => line.match(/^\s*-\s+["']?([^"'\s]+)["']?\s*$/)?.[1])
    .filter(Boolean);
}

function expandWorkspacePackagePaths(workspace) {
  if (!workspace.endsWith("/*")) {
    const packagePath = path.join(workspace, "package.json");
    return existsSync(packagePath) ? [packagePath] : [];
  }

  const directory = workspace.slice(0, -2);
  return listDirectories(directory)
    .map((entry) => path.join(directory, entry, "package.json"))
    .filter((packagePath) => existsSync(packagePath));
}

function listDirectories(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory).filter((entry) => statSync(path.join(directory, entry)).isDirectory());
}
