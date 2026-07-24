---
name: mobile-submission
description: "iOS/Android submission to App Store and Google Play. Use when reviewing, submitting, publishing, or releasing a mobile app, working on a store listing, handling a store rejection, or checking release status."
license: MIT
---

# Mobile Submission

Prefer the CLIs for most tasks and fall back to browser automation only when necessary:
- App Store Connect `asc` (`references/apple.md`) 
- Google Play `gplay` (`references/google.md`).

Fetch the state from the store (`asc status`, `gplay status`) and trust what it says over anything written down earlier.

## Discovery

Starting points: bundle ID and package name, framework and build system, permissions and their purpose strings, auth and account deletion, payments, UGC/AI surfaces, privacy/support/terms URLs, existing store assets; let what you find lead the rest. Then judge the app the way a reviewer will, against the current official policy pages (App Review Guidelines, Play policy center) for the app's actual risk surfaces — payments, kids, health, UGC, AI, tracking — not a generic checklist. Report what would likely get it rejected and fix with the user's approval before spending time on store plumbing. Then work through records, listing, build, upload, testing, and submission per the store references.

## Update

Read the diff since the last released version to classify the release, semantically bump the version across all surfaces (don't forget to update CFBundleVersion/versionCode), write release notes from what actually changed, build, upload, and submit. Listing, privacy answers, and declarations usually carry over — touch them only when the changes altered behavior they describe (new permissions, new data collection, new SDKs).

## Rejection

Read the rejection notice precisely. Apple cites numbered guidelines — the number is an index into the current App Review Guidelines page; Google cites policy names that map to Play policy pages. Fetch the cited text, and web-search the exact citation for current community experience before theorizing. Diagnose against the app's real behavior, fix, and resubmit. Mechanics that matter: a metadata-rejected Apple status means you can fix listing/review info and resubmit without a new binary; the resolution center is a conversation — you can reply, ask the reviewer questions, or contest a misunderstanding before changing anything; Apple 4.3 (spam/design) is about product positioning, not code, and a well-argued reply sometimes beats rebuilding. When the API's rejection detail is thin, `asc web review` (experimental) can pull reviewer messages that only surface in web sessions.