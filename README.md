# Agent home

The working rules and reusable skills Hasan Shoaib uses across Claude Code, Codex, and Pi.

## Configs

The two entry points share the same principles:

- [`AGENTS.md`](./AGENTS.md) configures Codex-compatible agents.
- [`CLAUDE.md`](./CLAUDE.md) configures Claude Code.

Focused guidance lives in [`docs/`](./docs):

- [`delegation.md`](./docs/delegation.md)
- [`writing-style.md`](./docs/writing-style.md)
- [`code-standards.md`](./docs/code-standards.md)
- [`code-review.md`](./docs/code-review.md)

Machine paths, credentials, account names, deployment identifiers, caches, session state, and private operational notes are intentionally excluded. The public files are the reusable policy layer, not a backup of a home directory.

Copy the relevant entry point into a project or use it as the base for global agent instructions. Adjust paths and tool names to match your environment.

## Skills

Each skill is a folder under `skills/` with a `SKILL.md`: the frontmatter description is the trigger, the body is the brief. Some carry `references/` for fragile procedures or `agents/` for per-agent configuration. Register a folder with [Skillbox](https://github.com/hhushhas/skillbox), or copy it into an agent's own skills directory.

| Skill | What it does |
| --- | --- |
| [agent-prompting](skills/agent-prompting) | Write system prompts that give an AI or voice agent a real personality, natural behavior, and guardrails that hold. |
| [claude-explain](skills/claude-explain) | Route an explanation through Claude when another agent isn't explaining clearly. |
| [debrief](skills/debrief) | Write the walkthrough document that gets me up to speed on a change — interactive HTML, not a wall of prose. |
| [goal](skills/goal) | Create or update a session goal. |
| [mobile-screenshots](skills/mobile-screenshots) | Generate and upload App Store and Google Play listing media from simulators and emulators. |
| [mobile-submission](skills/mobile-submission) | iOS and Android store submission: listings, rejections, release status. |
| [skill-craft](skills/skill-craft) | Create, review, or restructure a skill so it stays a compact, tested prompt. |
| [spec-craft](skills/spec-craft) | Turn a rough product idea into a spec another agent can execute autonomously. |
| [website-optimization](skills/website-optimization) | Evidence-based web performance audits — measure first, then fix. |

Some skills reference local paths. Adapt those paths to your own environment.

## License

MIT
