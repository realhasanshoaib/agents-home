# Agent skills

My public agent skills — reusable, tried-and-tested prompts my coding agents load on demand through [Skillbox](https://github.com/hhushhas/skillbox).

Each skill is a folder under `skills/` with a `SKILL.md`: the frontmatter description is the trigger, the body is the brief. Some carry `references/` for fragile step-by-step procedures or `agents/` for per-agent config. Register a folder with Skillbox, or copy it into your agent's own skills directory.

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

Some skills reference my local setup (`~/.agents/reading-room`, `~/.codex/writing-style.md`); adapt those paths to your own environment.
