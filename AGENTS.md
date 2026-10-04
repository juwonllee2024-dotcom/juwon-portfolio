# Portfolio maintenance

- This repository is JUWON's independent public portfolio. Preserve unrelated projects, servers, files and user changes.
- The owner approved Cloudflare Pages at `https://jupt.pages.dev/` as the primary host. Keep GitHub Pages and the existing Cloudflare Workers site as working mirrors; do not delete them or publish to ChatGPT Sites as a substitute. Source remains in this GitHub repository.
- Keep the current static-only, free-plan architecture. Do not add paid services, subscriptions, domains, runtime AI APIs, databases or server code without explicit approval and a fresh cost review.
- All public assets live in `public/`. Build only these assets into `out/`; never publish the repository root, credentials, conversation exports or local paths.
- Project descriptions, tags, evidence and status: `public/catalog.mjs`. Hero, biography and social links: `public/index.html`. Styling: `public/style.css`. Search and dialogs: `public/app.mjs`.
- Preserve stable project IDs, credit external integrations and collaborators, and do not invent completion percentages, links or achievements.
- Use `apply_patch` for source edits. Use RTK-prefixed shell commands in the owner's environment and the caveman skill when available.
- Run `npm test` and `npm run build` before committing requested changes. Inspect the exact diff and stage only task files.
- Pushing `main` triggers Cloudflare Pages and Workers tests, build and deployment. Confirm the corresponding Pages and Workers Builds checks succeed and verify the live sites before claiming a change is published.
- Cloudflare Pages project `jupt` is Git-integrated with this repository. Build settings: repository root, framework None, `npm test && npm run build`, output `out`, `NODE_VERSION=24`, `SKIP_DEPENDENCY_INSTALL=true`. Tests and the static build require only Node standard libraries. Do not skip dependency installation if future build code starts needing packages.
- Preserve `wrangler.jsonc` as the existing Workers configuration. Pages uses dashboard build settings; do not repurpose this file or widen the owner's CLI token permissions to deploy Pages.
- `.github/workflows/pages.yml` deploys the tested `out/` directory to GitHub Pages when public assets, build code, tests or the workflow change. Confirm its build/deploy jobs and verify the public Pages site, including search/dialogs, before claiming publication.
- Keep local asset URLs relative so both the repository-prefix Pages URL and the root Cloudflare URL work. Do not add a CNAME or custom domain until its registration, privacy terms and DNS control have been verified and approved. Never disclose the owner's home address or personal identity data to a domain provider without specific informed approval.
- Always pass `--config wrangler.jsonc` for direct Wrangler deployment. A parent workspace may contain unrelated deployment configuration.
- Never use destructive Git resets, stop unrelated localhost servers, expand permissions, or modify account security settings without specific authority.
- Keep build credentials inside Cloudflare. Do not read, print or commit their secret values. Current build token uses Workers Scripts edit and account/user metadata read permissions only.
- Read README.md for editing instructions, deployment settings and the limits of free hosting. Static requests being free and unlimited does not mean unlimited builds, file sizes, runtime services or a permanent pricing guarantee.
