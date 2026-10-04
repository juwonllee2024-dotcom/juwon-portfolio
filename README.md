# JUWON — The Work

Independent public portfolio. Source belongs in **juwonllee2024-dotcom/juwon-portfolio**; hosting belongs in the owner's **Cloudflare account**, using **Workers Static Assets**. No ChatGPT Sites manifest, database, paid AI API, or ChatGPT-hosted runtime is required. No private conversation export is included.

## Run and verify

```sh
npm ci
npm test
npm run dev
npm run check:deploy
```

Local preview chooses a free loopback port, without interrupting other projects. All public descriptions are in `public/catalog.mjs`. The 119 records include project families, workflow components, experiments and ambitions, not 119 finished products. External open-source integrations and family collaboration are credited separately. Audit-based status is not an uptime or completion guarantee.

## First deployment from your account

```sh
npx wrangler login
npm run deploy
```

Wrangler prints the real deployment URL after successful publication. No deployment URL or custom domain is claimed in advance. `out/` contains only public assets; never publish the repository root, private files or credentials.

## GitHub integration — Cloudflare Workers Builds

In your Cloudflare account, open Workers & Pages, select `juwon-portfolio`, then Settings > Builds and connect `juwonllee2024-dotcom/juwon-portfolio`. If GitHub authorization is requested, review it and select only this repository.

- Production branch: `main`
- Root directory: repository root
- Build command: `npm test && npm run build`
- Deploy command: `npx wrangler deploy`

This integration is not active merely because configuration exists in GitHub; it requires a successful account-side connection. Once connected, push to `main` to trigger the configured Cloudflare build.

Official docs: [GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/) · [Static Assets](https://developers.cloudflare.com/workers/static-assets/get-started/)

No subscription upgrades or domain purchases are part of this project. A `workers.dev` URL belongs to the Cloudflare account's namespace; a custom personal domain can be connected later if the owner already has one.
