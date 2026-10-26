---
name: pitch-demo
description: Use when Hasan asks to build a demo to pitch a company, such as cloning their website with a live Ava voice agent on it (like OnTime), rebuilding their application with Flow (like Mercury), or a custom workflow prototype (like the Future Divine RFQ desk).
disable-model-invocation: true
---

# Build a demo for a prospect

A pitch exists to get the decision maker to reply and take one next step. We put our product to work on a piece of the prospect's own world, deploy it on `<prospect>.q9labs.ai`, record a short video when asked, and wrap it in an HTML deck at `/proposal/`, which is the one link we send. `rubric.md` says what a 9 looks like in each area, and every applicable area must reach 9 the first time, because the brief settles every claim and decision before anything is built.

The lead decides what is true and what we ask for, in the brief. Builders implement the brief, prove each acceptance case, and return any gap to the lead instead of filling it themselves.

1. **Research.** Read the prospect's Relationship, any meeting recording or RFQ, and the related Canon in Q9 Brain to the end, paging any result that comes back cut. Then research their business from public sources: what they sell and to whom, what they already offer (hours, chat, WhatsApp, languages), their competitors, recent news, and who decides. For a cold prospect, add the proof from step 3 of `/Users/macmini/code/q9-pitch/docs/sales-workflow.md`; never run a reply-speed test on anyone we've met. Write `research.md` in the demo repo in four parts: sourced facts, what the buyer said, our assumptions, and unknowns.
2. **Write the brief.** Copy `brief-template.md` to `brief.md` in the demo repo and fill in every field. Done when Hasan has said yes to it.
3. **Rebuild only the pages the demo touches**, in their layout, colours, fonts, logo and images, from public sources and never their customers' data. Put a footer on every rebuilt page: "Concept demo by Q9 Labs. Not affiliated with <company>." Add `noindex` and a preview card (title, description, image). Fix what a visitor would notice at 1440 px and 390 px, and stop there.
4. **Build the product journey** the brief names: `ava.md` for a voice agent on their website, `flow.md` for a voice guide that fills their application, or, for a custom workflow, the one journey, data and simulation boundary the brief specifies. It must do the brief's hard case, not only the intake. A custom workflow's screens look like the enterprise SaaS tools their team already buys: a side navigation, a row of KPI cards, a table of work items with status and owner, and a detail panel that opens from a row, laid out for 1440 px first. When you start from an earlier demo, keep its logic and build its screens to this standard.
5. **Deploy** it as its own Cloudflare Worker on the hostname in the brief, with `workers_dev: false`. Done when every acceptance case in the brief passes on the deployed site, with the result saved in `acceptance.md`.
6. **Record the video** only when it was asked for, from the brief's video plan. Paid calls never find problems, because every retry is paid again: settle the visitor's script in text chat first, dry-run the recorder and the cut with free local audio such as macOS `say`, and only then record at most 3 paid takes. Use only a take that passes the brief's take rules, and when none of the 3 passes, stop and return the transcripts to the lead instead of tuning and retrying. Cut it to 30 to 60 seconds with one visible caption layer, counting any captions the widget shows, and label simulated steps. Put it at `/journey/`. Record and cut it with `/Users/macmini/code/pitch-kit/video`, as its README says: it drives the shared widget with the face off, cuts with one caption layer, and writes a contact sheet. Set the demo's call limit long enough for the hard moment's full answer before a paid take, because a call that ends mid-answer wastes the take.
7. **Build the deck** at `/proposal/` on the same Worker, from one of the pitch-kit deck templates and the brief's words, as `deck.md` says, and apply the `squint` skill.
8. **Draft the email** with the `write-email` skill, from the relationship owner, with the deck link and the brief's ask, in the brief's words.
9. **Check the facts.** A lane lists every claim the deck, the email, the video and the agent's answers make about the prospect, their trade or us, and checks each against `research.md` and its source. Every claim it can't back goes back to the lead, who fixes or cuts it.
10. **Run the pre-send check**, `scripts/precheck.sh` in this skill, against the deck URL and the email draft, with `--demo <id>` when the demo has Ava. It fails on a missing deck link or ask in the email, our team or cost in anything the prospect sees, a vendor account with no credit, a call that won't start, a slide count over the limit, or a demo button in the deck that opens to an access error, and it writes contact sheets of every slide at 1440 × 900 and 390 px.
11. **Show and send.** The lead reads the contact sheets against `rubric.md` area 4 and has every slide below a 9 fixed, then reads `acceptance.md` and the email against the brief. The lead then gives whoever asked for the demo the full link to send, `https://<host>/proposal/?k=<key>` when the demo has an access key, and shows them the deck, the video and the email. That person sends it. On the day it goes, and before every follow-up, run the pre-send check again.
12. **Log it** in Q9 Brain in one `note`: the demo URL and the decisions as a Fact, the send as an Interaction once it went, and the dated follow-ups as Next actions.

Nothing the prospect sees shows our side of the cost: no team size or make-up, roles, hours, person-weeks, day rates, vendor costs or margin, because headcount and time let them work out what the work costs us. The deck, the email and the PDF show only what they pay and one delivery time from signing to go-live.

A demo spends at most USD 0.50 on voices, faces and generation, counted across every take and every lane, and more needs Hasan's yes first. Aim to have the pitch ready within one working day of Hasan's yes to the brief.

## Who builds

| Work | Model |
| --- | --- |
| The brief, Ava's prompt, the final read before showing, and every gap a lane returns | Opus 5.5 high, the lead |
| Gathering research facts with sources, and the fact check | GPT-6 Luna xhigh, or Haiku 5.5 high when it needs Q9 Brain |
| The pages, the product journey's screens, and the deck layout from the brief's words | Sonnet 5.5 xhigh |
| Cutting the video | Sonnet 5.5 medium |
| Deploying, running the acceptance cases and the pre-send check, recording takes, the PDF, the Gmail draft, the Brain log | Haiku 5.5 high |
