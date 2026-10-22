#!/bin/sh
# Requires Node 20+, Playwright with Chromium, and ImageMagick montage.
# PLAYWRIGHT_MODULE may point to an existing playwright package on this machine.
set -eu
exec node "$(dirname "$0")/precheck.mjs" "$@"
