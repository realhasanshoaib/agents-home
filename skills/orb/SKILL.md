---
name: orb
description: "Use only when Hasan asks for orb, or to turn a branch into a live preview a reviewer can open and use (Ava, Recruiter or Chalk), verify it, or save its panel."
---

`orb` turns a pushed branch into an Orb: one Instabox machine running the repo's whole stack behind public HTTPS URLs, with a review panel next to it. The design is in `~/code/docs/orb.md` and `~/code/docs/verification.md`. Repos known to `orb` (edit `PROFILES` in the script to add one): `ava`, `recruiter`, `chalk`. Each needs its launch contract (`pnpm dev`, `pnpm dev:doctor`, `pnpm dev:down`) and `verify-<app>` skill on the branch.

```sh
orb=~/.agents/skills/orb/orb
$orb up chalk verify/launch-contract      # same repo + branch returns the same Orb
$orb verify <orb>                         # journeys against the public URL, writes .verify/orb-<time>-<journey>/
$orb panel <orb>                          # builds the panel from the latest run and serves it on port 8099
$orb status                               # read-only list of Orbs and URLs
$orb down <orb>                           # saves panel + .verify/ to $ORB_PANELS_DIR, then deletes the machine
```

- `<orb>` is the machine name that `up` prints (`box-orb-<repo>-<hash>-<time>-<pid>`).
- `up` prints the preview URL, panel URL, seeded sign-in and the time spent per phase, and only after the stack's ready line and `doctor` both pass. A failure prints the log tail and leaves the machine for you to inspect; delete it with `orb down` or `instabox rm`.
- Secrets come from `op` on this Mac (Chalk's non-production `Cloudflare Realtime SFU chalk-local-dev-…` item) and travel over SSH on stdin into a RAM file on the machine. They never reach argv, a log or the panel; `panel` aborts if one appears in the evidence.
- Saved panels go to `ORB_PANELS_DIR` (default `/Users/macmini/code/orbs/<repo>/<branch>-<short-sha>/`). Where they live long term is an open item in `orb.md`, so keep that one variable the only place that knows.
- `ORB_SNAPSHOT=<name>` starts the machine from another snapshot (for example one with node_modules and images baked in).
- The plan allows 5 machines shared by every lane (`instabox usage`). Delete the Orb when done: `orb down` prints `deleted` only after the machine is gone.
- If a contract breaks behind a public URL (wrong origin in links, cookies, CORS, websockets), fix it inside the repo's existing dev command, never with a second launch path.
