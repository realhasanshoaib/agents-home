---
name: claude-explain
description: Use when Hasan asks for Claude to explain something, says Codex is not explaining clearly, or wants an explanation through another agent.
---

# Claude Explain

Run `claude -p` with only the relevant code facts and Hasan's exact question/confusion, avoiding Codex's conclusions or preferred framing. Relay Claude's answer back without re-teaching it in Codex's own style.

Example prompt style: `In this repo, file A calls function B, and route C also calls function B then filters by slug. Hasan is confused about how C differs from A if both call B. Explain simply, without assuming framework knowledge.`
