# Continuous world verification — 2026-10-08

Local branch only. Integration and publication await the owner's choice.

## Approved scope

Keep the complex lit 3D, but remove chapter-based teleporting and sudden asset appearances. Fixed exhibition stations share one world; a camera travels between them in either direction. Preserve catalog evidence, readable typography, screenshots, performance protection and reduced-motion support.

## Implementation

- Fixed work stations at x=14/30/46, convergence at 58, core stations at 70/90/110. Camera and aim follow a continuous route; late rapid scroll changes are damped and capped at 120 world units/sec. Fresh deep-link initialization starts at its requested station rather than flying through the entire site.
- Sculptures no longer toggle existence at chapter boundaries. Ambient rotations still depend on time; fixed anchor coordinates and route sampling are reversible, not pixel-identical pictures at different times.
- Images preload neighboring stations, fade in over 0.45s, and fade out over 0.3s before cache eviction. Low/high limits remain 4/8 textures, 350/1200 points and DPR 1/1.5. Downgrades retain nearest images instead of removing the current one. Memory images remain dim; station screens occupy the right-hand reading-safe area.
- Once successfully enhanced, motion-layout retains document geometry during manual/automatic fallback and live reduced-motion changes. Initial no-JS/reduced-motion documents remain compact. GPU resources are still released; protection is not bypassed.
- Measured in-app cadence was about 30fps (33.20ms). The former 32ms rule shut off even bounded low quality at that normal browser cadence. High quality still reduces above 32ms; low quality shuts off only after two complete 120-frame windows averaging over 50ms, with the existing 2s warm-up/hidden-time guards. This is an observed-browser policy correction, not a universal FPS, GPU or thermal guarantee.

## Evidence

- Baseline: 35/35 tests. Current: 44/44. RED/GREEN observed for fixed camera stations, stable sculpture coordinates, late texture opacity, fading cache eviction, large/reversed scroll tracking, fallback layout state, nearest-image retention, reading-column projection and keeping usable 30fps low quality. Existing serious-slow-frame shutdown tests remain green.
- Build and whole-module audit pass: 11 modules, 92 local import requests, approximately 289 KiB gzip or less against the 600 KiB budget. Public file allowlist remains 40 files; no fixture, private capture or document is published.
- In-app browser 1280x720: normal fallback originally shrank journey height from 10421.40px to 6182.88px. After the fix, height stayed 10421.40px and scrollY stayed 4769px across disabling graphics.
- Mobile 360x780: height stayed 9245.5px; scrollY differed only by 0.5px rounding; no horizontal overflow. Viewport override reset afterward.
- Private reduced-live fixture simulates the media event and activates actual reduced-motion CSS while retaining compound width/height conditions. It does not change OS preferences. RED: established height 10421.40px fell to 6082.20px. GREEN: height remained 10421.40px, graphics stopped and the toggle became disabled. Mobile retained 9245.5px with no overflow when toggling the simulated preference.
- Real lit sculptures and artwork screens were visually inspected in their shared spatial route. Initial browser CLI connection attempts failed; the in-app browser was used for real observations instead. Those failed attempts are not counted as verification.

## Independent review

Read-only review of c497611..facb74f found no Critical defects, one Important downgrade-eviction issue and one reduced-motion-layout issue labeled Minor. The first was reproduced and fixed. The latter was treated as user-visible motion continuity, reproduced in the actual CSS fixture and fixed rather than deferred. No outstanding reviewer minor remains.

The reviewer declined to judge laptop thermals/GPU stability, actual bloom rendering, visual polish, deployment and full build/audit. Root performed the build/audit and real browser visual checks. Exact color fidelity, physical hardware stability/thermals and every device remain unproven. Publication has not occurred for this revision.

The verification fixture can restart requests during rapid reversals; stale completions dispose their textures and no unbounded GPU leak was found. Nothing here claims a perfectly uninterrupted experience under network loss, lost GPU context or all possible hardware conditions.
