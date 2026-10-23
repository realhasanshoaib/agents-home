---
name: diagrams
description: Use when creating or updating an architecture, system, sequence, or process diagram.
user-invocable: true
disable-model-invocation: false
---

# Diagrams

The diagram references and tooling moved here from `design-references`. Read `references/README.md` and look at the matching images before starting. It describes the style, architecture and sequence examples, and the static sequence renderer. Use them as inspiration and reusable tooling; the Chalk facts in the examples are not current system evidence.

Use `$squint` when building and reviewing the diagram. `logos/` is the shared brand-asset cache for diagrams and finance dashboards, independent of any example project. Read `logos/README.md` for selection and provenance. Reuse its SVGs before fetching others; add reusable new brand SVGs there. The separate `../design-references/logos/` cache can supply other existing assets.

## Main model decides; Haiku builds

The main model investigates the system and owns the actual architecture: the question being answered, evidence, nodes, connections, direction, sequence, labels, branches, uncertainty and tradeoffs. Choose architecture, sequence or both based on what Hasan needs to understand.

Before delegating, write an exact brief containing those facts, the chosen reference images, required output format, owned output paths and checks. Do not ask the renderer to discover or decide the architecture. Resolve any missing fact or semantic change yourself.

Delegate the rendering and construction to **Claude Haiku 5.5 with high effort**. Read `~/.agents/docs/delegation.md`, discover the live model and option names, set the effort in the tool call, and verify the returned model and effort. This skill authorizes that bounded rendering subagent whether the user or the model invoked the skill. If the requested model is unavailable, keep the prepared brief and report the blocker rather than silently switching.

Haiku implements the supplied diagram, including layout, typography, arrows, SVG/HTML and rendering fixes. Give it the brief, references, relevant tooling and `$squint`. Tell it which files it owns and that other agents may be working; preserve their work. It returns ambiguities to the main model and does not delegate further.

## Check and deliver

The main model checks every node, arrow, direction, order, branch and uncertainty against the brief, then inspects the actual rendered artifact for legibility, overlap and clipping. Test interactive controls with `$squint`. Send rendering defects back to Haiku; fix architectural mistakes in the brief yourself.

Use the requested format. For HTML in T3, preview with `html_preview`, then deliver with `html_render`, keeping editable source and an absolute local artifact link. Follow the current machine and process-lifetime rules for rendering and browser work. This skill creates static diagrams; narrated diagrams, audio generation and playback are outside its scope.

Done when the main model has checked both meaning and rendering, and Hasan has the diagram and its editable source.
