# Code review

Review exists to catch real defects before handoff. Run the project's configured reviewer once after a non-trivial implementation, fix the findings, and use at most one re-review when fixes materially changed the result.

Review applies to features, bug fixes, regressions, security changes, and meaningful refactors. Skip it for documentation, scratchpads, generated reading artifacts, one-off operations, and configuration-only changes unless their risk justifies review.

Choose one bounded scope: the implementation commit, the branch against its base, or the intended uncommitted files. Dirty shared worktrees make a broad uncommitted review unreliable because unrelated work enters the result.

A review that fails to launch is failed coverage. Report it instead of retrying variants until one appears to work. Findings that survive the bounded review pass belong in the handoff with their actual impact.
