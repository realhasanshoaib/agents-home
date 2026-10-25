# Code review

Review exists to catch defects a user would hit before the change ships. A judge has one goal and every brief points here, so the goal stays the same from PR to PR.

## What a judge looks for

Defects in this diff, in four classes:

1. Wrong behaviour a user sees.
2. Data loss.
3. A security hole.
4. A broken build.

A finding needs a file:line, a severity, and a reproduction: a command, a test, or steps that fail on this exact head. A concern with no reproduction is a note, not a finding. Style, naming, performance without a user-visible cost, edge cases that need unlikely conditions, and weaknesses in test fakes are notes too. Test code is read only to confirm it exercises the fix for a blocker.

## Verdict

SHIP when no finding falls in the four classes. FIX otherwise. Notes go into the PR body and never change the verdict.

## Before the judge starts

The lead launches a judge only when CI is green on the head SHA and the builder has checked its own diff against this file. A red or running CI is the builder's work: the lead waits for green, or sends the failure back to the builder. A re-review starts the same way, after CI is green on the fix head. If a judge still finds CI running, it reports "CI pending on <SHA>" and not FIX, because a fix lane starts only for a defect in the code, never to wait for CI.

## Rounds

Risk sets the rounds. A high-risk change (data loss, security or credentials, auth, money, the recorder and other production-critical paths, anything that deploys) gets a fresh judge before merge, then re-reviews of only the fix diff and the earlier findings until the judge says SHIP. Every other change merges when CI is green on the head SHA, and the daily deep pass (`daily-deep-pass.md`) reads it afterwards. A re-review does not redo what an earlier round cleared. The judge confirms CI is green on the exact head before it writes SHIP.

## The brief

The lead's brief adds only: the PR and exact head SHA, what changed and why, what to run, and at most three questions that are specific to this change's risk. It does not restate this file.

## Scope and coverage

Review one bounded scope: the implementation commit, or the branch against its base. A dirty shared worktree makes an uncommitted review unreliable, because unrelated work enters the result. Documentation, scratchpads, generated reading artifacts, one-off operations and configuration-only changes skip review unless their risk justifies it. A review that fails to launch is failed coverage: report it instead of retrying variants until one appears to work.
