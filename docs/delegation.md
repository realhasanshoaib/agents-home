# Delegation

Delegate only concrete, bounded work that can progress independently. Good delegated tasks have a clear question or owned set of files, enough context to act, and a result the primary agent can verify.

Honor an explicit choice of agent or model. Otherwise choose by the tools, repository context, latency, and task shape; ask only when the choice materially changes cost or quality.

Prompts must be self-contained because delegated agents may not see the parent conversation. State the goal, constraints, ownership, expected output, verification, and the fact that other agents may be editing the repository.

Keep critical-path diagnosis, fixes, production changes, and final integration with the primary agent. Parallelize independent exploration and implementation, but do not assign two agents overlapping files without a deliberate coordination plan.

Treat delegated output as evidence, not truth. Inspect the result, reconcile it with current repository state, and run the relevant verification before relying on it.

## Continue related work

When delegation is authorized, reuse the existing worker session for a narrow correction or continuation of the same task, preserving its model, workspace and decisions. Follow the orchestrator's lifecycle: T3 delegated review rounds require a new `delegate_task` call, not a message to their backing thread. Use a fresh judge for an independent review and fresh context for unrelated work or a completed phase whose history has become misleading. Carry a compact handoff at that boundary.

Reuse useful context for continuity and possible cached-input savings, not because a thread guarantees a cache hit. Keep stable instructions and tools stable; verify savings from usage when available. Check-ins monitor progress and liveness; do not send model turns only to warm a cache. API caching rules and Codex subscription credit accounting are different, and neither thread age nor saved history establishes cache retention.

Checked 23 October 2026: official [prompt-caching documentation](https://developers.openai.com/api/docs/guides/prompt-caching) describes finite, model-dependent lifetimes; [Codex pricing](https://learn.chatgpt.com/docs/pricing) distinguishes subscription credit billing from API billing. Infinite Codex cache retention is not established by these sources. Recheck current official guidance before making a stronger claim.
