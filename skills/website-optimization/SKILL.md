---
name: website-optimization
description: Use when asked to audit or optimize web performance and visibility.
---

# Website Optimization

Preserve the visual design throughout — branding, colors, layout, copy tone, and animation are off-limits without explicit approval, and for contrast failures on brand colors, report and ask rather than recoloring.

## Diagnose

Diagnose in the rendered page, not the source: the waterfall, the trace, and the live DOM answer what code reading can't. Find the actual LCP element before touching anything — it is often not the node you'd guess. The network waterfall shows blocking chains, request order, and what actually shipped: in one field case SSR emitted optimized hero variants while client hydration silently fell back to the raw PNG, invisible in the code. The performance trace surfaces long tasks and hydration cost; inspecting the live DOM pins down layout-shift sources and missing intrinsic dimensions. For bundle work, measure the production build output and compare real alternatives — package-size tables and guesses mislead.

## Images

Size responsive variants to actual rendered dimensions (mobile DPR, container width), not arbitrary breakpoints, and give images explicit dimensions so layout can't shift.

## Measure

Lighthouse fluctuates run to run — average about 3 runs before trusting a score, once at baseline and again on the result, for both mobile and desktop. Compare desktop and mobile screenshots against the baseline: that's what proves the UI didn't drift.

## Handoff

Hand off with screenshots and the local preview running and report what changed, before/after numbers, and anything left unresolved.

## SEO and AI visibility

SEO beyond metadata basics and AI/LLM visibility (llms.txt, markdown routes, structured data) are their own engagements — take them on when asked or when discovery is the stated problem, not as part of every optimization pass.

## When live lags local

When live performance lags the local result, the cause is usually hosting: compression off, weak cache headers, slow origin TTFB, CDN misconfiguration, missing HTTP/2+. Diagnose and recommend these; never apply hosting, DNS, or cache changes from inside this skill.
