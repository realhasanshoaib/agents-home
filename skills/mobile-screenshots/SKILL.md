---
name: mobile-screenshots
description: "Generate and upload App Store and Google Play listing media — screenshots, icons, feature graphics, previews — from simulators and emulators, no physical device needed. Use when creating or updating store screenshots, fixing wrong-size or rejected listing graphics, or when an uploaded icon or screenshot isn't showing."
license: MIT
---

# Mobile Screenshots

Capture natively at an accepted size instead of resizing: pick a simulator or emulator whose screen already matches a store-accepted dimension, clean the status bar, screenshot with the device tool (never a window capture), and the file is upload-ready. The specs are nitpicky — exact pixel pairs on Apple, aspect and alpha rules on Google — but all machine-checkable, so validate locally before uploading. Commands and device mappings: `references/ios.md`, `references/android.md`.

The requirement floor is smaller than most write-ups claim: Apple needs one iPhone 6.9" set (1–10 shots) plus one 13" iPad set if the app runs on iPad — it scales those to every other size. Play needs at least two screenshots, a 512×512 icon, and a 1024×500 feature graphic before a listing can publish.

What reviewers reject is mostly honesty, not pixels: screenshots that don't show the real app in use (no splash, login, or title cards), status-bar clutter (Play outright bans carrier names and notifications), promo text overwhelming the image, and frames or composites that misrepresent the app. Capture from the build you're submitting, not an older one — stale screenshots undercut even a metadata-only resubmission. Marketing composition — text, backgrounds, device bezels — is allowed on both stores over honest UI; compose with ImageMagick on top of validated captures (pass an explicit `-font`: the unset default errors on any annotation, even implicit labels), then re-validate dimensions.

## Uploaded but not showing

Apple's store icon isn't an upload at all — it ships inside the binary's asset catalog, so changing it means a new build, a new version, and a full review pass. On Play, listing-graphic changes only go live after being sent for review and approved (hours to days), and with managed publishing on, approved changes sit parked until someone publishes them. When art "won't update", check what was actually submitted before suspecting a caching bug.
