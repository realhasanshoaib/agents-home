---
name: storage-cleanup
description: Use when Hasan asks to free disk space or clean up storage, worktrees, caches or simulators on the MacBook Air or the M4.
disable-model-invocation: true
---

This is the attended pass. The engine is `~/code/storage-cleanup.sh`, and `~/code/storage-cleanup-guide.md` is its policy: the tiers, the keep rules, and what never to touch. Read the guide's Tier B table and its never-kill list before step 4. Hasan wants space back and no homework, so do every step yourself.

The command guard blocks `rm -rf`, `find -delete` and truncating redirects that you type. Delete only through the engine, with `~/code/storage-cleanup.sh rm <path>` for build output and caches, or through `trash <path>`, which step 5 empties. When both refuse a path, report it with the refusal and leave it.

1. Work on both Macs unless Hasan names one. Each `ssh agents-macmini` session takes about a minute to open, so start the M4's commands first and in the background. Record free space on each with `df -h /System/Volumes/Data`.
2. Run the engine on each Mac: `~/code/storage-cleanup.sh scheduled`, then `STORAGE_CLEANUP_WORKTREE_IDLE_HOURS=12 ~/code/storage-cleanup.sh worktrees`. The second command pushes every worktree idle for 12 hours to origin, with uncommitted work committed to a `cleanup/` branch first, then removes it. Each removal writes its restore command to `storage-cleanup-worktree-restore.jsonl` in the run-log folder. When Hasan wants worktrees cleared regardless of age, use `1` instead of `12`. That is the floor, and a worktree a process is using is always kept. Done when both commands printed their JSON summary.
3. Run the hunt: `~/.agents/skills/storage-cleanup/hunt.sh` on the Air, and `ssh agents-macmini bash -s < ~/.agents/skills/storage-cleanup/hunt.sh` for the M4. It prints every folder of 1 GiB or more, nested, so read down to the folder that actually holds the space.
4. Put every item of 1 GiB or more into one of three groups:
   - **Rebuildable and idle:** caches, dependency installs, build output, package stores of an older version, simulator runtimes and devices, Android NDKs and emulator images, Homebrew leftovers, and backup copies of a database whose live file sits beside them. Clear these now.
   - **In use:** a process has it open, an archive job is writing it, or a lane is running in it. Check with `lsof +D <path>` and leave it, naming the process in the report.
   - **Hasan's data:** the guide's Tier B, chat history, media, recordings, models and Downloads. Ask once with `AskUserQuestion`, multi-select, largest first, each option giving its size and what is lost, and move what he picks to Trash.
5. Empty the Trash on each Mac with `~/code/storage-cleanup.sh trash --all`, then record free space again.

Measure the result with `df`, never by adding up sizes, because pnpm installs share blocks with the pnpm store and APFS clones share blocks with their source.

## Report

Lead with what needs Hasan. Then give, for each Mac, free space before and after, the worktrees pushed and removed (and any that couldn't be pushed, which stay on a local branch), what was kept and why, and what the hunt couldn't read. When you cleared something rebuildable that will come back, name it under "The engine should learn this", because a Tier A rule in the engine is what keeps the disk clean between passes.
