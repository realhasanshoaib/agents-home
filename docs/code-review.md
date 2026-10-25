# Reviews

Review exists to catch defects a user would hit before the change ships. This file holds every review rule, for every repo and every agent, so the rules stay the same from PR to PR.

Read it each time, not from memory:

- The lead reads it before deciding whether a change gets a judge, before writing or re-writing a judge brief, and before acting on a verdict.
- A builder reads it before opening a PR, and checks its own diff against "What a judge looks for".
- A judge judges against it.

## Which changes get a judge

Every round costs a judge lane plus a fix lane, and later rounds find fewer problems, so risk sets the number of rounds.

- **No judge** when the diff is only tests, documents (trackers, specs, debriefs, READMEs, HTML or markdown reading artifacts), formatting, scratchpad work, configuration that production never reads, or a one-off direct operation (a database query, a file move). CI or the next real run shows what those break, so a judge adds only waiting. Merge when CI is green.
- **High risk** is data loss, security or credentials, auth, money, the recorder and other production-critical paths, and anything that deploys. A fresh Sol xhigh lane that didn't build the work judges it, and rounds continue until the judge says SHIP.
- **Everything else**, such as UI, copy, demos, decks, skills, scripts, tooling, and work with no PR, gets one judge round on Sol xhigh. Fix the blockers and ship, and don't start a second round.

## Before the judge starts

The lead launches a judge only when CI is green on the head SHA and the builder has checked its own diff against this file. A red or running CI is the builder's work: the lead waits for green, or sends the failure back to the builder. A re-review starts the same way, after CI is green on the fix head. If a judge still finds CI running, it reports "CI pending on <SHA>" and not FIX, because a fix lane starts only for a defect in the code, never to wait for CI.

## The brief

The lead's brief adds only the PR and exact head SHA, what changed and why, what to run, and at most three questions that are specific to this change's risk. It points at this file and does not restate it. A re-review brief also names the fix diff and the earlier findings.

## What a judge looks for

Defects in this diff, in four classes:

1. Wrong behaviour a user sees.
2. Data loss.
3. A security hole.
4. A broken build.

A finding needs a file:line, a severity, and a reproduction: a command, a test, or steps that fail on this exact head. A concern with no reproduction is a note, not a finding. Style, naming, performance without a user-visible cost, edge cases that need unlikely conditions, and weaknesses in test fakes are notes too. Test code is read only to confirm it exercises the fix for a blocker.

## Verdict

SHIP when no finding falls in the four classes, and FIX otherwise. The judge confirms CI is green on the exact head before it writes SHIP. Notes go into the PR body, and they never change the verdict or start or extend a round.

## Rounds

A re-review checks only the fix diff and the earlier findings, so it is a short lane, and it does not redo what an earlier round cleared. A fix lane adds a test or other proof for each blocker it fixes, because a fix that adds a new bug is what starts the next round. A third round on one PR means the fixes share a wrong assumption: test that assumption before the next fix.

## Scope and coverage

Review one bounded scope: the implementation commit, or the branch against its base. A dirty shared worktree makes an uncommitted review unreliable, because unrelated work enters the result. A review that fails to launch is failed coverage: report it instead of retrying variants until one appears to work.
