# Google Play: via gplay

`gplay` (tamtom) is the primary tool. Update before serious work (`brew upgrade tamtom/tap/gplay`), check with `gplay auth doctor --output json`. Auth is a Google Cloud service account, and setup has two halves that both must exist: the GCP side (service account created, Google Play Android Developer API enabled) *and* the Play Console side (the service account granted app access under Users and permissions) — API enablement alone silently gives you 403s. Store the JSON as a ref (`env:GOOGLE_APPLICATION_CREDENTIALS`), never inline. When `gplay` lacks coverage, fall back to the Android Publisher API v3 directly (scope `https://www.googleapis.com/auth/androidpublisher`); for Gradle-native projects, Gradle Play Publisher is a mature alternative. `gplay docs` answers command-discovery questions from the binary itself. Flags rename between releases (`preflight --bundle` became `--file`) and help text can advertise flags the binary rejects (`images sync --dry-run`) — trust each subcommand's `--help` over this file, and verify dry-run support per command before relying on it. The CLI ships a companion skill pack (`tamtom/gplay-cli-skills`) for metadata, screenshots, IAP, and rollout work — register the skills you need in your skill manager (skillbox here) rather than installing them into an agent's global skills directory.

## Tracks: resolve names before every call

User-facing track names are not API track names. "Open testing" is `beta` in the API/CLI; "internal testing" is `internal`; closed tracks have custom names that must match Play Console exactly. Always inspect actual tracks inside an edit (`gplay tracks get`) before updating one — never pass a user's phrasing straight through.

## Flow

```bash
gplay preflight --file <aab>                         # offline artifact checks
gplay publish track --package <pkg> --track <track> --bundle <aab>   # high-level path
# or explicit edit lifecycle when you need control:
gplay edits create --package <pkg> --output json
gplay bundles upload --package <pkg> --edit <id> --file <aab>
gplay tracks update --package <pkg> --edit <id> --track <track> --releases <json>
gplay edits validate --package <pkg> --edit <id>
gplay edits commit --package <pkg> --edit <id>       # the point of no return
gplay status --package <pkg>                         # verify track state after; --watch polls
```

One edit per coherent release; validate before commit; commit is the store mutation. There is no App Store-style public review lifecycle to poll — after commit, poll *track state* (`gplay status --watch`), and expect propagation delay before testers see anything. For getting a build onto a device fast with no review at all, `gplay internal-sharing` uploads to a shareable test link.

## Gotchas (all field-tested)

- First production release: production countries/regions must be set in Play Console first — the API can only commit a `completed` release after targeting exists, may reject `countryTargeting` on completed releases, and may not support a staged `inProgress` first release. Set countries in console, send that change for review, then retry via API.
- Play Console can show an open-testing track as paused/inactive while the API reports a `beta` release with `status: completed`. Resume the track in Play Console, then send the change for review.
- Internal testing links 404 while the internal track only has a draft release, even with tester lists selected.
- Special permissions (e.g. `FOREGROUND_SERVICE_MICROPHONE`) require a console declaration with a *public* demo-video URL showing the in-app justification — the field only appears after selecting the service type, and save stays disabled without it. Budget for recording *and hosting* one — any public URL works, and a Drive share link avoids fragile YouTube upload automation.
- Inspect the built AAB's merged manifest before upload — Expo/dependency plugins can add permissions (overlay, legacy external storage) that never appear in source, and unused ones get releases withheld.
- New personal developer accounts must run a closed test with a minimum tester count over a multi-week window before production access — check the current requirement on Play policy pages before promising a production date.
- Notification-only email addresses go under Users and permissions > Email recipients; they don't need console access.
- Any changed AAB needs a new `versionCode` — uploads reusing a code are rejected.
- Listing graphics (icon, screenshots, feature graphic) don't display until the committed change is sent for review and approved; with managed publishing on, approved changes sit in "ready to publish" until manually published.

## Console boundary

API-covered: edits, bundle upload, listings, images, release notes, tracks/rollouts, testers, and data safety declarations (`gplay data-safety`). Web-only — browser automation or human: app creation, content rating questionnaire, target audience, ads declaration, privacy policy URL field, sensitive-permission declarations; `gplay web` opens the right console page for these. Owner-only: developer account creation, Play App Signing enrollment, service-account grants, payments/agreements.

## Readiness judgment points

Data Safety answers that don't match the SDKs and network calls actually in the build are the top rejection driver — audit against reality, not intention. Account creation requires both in-app deletion *and* a public web deletion URL. Target API level must meet the current requirement (it ratchets yearly). Tester/reviewer instructions must cover login, region locks, and paid features — and creating the reviewer account itself can demand phone/device verification, a human checkpoint.
