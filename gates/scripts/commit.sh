#!/usr/bin/env bash
set -euo pipefail

# Commit gate template. Copy into scripts/gates/ and back every `pnpm run`
# alias here with a real script in the root package.json (hygiene.mjs verifies
# both, and that this file never mutates the tree or touches deploy lanes).

# Fail if this gate relies on placeholder, no-op, weak, missing, or mutating scripts.
pnpm run gate:hygiene

# Changed-code dead code, duplication, complexity, and dependency hygiene.
pnpm run static:fallow

# Custom Semgrep rules: type-safety bans, security, forbidden APIs.
pnpm run static:semgrep

# Scan for API keys, tokens, passwords, private keys, and credential leaks.
pnpm run security:secrets

# Known vulnerabilities in dependency manifests and lockfiles.
pnpm run security:osv

# Catch typos in identifiers, comments, docs, config, and user-facing copy.
pnpm run lint:spelling

# Require meaningful source files to have matching tests unless explicitly excluded.
pnpm run test:presence

# Stable lint contract.
pnpm run lint

# Typecheck the owned package surface.
pnpm run check-types

# Run workspace tests.
pnpm run test

# Verify deployable bundles build.
pnpm run build
