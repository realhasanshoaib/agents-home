---
name: pitch-demo
description: Use when Hasan asks to build a demo to pitch a company, such as cloning their website with a live Ava voice agent on it (like OnTime), or rebuilding their application with Flow (like Mercury).
disable-model-invocation: true
---

# Build a demo for a prospect

A pitch exists to get the decision maker to reply and take one next step. We put our product to work on a piece of the prospect's own world, deploy it on `<prospect>.q9labs.ai`, record a short video when asked, and wrap it in an HTML deck at `/proposal/`, which is the one link we send. Every part is judged against `rubric.md`, and nothing goes out until each of its six areas scores 9 or more. The product decides the build steps: `ava.md` for a voice agent on their website, `flow.md` for a voice guide that fills their application. A run started from make-demo.q9labs.ai also follows `make-demo.md`.

1. **Research.** In one Q9 Brain `recall`, read the prospect's Relationship, any meeting recording or RFQ, and the related Canon. Then research their business from public sources: what they sell and to whom, what they already offer (hours, chat, WhatsApp, languages), their competitors, recent news, and who decides. For a cold prospect, add the proof from step 3 of `/Users/macmini/code/q9-pitch/docs/sales-workflow.md`; never run a reply-speed test on anyone we've met. Save every fact with its source in `research.md` in the demo repo.
2. **Write the brief** in `brief.md`: who decides and what they fear, their pain points strongest first with sources, the one moment the demo proves, what is real and what is only proposed, the one next step we ask for with a date, the deck's words slide by slide, and the ten scripted questions the demo must answer right. Done when Hasan has said yes to it. Builders work from the brief and don't invent claims, slides or asks that aren't in it.
3. **Rebuild only the pages the demo touches**, in their layout, colours, fonts, logo and images, from public sources and never their customers' data. Put a footer on every page: "Concept demo by Q9 Labs. Not affiliated with <company>." Add `noindex` and a preview card (title, description, image). Fix what a visitor would notice at 1440 px and 390 px, and stop there; spacing a buyer wouldn't see never holds up a pitch.
4. **Put the product in it, working live**, as the product file says. It must do the hard part from the brief, not only the intake.
5. **Deploy** it as its own Cloudflare Worker on `<prospect>.q9labs.ai`, with `workers_dev: false`. Before deploying, check every vendor account it calls has credit and allows calls (for Ultravox, `GET https://api.ultravox.ai/api/accounts/me` shows `allowedConcurrentCalls` above 0). Done when the link works on a phone outside the tailnet and the ten scripted questions get right answers.
6. **Record the video** only when it was asked for, as `rubric.md` section 6 says. Caption it once, burned in or as a caption file, never both. Put it on the demo site at `/journey/`. For OnTime, `/Users/macmini/code/ontime-site-clone/scratchpad/live-take-harness-2026-10-14/run.sh` recorded live takes with a generated visitor voice, and `/Users/macmini/code/ontime-journey-demo/combined/build.sh` cut them with captions and a music bed.
7. **Build the deck** at `/proposal/` on the same Worker, from the brief's words, as `deck.md` says, and apply the `squint` skill.
8. **Check the facts.** A lane lists every claim the deck, the email, the video and the agent's answers make about the prospect, their trade or us, and checks each against `research.md` and its source. Fix or cut every claim it can't back.
9. **Judge it.** A fresh lane that built nothing scores the pitch against `rubric.md` and lists what keeps each area below 9. Send the findings back to the lanes that built the work, then judge again. After three rounds, stop and show Hasan the scores and what's left.
10. **Write the email** with the `write-email` skill, from whoever owns the relationship. It carries the deck link and the brief's one next step. For a cold prospect, also use `reach-out` for their other channels. Whoever asked for the demo reviews the deck, the video and the email, and sends them.
11. **Check before it goes.** On the day of sending, start one real call from inside the deck on a phone, and read the email once more for the link and the ask. Do the same before every follow-up.
12. **Log it** in Q9 Brain in one `note`: the demo URL and the decisions as a Fact, the send as an Interaction once it went, and the dated follow-ups as Next actions.

Nothing the prospect sees shows our side of the cost: no team size or make-up, roles, hours, person-weeks, day rates, vendor costs or margin, because headcount and time let them work out what the work costs us. The deck, the email and the PDF show only what they pay and one delivery time from signing to go-live.

Show whoever asked for the demo the screenshots, the video, the deck and the judge's scores before step 10. Spend over 1 USD on voices, faces or generation needs Hasan's yes first. Aim to have the pitch ready within one working day of Hasan's yes to the brief.

## Who builds

Judgment happens once, up front, in the brief and the rubric, so the cheaper models can build against a precise target.

| Work | Model |
| --- | --- |
| The brief (pain, proof moment, the ask, the deck's words, the ten questions), Ava's prompt, and answering lanes | Opus 5.5 high, the lead |
| Gathering research facts with sources, and the fact check | GPT-6 Luna xhigh, or Haiku 5.5 high when it needs Q9 Brain |
| The pages, the deck layout from the brief's words, choosing and cutting the video take | Sonnet 5.5 medium |
| Deploying, the vendor and phone checks, recording takes, the PDF, the Gmail draft, the Brain log | Haiku 5.5 high |
| Judging against `rubric.md` | GPT-6.1 Sol xhigh, in a fresh lane that built nothing |
