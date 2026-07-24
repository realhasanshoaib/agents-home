---
name: skill-craft
description: Use when creating, reviewing, or restructuring a skill so it matches Hasan's skill philosophy
---

# Skill Craft

A skill is a reusable, true, tried-and-tested prompt — not documentation and not a fancy formatted artifact. The default form is a single SKILL.md of two to four paragraphs of plain prose; short headings that name the phases of the work are welcome, as long as the whole stays this compact. The context window is a public good and the model is already smart: only include what it doesn't know, and challenge each paragraph's token cost. Match specificity to fragility — judgment-led work gets prose and heuristics (high freedom); fragile or error-prone sequences get exact commands, paths, and ordered steps (low freedom, e.g. a prod patching procedure with the precise host, container, and health endpoint). Only split into SKILL.md as a router plus references/*.md when the skill is large with genuinely varying content where loading it all every time would be wasteful; a single coherent procedure stays in one file no matter what. No auxiliary files (README, changelog, setup docs) — only what the executing agent needs.

## Creating

Skill creation is a conversation, not a transcription: gather the concrete use cases first (what should trigger it, what it must handle, whether scripts or reference material are needed), draft, then review the draft with Hasan before finalizing — everything that goes in should be intentional, not whatever happened to be lying around. Before drafting, search what's already published — skills and tools both; if something covers part of the job well, point to it instead of duplicating, and let the new skill fill only the gap.

## Trigger

The frontmatter description is the *only* trigger — the body loads after triggering, so all "when to use" information belongs in the description, never in a body section. Shape it as two sentences: first what the skill does, then "Use when …" naming the situations and phrasings that should activate it ("Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDFs or the user mentions forms or document extraction" — not "Helps with documents"). Include the symptom phrasings users actually say, not just task verbs, so the skill triggers on the problem even when the answer isn't what the user assumed. Set `disable-model-invocation: true` for anything destructive, history-rewriting, prod-touching, or that only Hasan should decide to run; leave it model-invocable when agents noticing the situation on their own is the point.

## Body

Write the body the way you'd brief a capable colleague: lead with the purpose and philosophy (the *why* keeps the agent making good judgment calls beyond the listed cases), state scope and safety boundaries explicitly (what not to touch, when to skip and say so, when to flag instead of guessing), and prefer judgment-led guidance over exhaustive rules. Since skills are meant to be tried-and-tested, distill what actually worked in real sessions over speculating; when a skill is born from a one-off success, capture the concrete specifics (paths, commands, thresholds) that made it work. Write timelessly — no "currently", no relative dates, no version numbers that will go stale unless they're load-bearing; when a fact can go stale, encode the command that prints the current truth and keep only the durable mapping in prose, saying explicitly that live output wins over the written text. Keep terminology consistent throughout: one term per concept, since the executing agent reads a word change as a meaning change.

## Test and trim

For non-trivial skills, forward-test before trusting them: launch a fresh subagent that doesn't know it's a test, prompted the way a user would ask ("Use skill-x at <path> to do y" — not "review this skill"), passing raw artifacts rather than your conclusions, and never leaking the expected answer or intended fix. If it only succeeds with leaked context, tighten the skill. Once it ships, mine real run transcripts and the complaint log for where agents lost time — verified friction beats speculation — and use that evidence to revisit and trim skills that have drifted or grown stale rather than appending to them.
