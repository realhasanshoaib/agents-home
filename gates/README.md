# Gates

Copyable static gates that enforce the global code standards (`~/.codex/global-code-standards.md`). Copy the relevant file into a project and wire it into the commit gate or CI — don't re-derive the rules.

Each layer sees something the others can't; a project wants all four.

| Layer | File | Enforces | Why this tool |
| --- | --- | --- | --- |
| Semgrep | `semgrep/type-safety.yml` | `as` assertion ban (`as const` exempt), shapeless `Record`/index signatures, `isRecord`-style guards, suppressions without justification | Syntax-level and linter-agnostic — works in every TS file even when the project has no linter |
| ESLint | `eslint/type-safety.mjs` | Floating/misused promises, `!` non-null assertions, explicit `any`, throwing non-Errors, empty catch | Needs type information; only typescript-eslint with `projectService` can see it |
| dependency-cruiser | `depcruise/hexagonal.cjs` | Domain core never imports transport/framework edges; no circular imports | Only tool that checks import direction across the module graph |
| tsc | `tsconfig/strict.json` | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` | Compiler-level; catches unsafe access at the source |

## Copying into a project

- **Semgrep**: copy into the project's `.semgrep/` and run `semgrep scan --config .semgrep --error` in the gate. Scope `paths.include` to the project's source roots if the defaults are too broad.
- **ESLint**: spread the exported array into the project's flat config (see the file header). Requires `typescript-eslint`.
- **dependency-cruiser**: adapt the layer globs to the project's layout first — the defaults assume `src/domains` core with `src/http`-style edges.
- **tsconfig**: extend from it (`"extends"`). `exactOptionalPropertyTypes` is the first flag to drop if a codebase or its dependencies fight it.

Suppressing any gate finding requires an adjacent justification comment (`because` / `reason` / `intentional` / `safe` / `false positive`); the Semgrep pack enforces that too.

## Repo gates (`scripts/`)

Copy `scripts/*` into a project's `scripts/gates/`, then back each alias in the root `package.json` and run `bash scripts/gates/commit.sh` as the commit gate. `hygiene.mjs` verifies the wiring: every referenced alias must exist, and the gate must never mutate the tree or run dev/deploy/release lanes.

| Script | Alias | Checks | Needs |
| --- | --- | --- | --- |
| `hygiene.mjs` | `gate:hygiene` | No placeholder/no-op scripts anywhere in the workspace; commit gate integrity | — |
| `fallow-audit.sh` | `static:fallow` | Changed-code dead code, duplication, complexity, dependency hygiene | `fallow` CLI; baselines optional in `scripts/gates/fallow-baselines/` |
| `semgrep-scan.sh` | `static:semgrep` | Changed-files run of the project's `.semgrep/` pack (seed from `../semgrep/`) | `semgrep` CLI |
| `osv-scan.mjs` | `security:osv` | Known vulnerabilities vs a reviewed baseline (`osv-baseline.json`, start `{"entries": []}`) | `osv-scanner` CLI |
| `spelling.sh` | `lint:spelling` | Typos vs a ratcheting baseline (start with an empty `cspell-baseline.txt`) | `cspell` dev dependency |
| `test-presence.mjs` | `test:presence` | Meaningful source files have a nearby test or a justified exclusion | ADAPT `sourceRoots` |
| `react-quality.mjs` | `static:react` | React Doctor on changed code plus React Scan integration surface | React projects; `react-doctor`, `react-scan` |
| `require-tool.mjs` | — | Helper: fail with install instructions when a CLI is missing | — |
| `commit.sh` | `gate` | Orchestrates all of the above plus lint, typecheck, test, build | — |

Secrets scanning (`security:secrets`) stays a one-liner in `package.json`: `gitleaks detect --source . --redact --verbose` (add `--baseline-path` once a reviewed baseline exists).

Baselines (`fallow-baselines/`, `osv-baseline.json`, `cspell-baseline.txt`, gitleaks) are project-owned data — seed them per project, never copy them between projects.

First deployment: Ava (`~/code/Ava/scripts/gates/`, wired into `pnpm gate`; its Semgrep pack carries the `ava.` prefix and project-scoped paths). Reference for a diff-classifying selective gate: `~/code/chalk/scripts/gates/smart-gate.mjs`.
