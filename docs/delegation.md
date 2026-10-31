# Delegation

The lead owns coordination, decisions, and replies to Hasan.

## Legwork goes to a lane

Each lead call sends the whole thread again, and every command output stays in it for all later calls, so legwork done in the lead costs far more than the same work in a fresh lane. In the week that ran out the weekly Claude limit (16 to 21 Oct 2026), 62% of Opus lead calls were shell commands, command output made up three quarters of a long lead thread, and re-sending context was two thirds of all usage.

Claude leads delegate legwork such as browser work, tests, reading, screenshot review, and data gathering. Codex follows its own delegation instructions.

## Choosing a model

Before each lane, name the hard part, and give the model, effort and the reason in one line. Then launch without reconfirming authorized work.

| Work | Model |
| --- | --- |
| Mechanical legwork: finding, listing, bulk data pulls, running test and build commands to completion | GPT-6 Luna xhigh |
| Computer or browser use on Hasan's machine: driving Helium or a native Mac app | GPT-6.1 Terra medium |
| Diagnostic legwork: reading logs, traces and data to find a cause; legwork that needs Claude-side tools | Claude Haiku 5.5 high |
| Implementation | Claude Sonnet 5.5 high |
| A phase that demonstrably needs more reasoning | Claude Opus 5.5 high; escalate that phase only, then drop back |
| Reviews and judges (see `code-review.md`) | GPT-6.1 Sol xhigh |
| Imagegen | GPT-6.1 Sol high |
| Testing on Windows, or on a clean macOS or Ubuntu machine | `devin-box` skill: Devin cloud on SWE-2, free until 22 Nov 2026 |

Builders run on Claude and reviewers on GPT, because the founders' ChatGPT plan is Pro 100 and building used about 70% of its Codex allowance. A reviewer from the other model family also catches mistakes the builder's family shares.

When he asks, name the lanes and subagents that are running and the model each one uses.

- Use the Standard tier (`service_tier="default"`) unless asked.
- When a lane stops with "Selected model is at capacity", send a new message in the same thread so it resumes where it stopped, on the same model.

## Briefs

Give the lane a clear task, the context and constraints it needs, and ownership when work could overlap. Don't copy inherited instructions or use a boilerplate contract.

When Claude delegates to Codex, tell it to act as a worker for the lead: complete the assigned scope and report the result to the lead. Lead-thread collaboration and handoff instructions do not apply to the worker; keep project instructions and safety boundaries.

## While lanes run

Coordinate independent work, use the time productively, and check results before relying on them. A review must be independent when the review policy calls for one.
