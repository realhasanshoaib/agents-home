#!/usr/bin/env bash
set -euo pipefail

# Changed-code Fallow audit: dead code, duplication, complexity, dependency hygiene.
# Requires the fallow CLI. Baselines are project-owned data: seed them from a
# reviewed clean run into scripts/gates/fallow-baselines/; until they exist the
# audit runs unbaselined.
base="${FALLOW_AUDIT_BASE:-}"
baseline_dir="${FALLOW_BASELINE_DIR:-scripts/gates/fallow-baselines}"

if [ -z "$base" ]; then
  base="$(
    git merge-base HEAD origin/HEAD 2>/dev/null \
      || git merge-base HEAD origin/main 2>/dev/null \
      || git merge-base HEAD origin/master 2>/dev/null \
      || git merge-base HEAD main 2>/dev/null \
      || git merge-base HEAD master 2>/dev/null \
      || true
  )"
fi

if [ -z "$base" ]; then
  fallow audit
  exit 0
fi

diff_file="$(mktemp -t gate-fallow-diff.XXXXXX)"
trap 'rm -f "$diff_file"' EXIT

git diff --binary --no-ext-diff "$base"...HEAD >"$diff_file"
git diff --binary --no-ext-diff --cached >>"$diff_file"

if [ ! -s "$diff_file" ]; then
  echo "No committed or staged JS/TS diff; changed-code Fallow audit passed."
  exit 0
fi

audit_args=(--changed-since "$base" --diff-file "$diff_file")

for pair in "dead-code:--dead-code-baseline" "health:--health-baseline" "dupes:--dupes-baseline"; do
  name="${pair%%:*}"
  flag="${pair#*:}"
  if [ -f "$baseline_dir/$name.json" ]; then
    audit_args+=("$flag" "$baseline_dir/$name.json")
  fi
done

fallow audit "${audit_args[@]}"
