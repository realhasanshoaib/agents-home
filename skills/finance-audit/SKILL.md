---
name: finance-audit
description: Use when Hasan asks to audit company spending, review the company budget, find financial waste, or run the recurring finance audit.
---

Make the next budget decision easier. A successful run explains the current position, finds material omissions or inefficiencies, and leaves an evidence-backed action list and a usable HTML dashboard.

## Establish the baseline

Read the latest audit, its evidence index, and the founders' subsequent decisions before collecting. For Hasan, read the private `~/code/journal/finance-audit-context.md` (or `references/hasan.md` beside this skill on a synced machine), then `finance-audit-latest.json` and `finance-audit-collection-guide.json` in the journal. If those files are unavailable, recover the baseline from Q9 Brain or report the gap. The guide supplies routes, not current facts. Read Q9 Brain context and relevant finance decisions too. Preserve existing source history and schema when updating state.

Build one coverage ledger by vendor, account and venture. Include cloud, software, AI subscriptions and API usage, hosting, domains, email, calling, prepaid balances and annual commitments. Look for omitted business costs in available invoices, receipts, billing notices and company records; the previous vendor list is a starting point. Add payroll, contractors, receivables, cash and other company expenses when records support them. Label a technology-only subtotal as such. Exclude household spending and Yahya; keep unknown ownership visible.

Maintain the independent `finance-inventory.json` in the journal. Reconcile its priced and unpriced entries against billing/statement evidence and resource inventories, including every account and dev/prod resource. Add discoveries with evidence before rebuilding the dashboard. Retire an inventory entry only with a dated reason; preserve its history. Match charges, accounts and resource IDs rather than vendor names alone. Every known item must appear once in its proper budget view or explicitly among unpriced/excluded items.

Use Q9 Labs, CollabEZ, Hasan+Shoaib, Tuition Highway and supported shared allocations. Assign each subscription to the team using it; an account name alone does not determine the venture. Keep Kaadr in a separate view, excluded from Hasan's current main budget; show Q9-paid Kaadr costs there so they do not disappear. CollabEZ Convex and Telnyx belong to TH; Ultravox CollabEZ serves mainly Q9 with some TH, with no invented split. Preserve supported PlanetScale and DigitalOcean allocations. New evidence may correct these mappings; record why.

Check: every material account has a source, period, last successful read, vendor data date and coverage status; missing company records are explicit.

## Collect for decisions

Refresh approaching renewals, payment failures, exhausted balances, expiring keys, major cost drivers, and evidence that could change an open decision first. Batch independent read-only API calls with timeouts. Use `2password` for credentials. Use the original signed-in Helium through its plugin; if unavailable, use the user's approved agent-browser fallback only when it can reach the intended session, then clean up processes and tabs you created. An empty replacement browser says nothing about Helium login state.

Save nonsecret evidence once. Distinguish attempted time, successful-read time and vendor data-as-of. A failed read never refreshes an old number. Try a different authenticated route when evidence supports it; record the exact unblock needed when none works. Do not keep retrying an unchanged blocker. Continue independent checks.

At each recurring run, refresh important changes and investigate the highest-value unresolved gap or saving. Maintain the full dashboard even when the reply is short. On the first run of each month, reconcile the previous month's invoices and payments and refresh the complete account inventory. If coverage is partial, keep that reconciliation open for later runs rather than marking it complete by date alone.

Keep an explicit `growth_required` resource/account ID list in the independent inventory; every ID needs an observation or a visible missing-coverage entry. Growth windows use full `YYYY-MM-DD/YYYY-MM-DD` start-inclusive/end-exclusive dates and must be complete, non-overlapping and equal in duration. Render every validated growth flag as well as gaps in the dashboard. Every three-day run checks unexpected growth by account, application, environment and resource, including newly charging resources. Compare consumption over matched complete windows, normalized to USD/day, against the preceding comparable window and a recent seven-day baseline when available. Use the same currency/FX basis; never compare wallet top-ups, credits, quota resets or unequal cumulative month-to-date totals as consumption growth. Flag a new positive rate, an increase of at least $1/day and 25%, or any increase of at least $5/day. These are reporting thresholds, not spending authority. Rank by absolute cost increase and identify the owner, environment, evidence dates and next investigation. Treat deliberate launches and billing resets as explanations to verify. Missing comparable data is a coverage gap, never “no growth”. Three-day checks do not imply continuous monitoring; report whether provider alerts and caps are actually verified.

Check: report what was read, blocked, stale and not attempted, including pagination or account boundaries that limit completeness.

## Reconcile before recommending

Keep these separate: billed cost, cash payment, credit/refund, prepaid funding, consumption, commitments, and forecast. Keep planned purchases out of current spend. Match invoices to payments so neither is counted twice. A quota reset is not a saving; a key's usage is not the whole account; AWS usage is not proof of a reseller invoice. API-equivalent token value under a flat subscription is not a bill. Registry expiry is not a renewal price or payment date.

Keep original currency, billing period, taxes and annual/multiyear payment dates. Show monthly equivalents separately from cash due. Source and date any FX rate used; do not add different currencies without conversion. Forecasts name their observation window, method and exclusions, with incomplete periods visible. Show runway only when current available cash and net cash burn support it; receivables remain separate until paid.

Check subtotals against source totals and list unresolved differences. A missing amount remains unknown, never zero. When account consumption is unavailable, put it in the excluded-cost list; prepaid funding cannot supply its upper bound. Key and renewal warnings use Dubai time and show urgency at 30, 14 and 7 days or expired. A dated unpaid-invoice warning calls for checking whether it remains outstanding before recommending payment.

## Turn findings into savings

Inspect duplicates, unused seats, idle resources, stranded balances, annual renewals, expensive defaults, abandoned experiments and services with poor value for their workload. Check peak demand, dependencies, retention, recovery and revenue impact before proposing a cut. Verify current official pricing and compatibility when suggesting a replacement.

For each material action give the owner, evidence, deadline, current cost, proposed cost, net recurring saving, one-off migration/exit cost, effort, dependency and rollback. Where inputs are uncertain, give a bounded scenario or an unpriced action. Rank by net benefit and urgency; prioritize a few concrete decisions over a long list of cheap optimizations. Do not add mutually exclusive alternatives or overlapping savings together.

Track proposed, approved, implemented and verified separately. A cancellation becomes implemented when confirmed; savings become verified when subsequent billing or metering supports them. A spending alert, a vendor hard limit, a per-key allowance and an application stop are different controls; show which exists, whether it is set, and what usage it actually covers. Closed decisions stay closed unless new evidence changes them. Carry forward a dated unresolved risk without presenting it as a new discovery.

This skill authorizes investigation and recommendations. A scheduled run does not authorize payments, cancellations, plan changes, key rotation, infrastructure deletion or messages to others. Execute a change only under separate applicable authorization, with its required undo and verification.

Check: each recommendation can be decided or executed without reconstructing the audit, and reported savings cannot be confused with money already saved.

## Show the result

Use the shared `../diagrams/logos/` cache for vendor logos; its README and `sources.json` record variants and provenance. Match account-qualified names such as “Convex (Q9)” to the vendor, and represent combined vendors separately. Check the rendered vendor list for missing or unreadable marks. Source missing logos from Svgl first, then the vendor's official site, and save reusable assets with their provenance in that cache. Embed assets in the delivered HTML so the dashboard works offline; preserve a readable vendor name if a real logo is unavailable.

Every audit run, including no-change runs and runs with blocked sources, delivers a dated, self-contained, private HTML dashboard and a short text handoff. Carry forward unchanged evidence with its original dates and show gaps on the page. A text-only reply does not complete an audit. Hasan prefers the original 23 October Claude dashboard: warm cream background, large centered navy headline, rounded white cards, teal/amber accents, a spending bar and visible category/vendor groups. Use that approved design with the latest reconciled data; preserve it when correcting numbers. The private context identifies the current template. Use `squint` for accessibility and copy while honoring this explicit design preference. Keep finance visible only to the founders; no public hosting or external analytics/assets.

Hasan is not a finance specialist. The first screen answers in plain words: what we spend each month, what is already saved, and what room that creates for the next tool. Show a range or incomplete subtotal when the evidence cannot support a company total. Keep the spending groups visible and show at most three urgent decisions. Put accounting terminology and source evidence in expandable details. For a newly found cost, distinguish the amount omitted from the previous report, actual usage to date, and any projected increase from an earlier period. The complete page also shows:

- Current recurring cost and cash due, with currency, period and coverage beside the numbers.
- Spend by venture and vendor/category, with drill-down to evidence and unknown allocations.
- Changes since the previous audit and the largest drivers.
- Ranked actions with net savings, status, owner and due date.
- Upcoming renewals, commitments, balances and service/key risks.
- Source coverage and unresolved reconciliation differences.

Generate headline, category totals and scenarios from one reconciled dataset. Apply founder corrections to every dependent number and recommendation, then remove superseded options. Never patch the headline while leaving old recommendations elsewhere. Name each action included in a savings bundle, and compute its displayed reduction from that exact bundle. Preserve the founder's keep-list. Any scenario control changes only the scenario, clearly marked as hypothetical. A cost reduction alone is not spending room: reconcile cost increases, prior reinvestment and cash needs before saying a new tool fits. Show upfront cash separately. Keep each headline card to a number and one short sentence, with the explanation expandable. Avoid decorative charts, fake approval buttons and charts that hide unknown amounts. A static table is sufficient when interaction adds nothing.

Open and inspect the real HTML at desktop and phone sizes. Exercise each control, including blank, negative, fractional and excessive counts; invalid values must show an error and suppress the scenario result. Check the displayed arithmetic and confirm that empty/stale data stays visible. In T3, use `html_preview` and then `html_render` to deliver it. Preserve a local HTML artifact and its evidence alongside the dated audit; include absolute file links in the final reply. Screenshots used for review are two-column contact sheets.

Update the audit state only after validation. Diff each changed source record against its saved evidence: failed and reused sources keep their previous successful-read timestamp and evidence pointer, while a failed attempt gets a separate attempt record. Test a failed-read fixture against the state-writing helper before using a new helper. Save decisions, completed actions and the session outcome in Q9 Brain with their sources, without turning a proposal into an approved action. If review corrects a published claim, correct its saved Brain memory too. Final text leads with what needs Hasan, material changes and what could not be seen. Ask only for missing intent or access that the available evidence cannot resolve.

Before publishing, run `python3 scripts/check_audit.py <dataset.json> <finance-inventory.json> --growth <growth-observations.json>` from this skill folder. It checks inventory coverage, duplicate rows, owners, recorded recurring amounts and totals, and reports comparable growth or explicit gaps. Its inputs are local JSON; it performs no network calls or financial changes. For growth observations provide resource ID, consumption rates in USD/day, source, as-of date and both windows; mark unavailable comparisons with a reason. Resolve validation errors and carry growth coverage gaps into the dashboard. This check supplements statement-to-inventory reconciliation; it cannot discover a vendor absent from both inputs.

Check: the dashboard is delivered, its numbers reconcile, the evidence and state are saved, and the next run can resume without rereading this conversation.
