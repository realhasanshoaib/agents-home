---
name: devin-box
description: "Use only when Hasan asks for devin-box, or to test on Windows or on a fresh macOS or Ubuntu cloud machine."
---

Devin cloud runs Windows Server 2022, macOS 26 (arm64) and Ubuntu 22.04 boxes, free on SWE-2 under Hasan's Devin Max plan until 22 Nov 2026. Use them for Windows, which none of our machines run, and when a test needs a clean machine. Heavy Linux work stays on Instabox and macOS builds on the Mac mini.

`devin-box` in this folder does every step on the MacBook Air, where the Devin CLI is signed in to the Q9 Labs org; its header lists the commands. It pins `swe-2-high`, because the org default mode (Fusion) and the Lightning models cost ACUs, so start every box through it.

1. `devin-box up <windows|macos|linux> [owner/repo]...` prints the box's session id and clones the repos onto it.
2. `devin-box run <id> '<command>'` prints stdout and stderr and exits with the command's code. On Linux, stdout can start with shell setup noise, so echo a marker before output you parse. It retries for up to five minutes while a new box boots. Windows runs commands in Git Bash, so write `cmd //c ver` or `powershell.exe -Command '...'`; `cmd /c` turns into `cmd C:\` and hangs until the timeout.
3. Move files with git on the box, or pipe them: `devin-box ssh <id> 'cat > /tmp/f' < f`. Forward a port with `devin-box forward <id> <local>:<remote>` in the background.
4. Run `devin-box rm <id>` for every box you started, also when the work fails. Done when `devin-box ls` marks each of your boxes `archived` and `devin-box usage` still shows `total_acus` 0.0. The status column can say `running` for a minute or two after `rm`.

Read `recipe.md` in this folder when the script fails and you need the raw API calls, the org quirk or the SSH host key.
