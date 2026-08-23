#!/usr/bin/env bash
set -euo pipefail

# Changed-files Semgrep scan against the project's rule pack (default .semgrep/,
# seeded from ~/.agents/gates/semgrep/). Falls back to a full scan when no
# baseline commit can be resolved.
node scripts/gates/require-tool.mjs semgrep "Install the official Semgrep CLI, then rerun the semgrep gate."

config="${SEMGREP_CONFIG:-.semgrep}"
base="${SEMGREP_BASELINE_COMMIT:-}"

if [ -z "$base" ]; then
  for ref in origin/HEAD origin/main origin/master main master; do
    if git rev-parse --verify "$ref" >/dev/null 2>&1; then
      base="$(git merge-base HEAD "$ref" 2>/dev/null || true)"
      [ -n "$base" ] && break
    fi
  done
fi

if [ -z "$base" ]; then
  semgrep scan --config "$config" --error
  exit 0
fi

changed_files="$(mktemp -t gate-semgrep-files.XXXXXX)"
trap 'rm -f "$changed_files"' EXIT

git diff --name-only --diff-filter=ACMR "$base"...HEAD >"$changed_files"
git diff --name-only --diff-filter=ACMR --cached >>"$changed_files"
sort -u "$changed_files" -o "$changed_files"

if [ ! -s "$changed_files" ]; then
  echo "No committed or staged file changes; Semgrep passed."
  exit 0
fi

files=()
while IFS= read -r file; do
  if [ -f "$file" ]; then
    files+=("$file")
  fi
done <"$changed_files"

if [ ${#files[@]} -eq 0 ]; then
  echo "No existing committed or staged file changes; Semgrep passed."
  exit 0
fi

echo "Semgrep baseline commit: $base"
semgrep scan --config "$config" --error -- "${files[@]}"
