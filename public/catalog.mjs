// Public editorial summaries only. Never import conversation exports or local paths here.
const audit = '2026-10-03 프로젝트 조사 기록. 현재 실행·배포·판매 여부는 별도 검증 전입니다.';
const readme = '로컬 README에서 목적과 구현 자료를 확인했습니다. 공개 서비스 가동 여부는 별도 검증 전입니다.';
const categories = {
  product: [
    ['antistudy','AntiStudy Mission Engine','공부와 실행을 작은 미션으로 바꾸는 개인 실행 시스템.','Mission · Productivity','자료 확인'],
    ['juwon-system','JUWON SYSTEM','Solo Leveling에서 출발한 성장·퀘스트·실행 관리 실험.','Personal OS · Electron','자료 확인'],
    ['token-saver','Token Saver','AI 작업에 필요한 맥락을 정리하고 토큰 낭비를 줄이는 도구와 스킬.','AI · Context','자료 확인'],
    ['freelance','Freelance AI Builder','고객에게 필요한 웹사이트를 만들고 결과물로 제안하는 서비스 구상.','Web · Service','구상'],
    ['openapps','OpenApps / GitHub Automation','직접 실행할 수 있는 오픈소스 앱을 발견·검색·비교하는 로컬 카탈로그.','Open source · Python','구현 자료',readme],
    ['revenue-os','Juwon Revenue OS','프로젝트를 수익 실험과 실행 흐름으로 연결하는 운영 MVP.','Business OS','자료 확인'],
    ['command','JUWON COMMAND','회사 맥락, AI 역할, 실행 승인, 결과 증거를 묶는 AI 회사 관제실.','Agents · n8n','구현 자료',readme],
    ['actionslice','ActionSlice','웹페이지 전체 대신 제목·선택문·조작 가능한 버튼만 AI에 전달하는 확장.','Chrome · Context','구현 자료',readme],
    ['copyhomes','CopyHomes','한 파일을 지정한 여러 위치에 복사하고 작업 영수증과 되돌리기를 남기는 CLI.','Python · Files','구현 자료',readme],
    ['distpeek','distpeek','압축을 풀거나 실행하지 않고 배포 아카이브 안의 파일을 검토하는 도구.','CLI · Release','구현 자료',readme],
    ['everyask','EveryAsk','요청과 AI 답변을 대조해 빠진 요구사항과 필요한 후속 질문을 보여주는 확장.','Chrome · AI','구현 자료',readme],
    ['failcase','Failcase','실패를 재현하는 JSON 입력을 작은 공유 가능한 사례로 줄이는 로컬 도구.','Python · Debugging','구현 자료',readme],
    ['filebirthmark','FileBirthmark','다운로드 파일에 출처·시간·해시를 담은 별도 기록을 붙이는 도구.','Provenance · Files','구현 자료',readme],
    ['linepatch','LinePatch','PDF에서 복사한 줄바꿈·단어 분리·숨은 문자 흔적을 검토하며 정리하는 CLI.','Text · CLI','구현 자료',readme],
    ['lockpeek','LockPeek','어떤 앱이 파일을 점유하는지 확인하는 읽기 전용 진단 도구.','Windows · CLI','구현 자료',readme],
    ['parityprint','ParityPrint','비밀값을 기록하지 않고 개발 환경의 형태를 비교하는 진단 도구.','Privacy · Devtools','구현 자료',readme],
    ['promptparcel','PromptParcel','선택한 로컬 파일을 해시가 있는 AI 맥락 패키지로 묶는 확장.','Chrome · Context','구현 자료',readme],
    ['reprocard','ReproCard','실패한 명령과 진단 결과를 민감정보를 가린 재현 카드로 만드는 도구.','CLI · Debugging','구현 자료',readme],
    ['scopepin','ScopePin','AI 대화에 사용할 페이지를 고정하고 출처가 바뀌면 전송을 멈추는 확장.','Chrome · Safety','구현 자료',readme],
    ['sourcestamp','SourceStamp','웹에서 복사한 주장에 출처·시각·해시를 함께 보존하는 확장.','Research · Chrome','구현 자료',readme],
    ['tab2patch','Tab2Patch','선택한 로컬 파일의 정확한 맥락을 기존 AI 채팅에 넣는 확장. 전송은 사람이 결정.','Chrome · AI','구현 자료',readme],
    ['worktree-seal','Worktree Seal','코딩 에이전트가 잘못된 프로젝트나 파일을 수정하지 않도록 작업 범위를 고정하는 도구.','Agents · Safety','구현 자료',readme],
    ['unzipblind','UnzipBlind','ZIP을 풀기 전에 덮어쓰기·경로 이탈·파일 충돌 위험을 보여주는 CLI.','Archive · Safety','구현 자료',readme],
    ['whenfound','WhenFound','메시지 속 날짜를 검토 가능한 캘린더 파일로 바꾸는 로컬 도구.','Calendar · CLI','구현 자료',readme],
    ['wrongshell','WrongShell','복사한 명령을 실제 사용할 셸에 맞춰 검토 가능한 형태로 바꾸는 도구.','Shell · Devtools','구현 자료',readme],
    ['evidence-lane','Evidence Lane','흩어진 자료를 출처와 개인정보 검토가 있는 증거 패키지로 정리하는 도구.','Privacy · Evidence','구현 자료',readme],
    ['finish','FINISH','메모와 할 일에서 다음 행동·승인 대기·마감일을 뽑아 완료 경로를 보여주는 도구.','CLI · Productivity','구현 자료',readme],
    ['tomorrow-tax','Tomorrow Tax','코드 변경이 다음 변경을 얼마나 어렵게 하는지 비교하는 오프라인 CLI.','TypeScript · Maintenance','구현 자료',readme],
    ['blogfoundry','BlogFoundry','콘텐츠 생산 흐름을 제품으로 연결하는 블로그 제작 프로젝트.','Publishing','자료 확인'],
    ['clipproof','ClipProof Studio','영상 제작 결과와 근거를 정리하는 스튜디오 프로젝트.','Video · Evidence','자료 확인'],
    ['proofrail','Proofrail','결과에 근거를 연결하는 프로젝트. 상세 제품 범위는 정리 중.','Evidence','자료 확인'],
    ['freshsend','FreshSend','첨부하려는 파일보다 최신 사본이 있는지 전송 전에 확인하는 CLI.','Files · Safety','구현 자료',readme],
    ['ghostsweep','GhostSweep','내용 없는 AI 세션 기록을 검토 후 격리하고 복구 영수증을 남기는 도구.','Sessions · Cleanup','구현 자료',readme],
    ['pathparity','PathParity','운영체제별 잘못된 파일명과 대소문자 충돌을 배포 전에 찾아내는 도구.','Cross-platform · CLI','구현 자료',readme],
    ['unicodefence','UnicodeFence','AI에 붙여넣기 전 보이지 않는 유니코드 제어문자를 확인하는 도구.','Text · Safety','구현 자료',readme],
    ['pastehalo','PasteHalo','AI 채팅에 비밀값을 붙여넣기 전 멈추고 검토·가림을 제공하는 확장.','Chrome · Privacy','구현 자료',readme],
    ['promiselock','PromiseLock','첨부·링크가 없는 약속과 미완성 문구를 전송 전에 확인하는 확장.','Chrome · Safety','구현 자료',readme],
    ['revisionlock','RevisionLock','초안을 작성하는 동안 페이지가 바뀌었을 때 전송을 잠시 멈추는 확장.','Chrome · Context','구현 자료',readme],
    ['symphony','Symphony','여러 AI가 회사의 역할을 나눠 계획·제작·검토하는 시스템 구상.','AI Company','구상'],
    ['model-company','모델 최적화 서비스','AI 모델의 성능과 운영을 개선하는 서비스를 만들고 싶은 장기 목표.','Models · Service','구상'],
    ['business-maker','Business Maker','각 프로젝트에 맞는 고객·가격·수익 실험을 설계하는 스킬.','Skill · Business','기록 확인']
  ],
  content: [
    ['ai-for-all','모두를 위한 AI','AI 뉴스와 기술 변화가 우리 삶에 어떤 의미인지 쉬운 한국어로 설명하는 채널.','YouTube · News','제작 흐름'],
    ['malva','Malva AI 영상 스크립트','영어 AI 콘텐츠를 참고해 한국어 후킹과 설명 흐름을 설계하는 작업.','Script · AI','제작 기록'],
    ['bible','bible-video','예수님과 성경 이야기를 영상으로 전달하는 콘텐츠 제작 실험.','Story · Faith','제작 기록'],
    ['yadam','한국 야담','한국어 이야기 콘텐츠 제작 프로젝트.','Story · Korean','제작 기록'],
    ['jayden','Jayden Timeless','Timeless 계열의 영상·스토리 제작 프로젝트.','Story · Video','제작 기록'],
    ['timeless','Time Less Auto','콘텐츠를 반복 제작하는 자동화 흐름 실험.','Automation · Video','제작 기록'],
    ['yt-korean','YT Korean Studio','영어 영상에 한국어 자막을 만들고 로컬 모델로 번역하는 영상 제작 도구.','YouTube · Subtitles','프로토타입'],
    ['longform','모두를 위한 AI 장편 편집실','20~60분 영상을 핵심 흐름을 지킨 5~8분 영상으로 줄이는 로컬 편집 실험.','Long-form · FFmpeg','프로토타입'],
    ['builder-film','Juwon AI Builder Film','AI로 만들고 실험하는 과정을 보여주는 영상 프로젝트.','Build in public','제작 기록'],
    ['astra','JuPT Astra 영상','JuPT 브랜드의 기술·제작 영상 프로젝트.','YouTube · Tools','제작 기록'],
    ['remotion','remotion-edit','코드 기반으로 영상 장면과 자막을 구성하는 편집 작업.','Remotion · Video','제작 기록'],
    ['shorts','Shorts Factory','랭킹과 짧은 포맷의 영상을 반복 제작하는 자동화 구상.','Short-form','제작 기록'],
    ['instagram','Instagram 카드뉴스','뉴스·도구·실험을 카드뉴스로 재구성하는 콘텐츠 흐름.','Instagram · Automation','제작 기록'],
    ['epic','Epic Fantasy 1000 Remotion','판타지 장면을 코드 기반 영상으로 구성하는 실험.','Fantasy · Remotion','제작 기록'],
    ['gpt-remotion','GPT 5.6 Remotion','AI와 Remotion을 활용한 영상 제작 실험.','AI · Motion','제작 기록'],
    ['images25','JuPT Images25 Motion','이미지와 모션을 연결하는 JuPT 영상 실험.','Image · Motion','제작 기록'],
    ['breach','AI Breach Remotion','AI 주제의 코드 기반 영상 제작 프로젝트.','AI · Remotion','제작 기록'],
    ['challenge','100일 챌린지','벽보기·하루 작은 프로젝트·제작 기록을 꾸준히 공유하는 챌린지 콘텐츠.','Challenge · Build in public','구상'],
    ['jupt','JuPT / 주피티','AI 툴·GitHub 도구·꿀팁·직접 만드는 방법을 소개하는 채널.','YouTube · Tools','채널 기록'],
    ['free-video','무료·무제한 영상 생성 검증','Seedance·Vheer·Hunyuan의 실제 무료 조건과 결과를 직접 확인하는 영상. 무제한을 보장하지 않음.','Review · AI Video','촬영 기록'],
    ['github-series','GitHub 도구 소개','오픈소스 도구를 직접 써보고 한국어로 설명하는 JuPT 시리즈.','Open source · Tutorial','구상'],
    ['actor-commentary','해외 배우 코멘터리','배우 인터뷰와 인상적인 장면에 직접 해설을 더하는 포맷. 원본 사용 권리는 별도 확인.','Commentary · Interviews','구상'],
    ['oxalpha','Ox Alpha 영상','JuPT에 연결하는 기술 소개 영상 아이디어.','YouTube · Tools','구상'],
    ['hermes-news','Hermes AI 뉴스','모두를 위한 AI에서 다룰 에이전트 기술 뉴스 주제.','News · Agents','주제'],
    ['show-work','개인 계정 제작물 공유','완성한 도구와 만드는 과정을 개인 소셜 계정에 기록하는 흐름.','Build in public','구상'],
    ['stocks-archive','NVDA · Apple 주식 콘텐츠','현재 채널 방향에서 제외한 과거 콘텐츠 아이디어.','Archive','보류']
  ],
  ai: [
    ['kraude','KRAUDE','AI 에이전트·작업 화면·모델 실험실을 하나의 환경으로 연결하는 작업 시스템.','Agents · World','실행 기록'],
    ['village','AI Agent Village','여러 AI 에이전트가 함께 움직이고 협업하는 공간 실험.','Multi-agent','자료 확인'],
    ['diamond','Diamond Rivalry','브라우저에서 플레이하는 3D 야구 게임. 기존 도시 주행 실험과 같은 작업 폴더에서 이어진 현재 작품.','3D · Baseball','구현 자료'],
    ['lee-relay','LEE RELAY','여러 AI 채팅 사이에서 메시지·역할·작업 결과를 이어주는 협업 확장.','Chrome · Multi-agent','구현 자료',readme],
    ['lee-ultra','Lee Relay Ultra','Lee Relay의 확장된 협업 흐름을 탐색하는 별도 작업 계열.','Relay · Experiment','자료 확인'],
    ['law-ai','AI Law Firm','자료와 근거를 정리하는 법률 AI 협업 구상. 법률 자문 서비스가 아님.','Research · Agents','실험 기록'],
    ['chat-relay','Chat Relay 연동 실험','외부 Chat Relay를 활용한 웹 AI 채팅 인터페이스 연결 실험. 원작은 외부 오픈소스.','Upstream integration','외부 도구 활용',readme],
    ['terminal-agent','ChatGPT Terminal Agent','AI 채팅과 터미널 작업을 연결하는 실험.','Terminal · AI','자료 확인'],
    ['local-chat','Local AI Chat','로컬 모델과 대화하는 인터페이스 실험.','Local models','자료 확인'],
    ['codex-ui','Codex Local Agent UI','로컬 에이전트 작업을 화면에서 다루는 UI 실험.','Agents · UI','자료 확인'],
    ['rulesync','RuleSync 활용 실험','외부 RuleSync를 활용해 AI 도구별 규칙 파일을 관리하는 실험. 원작은 rulesync/rulesync.','Upstream integration','외부 도구 활용',readme],
    ['dreamcore','DreamCore','반복 회고·연구·진화 아이디어를 자동화 작업으로 탐색하는 프로젝트.','Research · Automation','작업 기록'],
    ['openhands','Browse Code / OpenHands Bridge','외부 OpenHands와 로컬 모델을 연결하는 실험. 외부 도구 자체의 제작자는 아님.','Local models · Bridge','연동 실험'],
    ['dsh','DSH wow-starter','외부 AI 실행 도구를 이용해 작업 환경을 구성한 실험.','Workspace · Integration','연동 실험'],
    ['arise','ARISE','개인 AI 작업 흐름을 탐색하는 프로젝트. 상세 범위 정리 중.','AI · Experiment','작업 기록'],
    ['atlas','Project Atlas','프로젝트를 한곳에서 탐색하고 연결하는 화면.','Projects · Map','자료 확인'],
    ['nebula','Localhost Control Center / Nebula Studio','로컬 프로젝트와 서버를 찾아 정리하는 관제 화면 실험.','Localhost · Tools','자료 확인'],
    ['secondbrain','Second Brain','프로젝트·아이디어·작업을 연결해 관리하는 개인 지식 화면.','Knowledge · Graph','자료 확인'],
    ['secondbrain3d','Second Brain 3D','프로젝트 연결을 뉴런 같은 3D 그래프로 시각화하는 웹 실험.','3D · Graph','구현 자료'],
    ['record-replay','Juwon Record Replay AI','작업 기록과 재현을 연결하는 AI 프로젝트.','Record · Replay','자료 확인'],
    ['hermes-pet','Hermes Pet Overlay','에이전트 상태를 화면 위 캐릭터와 연결하는 UI 실험.','Overlay · Agents','자료 확인'],
    ['hermes-chrome','Hermes Chrome Use Bridge','Hermes와 브라우저 조작을 연결하는 실험.','Browser · Bridge','연동 실험'],
    ['seoul','Seoul Zero','서울 사이버펑크 세계관의 경영 게임 제작 프로젝트.','Game · Cyberpunk','제작 기록'],
    ['skybound','ZEPHYR / SKYBOUND','동작 조종과 비행 플레이를 탐색하는 게임 프로젝트.','Game · Flight','자료 확인'],
    ['zhepher','ZHEPHER','에이전트 월드 프로젝트. ZEPHYR 비행게임과는 별도 작업.','Agents · World','자료 확인'],
    ['history','History Lab','역사와 시뮬레이션을 탐색하는 프로젝트.','Simulation · History','자료 확인'],
    ['frontier','Frontier Dominion','게임·세계 시뮬레이션 제작 프로젝트.','Game · Simulation','자료 확인'],
    ['iphone','iPhone Cinematic 3D','브라우저에서 3D 기기와 시네마틱 움직임을 보여주는 데모.','3D · Web','자료 확인'],
    ['kiomet','Kiomet 3D','3D 게임 화면을 탐색하는 웹 프로젝트.','3D · Game','자료 확인'],
    ['modelark','AUTO MODELARK','이미지와 프롬프트 작업을 대기열로 다루는 브라우저 자동화 확장.','Chrome · Video','구현 자료',readme],
    ['offline-model','개인 AI / 자체 모델','자체 모델과 오프라인 AI 실행 환경을 만들고 싶은 장기 연구 목표.','Models · Local-first','연구 목표']
  ],
  lab: [
    ['first-aid','First Aid Course Materials','응급처치 학습 내용을 정리한 교육 자료 묶음. 공개 개인정보·수료증은 포함하지 않음.','Learning','자료 기록'],
    ['school','한글학교 수업자료','한국어 학습을 위한 수업자료 작업 묶음. 학생 정보는 포함하지 않음.','Education · Korean','자료 기록'],
    ['baseball','3D Baseball Game','동생이 만든 3D 야구 게임. 가족 협업 기록이며 단독 저작물로 소개하지 않음.','Family collaboration · Game','협업 기록'],
    ['floating','Floating Icons UI','떠 있는 아이콘과 화면 상호작용 UI 실험. 현재 활용 방향 미정.','UI · Experiment','보류'],
    ['saver-skill','Token Saver 3 스킬','AI 작업에서 맥락과 출력 낭비를 줄이는 개인용 스킬 실험.','Skill · Context','작업 기록'],
    ['github-goal','GitHub 10만 스타 목표','사람들이 실제로 사용하는 오픈소스를 만들려는 성장 목표. 10만 스타 달성 주장이 아님.','Open source · Ambition','목표'],
    ['model-fix','모델 개선 회사','로컬·오픈소스 모델을 고치고 개선하는 회사를 만들고 싶은 야심작.','Models · Ambition','구상']
  ],
  workflow: [
    ['morning','오전 6시 촬영 패키지','AI 뉴스 조사 → 아이디어 3개 → 추천 주제 → 3~5분 대본 → 촬영 체크리스트.','News · Script','자동화 기록'],
    ['edit-plan','AI 편집 판단기','대본과 촬영본을 분석해 재현 가능한 편집 명령서를 만드는 핵심 워크플로우.','AI · Editing','구상'],
    ['render','Remotion / FFmpeg 렌더링','편집 명령서에 맞춰 실제 영상 파일을 만드는 렌더링 단계.','Render · Video','워크플로우 구상'],
    ['silence','침묵 제거 · 자막 · 강조','불필요한 침묵과 실수를 줄이고 자막·확대·음악을 배치하는 편집 단계.','Captions · Audio','워크플로우 구상'],
    ['matching','뉴스 이미지 · 사용 장면 매칭','문장에 맞는 출처 자료와 실제 사용 화면을 연결하는 편집 단계.','Sources · B-roll','워크플로우 구상'],
    ['face-switch','얼굴 ↔ 자료 화면 전환','이야기의 흐름에 따라 얼굴과 자료 화면을 전환하는 편집 단계.','Composition','워크플로우 구상'],
    ['circle-face','자료 속 얼굴 원형 창','자료를 보여줄 때 촬영한 얼굴을 작은 원형 창으로 함께 배치하는 기능.','Composition · Picture-in-picture','워크플로우 구상'],
    ['screen-record','뉴스 화면 · 사용법 자동 녹화','관련 뉴스 자료와 실제 사용 과정을 영상에 쓸 화면으로 기록하는 기능.','Capture · Tutorial','구상'],
    ['channel-analysis','채널 분석 · 진화 시스템','유튜브·카드뉴스·GitHub 콘텐츠 결과를 분석해 다음 작업을 개선하는 시스템.','Analytics · Feedback','구상'],
    ['korean-script','영어 영상 → 한국어 대본','원본의 핵심을 한국어 설명과 대본으로 재구성하는 제작 흐름.','Translation · Script','워크플로우'],
    ['competitor','Goal-AI Competitor Watch','AntiStudy의 제품 전략에 필요한 경쟁 정보와 AI Coach 분석을 정리하는 작업.','Research · AntiStudy','분석 기록'],
    ['daily-cleanup','파일 · 다운로드 · 서버 일일 정리','하루 작업 파일과 로컬 서버를 검토하며 정리하는 자동화 구상. 무단 삭제는 하지 않음.','Files · Localhost','구상'],
    ['wall','벽보기 챌린지','짧은 집중 실험을 기록하는 챌린지 콘텐츠.','Challenge','구상'],
    ['daily-project','하루 하나 작은 프로젝트','작게 만들고 결과물을 공유하는 제작 챌린지.','Challenge · Build','구상']
  ]
};
// Public-facing exhibition notes from the reviewed Codex audit; no private paths or transcripts.
categories.product.push(
  ['portfolio','JuPT Portfolio','3D 작품·웹앱·확장 프로그램을 한곳에 전시하는 독립 공개 포트폴리오.','Web · Portfolio','공개 배포'],
  ['company-lab','Company AI Lab','회사 AI 채팅과 도구 실행·운영 실험을 다루는 로컬 관제 화면.','Web · Agents','구현 자료'],
  ['localhost-commander','Localhost Commander','로컬 서비스의 발견·목록·상태를 관리하는 개인 대시보드.','Web · Local services','구현 자료']
);
categories.ai.push(
  ['factory-proof','Factory Proof','공장 작업 일정과 비교 결과를 인터랙티브하게 보여주는 계산·검증 시각화.','Visualization · Scheduling','구현 자료']
);
const exhibitNotes = {
  seoul:['world','implemented','3D 도시·회사, 계약·성장·연쇄 사건·추천 행동 화면이 구현된 경영 게임.','게임 코드·README·실제 실행 캡처와 테스트 기록을 확인했습니다. 공개 게임 서버의 가동 여부는 미검증입니다.',[
    {src:'./seoul-zero-city.jpg',alt:'Seoul Zero의 서울 3D 도시와 지역 선택 화면',caption:'기록된 실제 실행 화면 · 3D 서울'},
    {src:'./seoul-zero-play.jpg',alt:'Seoul Zero의 추천 행동과 계약 선택 화면',caption:'기록된 실제 실행 화면 · 쉽게 플레이'}]],
  kraude:['world','prototype','3D 시설·미션 관제·에이전트 상태와 모델 실험을 연결한 로컬 세계.','3D 화면과 핵심 코드·학습 결과 파일을 확인했습니다. 캡처는 과거 실행 기록이며, 모델의 성능 향상·승격은 미완료입니다.',[
    {src:'./kraude-land.png',alt:'KRAUDE LAND의 연구실·공장·숙소가 보이는 3D 시설 화면',caption:'기록된 실제 실행 화면 · 캡처 당시 시설 관람 상태'}]],
  village:['world','prototype','AI 직원과 협업 상태를 보여주는 3D·픽셀 회사 세계.','월드 엔진·서버·모델 연결 코드가 있습니다. 최신 Codex 채팅 연결 기능은 설계·계획 단계입니다.'],
  diamond:['world','implemented','현재 작업 폴더의 README와 게임 소스로 확인한 3D 야구 작품.','게임 소스·README와 테스트 기록을 확인했습니다. 과거 도시 주행 프로토타입은 별도 현행 작품으로 중복 계산하지 않습니다.'],
  skybound:['world','implemented','몸 움직임을 입력으로 사용하는 브라우저 3D 비행 게임.','공개 저장소의 Three.js·MediaPipe 기반 구현 자료를 확인했습니다. 외부 라이브러리 활용 작품입니다.'],
  secondbrain3d:['world','prototype','프로젝트 관계를 뉴런처럼 연결하는 개인 지식 시각화.','기존 화면 소스가 있습니다. 최신 WebGL Universe 재설계는 문서·계획 단계이며 이 전시에서 완성으로 표시하지 않습니다.'],
  atlas:['world','implemented','프로젝트 분류·검색·상세 정보와 연결 그래프를 탐색하는 지도.','README·서버·화면 소스를 확인했습니다. 과거 데이터 오류 기록이 있어 정상 운영 여부는 재검증이 필요합니다.'],
  'factory-proof':['world','implemented','작업 일정의 후보와 검증 결과를 눈으로 비교하는 인터랙티브 작품.','계산 코드·README·시각화 HTML과 검증 기록이 있습니다. 실제 공장 운영 성과를 주장하지 않습니다.'],
  iphone:['world','partial','시네마틱 3D 기기 웹 데모를 만드는 초기 작업.','설계·구현 계획·초기 코드 작업 기록까지만 확인했습니다. 모델 준비와 완성 사이트는 미확인인 미완성 작품입니다.'],
  portfolio:['web','published','독립 정적 웹사이트. 기존 작품·아이디어 기록을 보존하며 실제 화면 작품을 별도로 전시합니다.','소스는 본인 GitHub에 있습니다. Cloudflare Pages·Workers와 GitHub Pages의 기존 배포를 사용하는 정적 포트폴리오입니다.'],
  antistudy:['web','implemented','목표·미션·시도·판정, 온보딩과 AI 연결을 갖춘 실행 관리 웹앱.','화면·미션 흐름 코드와 테스트·빌드 기록을 확인했습니다. 현재 서비스의 가동이나 사업 성과는 별도입니다.'],
  symphony:['web','implemented','Company OS 계열의 회사·AI 채팅·작업 승인·증거 기록 화면.','실제 서버·회사 실행 엔진·Symphony 채팅 코드가 있습니다. 최신 Chat Awakening 연결은 계획 단계입니다.'],
  'company-lab':['web','prototype','회사 AI와 도구 실행을 시험하고 운영 기록을 확인하는 화면.','회사 AI Lab 코드·운영 문서·검증 자료가 있습니다. 후속 Synapse 연결의 전체 완성은 확정하지 않았습니다.'],
  'localhost-commander':['web','implemented','로컬 프로젝트·서비스를 발견하고 목록·상태를 살펴보는 대시보드.','서버·발견·레지스트리·대시보드 코드가 있습니다. 모든 서비스를 항상 실행시키는 공개 서버는 아닙니다.'],
  nebula:['web','prototype','Nebula Studio의 별도 웹 화면과 로컬 관제 실험.','화면 파일이 확인됐습니다. Localhost Control Center·Second Brain 계열과 연결되며 독립 제품 완성은 미확인입니다.'],
  'yt-korean':['web','prototype','영상 입력·유튜브 다운로드·한국어 자막·최종 출력·QA를 다루는 웹앱.','소스와 실제 최종 MP4·자막 QA 결과 파일을 확인했습니다. 모든 유튜브 링크와 번역이 안정적으로 작동한다고 보장하지 않습니다.'],
  longform:['web','prototype','영어 장편을 5~8분으로 줄이는 편집실. 대기열·모델 선택·개인 허가 메모를 포함합니다.','장편 압축·유튜브 입력·웹 UI·Ollama 연결 코드가 있습니다. 다운로드·번역 실패 기록이 있어 안정화가 필요한 프로토타입입니다.'],
  'revenue-os':['web','prototype','매장 주문을 웹사이트·쇼츠 기획·검수·납품 ZIP으로 연결하는 운영 웹앱.','로컬 MVP README와 구현 자료가 있습니다. 실제 고객·결제·매출이 발생했다는 증거는 확인되지 않았습니다.'],
  blogfoundry:['web','prototype','근거 메모로 블로그 초안을 만들고 검수·WordPress 게시 준비를 하는 웹앱.','Python·SQLite UI/API와 검수·게시 준비 기능이 있습니다. 브라우저가 자동 공개 발행하는 도구는 아닙니다.'],
  clipproof:['web','prototype','영상 허가·출처·고유 해설을 기록하고 자막·편집 지시서 패키지를 만드는 웹앱.','로컬 UI/API와 패키지 생성 코드가 있습니다. 영상 다운로드·MP4 렌더·자동 업로드 기능은 포함하지 않습니다.'],
  'local-chat':['web','prototype','로컬 모델과 대화하고 에이전트·터미널 연결을 실험하는 UI.','로컬 채팅·시작 파일과 Agent UI 작업 기록이 있습니다. 후속 통합 작업 전체의 완성은 미확인입니다.'],
  'juwon-system':['app','prototype','개인 성장·퀘스트 관리 Electron 앱과 별도 Mission Web.','실행 파일과 웹 소스가 존재합니다. 설치 파일 존재를 전체 기능 완성이나 정상 실행 보증으로 해석하지 않습니다.'],
  'lee-relay':['app','implemented','여러 AI 채팅의 메시지·역할·작업 결과를 이어주는 Chrome 확장.','v4.1.11 설치 ZIP·manifest와 테스트 기록을 확인했습니다. 브라우저에 현재 설치된 버전은 별도 확인 대상입니다.'],
  'lee-ultra':['app','implemented','계획·구현·검토·테스트 역할과 로컬 코딩 실행을 연결하는 별도 확장.','v1.1.0 계열 README·확장·로컬 실행 서버와 공개 저장소가 있습니다. LEE RELAY와는 별도 제품입니다.'],
  timeless:['app','implemented','AI 응답 화면 캡처와 반복 작업을 처리하는 Chrome 확장.','TimeLess Auto v2.0.0 설치 ZIP과 확장 코드가 있습니다. Timeless 영상 시리즈와는 별도 도구입니다.'],
  openhands:['app','integration','BrowseCode와 외부 OpenHands·로컬 모델을 연결한 에이전트 UI.','브리지·모델 선택·확장 연결 코드가 있습니다. OpenHands 자체를 독자 제작한 것으로 소개하지 않습니다.']
};
// Privacy-reviewed browser screenshots. A UI preview is not proof of backend execution.
const capturedScreens = {
  portfolio:['running-ui','공개 포트폴리오 첫 화면 · 이미지 추가 전 배포 기록'],
  longform:['running-ui','로컬 장편 편집실 시작 화면 · 다운로드·번역·렌더 작업은 실행하지 않음'],
  diamond:['running-ui','브라우저의 실제 3D 야구 시작 화면 · 경기 전체 기능은 미검증'],
  skybound:['running-ui','브라우저의 실제 3D 비행 게임 시작 화면 · 카메라·동작 조종 미검증'],
  'factory-proof':['running-ui','기존 일정 검증 시각화 HTML · 표시 값은 검증 시나리오이며 실제 공장 실적이 아님'],
  secondbrain3d:['running-ui','기존 3D 은하 UI · 도구 수와 상태는 저장된 분류 데이터이며 현재 운영 현황을 자동 검증한 값이 아님 · 일부 HUD 배치 미완성'],
  iphone:['ui-preview','기존 초기 웹페이지 빌드 · 3D 상호작용 미완성'],
  'company-lab':['ui-preview','기존 Company AI Lab 빌드 · 운영 서버 미연결'],
  village:['ui-preview','기존 픽셀 회사 UI · 에이전트 서버 미연결 · 시뮬레이션 미실행'],
  symphony:['ui-preview','기존 Company OS 회사 선택 UI · 서버 미연결 오류가 표시된 상태'],
  timeless:['ui-preview','기존 확장 패널 단독 미리보기 · 브라우저 확장 설치·반복 작업 미실행'],
  'lee-relay':['ui-preview','기존 확장 패널 단독 미리보기 · AI 탭 연결·회의 미실행'],
  'lee-ultra':['ui-preview','기존 확장 패널 단독 미리보기 · 실행 잠금·자동 코딩 비활성 상태'],
  blogfoundry:['running-ui','별도 빈 로컬 작업공간 · 초안 생성·외부 발행 미실행 · 고객 데이터 없음'],
  clipproof:['running-ui','별도 빈 로컬 작업공간 · 제작 패키지 생성·외부 업로드 미실행'],
  atlas:['ui-preview','기존 지도 UI · 프로젝트 데이터 미연결 오류 상태 · 빈 목록을 완성 데이터로 표시하지 않음'],
  'localhost-commander':['ui-preview','기존 관제 대시보드 UI · 관리 서버 미연결 · 서비스 시작·종료 버튼 미사용'],
  nebula:['ui-preview','기존 랜딩 페이지 UI · 관제 서버 미연결 · 템플릿 지표는 실제 실적이 아님'],
  'yt-korean':['ui-preview','기존 자막 스튜디오 UI · 번역 모델·백엔드 미연결 · 영상 작업 미실행'],
  'juwon-system':['ui-preview','JUWON SYSTEM 계열의 Mission Web 빌드 · Electron 화면이 아님 · 미션 서버 미연결'],
  'revenue-os':['ui-preview','기존 빌드의 빈 주문 UI · 고객 데이터·백엔드 미연결 · 제작·납품 미실행'],
  antistudy:['ui-preview','저장된 Mission Engine 랜딩 HTML과 일치하는 빌드 CSS · AI·인증 서버 미연결 · 미션 생성 미실행'],
};
const captureIssues = {
  'local-chat':'현재 접근 가능한 소스 위치를 찾지 못해 캡처하지 않았습니다.',
  openhands:'설치된 화면 빌드는 데스크톱 런타임 연결 없이 빈 화면으로 표시돼 공개 캡처에서 제외했습니다.',
};
const urls = {
  'ai-for-all':'https://www.youtube.com/@JuwonLee-k7x',
  jupt:'https://www.youtube.com/@%EC%A3%BC%ED%94%BC%ED%8B%B0-JuPT',
  filebirthmark:'https://github.com/juwonllee2024-dotcom/filebirthmark',
  command:'https://github.com/juwonllee2024-dotcom/juwon-company-os-v2',
  'tomorrow-tax':'https://github.com/juwonllee2024-dotcom/tomorrow-tax',
  rulesync:'https://github.com/rulesync/rulesync',
  symphony:'https://github.com/juwonllee2024-dotcom/juwon-company-os-v2',
  portfolio:'https://github.com/juwonllee2024-dotcom/juwon-portfolio',
  skybound:'https://github.com/juwonllee2024-dotcom/zephyr',
  openapps:'https://github.com/juwonllee2024-dotcom/openapps',
  'lee-relay':'https://github.com/juwonllee2024-dotcom/lee-relay',
  'lee-ultra':'https://github.com/juwonllee2024-dotcom/lee-relay-ultra'
};
export const exhibitGroups = {all:'전체 작품',world:'3D · 게임 · 시각화',web:'웹사이트 · 웹앱',app:'데스크톱 · 확장 앱'};
export const exhibitStates = {implemented:'구현 자료 확인',prototype:'프로토타입',published:'공개 배포',partial:'초기 구현 · 미완성',integration:'외부 도구 연동'};
export const projects = Object.entries(categories).flatMap(([category,rows])=>rows.map(([id,name,description,tagline,status,evidence])=>{
  const note = exhibitNotes[id];
  const capture = capturedScreens[id];
  const shots = note ? [...(note[4]||[]),...(capture?[{src:`./${id}-screen.jpg`,alt:`${name}의 실제 화면 캡처`,caption:capture[1],kind:capture[0]}]:[])] : [];
  return {id,name,description:note?note[2]:description,category,tags:tagline.split(' · '),status:note?exhibitStates[note[1]]:status,evidence:note?note[3]:(evidence||audit),...(urls[id]?{url:urls[id]}:{}),...(note?{exhibit:{group:note[0],state:note[1],note:note[2],shots,...(captureIssues[id]?{captureIssue:captureIssues[id]}:{})}}:{})};
}));
export const categoryLabels = {all:'전체',product:'제품 · 오픈소스',ai:'AI · 세계관',content:'영상 · 콘텐츠',workflow:'워크플로우',lab:'실험 · 야심작'};
export function filterProjects(rows,query='',category='all'){
  const q=query.trim().toLocaleLowerCase();
  return rows.filter(p=>(category==='all'||p.category===category)&&[p.name,p.description,...p.tags].join(' ').toLocaleLowerCase().includes(q));
}
