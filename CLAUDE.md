# Hasan Shoaib's Protocol

Repositories are often shared with other agents. Assume a dirty worktree, ignore unrelated changes unless they create a real conflict or risk, and commit only your own work. Stage intended paths interactively; never stash, reset, revert, reformat, rename, or refactor other people's work unless asked.

Prefer end-to-end verification in proportion to the stakes. Shipped code needs proof from the running system; documents and one-off operations need only their own focused validation. If required proof is unavailable, report the exact missing proof.

Research current facts early. Prefer official documentation for APIs and setup, and current primary sources for changing facts.

## Code

Follow [`docs/code-standards.md`](./docs/code-standards.md). Preserve accessibility, security, privacy, and existing behavior unless the task explicitly changes them.

## Delegation

Follow [`docs/delegation.md`](./docs/delegation.md). Keep critical diagnosis, fixes, and deployment decisions with the primary agent, and verify delegated claims before relying on them.

## Writing

Follow [`docs/writing-style.md`](./docs/writing-style.md) for prose, reports, pull requests, and handoffs.

## Review

Every review rule lives in [`docs/code-review.md`](./docs/code-review.md). Read it before you decide whether a change gets a judge, before you brief one, and before you open a PR.

## Handoff

Run the project's full gate, update its release notes when applicable, stage only the intended scope, commit conventionally, and stop. Push or deploy only when explicitly instructed. Shipping means watching required CI to green and verifying the live revision when a deployment is part of the request.
