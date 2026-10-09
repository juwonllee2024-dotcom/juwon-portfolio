# Separate portfolio documents

Approved scope: the cinematic home ends at the giant JUWON signature. Exhibition, selected work, all project records and biography are separate static pages. Existing catalog IDs, photos, evidence labels and detail dialogs remain unchanged.

## Observed local verification

- HTTP regression initially failed because the exhibition still occupied home. After separation, all four destination documents and their shared navigation resolved successfully.
- Browser: home retained active 3D; End reached the giant JUWON finale with no collection beneath it. Finale link opened works.html.
- Exhibition rendered 26 cards. KRAUDE search returned one card; its dialog retained the screenshot, status, evidence and current-runtime disclaimer. 3D filter returned 9 exhibits.
- Selected work rendered 6 cards. Projects rendered 123 records; Token Saver search returned 2 records. Biography loaded without a canvas.
- Former home #projects bookmark redirected to projects.html. Four former section anchors share the same redirect mapping.
- At 390×844, the old mobile CSS hid three navigation links (RED). The two-row header displayed all four within the viewport without horizontal overflow (GREEN).
- No console errors were observed during these checks. Collection pages did not create a canvas. Temporary viewport override reset, agent preview tab closed, owned preview server stopped.
- Review follow-ups: independently titled documents now use h1 with the existing visual size. The real pre-initialization redirect code is exercised against the browser location boundary; inherited keys such as #constructor initially triggered invalid destinations (RED), then stopped after own-property validation (GREEN).
- Full suite: 46 tests passed. Static build passed. Whole-module audit: 11 modules, 92 requests, gzip total below 600 KiB. Root and repository-prefix asset checks cover all five documents.

## Boundaries

Local verification is not publication. No paid services, dependencies, account settings, public project data, or unrelated localhost servers changed. Browser checks do not guarantee all devices or hardware performance. Collections retain the existing JavaScript requirement for search and dialogs.
