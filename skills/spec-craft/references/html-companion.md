# Spec HTML Companion

The companion is a single HTML file next to the markdown spec, composed from the Reading Room Kit: read `~/.agents/reading-room/kit/README.md`, write a `.rr.html` file of `<rr-*>` components, build with `node ~/.agents/reading-room/kit/build.mjs`. Two formats, both from the kit — **deck** (`rr-deck`/`rr-slide`, one concept per screen; best for a first linear read) or **document** (one scrolling page; best as a reference to jump around). **The deck is the default** — build slides unless the user asks for the document format. In the deck, chunk *inside* each slide with `rr-beat` so ideas arrive step by step — a beat is one step of the argument, never one bullet of a list (the kit README's Decks section is the guide). Visual canon: `~/.agents/html-template.md` for documents, `~/.agents/html-slides-template.md` for decks; match the craft of `~/.agents/examples/` for rich or interactive sections. Register in the Reading Room via `register="spec" project="…" risk="…" summary="…"` on the `<rr-doc>` tag — the kit build writes the registry line itself (`~/.agents/reading-room/README.md` is the single canonical registry). In the deck format, the structure below maps to slides (one concept per slide); the sticky section nav becomes the title slide's table of contents.

## Sizing

Ceremony scales with the spec, judged by risk, span, and how many decisions are still open — not by effort available:

- **Small** (single-session, low-risk, decisions already settled): a short deck — background states, scope, done. No mini world, no story player, preview prototypes only if the UI changes.
- **Standard**: the short-deck core, plus whichever heavier elements (mini world, story player, structural exhibits, generated images) genuinely sharpen a decision or would catch bugs before implementation. Each is a judgment call — skip any element that would only decorate what a sentence already says.
- **Large / high-risk** (multi-phase, fleet-executed, irreversible, or contested): the full treatment.

## Purpose and posture

The markdown is for executors; the HTML is for the reader — and not only for reading the finished spec: it is the collaboration surface while the spec is being shaped. The first draft ships early (status `draft`, registered in the Reading Room immediately) and evolves with every iteration; every decision the user is asked to make lives on the page as a decision card before the question reaches them in chat, so they decide with the premise in front of them instead of rebuilding it from memory.

Optimize for skimmability: a reader should get the whole spec — intent, shape, scope, phases, done-ness — from the diagrams and cards alone, without reading a paragraph. Prose in the HTML is captions and one-liners; if a section needs long prose, that prose lives in the markdown and the HTML shows its structure instead. Long supporting detail that must be present goes in collapsible `<details>` sections — the main path stays short, the depth is one click away, nothing is lost.

Language: explain, don't abbreviate. Write all prose to `~/.codex/writing-style.md` (review the copy against it before delivering). Prefer the plain phrase over the term of art, and give every technical term, acronym, or codename a hover definition (`.term` pattern) — one or two everyday-words sentences, on every occurrence, shown on hover and keyboard focus, with a dotted underline so hoverable terms are visible. The glossary grid defines the project's canonical vocabulary; hover definitions cover everything else, everywhere it appears. And per the "visual, not just typeset" principle: inline SVG icons on statuses, headings, and diagram nodes; no screenful of pure text.

## Types, call stacks & schema

The user reviews the spec's abstractions at the interface level, without reading implementation bodies. These exhibits exist so they can get familiar with the types, function shapes, and call paths of the program — and judge whether the seams are right, whether an outcome is a value or a smuggled boolean — from signatures alone. First-class whenever the spec touches real code architecture:

- **Function shapes** — `rr-types`, syntax-highlighted: every function being added or changed, written as `(input: Shape) → Outcome`, so the inputs and outputs are learnable at a glance.
- **Call stacks** — `rr-stack`: who will call whom once this lands, new frames toned `new`. When the change restructures existing code, pair **current and intended** in `rr-panes` (before/after) so the structural cost or payoff is visible at a glance.
- **Schema** — when the spec touches the database, the same before/after treatment for the data model: current and intended schema side by side (Mermaid `erDiagram` or `rr-types`-style table shapes), with changed entities and columns highlighted and the owning system annotated.
- **Code exhibits** — a specific piece of code that genuinely carries a point goes in a collapsed, annotatable `rr-code` exhibit (a handful at most), never as snippets in prose. Otherwise no inline source code in the HTML: code-level detail stays in the markdown for executors.

Present these collapsed for one-off or internal features, expanded when the architecture is the point. Sections that carry a decision or a risk may close with a short `rr-quiz` self-check (2–4 questions with `rr-why` explanations) so the user can confirm the abstractions landed.

## Structure

1. **Header** — spec title, project, date, status badge (draft / ready / in-progress / done), and a link to the markdown file.
2. **TL;DR strip** — 3–5 stat-tile cards: what it is (one sentence), size (phases × major pieces), riskiest part, and current progress (n/m checklist items).
3. **Sticky section nav** — anchors to every section; the reader should never scroll to find something.
4. **Background** — the premise, before any spec content, in the spec's states-not-tasks order: the problem in plain words, then the **current state** and the **desired state** of the system rendered as gallery system views (`~/.agents/examples/` — same view twice, or one view with a today/goal toggle, so the gap is visible rather than narrated). Desired state is behavior and outcomes, not implementation — implementation gets its own section near the end of the page, mirroring the markdown's ordering. Prose stays short (a doorstep, not a chapter); the two states carry the weight.
5. **Mini world** — when the spec describes dynamic behavior worth poking: an interactive vanilla-JS simulation of the *intended* behavior — toggles, sliders, editable inputs, click-through flows with plain-language narration. Model the spec faithfully — same rules, edge cases, and failure modes — so the user can trigger the tricky paths before implementation starts. Include it when playing with it would sharpen a decision or catch a spec bug; skip it when it would only animate what a sentence already says. Inline, no dependencies; `.fullbleed` section (or full-bleed slide) with a fullscreen toggle, never the prose column.
6. **Sections mirroring the markdown**, each led by its visualization. Map concepts to diagram types:

| Spec content | Visualization |
|---|---|
| Architecture / system boundaries | An architecture-aware system view from the reference gallery `~/.agents/examples/` (read its README; atlas = where it lives, metro = what flows change, lifecycle = behavior over time) — match the example's quality, never a bland substitute; Mermaid `flowchart` with `subgraph` per boundary only for secondary/supporting structure |
| Primary workflows | Mermaid `flowchart` (user-facing) or `sequenceDiagram` (system-to-system) |
| User-facing change | A user story that plays like a video — the `story-player.html` pattern from `~/.agents/examples/`: one concrete user on a mocked screen, play/scrub controls, captions, old-vs-new contrast. Include when experiencing the change beats reading about it; skip for minor or self-evident changes |
| UI changes (components, views, layouts) | Preview prototypes (see "Preview prototypes") — components share a view, full views/layouts/pages go full-bleed |
| Function shapes, call stacks, schema changes | The structural exhibits (see "Types, call stacks & schema") — `rr-types`, `rr-stack`, before/after `rr-panes` |
| Data model / source of truth | Mermaid `erDiagram`; annotate the owning system on each entity |
| State, failure & offline behavior | Mermaid `stateDiagram-v2` |
| Execution plan | The markdown's dependency DAG rendered with `rr-dag`: parallel lanes side by side, explicit labeled edges, join and proof gates, critical-path tone, and owner swimlanes for fleet work |
| Scope | Two-column card: ✅ In scope / 🚫 Non-goals |
| Acceptance criteria | Checklist card with checked/unchecked styling matching the markdown checkboxes |
| Ubiquitous terms | Definition grid (term — one-line meaning) |
| Open decisions / TODOs | Decision cards (see "Decision cards") |
| Anything a picture carries better than boxes | A generated image (see "Image visualizations") |

## Preview prototypes

When the spec touches the frontend, the companion carries **preview prototypes**: high-fidelity, high-parity previews of the shipped feature, built inside the HTML itself, with vanilla JS wiring up the interactions the spec describes (hover states, clicks, toggles, expansions behave as intended). Never substitute a wireframe, a screenshot description, or prose for the prototype.

- **Product parity is the fidelity bar.** A prototype is a preview of the final product, so it is styled in the *target application's* design language, never the document's. Before building, mine the app's real design system from its codebase — theme tokens, `globals.css`, Tailwind config, its actual button/input/nav components — and reproduce the exact colors, type, radii, spacing, and iconography. The reader should not be able to tell the prototype from a screenshot of the shipped feature. If the app has no established design language, say so on the page and propose one as part of the spec; never quietly substitute the reading-room look.
- **Build every prototype inside `rr-mockup`** (the kit's product frame): it renders browser or phone chrome and mounts the mock into a shadow root, so the two design systems cannot contaminate each other. Mock content is plain HTML + `<style>` in the product's idiom; interaction JS sits outside the frame (wrapped in `DOMContentLoaded`) and drives it via `document.getElementById("<id>").shadowRoot`. See the kit README's "Product frames" section.
- **Undecided UI → variants.** When the design itself is still open, build 2–3 distinct variants of the affected surface and put the choice on a decision card. The user picks from rendered previews, never from prose descriptions of options.
- **Settled UI → single preview.** Coverage follows judgment: every change the user must *see* to judge the spec gets a preview; minor or mechanical changes share a grouped, labeled view rather than being mocked in isolation. The reader should never have to imagine a UI change — but ten near-identical cells is decoration, not coverage.
- **Size by scope.** A change to an individual **component** renders as just that component, so several component prototypes can share a single view or slide — a labeled grid, each cell one component. A change to a **full view, layout, or page layout** takes the entire space — the `.fullbleed` section in the document, a full-bleed slide in the deck — so its proportions and hierarchy read as they will in the real thing.
- **Show the change, not just the result.** Where a prototype replaces existing UI, pair it with a today/goal toggle (the same pattern the background states use) so the before/after is direct rather than narrated.
- Prototypes follow the no-source-code rule from the reader's side: they *are* rendered UI, never code listings of the UI.

## Decision cards

Open decisions are where the companion earns its keep as a collaboration tool. the user is never asked to decide something cold in chat — the decision goes on the page first, and the chat question points at the card. Each open decision is an amber `.callout` card that contains everything needed to decide on the spot:

- **What's being decided**, in one plain sentence.
- **Why it came up** — one or two lines of premise, anchoring back to the background section rather than repeating it.
- **The options**, each with its trade-off in a phrase (side-by-side panels if the contrast deserves it).
- **Your recommendation** and the one-line why.
- **The default** — what happens if they do not decide, so no card ever silently blocks.

Give the cards their own anchor in the section nav (e.g. "Decisions (2)") so open questions are findable in one glance. When the user decides, fold the outcome into the relevant section and delete the card — a decided card is stale scaffolding, not history; the decision trail belongs in the session log, not the spec.

## Image visualizations

Generated images are a core part of the spec HTML — a first-class method alongside the system views, Mermaid, and the mini world, never an optional extra. Use the imagegen tool generously: generate as many images as help the user absorb the spec faster — concept illustrations for the problem and the desired state, architecture or data-flow renderings where a picture beats a box-and-arrow diagram, before/after comparisons, and UI/scene illustrations for user-facing work. Give every image a descriptive filename (`spec-<name>-<what-it-shows>.png`, e.g. `spec-sync-conflict-resolution.png`) — never the tool's random-ID names — and embed each one next to the section it illuminates (base64 data URI, or relative path beside the HTML). The bar is the same as for diagrams: an image that replaces three paragraphs of prose is a win; one that decorates what a sentence already said is noise. Where the concept is dynamic (state over time, a flow, a feedback loop), prefer the mini world over a static image.

## Styling conventions

Both formats compose from the Reading Room Kit (see the opening section); visual canon is `~/.agents/html-template.md` for documents and `~/.agents/html-slides-template.md` for decks. Spec-specific conventions on top:

- Status badge in the header: draft = muted, ready = accent, in-progress = amber, done = green.
- Checklist progress: a thin `.progress` bar under each phase heading with an `n/m` label, derived from the markdown checkboxes at generation time.
- Scope card: the shared `.cols2` grid — ✅ In scope / 🚫 Non-goals side by side.
- Open decisions: amber `.callout` cards, one per decision.


## Diagram quality rules

- Label every edge that isn't obvious; an unlabeled arrow between two boxes conveys almost nothing.
- Keep each diagram under ~15 nodes — split a sprawling flow into one overview diagram plus per-workflow detail diagrams rather than one unreadable mega-graph.
- Direction: `flowchart LR` for pipelines/data flow, `TD` for hierarchies and decision trees.
- Quote node labels containing punctuation (`A["label (with parens)"]`) — unquoted parens/brackets are the top Mermaid parse-failure cause.
- Verification is proportional: the rr build's checks are the gate for the document — no code review, no browser walkthrough. Open the page only when it contains Mermaid blocks (to confirm they parse — a raw error where a diagram should be defeats the purpose) or bespoke hand-written stage JS that needs debugging.
