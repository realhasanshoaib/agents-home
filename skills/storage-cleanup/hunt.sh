#!/bin/bash
# Prints free space and every folder of 1 GiB or more: three levels into home,
# plus the system places that have filled the disk before. Changes nothing.
set -u
df -h /System/Volumes/Data | awk 'NR==2 {print "free: " $4 " of " $2}'
errors=$(mktemp)
{
  du -xk -d 3 "$HOME"
  du -xk -d 2 /opt/homebrew /Library/Developer /Applications
  du -xk -d 1 "$(getconf DARWIN_USER_CACHE_DIR)" "$(getconf DARWIN_USER_TEMP_DIR)"
} 2>"$errors" | awk -F'\t' '$1 >= 1048576 {printf "%6.1f GiB\t%s\n", $1/1048576, $2}' | sort -rn | head -80
echo "unreadable: $(wc -l <"$errors" | tr -d ' ') paths, so folders behind Full Disk Access such as Mail and Messages are not counted"
rm -f -- "$errors"
