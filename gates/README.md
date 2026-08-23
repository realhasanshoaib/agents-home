# Gates → moved to q9stack

The copyable gate files that used to live here (Semgrep type-safety pack, ESLint type-aware rules, dependency-cruiser hexagonal rules, strict tsconfig, and the `scripts/` commit-gate lanes) were absorbed into the q9stack monorepo on 2026-08-23 and are published as versioned packages:

| Old file | Now |
| --- | --- |
| `semgrep/type-safety.yml` | `@q9labsai/config-semgrep` (`rules/*.yml`) |
| `eslint/type-safety.mjs` | `@q9labsai/config-oxlint` (oxlint replaced ESLint) |
| `depcruise/hexagonal.cjs` | `@q9labsai/config-depcruise` |
| `tsconfig/strict.json` | `@q9labsai/config-tsconfig` |
| `scripts/*` (commit gate, hygiene, fallow, osv, spelling, test-presence, react-quality) | `@q9labsai/gates` (`q9gate run`) lanes |

Source: `~/code/q9stack` (`packages/config-*`, `packages/gates`). New projects get everything wired through `create-q9stack`; existing projects add the packages and a `gate.config.ts` (see `~/code/q9stack/docs/spec.md` and `packages/gates/README.md`).

The original files are in this repo's history: `git log -- gates/` (commit "track the legacy copyable gate files").
