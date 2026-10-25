---
name: instabox
description: Use when running heavy Linux work (a gate, a full test suite, a repo-wide typecheck or lint, a build, Docker, Playwright) off the Macs, when GitHub Actions jobs need a self-hosted runner, or when managing the Q9 Instabox machines and snapshots.
---

Run heavy work from the repo with `box` (this folder, linked as `~/.local/bin/box`):

```sh
box run -- 'pnpm install --frozen-lockfile && pnpm gate:full'
```

It starts a fresh machine from the `q9-base` snapshot, fetches your pushed HEAD from GitHub, runs the command, prints its output, deletes the machine, and exits with the command's exit code. So commit and push first, because uncommitted work doesn't reach the machine. Expect about 2.5 minutes to start the machine before the command runs. The plan allows 1 machine at a time, so a run that finds it in use waits for it, and parallel lanes queue behind each other.

The checkout is 200 commits deep and also holds origin's default branch as `origin/<name>`. The command can't reach GitHub itself, so a `git fetch` inside it fails. Name every other branch the command needs with `--fetch <branch>`, which repeats.

Leave out `--keep` unless you'll open the machine yourself (`instabox ssh <name>`) right after, then delete it with `instabox rm <name>`. A kept machine holds the only slot and makes every other lane wait. `box ls` lists the machines `box` started.

**GitHub Actions runner.** When a repo's workflows can't use GitHub-hosted runners, such as during a billing lock, point their `runs-on` at the `instabox` label and run `box runner` from the repo. For each queued job with that label, it starts a fresh machine with a single-job runner and deletes the machine after the job, so a job can't leave a process behind that reads the next job's secrets. Each job therefore waits about 3 minutes for its machine. It stops after 10 minutes with no queued job (`--idle <minutes>` changes that), and holds the only slot only while a job runs. Start it in tmux, not as an agent's background task: a harness kills its background tasks at their time limit without waiting, and that deletes the machine in the middle of a job, such as a production release. Use `tmux new -d -s box-runner-<repo> -c "$PWD" 'box runner > /tmp/box-runner-<repo>.log 2>&1'`. The tmux session ends when the runner stops itself. The q9-base snapshot lacks some tools that GitHub's hosted runners have, such as the AWS CLI, so a workflow installs those itself when they're missing. GitHub still starts self-hosted jobs during a billing lock; a probe confirmed this on 25 Oct 2026.

**What a machine is.** x86 Linux with 4 vCPU, 8 GB of memory and 20 GB of disk. That's the only size on the free plan. Chalk's full gate peaks at 6.3 GB of memory and 9 GB of disk with its single-worker settings, so keep worker counts as the repo sets them. There's no macOS, Xcode or simulator, so that work goes to the M4. The machine pauses after 30 minutes idle and can't be told otherwise.

**The GitHub token.** `box` sends your `gh` token in through ssh for one shallow fetch and unsets it before the command runs. It is never stored on Instabox. Instabox's proxy secrets can't carry it, because git sends its login Basic-encoded and the proxy only fills in plain header values. Set `BOX_GITHUB_TOKEN` to use another token.

**When a repo needs a tool the snapshot lacks**, install it on a kept machine and save a new snapshot: `instabox snapshot save <name> --name q9-base-<date>`, then point `BOX_SNAPSHOT` at it or replace `q9-base`. The plan allows 5 snapshots and 200 GB of storage. `q9-base` holds Node 24, pnpm 12, Go 1.26, Erlang/OTP 28, Elixir 1.19, OpenTofu, semgrep, gitleaks, osv-scanner, gh, Docker and the Postgres 18 image.

A long job over plain `instabox ssh` dies with the session, so `box` holds the session open for the whole run. On a kept machine, start long work in tmux. `instabox exec` caps a command at 10 minutes and `exec --stdin` can silently write an empty file, so `box` uses ssh for both.
