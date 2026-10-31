# Recipe: Devin Cloud boxes (Windows / macOS / Linux) from the CLI on Hasan's Mac

Tested 2026-10-31 with `devin` CLI 3000.11.234 on the Mac mini, logged in as
Q9 Labs (Devin Max plan). Everything below was run and verified; untested items
are marked. Total cost of all testing: **0.0 ACU**.

## TL;DR

- **OS choice is NOT available as a CLI flag.** `devin --cloud -p` has no
  `--platform` option. Pick the OS one of two ways:
  - **API (headless, tested):** `POST /v3/organizations/{org}/sessions` with
    `"platform": "linux" | "macos" | "windows"`.
  - **Interactive (untested here):** `devin --cloud`, then `/platform` before
    the first message. Web app has the same picker.
- **Run a command, get output:** `devin cloud drs run --devin-id <id>
  --command '<cmd>'` — returns JSON with stdout/stderr/exit_code. Works on
  Windows and macOS sessions too, not just DRS sandboxes.
- **SSH:** `devin ssh <id> '<cmd>'` requires a TTY — wrap it in
  `script -q /dev/null` for headless use.
- **Delete:** `DELETE /v3/organizations/{org}/sessions/{id}`.

## Auth

The CLI's own credential doubles as a v3 API bearer token:

```sh
KEY=$(grep windsurf_api_key ~/.local/share/devin/credentials.toml | sed -E 's/.*= *"?([^"]+)"?/\1/')
```

Verify: `curl -s https://api.devin.ai/v3/self -H "Authorization: Bearer $KEY"`
→ `{"principal_type":"windsurf_session", ... "org_id":"org-dd6f4eafd4664811b1882d7db970ed28"}`

## Org

Use only the Q9 Labs org (Max plan), `org-dd6f4eafd4664811b1882d7db970ed28`. `~/.config/devin/config.json` on the Air sets it as `devin.org_id`, so `devin cloud drs` commands need no `--config`.

## 1. Start a box

Check which platforms the org supports (free — deliberately bad value lists
valid ones):

```sh
curl -s -X POST "https://api.devin.ai/v3/organizations/org-dd6f4eafd4664811b1882d7db970ed28/sessions" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"prompt":"noop","platform":"bogus"}'
# → 400: "Available platforms: ['linux', 'macos', 'windows']"
```

Create a session (all three platforms verified on this org):

```sh
curl -s -X POST "https://api.devin.ai/v3/organizations/org-dd6f4eafd4664811b1882d7db970ed28/sessions" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d '{
    "prompt": "Infrastructure connectivity test. Run `uname -a` once, report, stop.",
    "platform": "windows",
    "devin_mode": "swe-2-high",
    "title": "agent-recipe-test"
  }'
# → {"session_id":"008130dd0f9c4531ab97356a18abac59", "status":"new", ...}
```

Rules note: always pass `"devin_mode": "swe-2-high"` (or `"swe-2-max"`).
Omitting it uses the org default (was `fusion` here — not allowed by our rules).

Options worth knowing: `"repos": ["owner/repo"]` clones repos into the box;
`"max_acu_limit": N` caps spend; `"resumable": false` for disposable boxes.

Alternative for a **Linux-only agentless sandbox** (attached to a repo, no
platform flag, prompt still required):

```sh
devin cloud drs sandbox-create \
  --repo simonw/llm --prompt "Sandbox connectivity test only."
# → {"session_id":"dc8603054c9242cdaf49226a89361bea", ...}
```

Verified OS identities (via `drs run` / `devin ssh`):

| platform | proof |
|---|---|
| linux (default) | `Linux devin-box 6.8.0-1061-aws #64~22.04.1-Ubuntu SMP x86_64`, user `ubuntu` |
| windows | `MINGW64_NT-10.0-20348 devinbox … Msys`; `cmd.exe /c ver` → `Microsoft Windows [Version 10.0.20348.5622]` (Server 2022, Git Bash shell) |
| macos | `Darwin … RELEASE_ARM64_VMAPPLE arm64`, `sw_vers` → macOS 26.6.2, user `devin`, home `/Users/devin` |

Boot time: Linux/macOS ~30–60 s; Windows a bit longer — the **first** `drs run`
on a fresh Windows box timed out at 60 s; retry succeeded.

## 2. Run a command, get output (no interactive terminal)

```sh
devin cloud drs run \
  --devin-id <session-id> --command 'uname -a' --timeout 90
```

Returns JSON:

```json
{"status":"completed","response":{"success":true,"exit_code":0,
 "stdout":"MINGW64_NT-10.0-20348 devinbox …","stderr":""}}
```

Works identically on linux/windows/macos sessions. Windows runs the command in
Git Bash (`cmd.exe /c …` or `powershell.exe -Command …` for native commands).
Raw API equivalent: `POST /v3beta1/organizations/{org}/sessions/{id}/command`.

SSH alternative (needs a pty — bare `devin ssh` fails with
`Device not configured (os error 6)` when stdin/stdout isn't a terminal):

```sh
script -q /dev/null devin ssh <session-id> 'hostname; uname -s'
```

First-ever connection prompts to accept the ssh.devin.ai host key
(ED25519 `SHA256:P4xjZKbWa5EKEmnmWVNkjaqZyWU+TuGB/QBnpUSltx4`) — it's in
`~/.ssh/known_hosts` on this machine now; on a fresh machine run
`ssh-keyscan ssh.devin.ai >> ~/.ssh/known_hosts` first.

Plain `ssh devin-<id>@ssh.devin.ai` fails `Permission denied
(publickey,keyboard-interactive)` under BatchMode — the gateway wants an
interactive/browser approval that `devin ssh` handles for you.

## 3. Files onto the box + port forward

Upload/download through the ssh pipe:

```sh
cat local.txt | script -q /dev/null devin ssh <id> 'cat > /tmp/local.txt'   # up
script -q /dev/null devin ssh <id> 'cat /tmp/out.txt' > out.txt             # down
```

Or just use git/network on the box (tested on the Windows box):

```sh
devin cloud drs run --devin-id <id> \
  --command 'cd ~/ && git clone --depth 1 https://github.com/octocat/Hello-World.git hw && ls hw'
# → "Cloning into 'hw'...\nREADME\n"
```

`scp`/`sftp` directly: untested (plain-ssh auth issue above — the ssh-pipe
method is the reliable headless path).

Port forward (run it in background; also wrap in `script`):

```sh
# on the box: python3 -m http.server 8011 &
script -q /dev/null devin forward <id> 18011:8011   # local:remote
curl http://localhost:18011/    # → served from the box
```

## 4. Stop and delete

```sh
# terminate (running sessions → status "exit")
curl -s -X DELETE "https://api.devin.ai/v3/organizations/org-dd6f4eafd4664811b1882d7db970ed28/sessions/<id>" \
  -H "Authorization: Bearer $KEY"

# archive (hides it; also puts a running session to sleep)
curl -s -X POST ".../sessions/<id>/archive" -H "Authorization: Bearer $KEY"

# verify
curl -s ".../sessions/<id>" -H "Authorization: Bearer $KEY" | jq .status
```

DELETE on an already-suspended session leaves it `suspended` — the VM is off,
nothing is running; archive it to tuck it away. `devin rm <id>`: untested for
cloud sessions.

## 5. Costs / usage

- `devin models` shows `swe-2-high`, `swe-2-medium`, `swe-2-max` as **Free** on
  this Max plan; the `-lightning` variants are paid — don't use them.
- Per session: `GET .../sessions/<id>` → `acus_consumed`.
- Org daily: `GET .../consumption/daily` → `{"total_acus":0.0, ...}`;
  per session: `GET .../consumption/daily/sessions/<id>`.
- **Measured:** ~35 min of three boxes (Ubuntu sandbox, Windows Server 2022,
  macOS 26.6.2) with `uname`, git clone, python http.server, port forward —
  **total_acus stayed 0.0**. No per-VM-hour ACU appeared in the API for this
  test window (billing granularity may lag; check `consumption/daily` after
  real work).

## Sessions created and cleaned up during testing

| id | platform | final state |
|---|---|---|
| `dc8603054c9242cdaf49226a89361bea` | linux (drs sandbox) | suspended + archived, VM off |
| `008130dd0f9c4531ab97356a18abac59` | windows | terminated (`status: exit`) + archived |
| `dc51f50e5e2c47d3b48082ec602e98d4` | macos | terminated (`status: exit`) + archived |

## Not tested

- `devin --cloud` REPL `/platform` picker (interactive only).
- `devin --cloud -p` one-shot prompting (no way to set platform — use the API).
- `devin rm` on cloud sessions; `scp`/`sftp` through the gateway.
- Whether API-created boxes bill per VM-hour above plan allowance.
