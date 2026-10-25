# Review plan

Status of the review changes for Chalk and the other Q9 repos, as of 25 Oct 2026. The rules in force live in `~/.agents/docs/code-review.md` and the Review budget in `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`. This file holds what is proposed and not yet in force, so agents must not treat items 1 to 6 as rules.

## In place

- Every judge judges against `~/.agents/docs/code-review.md`: four classes of defect (wrong behaviour a user sees, data loss, a security hole, a broken build), a file:line and a reproduction for each finding, SHIP or FIX.
- The lead starts a judge only after CI is green on the head SHA and the builder has checked its own diff against that file.
- CI that is still running is never a FIX.
- Macroscope and CodeRabbit are dropped. Review stays with our own Sol judges.

## Proposed, waits for Hasan's yes

1. Add a changeset-present check to Chalk's gate, so a missing changeset never reaches a judge. Home when approved: a Chalk PR on `.github/workflows/gate.yml`.
2. Give a pre-merge judge only to high-risk PRs, and merge the rest when CI is green. Home when approved: the Review budget in `CLAUDE.md` and `AGENTS.md`.
3. Run a daily deep pass: one lane on the Kaadr Codex account reads everything merged that day and blocks nothing. It looks for edge cases, fragile code and performance, including problems no user feels. Findings go to a backlog and become fix PRs, and a severe find means a rollback. Home when approved: a scheduled task in T3 Code.
4. Re-measure Chalk's performance budgets on Instabox before enforcing them on every PR. The budgets were set on the retired Testbox.
5. Gate releases on the last reviewed tag only if two weeks of the daily pass find user-visible defects in merged low-risk PRs most weeks. Release stays a manual dispatch until then. Home when approved: Chalk's Release workflow.
6. Sync the rule files to the M4 when SSH to agents-macmini works. Files: `~/.agents/docs/code-review.md`, `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`.

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
