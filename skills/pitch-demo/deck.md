# The proposal deck

The deck makes one argument, in the order the buyer decides: what changes for them, the proof, what is real and what is proposed, and the one next step. Its words come from the brief, so a builder lays them out and doesn't write new claims; a gap goes back to the lead.

## Start from a template

Never design a deck from a blank page. Copy the finished example closest to the case from `/Users/macmini/code/pitch-kit/decks/` and change its words and pictures:

| Template | When | Slides |
| --- | --- | --- |
| `cold-voice-agent` | They haven't met us, and we show Ava on their own site. | at most 6 |
| `warm-workflow` | We met them and built a concept of their workflow. | at most 9 |
| `rfq-response` | We reply to a tender or a request for a quote. | as the RFQ needs |

Copy the example's folder to the demo repo's `public/proposal/` and `decks/kit/` to `public/kit/`, so its `../kit/` links keep working. Then follow `decks/README.md` there: it lists what to change, the eight slide layouts and the job each one does, and the text limits. Read the template's `NOTES.md` first, because it says why each slide exists and what changes for a new prospect. When the kit needs a fix or a new layout, make it in pitch-kit, so the next deck gets it too.

## Words

The text limits in `decks/README.md` hold on every slide: a headline of at most 10 words, at most 30 words of body, a proof caption of at most 12 words, and at most 3 cards. Anything longer goes in the meeting notes. The deck states what we understood and what we built as fact. Doubts, unknowns and requests for correction go in the meeting notes, and the slide on what is real and what is proposed is where the limits show.

## Pictures and demos

- Every picture is real and reusable, with its source and licence in `img/CREDITS.md`, and every screenshot shows the current product while it works, never a test screen or a marketing home page. Product text in a proof capture must be readable at 1440 px and at 390 px.
- Each demo plays on its slide and loads only when its slide comes up, with a labelled button such as "Open the live site" next to it and one line saying it is live. The kit passes the access key from the deck's link to every button marked `data-demo`, so the prospect never meets a key prompt.

## Proof

Show a past project only when it proves we can handle this buyer's specific risk, with a real screenshot and an outcome, and say whether it was a demo or is live. Edli (LMS-School), our main traction product, is the first candidate for a school. Name clients only as the Q9 Brain's client-naming note allows (`get` with `{"id": "canon:facts/q9-deck-client-naming"}`), and describe the rest by industry and country.

## Commercials and the next step

- **The offer.** Show only the offer in the brief: the setup fee, paid in full upfront on signing and never split, the monthly fee and what it includes, usage above that, and the delivery time, under one "Tentative, depends on the final scope" note. Leave out the first-year total. When the full build isn't scoped, show the brief's bounded first phase instead.
- **The next step.** The last slide asks for the brief's one dated next step, the same one the email asks for, with a working reply link to the relationship owner. Show both logos. Hasan's name and photo stay off it.

## Before it goes

Done when the contact sheets from the pre-send check show every slide readable at 1440 × 900 and 390 px with every picture whole, the proof buttons open the live demo without a key prompt, the print layout works, and one live call started from inside the deck on a phone has run. Check another window size only to chase a problem you've seen.
