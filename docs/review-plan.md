# Review plan

Status of the review changes for Chalk and the other Q9 repos, as of 25 Oct 2026. The rules in force live in `~/.agents/docs/code-review.md` and the Review budget in `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`. This file records what is in force and the baseline it is measured against.

## In place

- Every judge judges against `~/.agents/docs/code-review.md`: four classes of defect (wrong behaviour a user sees, data loss, a security hole, a broken build), a file:line and a reproduction for each finding, SHIP or FIX.
- The lead starts a judge only after CI is green on the head SHA and the builder has checked its own diff against that file.
- CI that is still running is never a FIX.
- Macroscope and CodeRabbit are dropped. Review stays with our own Sol judges.

## Proposals

Proposals are open pull requests labelled `proposal` in `realhasanshoaib/agents-home` and `Q9Labs/chalk`. The diff is the change, and merging a pull request is Hasan's yes. Pull requests labelled `applied` record changes that are already in force.

Work that needs no diff is an open action in the Q9 Brain: re-measure Chalk's performance budgets on Instabox, gate releases on the last reviewed tag only if the daily deep pass shows user-visible defects in merged low-risk PRs most weeks, and sync the rule files to the M4 when SSH to agents-macmini works.

## Baseline to measure against

Source: Codex Q9 account on the MacBook Air, 18 to 25 Oct 2026, Chalk convergence reviews. The labels on findings come from Haiku lanes, and 14 were spot-checked.

- PRs judged SHIP in round 1: 33% (21 of 63).
- FIX verdicts that only a wait or a static check settles: 30% (55 of 182). A separate keyword count found 45 of 182 (25%) whose only findings were "CI not finished".
- FIX verdicts the builder could have caught: 24% (43 of 182).
- FIX verdicts with a real blocker under the new rubric: 40% (72 of 182). Wrong behaviour, data loss and security make 119 of the 129 blocker findings.
- Cost: a FIX round is about 255 calls and a SHIP round about 45.

## Pictures and data

All beside this file in `~/.agents/docs/review-plan/`.

- Flow diagram: `review-plan-v2.html`
- Comic: `review-comic.html`
- Labelled FIX findings: `out-1.json` to `out-4.json`
