# Spec HTML Companion

A single self-contained HTML file next to the markdown spec, built on the shared template for the chosen format: `~/.pi/agent/packages/portable-pi-setup/support/html-slides-template.md` for the deck format (the default), `~/.pi/agent/packages/portable-pi-setup/support/html-template.md` for the document format (only when the user asks for it). Read the chosen one first — it provides the skeleton, the Notion-style palette (warm light / calm dark), and every shared component (cards, tiles, badges, callouts, hover definitions, collapsibles, mini-world controls, Mermaid theming). One `<script>` tag to the Mermaid CDN is the only external network dependency; everything else is inline (images as data URIs, or files beside the HTML) so the file opens from disk anywhere. In the deck format, the required structure below maps to slides (one concept per slide) as the slides template describes; the sticky section nav becomes the title slide's table of contents.

## Purpose and posture

The markdown is for executors; the HTML is for the reader — and not only for reading the finished spec: it is the collaboration surface while the spec is being shaped. The first draft ships early (status `draft`, registered in the Reading Room immediately) and evolves with every iteration; every decision the user is asked to make lives on the page as a decision card before the question reaches them in chat, so they decide with the premise in front of them instead of rebuilding it from memory.

Optimize for skimmability: a reader should get the whole spec — intent, shape, scope, phases, done-ness — from the diagrams and cards alone, without reading a paragraph. Prose in the HTML is captions and one-liners; if a section needs long prose, that prose lives in the markdown and the HTML shows its structure instead. Long supporting detail that must be present goes in collapsible `<details>` sections — the main path stays short, the depth is one click away, nothing is lost.

Language: explain, don't abbreviate. Prefer the plain phrase over the term of art, and give every technical term, acronym, or codename a hover definition (`.term` pattern in the shared template) — one or two everyday-words sentences, on every occurrence, shown on hover and keyboard focus. The glossary grid defines the project's canonical vocabulary; hover definitions cover everything else, everywhere it appears.

No inline source code in the HTML — code-level detail stays in the markdown for executors; the HTML explains behavior in plain language and shows structure as diagrams. Two exceptions. When a specific piece of code genuinely carries a point, present it as a collapsed, annotatable `rr-code` exhibit (a handful at most), never as snippets in prose. And when the spec touches code architecture, show the **structure itself**: `rr-types` for the key functions' shapes (inputs → outcomes) and `rr-stack` for the intended call stack — paired before/after in `rr-panes` when existing code is being restructured, so the reader reviews the abstractions from signatures and call paths without reading bodies. Collapsed for one-off/internal features, expanded when the architecture is the point. And per the shared template's "visual, not just typeset" principle: inline SVG icons on statuses, headings, and diagram nodes; no screenful of pure text. The mini world takes a `.fullbleed` section (or full-bleed slide) with the fullscreen toggle, never the prose column.

## Required structure

1. **Header** — spec title, project, date, status badge (draft / ready / in-progress / done), and a link to the markdown file.
2. **TL;DR strip** — 3–5 stat-tile cards: what it is (one sentence), size (phases × major pieces), riskiest part, and current progress (n/m checklist items).
3. **Sticky section nav** — anchors to every section; the reader should never scroll to find something.
4. **Background** — the premise, before any spec content, in the spec's states-not-tasks order: the problem in plain words, then the **current state** and the **desired state** of the system rendered as gallery system views (`~/.pi/agent/packages/portable-pi-setup/support/examples/` — same view twice, or one view with a today/goal toggle, so the gap is visible rather than narrated). Desired state is behavior and outcomes, never implementation — implementation gets its brief mention near the end of the page. Prose stays short (a doorstep, not a chapter); the two states carry the weight.
5. **Mini world** (when the spec has dynamic behavior) — an interactive vanilla-JS simulation of the *intended* behavior: toggles, sliders, editable inputs, click-through flows with plain-language narration. Model the spec faithfully — same rules, edge cases, and failure modes — so the user can trigger the tricky paths himself before implementation starts. Inline, no dependencies.
6. **Sections mirroring the markdown**, each led by its visualization. Map concepts to diagram types:

| Spec content | Visualization |
|---|---|
| Architecture / system boundaries | An architecture-aware system view from the reference gallery `~/.pi/agent/packages/portable-pi-setup/support/examples/` (read its README; atlas = where it lives, metro = what flows change, lifecycle = behavior over time) — match the example's quality, never a bland substitute; Mermaid `flowchart` with `subgraph` per boundary only for secondary/supporting structure |
| Primary workflows | Mermaid `flowchart` (user-facing) or `sequenceDiagram` (system-to-system) |
| User-facing change | A user story that plays like a video — the `story-player.html` pattern from `~/.pi/agent/packages/portable-pi-setup/support/examples/`: one concrete user on a mocked screen, play/scrub controls, captions, old-vs-new contrast |
| UI changes (components, views, layouts) | High-fidelity interactive mockups (see "UI mockups") — one per change, no sampling; components share a view, full views/layouts/pages go full-bleed |
| Data model / source of truth | Mermaid `erDiagram`; annotate the owning system on each entity |
| State, failure & offline behavior | Mermaid `stateDiagram-v2` |
| Phases / roadmap | Mermaid `timeline` or a hand-built phase tracker with progress bars |
| Fleet orchestration / seams | Mermaid `flowchart` with swimlane subgraphs per owner; parallel lanes side by side, gates as diamond nodes |
| Scope | Two-column card: ✅ In scope / 🚫 Non-goals |
| Acceptance criteria | Checklist card with checked/unchecked styling matching the markdown checkboxes |
| Ubiquitous terms | Definition grid (term — one-line meaning) |
| Open decisions / TODOs | Decision cards (see "Decision cards") |
| Anything a picture carries better than boxes | A generated image (see "Image visualizations") |

Skip a visualization only when the spec genuinely has nothing of that shape — never because it's effort.

## UI mockups

When the spec touches the UI, mock the affected interface at high fidelity inside the HTML itself, with vanilla JS wiring up the interactions the spec describes (hover states, clicks, toggles, expansions behave as intended). Never substitute a wireframe, a screenshot description, or prose for the mockup.

- **Product parity is the fidelity bar.** A mockup is a preview of the final product, so it is styled in the *target application's* design language, never the document's. Before mocking, mine the app's real design system from its codebase — theme tokens, `globals.css`, Tailwind config, its actual button/input/nav components — and reproduce the exact colors, type, radii, spacing, and iconography. The reader should not be able to tell the mock from a screenshot of the shipped feature. If the app has no established design language, say so on the page and propose one as part of the spec; never quietly substitute the reading-room look.
- **Build every mockup inside `rr-mockup`** (the kit's product frame): it renders browser or phone chrome and mounts the mock into a shadow root, so the two design systems cannot contaminate each other. Mock content is plain HTML + `<style>` in the product's idiom; interaction JS sits outside the frame (wrapped in `DOMContentLoaded`) and drives it via `document.getElementById("<id>").shadowRoot`. See the kit README's "Product frames" section.

- **Coverage is total.** Every UI change in the spec gets its own mockup — if five changes span the interface, all five appear. The reader should see the entire surface of the change, not a representative sample.
- **Size by scope.** A change to an individual **component** renders as just that component, so several component mockups can share a single view or slide — a labeled grid, each cell one component. A change to a **full view, layout, or page layout** takes the entire space — the `.fullbleed` section in the document, a full-bleed slide in the deck — so its proportions and hierarchy read as they will in the real thing.
- **Show the change, not just the result.** Where a mockup replaces existing UI, pair it with a today/goal toggle (the same pattern the background states use) so the before/after is direct rather than narrated.
- Mockups follow the no-source-code rule from the reader's side: they *are* rendered UI, never code listings of the UI.
- Sections that carry a decision or a risk may close with a short `rr-quiz` self-check (2–4 questions with `rr-why` explanations); code, when it genuinely carries a point, goes in an annotatable `rr-code` exhibit (collapsed), never inline in prose.

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

## Styling & skeleton

For the document format, compose from the Reading Room Kit (`~/.agents/reading-room/kit/README.md` — `<rr-*>` components built with `node ~/.agents/reading-room/kit/build.mjs`); for decks, start from the skeleton in `~/.pi/agent/packages/portable-pi-setup/support/html-slides-template.md`. Shared canon (Notion-style tokens, components, Mermaid init): `~/.pi/agent/packages/portable-pi-setup/support/html-template.md`. Spec-specific conventions on top:

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
