# Portfolio maintenance

- This repository is JUWON's independent public portfolio. Preserve unrelated projects, servers, files and user changes.
- The owner approved GitHub Pages as the primary host. Keep the existing Cloudflare site as a working mirror; do not delete it or publish to ChatGPT Sites as a substitute. Source remains in this GitHub repository.
- Keep the current static-only, free-plan architecture. Do not add paid services, subscriptions, domains, runtime AI APIs, databases or server code without explicit approval and a fresh cost review.
- All public assets live in `public/`. Build only these assets into `out/`; never publish the repository root, credentials, conversation exports or local paths.
- Project descriptions, tags, evidence and status: `public/catalog.mjs`. Hero, biography and social links: `public/index.html`. Styling: `public/style.css`. Search and dialogs: `public/app.mjs`.
- Preserve stable project IDs, credit external integrations and collaborators, and do not invent completion percentages, links or achievements.
- Use `apply_patch` for source edits. Use RTK-prefixed shell commands in the owner's environment and the caveman skill when available.
- Run `npm test` and `npm run build` before committing requested changes. Inspect the exact diff and stage only task files.
- Pushing `main` triggers Cloudflare tests, build and deployment. Confirm the corresponding Workers Builds check succeeds and verify the live site before claiming a change is published.
- `.github/workflows/pages.yml` deploys the tested `out/` directory to GitHub Pages when public assets, build code, tests or the workflow change. Confirm its build/deploy jobs and verify the public Pages site, including search/dialogs, before claiming publication.
- Keep local asset URLs relative so both the repository-prefix Pages URL and the root Cloudflare URL work. Do not add a CNAME or custom domain until its registration, privacy terms and DNS control have been verified and approved. Never disclose the owner's home address or personal identity data to a domain provider without specific informed approval.
- Always pass `--config wrangler.jsonc` for direct Wrangler deployment. A parent workspace may contain unrelated deployment configuration.
- Never use destructive Git resets, stop unrelated localhost servers, expand permissions, or modify account security settings without specific authority.
- Keep build credentials inside Cloudflare. Do not read, print or commit their secret values. Current build token uses Workers Scripts edit and account/user metadata read permissions only.
- Read README.md for editing instructions, deployment settings and the limits of free hosting. Static requests being free and unlimited does not mean unlimited builds, file sizes, runtime services or a permanent pricing guarantee.
