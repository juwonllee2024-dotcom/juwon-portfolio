# Cinematic Universe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 실제 프로젝트 화면과 Three.js 카메라 여행, 한글 타이포그래피, 마지막 대표작 공개를 갖춘 주원의 공개 포트폴리오를 만든다.

**Architecture:** HTML 콘텐츠를 기본 경험으로 유지하고 하나의 장식용 Three.js 캔버스를 추가한다. 순수한 장면 모델이 스크롤 진행률과 카메라 상태를 계산하고, GSAP이 HTML 연출과 선택적 Lenis를 단일 루프로 동기화한다. 정적 에셋만 기존 세 호스트에 배포한다.

**Tech Stack:** Node >=22 표준 라이브러리 테스트·빌드, HTML/CSS/ES modules, Three.js, GSAP/ScrollTrigger/SplitText, 선택적 Lenis·postprocessing. Anime.js는 추가하지 않는다.

**Spec:** [승인된 설계](../specs/2026-10-04-cinematic-universe-design.md). 사용자 “ㄱ”으로 2026-10-04 설계 승인. 이 계획은 검토·실행 방법 선택 대기이며 제품 코드를 아직 변경하지 않았다.

## Global Constraints

- 카탈로그 123개 기록, 전시 26개 작품, 24개 작품의 실제 화면 이미지 25장을 보존한다. 미확인 2개는 `local-chat`, `openhands` 그대로 유지한다.
- 공개 순서는 `kraude` → `secondbrain3d` → `antistudy`; 이전 장면에는 대표작 이름·사진을 먼저 표시하지 않는다. `#works`, `#selected`, `#projects`, `#about` 보존.
- high / low / off. DPR 최대 high 1.5, low 1.0. 점 개수 상한 high 1,200, low 350. 텍스처 캐시 high 최대 8장, low 최대 4장. 블룸은 high만.
- 모바일은 low로 시작. 초기 로딩 2초 제외, 보이는 탭의 최근 120프레임 평균 간격이 32ms 초과 시 high에서 low. low에서 같은 기준 2회 연속이면 off. 자동 상향 없음.
- 장면 높이 데스크톱 1.2~2 화면, 모바일 1~1.4 화면. finale의 세 하위 장면도 각각 이 범위. 첫 화면 추가 JS의 압축 전송 목표 600 KiB 이하.
- `prefers-reduced-motion`·명시적 모션 끄기·WebGL 실패에서는 즉시 정적 콘텐츠 표시. 한글 grapheme 분리, 미지원 시 문장 전체 페이드. 오디오·스트로브·서사 강제 스크롤 잠금 없음. 기존 상세 모달의 배경 스크롤 잠금은 유지한다.
- `public/` 일반 파일만 `out/`에 빌드. 상대 URL·평면 구조 유지. CI는 Node 표준 라이브러리만 사용하며 `SKIP_DEPENDENCY_INSTALL=true`와 호스팅 설정 보존.
- 유료 서비스·도메인·DB·AI API·런타임 서버·계정 권한 변경 없음. 비공개 자료·로컬 경로·키를 공개하지 않는다.
- 모든 셸 명령은 `rtk` 접두사. 파일 변경은 `apply_patch`. 테스트·빌드 후 작업 파일만 커밋. 기존 localhost 서버나 무관한 파일을 중지·삭제하지 않는다.
- 중간 커밋은 로컬 전용. 전체 검증 후 한 번의 Git push로 배포하고 세 호스트를 확인한다. 파괴적 reset·강제 push 없음.
- 실행 시작 전 git status와 첨부 작업공간을 확인한다. 분리가 필요하면 using-git-worktrees 절차로 기존 적합한 작업공간을 재사용하며 기본 새 브랜치는 `codex/cinematic-universe`다. 계획 작성 단계에서 브랜치·작업공간을 만들지 않는다. 기존 변경은 보존한다.

## Review Focus

1. 저장소 접두 경로와 늦은 동적 import: 모든 vendor 하위 의존성도 동일한 사이트 경로에 남는다. Task 2 import 그래프 검사.
2. 빠른 역방향 스크롤·초기 앵커 접근: finale 상태가 이전 스크롤에 의존하지 않고 건너뛰기 링크가 정상 작동한다. Tasks 1·5 테스트.
3. 화면 숨김·모달·회전 중 프레임 측정: 숨겨진 시간 때문에 품질이 잘못 강등되거나 프레임 루프가 중복되지 않는다. Tasks 3·5 테스트.
4. 저장소 접근 거부·글자 분리 미지원: localStorage 예외가 페이지를 멈추지 않고 한글과 정적 원문이 유지된다. Tasks 1·5 테스트.
5. 텍스처 다운로드 실패·context loss: 현재 장면의 읽을 수 있는 설명·캡처가 남고 GPU 자원과 초기화 시도가 누적되지 않는다. Tasks 3·6 테스트.

## Files and Contracts

기존 `catalog.mjs`의 기록·상태는 변경하지 않는다. `showcase.mjs`의 캡처 라벨·escape 규칙을 재사용한다. 기존 `app.mjs`의 검색·필터·모달을 유지하며 작은 연결 코드만 추가한다.

- Create `public/story.mjs`, `tests/story.test.mjs`: 장면 정의·정규화·카메라 보간·grapheme 분리. `storyChapters`, `coreIds`, `sampleStory(progress:number):StoryFrame`, `splitGraphemes(text:string,segmenter:Intl.Segmenter|null):string[]`.
- `StoryFrame` = `{chapter:string, local:number, camera:{position:[number,number,number], target:[number,number,number]}, focusId:string|null}`. chapter는 `spark|constellation|work|convergence|core`, local은 0..1. progress는 전체 여정의 0..1.
- Create `public/vendor-three.mjs`, `public/vendor-gsap.mjs`, `public/vendor-lenis.mjs`, `public/vendor-postprocessing.mjs`, `public/motion-licenses.txt`, `docs/motion-vendors.json`, `tests/vendors.test.mjs`: 검토·고정한 브라우저 번들, 라이선스와 체크섬. vendor-gsap exports `gsap,ScrollTrigger,SplitText`; vendor-lenis exports `default`; vendor-postprocessing exports `EffectComposer,RenderPass,EffectPass,BloomEffect,ToneMappingEffect`; vendor-three는 Three.js 필요한 named exports를 제공.
- Create `public/motion-policy.mjs`, `public/universe.mjs`, `tests/universe.test.mjs`: 품질 정책과 3D. `qualityLimits(quality:'high'|'low'|'off'):{particles:number,dpr:number,textures:number,bloom:boolean}`, `createFrameMonitor(quality)`의 `record({timeMs,visible}):quality`, `reset(timeMs):void`. 120간격의 비중첩 창으로 검사하며 초기·복귀 2초는 제외한다. `init({canvas,projects,quality,dependencies,onFailure}):Promise<Universe>`.
- `dependencies` = `{THREE,postprocessing:null|object}`. `Universe` = `{update(frame:StoryFrame,timeSeconds:number):void,resize(width:number,height:number,dpr:number):void,setQuality(quality):void,dispose():void}`. renderer는 자신의 RAF를 만들지 않는다.
- Modify `public/index.html`, `public/style.css`; Create `tests/story-markup.test.mjs`: 다섯 장면·static finale·캔버스·모션 버튼. HTML의 `data-story-chapter`가 storyChapters 순서와 일치. finale는 기존 `data-project` 버튼 사용.
- Create `public/motion.mjs`, `tests/motion.test.mjs`; Modify `public/app.mjs`: `startMotion({root,projects,environment}):Promise<{stop():void,refresh():void}>`. environment는 `{window,document,storage,loadDependencies,createUniverse}`이며 테스트에서 주입 가능. 실제 환경 loader만 vendor import를 수행한다.
- Modify `tests/build.test.mjs`, `tests/asset-paths.test.mjs`, `tests/server.test.mjs`, `scripts/serve.mjs`, `README.md`; Create `tests/cinematic-integration.test.mjs`, `docs/cinematic-verification.md`: 에셋·MIME·실제 검증 기록. 기존 공개 파일 31개에 명시적으로 새 파일만 더한다.

## Task 1: Deterministic story model

**Files / Interfaces:** 위 story 계약. `coreIds=['kraude','secondbrain3d','antistudy']`. 장면 5개를 균등한 정규화 범위로 나누고 work의 3개 화면·core의 3개 대표작은 해당 장면 안에서 균등 분할한다. 카메라 키프레임은 데이터로 고정한다.

- [ ] **1. Write failing tests** in `tests/story.test.mjs`: `assert.deepEqual(coreIds,['kraude','secondbrain3d','antistudy'])`; `assert.equal(sampleStory(0).chapter,'spark')`; `assert.equal(sampleStory(1).focusId,'antistudy')`. 각 경계 전후, [-1,2,NaN]의 안전한 clamp, 같은 진행률의 동일 결과, forward/backward 입력에서 focusId 일치, core 이전에 coreIds 미노출, 한글 결합 문자·emoji의 grapheme 및 segmenter=null일 때 `[원문]` 반환을 검증한다.
- [ ] **2. Verify RED:** `rtk proxy node --test tests/story.test.mjs`. 새 모듈이 없어 실패해야 한다.
- [ ] **3. Implement** `public/story.mjs`의 계약. non-finite progress는 0. 한글 분리는 Intl.Segmenter를 사용하고 미지원이면 글자 분리를 하지 않는다. intro/quiet/signature 문구는 설계 그대로 고정한다. 현재 선택 작품 `iphone`, `village`, `yt-korean`과 finale는 카탈로그 ID만 참조한다.
- [ ] **4. Verify GREEN:** 같은 명령, 모든 새 테스트 PASS. 기존 테스트와 빌드도 통과해야 한다. 새 public 파일은 `tests/build.test.mjs`의 명시 목록에 함께 추가한다.
- [ ] **5. Commit:** exact Task 1 파일과 허용 목록 변경만 stage. `feat: add deterministic cinematic story model`. 후속 작업과 함께 main에 나중에 push한다.

## Task 2: Reviewed, self-hosted motion dependencies

**Files / Interfaces:** 위 vendor 계약과 `docs/motion-vendors.json`. manifest는 각 라이브러리의 `{name,version,sourceUrl,license,files:[{path,sha256}]}`와 로컬 번들 재생성 명령을 기록한다. 런타임 CDN과 Node 전용 import는 금지한다.

- [ ] **1. Write failing tests** `tests/vendors.test.mjs`: manifest의 필수 네 라이브러리·고정 버전·SHA256을 검사하고 실제 파일 해시와 일치시킨다. Three=MIT, Lenis=MIT, postprocessing=Zlib, GSAP=표준 라이선스 고지를 확인한다. 모든 정적·동적 literal import/import map URL을 root와 `/juwon-portfolio/`에서 해석해 공개 파일 존재·동일 origin을 검사한다. `import('https://...')`와 누락된 상대 import가 실패하는 fixture도 둔다.
- [ ] **2. Verify RED:** `rtk proxy node --test tests/vendors.test.mjs`, manifest/vendor 부재로 FAIL.
- [ ] **3. Prepare artifacts:** 공식 npm/GitHub 릴리스에서 GSAP·Lenis·postprocessing 버전을 확인하고 postprocessing peer 범위 안의 Three.js를 선정한다. 프로젝트 전용 임시 작업 폴더에서만 필요한 브라우저 모듈을 번들해 위 4개 파일을 만든다. Three.js를 postprocessing에 중복 포함하지 않고 local `./vendor-three.mjs`를 external로 둔다. 정확한 패키지·번들러 버전과 재생성 명령·해시를 manifest에 기록하고 라이선스를 보존한다. 임시 도구를 시스템 전역에 설치하지 않는다. 추가 트랜지티브 파일이 필요하면 평면 파일명과 manifest/allowlist에 명시한다.
- [ ] **4. Verify GREEN:** 새 tests PASS, `rtk npm test`, `rtk npm run build`. `scripts/serve.mjs`에 `.txt`의 `text/plain; charset=utf-8` 지원을 추가하고 server test에서 라이선스 200/MIME 확인. 첫-load 모듈 집합의 gzip 합을 `node:zlib`로 측정해 600 KiB 이하인지 기록하고 초과분은 선택적 후처리 지연 로드로 분리한다. 실제 browser import/export 검증은 Task 6에서 재확인한다.
- [ ] **5. Commit:** vendor·manifest·라이선스·경로/MIME/allowlist 테스트만 stage. `build: vendor reviewed browser motion libraries`. package.json·호스팅 설정은 변경하지 않는다.

## Task 3: One Three.js universe and adaptive quality

**Files / Interfaces:** 위 universe/motion-policy 계약. consumes Task 1 StoryFrame, Task 2 모듈. 품질 값은 Global Constraints 그대로 사용한다.

- [ ] **1. Write failing tests** `tests/universe.test.mjs`: `assert.equal(qualityLimits('high').particles,1200)`; low particles=350, DPR=1, textures=4, bloom=false; high DPR=1.5/textures=8. 120개 간격 평균의 경계 32ms·32.1ms, 초기 2초 제외, high 한 번 강등·low 두 번 연속 강등, 정상 window의 실패 횟수 reset, 숨김 후 warm-up reset을 검사한다. 주입한 renderer/texture doubles로 texture 실패 시 onFailure, cache 상한, dispose 반복의 안전함, async texture 완료가 dispose 이후 재등록하지 않음, 단일 render path를 검사한다.
- [ ] **2. Verify RED:** `rtk proxy node --test tests/universe.test.mjs`, 모듈 부재 FAIL.
- [ ] **3. Implement:** 실제 perspective camera, 원본 절차적 점·궤도·연결선·스크린 평면을 만든다. 카탈로그의 상대 image/alt/caption만 사용한다. 현재·다음 장면 우선 LRU 캐시, screen의 비율·색 공간 유지, 모든 geometry/material/texture/composer/resize/context 리스너 cleanup. high composer만 render; low renderer만 render. context lost 시 정적 화면으로 전환하고 무한 복구 시도는 하지 않는다. 모바일 low, 자동 upshift 없음.
- [ ] **4. Verify GREEN:** 해당 테스트 PASS, 기존 전체 tests/build PASS. GPU 실제 동작·색감·깊이·발열 가능성은 doubles가 아닌 Task 6 브라우저에서 확인한다.
- [ ] **5. Commit:** universe/policy/tests 및 public allowlist만 stage. `feat: render adaptive cinematic Three.js universe`.

## Task 4: Accessible HTML journey and finale

**Files / Interfaces:** 위 HTML/CSS 계약. 기존 작품 갤러리·카탈로그 ID·검색 입력·dialog ID는 유지한다. 캡처 설명은 기존 showcase 렌더 규칙과 비교한다.

- [ ] **1. Write failing tests** `tests/story-markup.test.mjs`: `data-story-chapter` 순서가 storyChapters와 일치, core 버튼의 ID 순서가 coreIds와 일치, 기존 4개 앵커·모달·검색 ID 유지, 작품 바로 보기 href=#works, 캔버스 aria-hidden=true/tabindex 없음, 모션 버튼 aria-pressed 존재, 원문은 접근 가능·글자 clone은 aria-hidden. static HTML의 core 설명·정직한 캡처 label·상대 image URL을 카탈로그와 비교하고 core 이전에 대표작 텍스트/캡처가 없는지 검사한다.
- [ ] **2. Verify RED:** `rtk proxy node --test tests/story-markup.test.mjs`, 새 서사 markup 부재 FAIL.
- [ ] **3. Implement:** 기존 hero의 orbit preview를 서사로 교체한다. 검은 공간·웜 화이트·라임, 제한적인 청록/따뜻한 빛, spark 타이핑·constellation 연결·work 여행·convergence 고요·core 공개를 적용한다. finale 이후 #works/#selected/#projects/#about 유지. HTML 기본은 모두 읽히고 enhanced 상태만 시각 clone을 연출한다. sticky 캔버스는 pointer-events:none. 원문/clone 중복 읽기 금지. 360px에서 제목 줄바꿈·폰트 fallback·200% 확대 지원. reduce/off/no-JS에서는 불필요한 긴 sticky 공백 제거.
- [ ] **4. Verify GREEN:** markup·기존 tests/build PASS. CSS의 고정 장면 높이는 Global Constraints 범위; 이미지 비율 예약; 새 noscript는 HTML 서사와 동적 검색의 차이를 설명한다.
- [ ] **5. Commit:** HTML/CSS/tests만 stage. `feat: add accessible cinematic chapters and core reveal`.

## Task 5: Scroll, typography, lifecycle and safe integration

**Files / Interfaces:** 위 startMotion 계약. 기본 환경은 app에서 주입하고 tests는 환경 doubles를 사용한다. Universe 업데이트는 Task 1 sampleStory만 사용한다.

- [ ] **1. Write failing tests** `tests/motion.test.mjs`: module loader reject 및 storage throw가 정적 화면을 유지하고 기존 UI 초기화를 막지 않음; reduce=true에서 loader·Lenis·RAF 호출 0; 한 ticker callback만 등록; stop 두 번에도 dispose 한 번; hidden/modal/resize에서 pause/reset/refresh 일치; loader가 늦게 끝나도 stop 이후 활성화 없음; deep link #works는 해당 위치 유지; 빠른 역행의 StoryFrame이 순수 sampleStory와 일치. split 미지원은 전체 문장 페이드, screen reader에는 clone 없음.
- [ ] **2. Verify RED:** `rtk proxy node --test tests/motion.test.mjs`, startMotion 부재 FAIL.
- [ ] **3. Implement:** DOM 준비 후 장식만 dynamic import. GSAP plugins 등록, native document scroll progress 측정, SplitText의 words/chars 연출은 full readable source와 분리. Lenis는 desktop pointer:fine/모션 허용일 때만, autoRAF=false와 GSAP ticker 하나. Lenis→ScrollTrigger 업데이트 연결. source 높이/폰트/텍스처/resize 이후 refresh; modal open 동안 Lenis와 장면 중지; close에서 위치 동기화. visibility 복귀에서 frame monitor reset. localStorage key `juwon-motion-disabled`는 try/catch. reduce는 저장 설정보다 우선. failure에서 enhancement class·clone·sticky 연출을 제거하고 원문 복구.
- [ ] **4. Verify GREEN:** motion·전체 tests/build PASS. app의 기존 검색·전시·모달 구현은 그대로 초기화하고 startMotion reject는 개별 처리. 후처리는 high가 필요할 때만 load, 모션 끄기로 단일 canvas/GPU 자원 cleanup.
- [ ] **5. Commit:** motion/app/tests/allowlist만 stage. `feat: synchronize scroll motion with safe lifecycle`.

## Task 6: Browser verification, polished delivery and deployment

**Files / Interfaces:** 기존 테스트 확장, `tests/cinematic-integration.test.mjs`, README, `docs/cinematic-verification.md`. Node 표준 라이브러리 검증은 CI, 실제 브라우저 결과는 문서에 분리해 기록한다.

- [ ] **1. Write failing regression test:** 전체 import 그래프·새 public allowlist·카탈로그 123/전시 26/캡처 작품 24/이미지25·미확인2 보존, no-JS 읽기 가능한 core 설명, 공개 파일의 localhost/개인 경로/키 미포함을 검사한다. 기존 서버 test는 GET/HEAD/mjs/txt MIME와 비공개 경로 404를 확인한다. Task 2 경로 fixture에 실제 deployment manifest를 연결한다.
- [ ] **2. Verify RED then GREEN:** `rtk proxy node --test tests/cinematic-integration.test.mjs`; 새 manifest 연동·검증 부족에서 FAIL을 확인하고 최소 연결·문서/MIME 수정 후 PASS. 기존 보호 테스트를 약화해 통과시키지 않는다. `rtk npm test`, `rtk npm run build`, `rtk git diff --check` 모두 통과.
- [ ] **3. Browser verify:** browser skill을 읽은 뒤 `rtk npm run dev`의 임의 loopback 포트를 사용한다. desktop 1440px/mobile 360px/200% 확대에서 다섯 장면의 스크린샷과 전체 scroll forward/backward, 앵커, /검색, filter, modal/Escape를 확인한다. reduced motion, localStorage denied, Segmenter unavailable, WebGL unavailable, context loss, 실패한 texture/module 응답을 각각 시험한다. canvas 1개·루프1개·숨긴 탭 중지·필요한 texture만 로딩·GPU cleanup, 체감 깊이/타이핑/클라이맥스·처음 gzip 600KiB 목표를 기록한다. 기능 PASS와 시각 검토를 별개로 기록하고 눈에 보이는 결함을 수정한다.
- [ ] **4. Release:** 검증 기록·편집 위치·모션 끄기·license credits를 README에 추가한다. 정확한 diff와 task-only 파일을 검토하고 `test: verify cinematic portfolio delivery`로 로컬 커밋한다. 새로운 프로세스만 정리하고 기존 localhost 서버 유지. 승인된 작업 브랜치를 검증 후 main에 정상 merge한다. main에 push하기 전 dirty/unrelated 변경이 없고 검증 commit이 HEAD인지 확인한다.
- [ ] **5. Publish and verify:** 승인된 배포 범위 안에서 main을 한 번 push. 해당 commit의 Pages·Workers Builds·GitHub Pages workflow 성공을 확인하고 세 실제 호스트의 동일 에셋 hash/MIME·동적 imports·검색·모달·finale를 확인한다. 배포 미확인은 완료로 보고하지 않는다. 배포 회귀는 검증 baseline의 public 파일을 복원하는 새 커밋으로 해결하고 사용자 파일·히스토리는 보존한다.

## Review and Execution Handoff

자체 검토: 설계의 모든 요구사항을 Tasks 1~6에 배정했다. 인터페이스·품질 수치·ID·배포 경로·실패 폴백·5개 Review Focus의 테스트가 일치한다. vendor 버전 선택은 Task 2의 실제 호환 검증 결과로 고정하며 검증하지 않은 버전을 임의 확정하지 않는다. 테스트 doubles는 실제 3D 품질을 증명하지 않으므로 Task 6의 브라우저 게이트는 생략하지 않는다.

권장 실행 방법은 **Native**: 이 채팅에서 직접 순서대로 구현하고 마지막에 독립 리뷰 1회. 장면·스크롤·리소스 수명이 서로 밀접해 연속 작업이 효율적이다. 선택되면 `superpowers:executing-plans`를 사용한다. 대안은 **Subagent-driven**: 작업별 구현·검토 에이전트로 매 단계 검토하며 더 많은 컨텍스트를 사용한다. 선택되면 `superpowers:subagent-driven-development`를 사용한다.

사용자가 계획을 검토하고 실행 방법을 선택하기 전에는 이 문서만 저장하며 제품 코드·라이브러리 설치·배포는 시작하지 않는다.
