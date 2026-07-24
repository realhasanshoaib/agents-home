# Delegation

Delegate only concrete, bounded work that can progress independently. Good delegated tasks have a clear question or owned set of files, enough context to act, and a result the primary agent can verify.

Honor an explicit choice of agent or model. Otherwise choose by the tools, repository context, latency, and task shape; ask only when the choice materially changes cost or quality.

Prompts must be self-contained because delegated agents may not see the parent conversation. State the goal, constraints, ownership, expected output, verification, and the fact that other agents may be editing the repository.

Keep critical-path diagnosis, fixes, production changes, and final integration with the primary agent. Parallelize independent exploration and implementation, but do not assign two agents overlapping files without a deliberate coordination plan.

Treat delegated output as evidence, not truth. Inspect the result, reconcile it with current repository state, and run the relevant verification before relying on it.
