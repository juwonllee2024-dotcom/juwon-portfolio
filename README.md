# JUWON — The Work

Independent public portfolio. Source belongs in **juwonllee2024-dotcom/juwon-portfolio**. The owner approved **GitHub Pages** as the primary host, while preserving the existing **Cloudflare Workers Static Assets** site as a mirror. No ChatGPT Sites manifest, database, paid AI API, or ChatGPT-hosted runtime is required. No private conversation export is included.

## Public deployment

GitHub Pages target: [juwonllee2024-dotcom.github.io/juwon-portfolio/](https://juwonllee2024-dotcom.github.io/juwon-portfolio/). Check the latest successful [Pages workflow](https://github.com/juwonllee2024-dotcom/juwon-portfolio/actions/workflows/pages.yml) and the live URL before treating a change as published.

Existing live mirror: [juwon-portfolio.juwonllee2026.workers.dev](https://juwon-portfolio.juwonllee2026.workers.dev)

Source: [juwonllee2024-dotcom/juwon-portfolio](https://github.com/juwonllee2024-dotcom/juwon-portfolio)

Published to the owner's Cloudflare account on 2026-10-03 (America/Los_Angeles). Public assets return HTTP 200; repository metadata and private hosting configuration return HTTP 404. The owner's GitHub repository is connected to Cloudflare Workers Builds on production branch `main`.

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
- Deploy command: `npx wrangler deploy --config wrangler.jsonc`

The account-side connection is configured. A push to `main` triggers tests, the static build, and deployment. Preview branch builds are disabled to avoid unnecessary builds. Failed tests stop the build before deployment.

## 쉽게 수정하기

가장 쉬운 방법: Codex에 **"내 juwon-portfolio에서 ○○를 바꾸고, 테스트 후 GitHub에 반영해줘"**라고 요청하세요. 공개 파일 변경 사항이 `main`에 반영되면 GitHub Pages와 기존 Cloudflare 사이트에 자동 배포됩니다. 노트북이나 localhost 서버를 켜둘 필요는 없습니다.

직접 수정하려면 GitHub에서 해당 파일을 열고 연필 버튼(Edit)을 누른 뒤, 변경 내용을 `main`에 커밋하세요. 코드 편집과 테스트가 필요하며, 화면에서 바로 내용을 바꾸는 CMS는 아닙니다.

- 프로젝트 이름·소개·상태·링크: [public/catalog.mjs](https://github.com/juwonllee2024-dotcom/juwon-portfolio/blob/main/public/catalog.mjs)
- 첫 화면 문구·자기소개·SNS 링크: [public/index.html](https://github.com/juwonllee2024-dotcom/juwon-portfolio/blob/main/public/index.html)
- 색상·폰트·레이아웃: [public/style.css](https://github.com/juwonllee2024-dotcom/juwon-portfolio/blob/main/public/style.css)
- 검색·상세 화면 동작: [public/app.mjs](https://github.com/juwonllee2024-dotcom/juwon-portfolio/blob/main/public/app.mjs)

`catalog.mjs`의 각 행은 `[고유 ID, 이름, 소개, 태그, 상태, 선택적 근거]` 순서입니다. 기존 ID는 바꾸지 않고 필요한 문구만 수정하세요. 공개 데모 링크는 파일 아래 `urls`에 추가하세요. 비밀번호·토큰·개인 대화·로컬 파일 경로는 넣지 마세요.

이전 내용으로 되돌리려면 GitHub의 변경 기록을 확인하고 해당 변경을 되돌리는 새 커밋을 만드세요. Git 기록을 강제로 삭제하거나 덮어쓰지 마세요. 자동 배포가 실패하면 Cloudflare의 Deployments에서 빌드 로그를 확인하세요.

## GitHub Pages 설정과 개인정보

- 저장소 Settings > Pages의 배포 Source는 **GitHub Actions**입니다. `.github/workflows/pages.yml`이 `main`의 공개 파일 변경 또는 수동 실행 시 테스트하고 `out/`만 배포합니다.
- 공개 저장소의 표준 Linux 실행기를 사용하며 별도 유료 서비스나 장기 배포 토큰이 필요하지 않습니다. 배포 작업에만 `pages: write`, `id-token: write` 권한을 사용합니다.
- 기본 `github.io` 주소를 사용하므로 도메인 등록용 실명·집주소를 제출하지 않습니다. 공개 GitHub 프로필과 공개 저장소 정보는 계속 공개됩니다.
- 기본 주소는 `/juwon-portfolio/` 경로를 사용합니다. HTML의 자산 URL과 모듈 import를 상대경로로 유지하세요.
- GitHub Pages는 개인 포트폴리오용입니다. 사이트 크기 1GB, 월 대역폭 100GB 소프트 한도가 있으며, 상거래·유료 SaaS 호스팅 용도로는 사용하지 마세요. [공식 한도](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- `jupt.int.yt` 등록은 실제 집주소를 공개 WHOIS에 요구해 중단했습니다. 해당 주소는 확보하지 않았으며 CNAME을 설정하지 않았습니다. 다른 짧은 무료 주소는 최신 개인정보 조건과 DNS 제어권을 확인한 뒤 별도 승인받아 연결하세요.

GitHub Pages 배포 실패 시 위 Pages workflow 링크에서 실패한 작업의 로그를 확인하세요. 기존 Cloudflare 주소는 삭제하지 않았으므로 독립적으로 확인할 수 있습니다.

## 무료 범위와 한도

2026-10-03에 확인한 Cloudflare 공식 정책 기준:

- 이 포트폴리오는 서버 코드 없는 정적 사이트입니다. 정적 자산 요청은 무료·무제한이며 자산 저장에 추가 비용이 없습니다. [공식 요금 안내](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- 무료 자동 빌드는 월 3,000분, 동시 1개, 빌드당 최대 20분입니다. 수정·배포 횟수까지 무제한이라는 뜻은 아닙니다. [빌드 한도](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)
- 파일 수·파일 크기 등 플랫폼 제한도 적용됩니다. 서버 API·SSR·데이터베이스·AI·영상 처리 기능을 추가하면 해당 제품의 요금과 한도를 다시 확인해야 합니다.
- `workers.dev` 주소를 사용하며 별도 도메인을 구매하지 않았습니다. 무료 요금제를 유지하고 유료 제품을 추가하지 않는 것이 이 구성의 기본 원칙입니다.
- Cloudflare의 향후 정책 변경이나 영구 무료·무제한 운영까지 보장할 수는 없습니다. 소스는 본인 GitHub와 로컬에 있어 다른 정적 호스팅으로 이전할 수 있습니다.

Official docs: [GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/) · [Static Assets](https://developers.cloudflare.com/workers/static-assets/get-started/)

No subscription upgrades or domain purchases are part of this project. A `workers.dev` URL belongs to the Cloudflare account's namespace; a custom personal domain can be connected later if the owner already has one.
