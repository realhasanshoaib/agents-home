# Daily deep pass

One lane reads everything that merged to a Q9 repo's default branch since the previous pass. It blocks nothing, and it looks for what a pre-merge judge has no time for: edge cases, fragile code, and performance, including problems no user feels today.

## The lane

- It runs once a day as a T3 scheduled task on the Kaadr Codex account, on Sol xhigh, in a fresh worktree of the default branch.
- Scope is the commits merged since the previous pass. Each pass opens one issue titled "Deep pass <date>, through <SHA>", and the next pass starts at that SHA.
- It checks the inputs a builder rarely tries: empty, huge, concurrent, retried and out-of-order. It also checks hot paths for query count, memory and bundle size.
- It judges against `code-review.md`. Every finding has a file:line, a severity and a reproduction, and a concern with no reproduction is a note.

## What happens to a finding

- A finding that falls in the four classes of `code-review.md` on production code goes to the lead at once. The lead rolls back or ships a hotfix.
- Every other finding is a checkbox in the pass's issue, and a fix PR names the issue it closes.
- A pass with no findings still opens its issue, so a missed day is visible.
