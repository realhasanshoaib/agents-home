# Shared brand logos

Reusable assets for diagrams and finance dashboards, including our own applications. Filenames identify brands independently of example projects. `sources.json` records where each asset came from, retrieval dates where known, and adaptations. Older cached files have unknown upstream provenance; their local source is recorded honestly.

For our own products, consult `own-apps.json` first. It maps application names to the selected files and explicitly records shared branding or missing logos. Source our artwork from its application or maintained brand assets. Keep native PNG/WebP files as such instead of pretending they are vector SVGs. Starter-framework icons and generic deck pictograms are not verified product logos.

The static sequence renderer accepts a bare SVG key (`logo: 'aws'`) or an explicit filename (`logo: 'murmur.png'`, `logo: 'ava.webp'`). `logoBase` selects the containing directory. Use a wordmark where it has room and an app icon at small sizes. `chalk.svg` remains the original diagram reference mark; `chalk-wordmark.webp` is the newer deck wordmark. Track has both an icon and a wordmark.

Prefer Svgl (`https://svgl.app/docs/api`) for new SVGs, then a vendor's official website. Keep SVGs self-contained: no scripts, event handlers, foreign objects or external image/font references. Record the source and any change in `sources.json`. Preview the actual asset against the intended background before using it.

- Use `readai-mark.svg` at icon sizes; `readai.svg` is its full wordmark. The mark is a viewport crop of the official asset, with paths unchanged.
- `telnyx.svg` uses a dark monochrome fill for light backgrounds; its source was light-on-dark.
- Use `outlook.svg` for Hotmail, `apple.svg` for Apple Developer, and `openai.svg` for ChatGPT.
- Cloudflare WARP+ uses `cloudflare.svg`; the Warp terminal is a different product.
- Account qualifiers do not change the vendor: both Ultravox accounts use `ultravox.svg`, for example.
- `kaadr.png` is the current hand-shaped Kaadr wordmark, white on transparency. Use a dark surface or the application's `currentColor` CSS-mask treatment. The older thin-letter talent-marketplace deck logo is superseded.

These are reference assets, not an executable tool. Reading this folder does not perform downloads or other network calls. Keep visible vendor labels alongside icons and embed the selected assets in portable HTML output. Trademark ownership stays with the respective vendors; this cache does not grant additional usage rights.
