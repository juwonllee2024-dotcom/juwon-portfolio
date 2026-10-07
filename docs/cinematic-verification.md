# Cinematic verification — 2026-10-06

Status: local implementation verified; independent whole-branch review completed, its one Important finding fixed with RED/GREEN regression and a fresh full suite. Integration choice and publication pending. This is not a deployment-completion claim.

## Automated evidence

- Baseline: 9 tests. Current suite: 32 tests, 32 PASS, 0 FAIL.
- RED/GREEN observed for story sampling, grapheme fallback, dependency provenance, renderer lifecycle/quality, accessible markup, scroll lifecycle, complete module graph and private fixture routes.
- Reproduced and fixed: duplicate renderer on pageshow; portrait screenshot outside the horizontal camera frustum; private-path guard missing ordinary/escaped Windows paths.
- Browser regression probes: missing Segmenter produced 27 split descendants instead of whole-text fade, then 0 after guard; short-height panel content 512px exceeded 450px, then panel/content both 713px in normal document flow after the fix.
- Conservative gzip total for all 11 public JavaScript modules, including high-quality postprocessing: 287,041 bytes, below the 614,400-byte target. This is a transfer-size estimate using Node gzip, not a network speed promise. The vendor-only base number without optional postprocessing was 244,827 bytes.
- Complete import check exercises root URLs and the GitHub Pages repository prefix. Build allowlist contains exactly 40 public files; docs, fixtures, private captures and local installs are excluded.
- Existing catalog and evidence preserved: 123 records, 26 exhibition items, 24 photographed works, 25 images. `local-chat` and `openhands` retain missing-capture explanations.

## Browser evidence

Observed real Three.js geometry/camera, image planes, typing/word reveals, orbit connections, KRAUDE reveal and reversed scrolling in the in-app browser. Independent named agent-browser Chrome session was also used; it does not share the user's existing profile or tabs.

- Desktop: 1280x720, 1440x900; independent Chrome capture 1254x620.
- Mobile: 360x780; document width 345px including scrollbar allowance, no horizontal overflow.
- Zoom-equivalent layout: 720x450, corresponding to available CSS space at 200% of 1440x900. Native zoom shortcut had no effect in the in-app surface, so actual native-browser 200% zoom was not verified.
- Private performance fixture: mean of 120 animation-frame intervals after 2 seconds of warm-up was 16.67ms in the independent local Chrome session. This is one local page/rAF measurement, not a guarantee of 60fps across browsers, GPUs or every scene.
- Search: KRAUDE yields 1 exhibition item; clearing restores 26. Second Brain yields 2 catalog items; clearing restores 123. Grid/list switch works.
- Modal opens with the correct KRAUDE title and background lock; Escape closes it. `/` focuses catalog search.
- Motion toggle removes clones (0), releases the controller and restores readable originals; enabling returns to motion-ready. Lifecycle tests cover hidden tabs, dialogs, delayed dependencies and repeated stop.
- Final review found Lenis.stop() blocking desktop wheel input outside the journey. Regression failed before the fix (ticker size 0 instead of 1), then passed. Scroll clock stays active outside the journey; GPU updates stop. Fine-pointer private Chrome deep-link test at #projects moved from scrollY 14,914 to 15,514 using scroll input, then back to 3,514 inside the journey with motion-ready preserved. Node regression also checks modal suspension and disposal. No second reviewer was dispatched; no deferred minors or declined-to-judge items.

## Failure fixtures

These are private response transformations, not public app backdoors. They are served only by `tests/browser-fixtures.mjs` on a temporary loopback port.

- Reduced motion: no animated clones, static content, motion toggle disabled.
- Denied localStorage: graphics initializes without reading or transmitting any existing browser storage.
- Missing Intl.Segmenter: graphics initializes; full text fades without split descendants. Fixture deletes the missing property to match an unsupported browser, rather than leaving a broken undefined constructor property.
- WebGL unavailable / failed motion module / actual context loss: motion-off, 0 clones, all 3 core images remain in HTML.
- Failed 3D texture: transitions to readable static fallback after entering the constellation.
- No JavaScript: 0 scripts and 3 readable core titles/images remain. Dynamic catalog search requires JavaScript, as stated on the page.
- Fixture server refuses repository/config files and encoded traversal requests.

## Decisions and limits

- Native app worktree creation selected the parent repo, so implementation uses an ignored isolated Git worktree of the actual portfolio. The unused app-created parent worktree is pinned/protected and was left unchanged; it consumes some disk space but no original project files were deleted.
- GSAP's npm package has no standalone LICENSE. Original copyright/terms notice and official standard-license URL are preserved. Reuse in other products needs its own license review.
- A non-public standard-library module audit CLI was added for reproducible verification; this adds one maintenance script.
- Public deployment waits until after independent review, rather than shipping before review. This delays release, not the original live site's availability.
- Native browser zoom remains unverified; zoom-equivalent content-space testing is explicitly distinguished above.
- Captures are presentation evidence, not verification that each project backend is connected. Symbolic 3D groups are not live applications or completed system integration.
- No new paid service, runtime AI, server backend, account permission or domain setting was added. No claim of world-first, world-best or perpetual free/unlimited hosting is made.

## Deployment gate

Run the full tests/build/diff check, finish independent review, then publish only the reviewed commit through the owner's existing Git integration. Confirm Cloudflare Pages, Workers Builds and GitHub Pages and the corresponding public files before changing this status to published. Preserve unrelated services and remove only this task's temporary processes.
