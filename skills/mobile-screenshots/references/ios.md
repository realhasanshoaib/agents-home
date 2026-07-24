# iOS: simulator capture and asc upload

`asc screenshots sizes` prints the live accepted-dimension matrix (default shows the sufficient sets; `--all` for the full device grid) — trust it over any written table. Then pick a simulator whose native output lands in an accepted bucket and confirm with `sips -g pixelWidth -g pixelHeight` on a test shot before capturing a full set. The mapping that holds today:

- iPhone 17 Pro Max / 16 Pro Max → 1320×2868 (6.9", the required set)
- iPhone 15 / 14 Pro Max → 1290×2796 (also 6.9")
- iPad Pro 13" / iPad Air 13" → 2064×2752 (the required iPad set)
- Trap: a plain iPhone 16/17 Pro is a 6.3" screen — its captures match *no* accepted bucket.

## Capture

```bash
xcrun simctl boot "iPhone 17 Pro Max"
xcrun simctl bootstatus "iPhone 17 Pro Max" -b        # overrides silently fail mid-boot
xcrun simctl status_bar booted override --time "9:41" \
  --dataNetwork wifi --wifiMode active --wifiBars 3 \
  --cellularMode active --cellularBars 4 \
  --batteryState charged --batteryLevel 100           # charged, not charging
xcrun simctl io booted screenshot shot.png            # never a macOS window capture
xcrun simctl status_bar booted clear
```

Install the app first — `npx expo run:ios --device "iPhone 17 Pro Max" --configuration Release` for Expo/RN, `xcodebuild` then `simctl install`/`simctl launch` otherwise. Driving to each state is scriptable too: deep links (`simctl openurl booted <url>`) when the app has them, an `asc screenshots run` JSON plan (launch/tap/type/wait/screenshot actions), or a Maestro flow for anything longer. Simulator PNGs come out Display P3, sometimes with alpha; if upload complains, convert to sRGB and strip alpha (`sips --matchTo '/System/Library/ColorSync/Profiles/sRGB Profile.icc'`, ImageMagick `-alpha off`).

## Validate and upload

`asc screenshots validate --path <dir> --device-type IPHONE_69` preflights dimensions, hidden files, and ordering locally; then `asc screenshots upload` per localization (or `--app`/`--version` to fan out). The experimental `asc screenshots capture/frame/review/plan/apply` pipeline automates the whole loop including device framing — worth trying, but it's labeled experimental, so keep the manual path above as fallback. For heavy multi-locale or resize/color work, the companion pack's `asc-shots-pipeline` and `asc-screenshot-resize` skills go deeper.

## Icon and previews

The App Store icon is the 1024×1024 asset-catalog entry inside the binary — opaque, no alpha (alpha fails upload validation). Nothing in App Store Connect changes it; ship a new build and expect up to ~24h storefront propagation after release. App preview videos are optional: 15–30s real screen recordings (`xcrun simctl io booted recordVideo`), up to 3 per size, managed via `asc video-previews`.
