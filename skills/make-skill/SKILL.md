---
name: make-skill
user-invocable: true
disable-model-invocation: false
description: Use when creating or editing a personal skill, or turning a repeated request into one.
---

## Where it goes

Put the skill in `~/.agents/skills/<name>/` on the MacBook Air and link it into Claude with `ln -s ../../.agents/skills/<name> ~/.claude/skills/<name>`, so Claude and Codex share one copy. Every skill gets both files:

- `SKILL.md` with `name` and `description` frontmatter.
- `agents/openai.yaml` for Codex, with `interface` (`display_name`, `short_description`, and a `default_prompt` that uses `$<name>`) and `policy.allow_implicit_invocation`.

`~/.agents/skills/update-harnesses/` is a good example to copy.

## Who can start it

Agents can start a skill by default. Its description stays in every agent's context on every turn, so it costs tokens all the time, and in return agents find it without Hasan naming it. Make a skill user-only (`disable-model-invocation: true` and `allow_implicit_invocation: false`) when only Hasan should start it, for example because it is costly or acts outside the machine. A user-only skill costs nothing in context, but Hasan has to remember it exists. Ask him when the choice isn't clear.

`user-only.py <name>...` in this folder sets both flags and adds a missing `agents/openai.yaml`. Installed vendor skills are user-only by Hasan's choice, so rerun it on them after every `skills update`: today that is the eight `higgsfield-*` skills.

Write the description as the trigger: it starts with "Use when", names each distinct case that should fire the skill once, and leaves out what the body already says.

## How to write it

- **Cut no-ops.** Read each sentence and ask whether the agent would behave differently without it. If not, delete the whole sentence. Agents writing for agents mostly explain things the model already knows.
- **State the behaviour you want.** Write "report in two sentences", not "don't write long reports". Naming a forbidden action puts it in the agent's mind. Keep a prohibition only for a hard guardrail, and pair it with what to do instead.
- **Disclose progressively.** Keep in `SKILL.md` what every run needs. Move what only some runs need into a separate file or an existing guide, and point to it with the condition for reading it. When a fact lives in the environment (`--help`, a config file, a script's output), point to it instead of copying it, because a copy goes stale.
- **End each step on a checkable condition**, such as "every row says `ok`", so the agent can tell done from not done.
- **Put repeated lookups into a script.** When every run would spend steps discovering the same state, bundle a script that prints it in one call.

## Show the complete package

Hasan needs to understand what will affect his workflow without opening files. In the handoff, show the responsibility split, when each skill activates, user/model invocation settings, and any delegated role with its model and effort. Explain what changed, what stayed, and the tradeoffs.

Inventory the whole package, not just `SKILL.md`: give absolute links and purposes for companion configuration, prompts, templates, scripts, references, assets, symlinks and Brain Kit registration when present. A large asset folder can be grouped by purpose with its count and a complete file manifest. Name automatic reads, writes, network calls, runtime dependencies, paid actions and permissions; distinguish dormant example helpers from tools the skill actually runs. Show new or changed behavioral instructions in the reply or a rendered review artifact, plus what was tested and what remains unverified. This disclosure is part of completion, not a new approval gate.

Finish by reading the skill once as the agent that will run it, and cut whatever you can. Verify the invocation metadata and one representative workflow when behavior changed. Then use `sync-harnesses`, so both accounts and both machines get the skill. Check: the complete package and its workflow impact are visible in the handoff.
