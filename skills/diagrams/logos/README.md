# Shared brand logos

Reusable assets for diagrams and finance dashboards. Filenames are stable vendor keys, not project-specific paths. `sources.json` records where each asset came from, retrieval dates where known, and adaptations. Older cached files have unknown upstream provenance; their local source is recorded honestly.

Prefer Svgl (`https://svgl.app/docs/api`) for new SVGs, then a vendor's official website. Keep SVGs self-contained: no scripts, event handlers, foreign objects or external image/font references. Record the source and any change in `sources.json`. Preview the actual asset against the intended background before using it.

- Use `readai-mark.svg` at icon sizes; `readai.svg` is its full wordmark. The mark is a viewport crop of the official asset, with paths unchanged.
- `telnyx.svg` uses a dark monochrome fill for light backgrounds; its source was light-on-dark.
- Use `outlook.svg` for Hotmail, `apple.svg` for Apple Developer, and `openai.svg` for ChatGPT.
- Cloudflare WARP+ uses `cloudflare.svg`; the Warp terminal is a different product.
- Account qualifiers do not change the vendor: both Ultravox accounts use `ultravox.svg`, for example.

These are reference assets, not an executable tool. Reading this folder does not perform downloads or other network calls. Keep visible vendor labels alongside icons and embed the selected assets in portable HTML output. Trademark ownership stays with the respective vendors; this cache does not grant additional usage rights.
