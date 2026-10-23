---
name: finance-audit
description: Use when Hasan asks to audit company spending, review the company budget, find financial waste, or run the recurring finance audit.
---

Make the next budget decision easier. A successful run explains the current position, finds material omissions or inefficiencies, and leaves an evidence-backed action list and a usable HTML dashboard.

## Establish the baseline

Read the latest audit, its evidence index, and the founders' subsequent decisions before collecting. For Hasan, read the private `~/code/journal/finance-audit-context.md` (or `references/hasan.md` beside this skill on a synced machine), then `finance-audit-latest.json` and `finance-audit-collection-guide.json` in the journal. If those files are unavailable, recover the baseline from Q9 Brain or report the gap. The guide supplies routes, not current facts. Read Q9 Brain context and relevant finance decisions too. Preserve existing source history and schema when updating state.

Build one coverage ledger by vendor, account and venture. Include cloud, software, AI subscriptions and API usage, hosting, domains, email, calling, prepaid balances and annual commitments. Look for omitted business costs in available invoices, receipts, billing notices and company records; the previous vendor list is a starting point. Add payroll, contractors, receivables, cash and other company expenses when records support them. Label a technology-only subtotal as such. Exclude household spending and Yahya; keep unknown ownership visible.

Use Q9 Labs, Hasan+Shoaib, Tuition Highway and supported shared allocations. Keep Kaadr in a separate view, excluded from Hasan's current main budget; show Q9-paid Kaadr costs there so they do not disappear. CollabEZ Convex and Telnyx belong to TH; Ultravox CollabEZ serves mainly Q9 with some TH, with no invented split. Preserve supported PlanetScale and DigitalOcean allocations. New evidence may correct these mappings; record why.

Check: every material account has a source, period, last successful read, vendor data date and coverage status; missing company records are explicit.

## Collect for decisions

Refresh approaching renewals, payment failures, exhausted balances, expiring keys, major cost drivers, and evidence that could change an open decision first. Batch independent read-only API calls with timeouts. Use `2password` for credentials. Use the original signed-in Helium through its plugin; if unavailable, use the user's approved agent-browser fallback only when it can reach the intended session, then clean up processes and tabs you created. An empty replacement browser says nothing about Helium login state.

Save nonsecret evidence once. Distinguish attempted time, successful-read time and vendor data-as-of. A failed read never refreshes an old number. Try a different authenticated route when evidence supports it; record the exact unblock needed when none works. Do not keep retrying an unchanged blocker. Continue independent checks.

At each recurring run, refresh important changes and investigate the highest-value unresolved gap or saving. Maintain the full dashboard even when the reply is short. On the first run of each month, reconcile the previous month's invoices and payments and refresh the complete account inventory. If coverage is partial, keep that reconciliation open for later runs rather than marking it complete by date alone.

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

Create a self-contained, private HTML dashboard and a short text handoff. Use the existing approved dashboard as the visual reference when available, and the `squint` skill for layout and copy. Keep finance visible only to the founders; no public hosting or external analytics/assets.

Hasan is not a finance specialist. The first screen answers in plain words: what we spend each month, what is already saved, and what room that creates for the next tool. Show a range or incomplete subtotal when the evidence cannot support a company total. Put at most three urgent decisions next. Keep accounting terminology, long inventories and evidence in expandable details. The complete page also shows:

- Current recurring cost and cash due, with currency, period and coverage beside the numbers.
- Spend by venture and vendor/category, with drill-down to evidence and unknown allocations.
- Changes since the previous audit and the largest drivers.
- Ranked actions with net savings, status, owner and due date.
- Upcoming renewals, commitments, balances and service/key risks.
- Source coverage and unresolved reconciliation differences.

Generate headline, category totals and scenarios from one reconciled dataset. Apply founder corrections to every dependent number and recommendation, then remove superseded options. Never patch the headline while leaving old recommendations elsewhere. Name each action included in a savings bundle, and compute its displayed reduction from that exact bundle. Preserve the founder's keep-list. Any scenario control changes only the scenario, clearly marked as hypothetical. A cost reduction alone is not spending room: reconcile cost increases, prior reinvestment and cash needs before saying a new tool fits. Show upfront cash separately. Keep each headline card to a number and one short sentence, with the explanation expandable. Avoid decorative charts, fake approval buttons and charts that hide unknown amounts. A static table is sufficient when interaction adds nothing.

Open and inspect the real HTML at desktop and phone sizes. Exercise each control, including blank, negative, fractional and excessive counts; invalid values must show an error and suppress the scenario result. Check the displayed arithmetic and confirm that empty/stale data stays visible. In T3, use `html_preview` and then `html_render` to deliver it. Preserve a local HTML artifact and its evidence alongside the dated audit; include absolute file links in the final reply. Screenshots used for review are two-column contact sheets.

Update the audit state only after validation. Diff each changed source record against its saved evidence: failed and reused sources keep their previous successful-read timestamp and evidence pointer, while a failed attempt gets a separate attempt record. Test a failed-read fixture against the state-writing helper before using a new helper. Save decisions, completed actions and the session outcome in Q9 Brain with their sources, without turning a proposal into an approved action. If review corrects a published claim, correct its saved Brain memory too. Final text leads with what needs Hasan, material changes and what could not be seen. Ask only for missing intent or access that the available evidence cannot resolve.

Check: the dashboard is delivered, its numbers reconcile, the evidence and state are saved, and the next run can resume without rereading this conversation.
