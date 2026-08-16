---
name: spec
description: "Use when creating or improving a product or implementation spec before substantial execution, especially when Hasan wants a flexible spec that helps Codex run autonomously without forgetting product, UX, architecture, data, testing, or anti-slop context."
---

Help shape the spec into a useful thinking surface, not a rigid template. Preserve the
project's natural form; the sections below are what to *consider*, weighted by how much
each one usually matters — not headings to fill in.

**The spec argues from states, not tasks.** It opens with the background — the problem
in plain words, the **current state** of the system, and the **desired state** — and the
desired state is described as behavior and outcomes (what the world looks like when this
is done), not as implementation. Implementation follows once the destination is
unambiguous, and it can go as deep as the work needs — the ordering is the rule, not
brevity. A reader should be able to challenge the destination without wading through
the route.

A spec reads as a coherent whole, not a chronological transcript. Decision history and
"we changed our mind" breadcrumbs belong in a session log; fold settled decisions into
the relevant section, keep only intentional open decisions, and remove stale scaffolding
once the user closes it.

# What a spec covers, in order of weight

1. **Background** — problem, current state, desired state. If this is wrong, nothing
   downstream survives.
2. **Done** — acceptance criteria as observable checks (what exists, what passes, what a
   user can now do) and where the work stops. The executor is literal and will keep
   working until the words are satisfied; an open-ended spec is an open-ended budget.
   State what is deliberately out of scope or good-enough as-is.
3. **Behavior** — primary workflows, feature behavior, failure/offline behavior.
4. **Language** — canonical/ubiquitous terms, so the spec, the code, and the
   conversation use the same words.
5. **System** — architecture and boundaries, data model and source-of-truth rules.
6. **UI/UX expectations** — for frontend work, the companion carries preview prototypes
   (see `references/html-companion.md`); the markdown states the expectations in words.
7. **Implementation** — the route to the destination, at whatever depth the work needs.
8. **Execution** — phases rendered as a **dependency DAG**: a Mermaid flowchart in the
   markdown with phases/seams as nodes, hard dependencies as edges, parallel work side
   by side, and verification gates as diamond nodes. Cut the DAG at real seams: parallel
   nodes share no files, no decisions, and no discoveries — if two lanes depend on what
   one exploration will find, hoist that exploration into its own upstream node and feed
   both; a long dependent chain is one node, not a lane. Place a gate wherever
   downstream work builds on an upstream node's output, and close every fan-out with an
   explicit integration node where the orchestrator reconciles the lanes — diagnosis,
   decisions, integration, and sign-off are orchestrator-owned and never assigned to a
   worker lane. When an agent fleet executes the spec, each node carries its owner, its
   interface contract with neighbors, its deliverable, and its scope fence (what it must
   not touch). For multi-phase or multi-session specs, add a phase-level checklist that
   maps one-to-one onto the DAG's nodes so progress is visible and work is resumable.
9. **Anti-slop rules** — project-specific traps the worker must not fall into.

Use Mermaid diagrams in the markdown itself wherever a diagram carries more than prose —
workflows, data model, state machines, and always the execution DAG. GitHub and most
viewers render them, and executors read the markdown, not the HTML.

# HTML companion

Every spec ships as two files: the markdown (source of truth for executors) and a
companion HTML next to it (`<spec-name>.html`) built for the user to absorb visually in
minutes. Deck format by default; regenerate whenever the markdown changes — a stale
HTML is worse than none. **How to build it — sizing, formats, structure, system views,
preview prototypes, mini worlds, story players, decision cards, images — is in
`references/html-companion.md`; read it before producing any companion.**

Three workflow rules live here because they shape the collaboration, not the artifact:

- **Draft early.** Build the first companion as soon as the shape of the problem is
  clear — status `draft`, registered in the Reading Room immediately (`register="spec"`
  on the `<rr-doc>` tag) — and evolve it through every round of back-and-forth.
- **Never ask a spec decision blind.** Before asking the user to decide anything, put
  the decision on the page as a decision card (premise, options with trade-offs, your
  recommendation, the default if they don't decide), and let the chat question point at
  the card.
- **Let them read.** After shipping or updating a draft, end your turn: say it's ready,
  point at the open decision cards, and stop. Do not follow a fresh draft with a list of
  questions in chat — the user hasn't read it yet, and the cards already hold everything
  that needs deciding.

# Critique pass

Have one or two capable workers critique it for blind spots, ambiguity, missing constraints,
risky assumptions, and execution traps, then fold the useful feedback back in or
summarize recommended patches for the user. Skip it only for small, settled specs. And
push back yourself when the spec is too vague, over-scoped, or likely to mislead the
implementation worker.
