---
name: skill-craft
description: Use when creating, reviewing, or improving a skill.
---

# How to Craft a Skill

Think of it like a good article written for the model: advice, recommendations, and the why, sometimes the how. The skill exists so it thinks of it. 

One short SKILL.md; `references/` only for detailed, genuinely varying content. No auxiliary files.

The description is the only trigger — the body loads after. State what the skill does, then "Use when …" with the phrasings users actually say. `disable-model-invocation: true` for anything destructive.

Creation is a conversation: gather real use cases, avoid and callout if duplicating existing skills, draft, review with the user. 

Write timelessly. Instead of hardcoding facts that can go stale, refer to the source (e.g. a link, shell command, etc...).

Forward-test with a fresh subagent that doesn't know it's a test and gets no leaked answers. 

After the skill has a few runs, rewrite/trim from real transcripts and complaints.
