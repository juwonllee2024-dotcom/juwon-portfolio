# Luminous exhibition — 2026-10-07

Local implementation only. Main integration and publication await the owner's choice.

## Scope and evidence

Retain complex 3D; make structure tangible with reflective metal surfaces, selective roof/neuron emission, a procedural 128×64 studio panorama, hemisphere/key/fill/rim lighting and larger sculptures. No paid dependency, model download, global configuration or unrelated service changed. These are symbolic portfolio sculptures, not actual project backends or photorealistic replicas.

Typography, description contrast, capture captions and exhibition spacing increased. Existing catalog, evidence, search, motion toggle, static fallback and screenshots remain intact.

- Baseline 32 tests passed; final 35/35 passed. Three new regressions observed RED then GREEN: lighting/environment disposal, high-to-low clearcoat reduction, desktop origin sculpture occupying at least 200px without horizontal cropping.
- Build passes. Module audit: 11 modules, 92 local imports, 287886 gzip bytes. Vendor provenance unchanged.
- Actual private Chrome: desktop 1254×620 and 1440×900; mobile 360×780. Studio reflection, KRAUDE sculpture, screenshot and readable text visually inspected. Mobile document has no horizontal overflow; description is 16px.
- 120 requestAnimationFrame intervals in the visible mobile-sized KRAUDE scene averaged 17.08ms. One local browser sample, not a hardware-independent frame-rate or GPU guarantee. No shadow-map passes added; existing DPR/particle/texture budgets preserved.
- Initial browser startup/scroll attempts timed out and a capture was blank. A fresh fixture/server session rendered correctly. Do not treat these initial failures as successful verification or as proof of a confirmed GPU defect.

## Independent review and limits

Read-only independent review of 1a98e69..c90e915: no Critical or confirmed Important findings. Minor clearcoat retention on automatic downgrade reproduced and fixed with regression. No unresolved reviewer minor remains.

Reviewer declined to judge actual compositor/color fidelity, mobile overlap/framing and GPU timing from mocked tests. Root subsequently inspected real desktop/mobile captures and sampled frame intervals. Full color calibration, every scene/device framing and universal GPU budgets remain unproven; release makes no such guarantees. Physical rendering, environment preprocessing and reflections can still cost more than the prior flat materials. Automatic downgrade now removes clearcoat as well as existing bloom/budget reductions.

New work is isolated in codex/luminous-exhibition. No public publication has occurred for this revision.
