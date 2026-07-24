---
name: debrief
description: Write the walkthrough document that gets Hasan up to speed on a change — a self-contained interactive HTML page built from the Reading Room Kit, with a mini world, maps, and honest findings. Use when Hasan asks for a debrief, a walkthrough of what was built or changed, or to be caught up on work an agent did.
---

# Debrief

A "debrief" is a document **you write for Hasan** to walk him through a change. Its purpose: features get implemented fast, and Hasan must stay in the loop — able to read, understand, and challenge every change — or the codebase silently accrues tech debt and he ends up locked out of his own system.

Hasan's time is valuable: the debrief must be **complete but fast to read**. Read `~/.codex/writing-style.md` before writing and adhere to it throughout — the debrief is judged against that style.

## Deliverable

One self-contained HTML file: `scratchpad/debrief-<topic>-YYYY-MM-DD.html`. **Never deliver the debrief inline in the conversation and never as markdown** — the HTML file is the only format. In the conversation, just hand over the file path and one sentence on the verdict. After writing the file, make sure it is **registered in the Reading Room** so it appears in Hasan's pinned reading queue: put `register="debrief" project="…" risk="…" summary="…"` on the `<rr-doc>` tag and the kit build writes the registry line itself (`~/.agents/reading-room/README.md`). The file must open cleanly from disk with no server, no build step, and no external network dependencies (inline all CSS/JS; embed images; the sole allowed exception is the Mermaid CDN script if the page uses Mermaid diagrams). The debrief HTML is a document, not a code change: never run code review on it and never spin up a browser to "verify" it — the rr build's checks are the gate; open the page only to debug bespoke hand-written stage JS or to confirm Mermaid blocks parse when the page has them.

The debrief comes in two formats, and **you ask Hasan which he wants** (AskUserQuestion) before building, unless he already said or a standing preference is on record:

- **Document** — one scrolling page, composed from the Reading Room Kit: read `~/.agents/reading-room/kit/README.md`, write a `.rr.html` of `<rr-*>` components, build with `node ~/.agents/reading-room/kit/build.mjs`. Design canon: `~/.agents/html-template.md`. Best for jumping around and using as a reference.
- **Deck** — slides, one concept per screen, arrow-key navigation, composed from the same kit (`rr-deck`/`rr-slide`, chunked inside each slide with `rr-beat`/`rr-step` — the kit README's Decks section is the guide; visual canon: `~/.agents/html-slides-template.md`). Best for a first linear read: no keeping track of where you were, the progress bar does it.

Read the chosen template before writing any HTML. Both share the same design system (Notion-style minimalism: warm light mode, calm dark mode, simple type, generous whitespace) and every component pattern: cards, stat tiles, badges, callouts, hover definitions, collapsibles, mini-world controls. Stay inside the tokens so every document Hasan reads feels the same. All rules below — structure, language, hover definitions, mini world, form over raw text — apply identically in both formats; in the deck they map to slides as the slides template describes.

## Language

Write in the language of explaining, not technical shorthand. Assume Hasan is smart but has zero familiarity with this code and its vocabulary. Prefer the plain phrase over the term of art ("the code that checks who you are" before "auth middleware"). Never let a sentence depend on a term Hasan can't be expected to know — and when a technical term is genuinely the right word, it gets a hover definition:

**Hover definitions** — every technical term, acronym, or project codename in the debrief must show its plain-English meaning on hover. Wrap each one in a tooltip element (dotted underline so it's visibly hoverable; also keyboard-focusable with the same definition shown on focus, so it works without a mouse). The definition is one or two sentences in everyday words — what the thing is and why it matters here, not a dictionary entry that uses three more jargon words. Apply this to *every occurrence*, not just the first, since Hasan may jump around the page. Use the `.term` pattern from the shared template rather than inventing your own.

## Writing rules

Every sentence of debrief prose follows `~/.agents/writing-rules.md` — Orwell's six rules (short words, cut words, active voice, no stock figures of speech, everyday English over jargon, and break any rule sooner than write something barbarous). They govern prose only, never code or technical terms. Review the finished copy against them before delivering; bad writing is the main tax on Hasan's reading, and these rules are the cut.

## No source code

The debrief is structure-first, never code-first: no inline snippets, no diff excerpts in prose, no function-name-as-explanation. When one specific piece of code genuinely carries a point, present it as a deliberate exhibit in an annotatable `rr-code` block (syntax-highlighted, collapsed by default, a handful per debrief at most) — Hasan can mark lines and copy the notes straight back to an agent. Explain what code *does* in plain language; show its *structure* with maps and diagrams. The one concession to traceability: a single collapsed "trace" appendix at the very end holding the precise file/line pointers a follow-up agent would need — closed by default, clearly marked as not for reading, and never referenced from the visible layer.

Structure, though, is not code — and when the work changed real code structure, the debrief shows it: an `rr-stack` of the call stack as it now stands and an `rr-types` of the key signatures that were added or changed (inputs → outcomes). When the work restructured existing code, pair before and after in `rr-panes` — tone `new` on what was added, `gone` on what was removed — so Hasan can judge from the shapes and call paths whether the abstractions stayed sane, without opening a file. If the spec's companion carried an intended stack, the debrief's version answers it: this is what actually landed. Collapsed for one-off or internal work; expanded when the change was architectural.

## Form over raw text

Hasan reads ~20 specs and debriefs a day. A wall of paragraphs inside an HTML file defeats the point of the format — if it reads like raw text, the HTML earned nothing. For every piece of information, choose the representation that makes it fastest to absorb, and only fall back to prose when prose genuinely is the best fit (narrative reasoning, a verdict, a "why"). Nothing may be dropped or dumbed down — same information, better shape:

- Comparisons (before/after, option A/B, old flow/new flow) → side-by-side panels or a two-column table, never interleaved paragraphs.
- Anything enumerable (files touched, findings, config values, steps) → a table, list, or cards with consistent fields, so his eye can scan a column instead of re-parsing sentences.
- Structure and flow (architecture, sequences, dependencies, state changes) → a diagram or the mini world, not a prose description of arrows.
- Anything the code does → plain-language behavior plus a map or diagram, never the code itself (see "No source code").
- Severity, verdicts, statuses → visually distinct badges/callouts so a skim of the page surfaces every warning without reading.
- Long supporting detail → collapsible (`<details>`-style) sections: the main path stays short, the depth is one click away, nothing is lost.

And the page must *look* like a designed interface, not a formatted essay. Styled text alone is still raw text. Give the UI visual texture everywhere: inline SVG icons on section headers, statuses, map nodes, and card fields; small illustrative images where a picture carries the idea; pictograms over labels where the meaning survives. Follow the shared template's icon guidance. The bar: **no screenful should be pure text** — every viewport of content contains something visual (a diagram, an icon set, an image, a colored structure) doing real work.

Test the page against this bar: Hasan should be able to get the verdict and every risk from a 30-second skim of the visual layer alone, and the full understanding from one linear read with no re-reading.

Optionally close the risks/decisions section with a short `rr-quiz` self-check (2–4 questions, each with an `rr-why` explanation) so Hasan can confirm the skim landed; its "Copy results" output is made to be pasted back to an agent.

## Structure

1. **Background** — before anything about the change itself, set the premise so Hasan knows what he's reading and why. In plain words: what part of the system this lives in and what that part does, what the world looked like before this change, and what problem or motivation triggered the work. Written for someone with zero context — after this section, everything that follows should land on prepared ground. Keep it short (a few sentences plus a small orienting diagram of where this sits in the system, if that helps); it's a doorstep, not a chapter.
2. **Grand summary** — three short sections, written so Hasan can stop after them and still have the full picture:
   - What the change does and why, plus an overall verdict (solid / needs attention / concerning) with your reasoning.
   - The walkthrough in miniature: the shape of the change — which parts of the system it touches, how the pieces fit together, and the one or two decisions that define the approach.
   - The findings in miniature: the concerns that matter most and what you'd do about them — or a plain statement that nothing worries you.
3. **Mini world** — an interactive model of the change, embedded in the page. This is not decoration; it is how Hasan actually builds intuition. Build a small simulation of the changed behavior in vanilla JS: something he can poke — buttons, toggles, sliders, editable inputs — that shows the system responding the way the real code now does. Good shapes: a before/after switch that replays the same scenario under old and new behavior; a click-through of a request or data flow where each step lights up with a plain-language narration; sliders for the inputs the change is sensitive to, with the outcome updating live. It must model *this specific change* faithfully (same rules, same edge cases, same failure modes) — a generic animation teaches nothing. If the change has a tricky edge case or a finding worth worrying about, make it reachable in the mini world so Hasan can trigger it himself. **Give it the full screen**: the mini world takes full-bleed width and full viewport height (the template's `.fullbleed` pattern; in the deck, a full-bleed slide), with a fullscreen toggle on top — its fidelity dies when it's squeezed into the prose column, so never inline it there.
4. **Map** — the guided tour of the change, with zero source code (this replaces any code walkthrough). Work in system parts, not files: name each touched part in plain language by its responsibility ("the piece that decides who may join a call"), then show how the change rewires them. The centerpiece is an **architecture-aware system view** built to the standard of the reference gallery in `~/.agents/examples/` (read its README, open the matching example, match its quality — never invent a bland substitute). Pick the view by the question the change raises: the **atlas** (`system-atlas.html`) for *where does this live and what does it touch*, the **metro map** (`system-metro.html`) for *what happens differently now*, the **lifecycle** (`system-lifecycle.html`) for *what happens to one thing over time and where can it die* — two views when the change deserves it. Around the view, layer the rest of the tour: before/after behavior panels for each part that changed; a responsibility table — part, what it did before, what it does now, why; and a journey view that follows one concrete scenario ("a user opens a stale link…") through the changed parts step by step. Order the tour so each part builds only on parts already explained. Skip mechanical churn (renames, lockfiles) with a word; spend the space on the one or two decisions that define the approach.
5. **Findings** — voice every concern, issue, or smell honestly: severity + category badges (blocker/major/minor; correctness/security/performance/maintainability/style), which part of the map it lives in, why it matters, and a concrete suggested fix — all in the same plain language as the rest, with no code and no visible file references (precise locations go in the trace appendix). No filler findings — if it wouldn't change what Hasan does, leave it out.

**Visualizations** — use the imagegen tool generously: generate as many visualizations as help Hasan understand the change better and faster — architecture and data-flow diagrams, before/after structure comparisons, sequence diagrams for new flows, dependency maps. Give every image a descriptive filename (`debrief-<topic>-<what-it-shows>.png`, e.g. `debrief-auth-token-flow.png`) — never leave the tool's random-ID names. Embed each image in the HTML next to the section it illuminates (base64 data URI or relative path in the same scratchpad folder). A diagram that replaces three paragraphs of prose is a win; one that decorates what a sentence already said is noise. Where a concept is *dynamic* (state changing over time, a flow, a feedback loop), prefer extending the mini world over a static image.

If something worries you even slightly, say so — an unraised concern is the failure mode this debrief exists to prevent.
