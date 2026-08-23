#!/usr/bin/env bash
set -euo pipefail

# Ratcheting cspell gate: only issues absent from the reviewed baseline fail.
# Start a project with an empty baseline: touch scripts/gates/cspell-baseline.txt
baseline="scripts/gates/cspell-baseline.txt"

if [ ! -f "$baseline" ]; then
  echo "Missing CSpell baseline at $baseline" >&2
  exit 1
fi

# ADAPT: the tracked roots that carry prose and identifiers worth spelling.
paths=(
  AGENTS.md
  README.md
  package.json
  apps
  packages
  src
  scripts
  docs
  .github
)

file_list="$(mktemp -t gate-cspell-files.XXXXXX)"
issues_file="$(mktemp -t gate-cspell-issues.XXXXXX)"
new_issues_file="$(mktemp -t gate-cspell-new.XXXXXX)"
trap 'rm -f "$file_list" "$issues_file" "$new_issues_file"' EXIT

git ls-files -- "${paths[@]}" | while IFS= read -r file; do
  if [ -f "$file" ]; then
    printf '%s\n' "$file"
  fi
done >"$file_list"

./node_modules/.bin/cspell lint \
  --file-list stdin \
  --gitignore \
  --no-progress \
  --no-summary \
  --no-color \
  --no-exit-code \
  --issue-template '$filename:$row:$col:$text' \
  <"$file_list" \
  | sort -u >"$issues_file"

comm -23 "$issues_file" "$baseline" >"$new_issues_file"

if [ -s "$new_issues_file" ]; then
  echo "Spelling failed. Add real words to cspell.config.yaml, fix typos, or update $baseline with a reviewed inherited issue:" >&2
  sed 's/^/- /' "$new_issues_file" >&2
  exit 1
fi

echo "Spelling passed."
