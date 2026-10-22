# Ava: a voice agent on their website

Start from the OnTime build, `/Users/macmini/code/ontime-site-clone`, and read its README first. It is Astro 7 with an Ultravox agent that speaks through a Tavus stock face, with text chat as the second mode.

- **The agent.** Replace `src/data/site.ts` with the prospect's facts (services, prices, branches, contacts), and rewrite `src/lib/agent.ts` for their customers. Keep the tools `bookConsultation`, `openPage` and `hangUp`, and add the tool the brief's hard moment needs, such as a live fee lookup, so the demo shows it working instead of describing it.
- **When a vendor fails.** If a call can't start, the widget says the live call is unavailable right now and shows what the brief names instead: the video when one exists, otherwise a captured result. It never tells the visitor to check their connection. Test this state on purpose before deploying.
- **The voice.** Pick a voice per language with samples, the way `proof/voices/` did. For an Arabic audience the voice must say prices in words and sound local.
- **The face.** The widget opens as a voice call with no face. Add a Tavus stock face only when the demo asks for one. Hasan rejected Simli, LemonSlice and Anam on quality.
- **The widget.** Fix a widget problem once, in the widget's source, not in one demo. On a phone it opens as a bottom sheet. It has no empty gap, no band at rest, a neutral input border, and one brand colour.
- **Cost.** The OnTime clone never went public, so its guards assume a private link. Before deploying, put the routes that start a call or a face behind an access key carried in the link you send, Keep the 15-minute limit on one call. There is no daily cap. The Tavus free plan has 25 video minutes.
- **Deploy.** The OnTime clone used Astro's node adapter and wrote bookings to `data/leads.jsonl` on the Mac mini. On Cloudflare it needs the Cloudflare adapter, the keys as Worker secrets from 1Password, and Worker storage for the bookings. Done when a booking made on the live site can be read back.
