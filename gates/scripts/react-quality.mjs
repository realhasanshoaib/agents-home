import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const reactDoctorCli = require.resolve("react-doctor");
const base = process.env.REACT_QUALITY_BASE || findBaselineCommit();

runReactDoctor(base);
verifyReactScan();

function runReactDoctor(baselineCommit) {
  const args = [
    reactDoctorCli,
    ".",
    "--yes",
    "--scope",
    "changed",
    "--blocking",
    "warning",
    "--no-score",
    "--verbose",
  ];

  if (baselineCommit) {
    args.push("--base", baselineCommit);
    console.log(`React Doctor baseline commit: ${baselineCommit}`);
  } else {
    console.log("React Doctor baseline commit not found; scanning the full workspace.");
  }

  run(process.execPath, args);
}

function verifyReactScan() {
  const version = capture("pnpm", ["exec", "react-scan", "--version"]).trim();
  assert(version.length > 0, "react-scan CLI did not return a version.");

  const reactScan = require("react-scan");
  assertFunction(reactScan.scan, "react-scan scan API");
  assertFunction(reactScan.getReport, "react-scan getReport API");

  const { instrument } = require("react-scan/lite");
  assertFunction(instrument, "react-scan/lite instrument API");
  const handle = instrument({ enabled: false, onEvent: () => {} });
  assertFunction(handle.stop, "react-scan/lite handle.stop API");
  assertFunction(handle.isActive, "react-scan/lite handle.isActive API");
  handle.stop();

  const vitePluginFactory = require("react-scan/react-component-name/vite").default;
  assertFunction(vitePluginFactory, "react-scan Vite component-name plugin factory");
  const vitePlugin = vitePluginFactory();
  assert(vitePlugin?.name, "react-scan Vite component-name plugin did not expose a plugin name.");

  console.log(`React Scan ${version} CLI, runtime, lite instrumentation, and Vite plugin loaded.`);
}

function findBaselineCommit() {
  for (const ref of ["origin/HEAD", "origin/master", "master"]) {
    const result = spawnSync("git", ["merge-base", "HEAD", ref], { encoding: "utf8" });
    if (result.status === 0 && result.stdout.trim()) {
      return result.stdout.trim();
    }
  }

  return "";
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  exitOnFailure(result);
}

function capture(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  exitOnFailure(result, result.stderr);
  return result.stdout;
}

function exitOnFailure(result, stderr = "") {
  if (result.status === 0) {
    return;
  }

  if (stderr) {
    process.stderr.write(stderr);
  }

  process.exit(result.status ?? 1);
}

function assertFunction(value, label) {
  assert(typeof value === "function", `${label} is not available.`);
}

function assert(condition, message) {
  if (!condition) {
    console.error(`React quality gate failed: ${message}`);
    process.exit(1);
  }
}
