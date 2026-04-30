# Melon Seeds 블로그 - GPT 핸드오프 가이드

## 1. 프로젝트 개요

- GitHub Pages 기반 개인 블로그 (블로그명: **Melon Seeds**)
- 이중 레포 구조: 소스(private) → deploy.py로 public 레포에 배포
- 순수 HTML/CSS/JS (프레임워크 없음), 각 포스트는 self-contained HTML
- 인코딩: **모든 파일 UTF-8 BOM** 필수
- 배포: `python deploy.py` 실행하면 자동으로 git commit + push + 암호화 처리

---

## 2. 디렉토리 구조

```
GitHub Pages/
├── index.html              # 홈페이지 (최근 글 카드)
├── deploy.py               # 배포 스크립트
├── assets/
│   ├── css/style.css       # 글로벌 스타일
│   └── js/
│       ├── sidebar.js      # 사이드바 렌더링 (카테고리 트리)
│       ├── post-nav.js     # 이전/다음 글 네비게이션
│       ├── auth.js         # 비공개 글 인증
│       └── horizontal-scroll.js  # 가로스크롤→세로스크롤 변환
├── public/
│   ├── index.html          # ★ 공개 글 목록 페이지 (카드 + 정렬 + 필터)
│   └── posts/              # ★ 개별 포스트 HTML 파일들
├── private/                # 비공개 글
└── templates/              # 템플릿 (있으면)
```

---

## 3. 새 포스트 작성 시 수정해야 할 파일들 (총 4곳)

### 3-1. 포스트 HTML 파일 생성 (`public/posts/새파일.html`)

필수 HTML 구조 (이 순서를 **반드시** 지켜야 함):

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>글 제목 - Melon Seeds</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        /* 플로팅 TOC 스타일 (아래 참조) */
        /* 포스트 고유 스타일 */
    </style>
</head>
<body>

<!-- 1. 상단 네비게이션 -->
<nav class="top-nav">
    <div class="top-nav-inner">
        <div style="display:flex; align-items:center; gap:12px;">
            <button class="sidebar-toggle" onclick="toggleSidebar()"><i class="fa-solid fa-bars"></i></button>
            <a href="../../index.html" class="nav-logo">
                <span class="nav-logo-title">Melon Seeds</span>
            </a>
        </div>
        <div class="nav-right">
            <div class="nav-search"><i class="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="검색..."></div>
            <button class="nav-auth" id="nav-lock" onclick="showAuthModal()"><i class="fa-solid fa-lock"></i> 비공개</button>
        </div>
    </div>
</nav>

<!-- 2. 플로팅 TOC (page-layout 바깥!) -->
<div class="floating-toc" id="floating-toc">
    <div class="toc-row1" id="toc-row1">
        <a href="#sec-1" data-section="sec-1">섹션1</a>
        <a href="#sec-2" data-section="sec-2">섹션2</a>
    </div>
    <div class="toc-row2 hidden" id="toc-row2"></div>
</div>

<!-- 3. 페이지 레이아웃 (sidebar + main) -->
<div class="page-layout">
    <aside class="sidebar" id="sidebar"></aside>
    <main class="main-content">
        <article class="post-detail">
            <div class="post-detail-header">
                <div class="post-card-tags">
                    <span class="post-tag public">PUBLIC</span>
                    <span class="post-tag cat">카테고리명</span>
                </div>
                <h1>글 제목</h1>
                <div class="post-detail-meta">
                    <span><i class="fa-regular fa-calendar"></i> 2026-04-08</span>
                    <span><i class="fa-regular fa-clock"></i> 15 min read</span>
                </div>
            </div>

            <div class="post-detail-body" id="post-body">
                <!-- 본문 내용 -->
            </div>

            <!-- ★ 이전/다음 글 네비게이션 영역 -->
            <div class="post-nav-bottom" id="post-nav-bottom">
                <a href="../index.html"><i class="fa-solid fa-arrow-left"></i> 목록으로</a>
            </div>
        </article>
    </main>
</div>

<!-- 4. 푸터 -->
<div class="site-footer"><span class="melon-icon sm"></span> Melon Seeds &mdash; Powered by GitHub Pages &mdash; Generated with Claude</div>

<!-- 5. 인증 모달 -->
<div class="auth-overlay" id="auth-overlay">
    <div class="auth-box">
        <div class="auth-icon"><span class="melon-icon lg"></span></div>
        <h3>비공개 콘텐츠 인증</h3><p>비밀번호를 입력하면 비공개 글을 볼 수 있습니다.</p>
        <input type="password" id="auth-password" placeholder="비밀번호">
        <button class="auth-btn" onclick="handleLogin()">인증</button>
        <div class="auth-error" id="auth-error">비밀번호가 올바르지 않습니다.</div>
        <button class="auth-cancel" onclick="hideAuthModal()">취소</button>
    </div>
</div>

<!-- 6. 스크립트 (순서 중요) -->
<script src="../../assets/js/auth.js"></script>
<script src="../../assets/js/sidebar.js"></script>
<script src="../../assets/js/horizontal-scroll.js"></script>
<script src="../../assets/js/post-nav.js"></script>
<script>
    renderSidebar('카테고리키');
    renderPostNav('카테고리키');

    // 플로팅 TOC 스크롤 감지
    const floatingToc = document.getElementById('floating-toc');
    const row1Links = document.querySelectorAll('#toc-row1 a');
    const allH2 = document.querySelectorAll('h2[id]');
    window.addEventListener('scroll', () => {
        const postBody = document.getElementById('post-body');
        if (postBody) floatingToc.classList.toggle('visible', postBody.getBoundingClientRect().top < 0);
        let curH2 = '';
        allH2.forEach(h => { if (h.getBoundingClientRect().top < 150) curH2 = h.id; });
        row1Links.forEach(a => a.classList.toggle('active', a.dataset.section === curH2));
    });
</script>
</body>
</html>
```

---

### 3-2. `assets/js/post-nav.js` 에 글 등록

`POST_NAV_DATA` 객체의 해당 카테고리 배열에 추가:

```js
'카테고리키': [
    { file: '파일명.html', title: '글 제목' },
    // ... 기존 항목 ...
    { file: '새파일.html', title: '새 글 제목' },  // ← 추가
],
```

순서 = 학습/읽기 순서 (이전글/다음글 결정)

---

### 3-3. `public/index.html` 에 카드 추가

`<div id="posts-list">` 안에 카드 HTML 추가:

```html
<div class="post-card" data-cat="상위 중위 하위" data-date="2026-04-08" data-order="순번">
    <div class="post-thumb"><i class="fa-solid fa-아이콘"></i></div>
    <div class="post-card-body">
        <div class="post-card-tags">
            <span class="post-tag public">PUBLIC</span>
            <span class="post-tag cat">카테고리표시명</span>
        </div>
        <h3><a href="posts/파일명.html">글 제목</a></h3>
        <p class="excerpt">한줄 요약.</p>
        <div class="post-card-footer">
            <span><i class="fa-regular fa-calendar"></i> 2026-04-08</span>
            <span><i class="fa-regular fa-clock"></i> 15 min</span>
        </div>
    </div>
</div>
```

**data-cat 규칙**: 공백 구분으로 상위→하위 모두 포함
- ISTQB 글: `data-cat="growth growth-cert growth-cert-istqb"`
- TOEIC 글: `data-cat="growth growth-lang growth-lang-toeic"`
- 도구 글: `data-cat="tool"`
- 센서 글: `data-cat="tech tech-sensor"`

**data-order**: 학습 순서가 있는 카테고리(ISTQB, TOEIC 등)에서 순서 번호.
ORDERED_CATS에 등록된 카테고리는 date 대신 order로 정렬됨.

---

### 3-4. `index.html` (홈페이지) 에도 카드 추가

홈페이지의 최근 글 섹션에도 동일한 카드 HTML 추가 (data-order 불필요).

---

## 4. 카테고리 체계

### 현재 카테고리 키 목록
| 키 | 표시명 | 아이콘 |
|----|--------|--------|
| dev | 개발 공부 | fa-code |
| dev-lang | 언어 (C++, Python 등) | fa-code |
| dev-cv | CV (Computer Vision) | fa-eye |
| dev-theory | 프로그래밍 이론 | fa-book |
| tech | 기술 공부 | fa-microscope |
| tech-sensor | 센서 / ISP | fa-microchip |
| tech-stereo | 3D 스테레오 비전 | fa-cube |
| tech-ai | AI / OpenAI | fa-robot |
| tech-factory | 스마트 공장 | fa-industry |
| tech-comm | 통신/인터페이스 | fa-network-wired |
| trend | 기술 트렌드 | fa-satellite-dish |
| tool | 도구/환경 설정 | fa-screwdriver-wrench |
| debug | 트러블슈팅 | fa-bug |
| growth | 자기계발 | fa-seedling |
| growth-lang | 어학 | fa-language |
| growth-lang-toeic | TOEIC | fa-language |
| growth-cert | 자격증 | fa-award |
| growth-cert-istqb | ISTQB FL | fa-award |
| tech-halcon | HALCON 비전 라이브러리 | fa-microscope |
| book | 책/강의 후기 | fa-book-open |

### 새 카테고리 추가 시 수정할 파일 ⚠️ 4곳 모두 빠짐없이!

> 한 곳이라도 누락되면 카테고리 페이지가 작동하지 않는다. 4곳 전부 수정 후 배포할 것.

1. **`assets/js/sidebar.js`** — `publicCats` 배열의 해당 부모 카테고리 `subs`에 `{ id, label }` 추가
   - 예: `subs: [..., { id: 'tech-halcon', label: 'HALCON 비전 라이브러리' }]`
2. **`assets/js/post-nav.js`** — 두 곳 모두 추가
   - `POST_NAV_DATA['새카테고리id']` = 글 목록 배열 (`{ file, title }`)
   - `CAT_LABELS['새카테고리id']` = 짧은 라벨 (목록 버튼 표시용)
3. **`public/index.html`** ⚠️ **두 곳 모두 추가**
   - `CAT_NAMES['새카테고리id']` = 사이드바/페이지 타이틀에 쓰는 이름 → 누락 시 **filterAndSort에서 `!CAT_NAMES[cat]`이 true가 되어 카테고리 필터가 비활성화됨**. 즉, 해당 카테고리만 골라서 보여줘야 하는데 모든 카드를 다 보여주는 버그가 발생.
   - `CAT_ICONS['새카테고리id']` = Font Awesome 아이콘 클래스 → 페이지 헤더 아이콘
4. 학습 순서 카테고리면 → `public/index.html`의 `ORDERED_CATS` 배열에도 추가
   - 카드에 `data-order="N"` 속성도 함께 부여해야 작동

### 새 카테고리 검증 방법

배포 후 `?cat=새카테고리id` URL에서 다음을 확인:
- [ ] 페이지 타이틀이 카테고리 이름으로 바뀌었는가? (안 바뀌면 → CAT_NAMES 누락)
- [ ] 다른 카테고리 글이 섞여 보이지 않는가? (섞여 보이면 → CAT_NAMES 누락)
- [ ] 사이드바에서 해당 카테고리가 활성 표시되는가? (안 되면 → sidebar.js 누락)
- [ ] 글 페이지 하단의 "이전 글/다음 글"이 작동하는가? (안 되면 → post-nav.js 누락)

---

## 5. 정렬 시스템

`public/index.html`의 filterAndSort() 함수:
- 일반 카테고리: date 기준 정렬 (최신순/오래된순)
- ORDERED_CATS 카테고리: data-order 기준 정렬 (최신순=역순, 오래된순=순서대로)
- ORDERED_CATS = `['growth-cert', 'growth-cert-istqb', 'growth-lang', 'growth-lang-toeic', 'tech-halcon']`
  (학습 순서대로 정렬할 시리즈 카테고리. 새로 추가하면 이 배열도 업데이트할 것.)

---

## 6. 포스트 본문에서 자주 쓰는 컴포넌트

```html
<!-- 요약 박스 -->
<div class="summary-box">
    <div class="summary-title"><i class="fa-solid fa-seedling"></i> 이 글에서 다루는 내용</div>
    <ul><li>항목1</li><li>항목2</li></ul>
</div>

<!-- 섹션 제목 (TOC 연동) -->
<h2 id="sec-1">1. 섹션 제목</h2>

<!-- 핵심 포인트 박스 -->
<div class="key-point"><strong>핵심:</strong> 설명</div>

<!-- 참고 자료 (글 마지막) -->
<div class="references">
    <div class="ref-title"><i class="fa-solid fa-book-bookmark"></i> 참고 자료</div>
    <ul><li><a href="URL" target="_blank" rel="noopener">제목</a></li></ul>
</div>
```

---

## 7. 플로팅 TOC 인라인 스타일 (모든 포스트 `<head>` 안에 포함)

```css
.floating-toc {
    position: fixed; top: 58px; left: 0; right: 0;
    background: rgba(255,255,255,0.97); backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
    z-index: 90; display: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.floating-toc.visible { display: block; }
.toc-row1 {
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px 0 calc(var(--sidebar-w) + 40px);
    display: flex; gap: 0; overflow-x: auto;
    scrollbar-width: none;
}
.toc-row1::-webkit-scrollbar { display: none; }
.toc-row1 a {
    padding: 9px 14px; font-size: 0.78rem; font-weight: 600;
    color: var(--text-muted); text-decoration: none; white-space: nowrap;
    border-bottom: 2px solid transparent; transition: all 0.15s;
}
.toc-row1 a:hover { color: var(--primary); }
.toc-row1 a.active { color: var(--primary); border-bottom-color: var(--primary); }
.toc-row2 {
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px 0 calc(var(--sidebar-w) + 40px);
    display: flex; gap: 0; overflow-x: auto;
    scrollbar-width: none; border-top: 1px solid var(--border-light);
}
.toc-row2::-webkit-scrollbar { display: none; }
.toc-row2.hidden { display: none; }
.toc-row2 a {
    padding: 7px 14px; font-size: 0.73rem; font-weight: 500;
    color: var(--text-light); text-decoration: none; white-space: nowrap;
    transition: all 0.15s;
}
.toc-row2 a:hover { color: var(--primary); }
.toc-row2 a.active { color: var(--primary); font-weight: 600; }
```

---

## 8. 체크리스트

### 8-1. 새 글 추가 시
- [ ] `public/posts/파일명.html` 생성 (UTF-8 BOM, 위 템플릿 구조 준수)
- [ ] HTML 구조 확인: top-nav → floating-toc(바깥) → page-layout(sidebar+main)
- [ ] `post-nav-bottom` 클래스 확인 (post-nav 아님!)
- [ ] `assets/js/post-nav.js` POST_NAV_DATA에 등록
- [ ] `public/index.html` 카드 추가 (data-cat, data-date, data-order)
- [ ] `index.html` (홈) 카드 추가
- [ ] `python deploy.py`로 배포
- [ ] 배포 후 카테고리 페이지에서 새 글이 보이는지 확인

### 8-2. 새 카테고리 추가 시 ⚠️ 누락 1건만 있어도 카테고리 페이지가 깨진다

- [ ] `assets/js/sidebar.js` — publicCats의 subs 배열에 `{ id, label }` 추가
- [ ] `assets/js/post-nav.js` — `POST_NAV_DATA['새id']` 배열 추가
- [ ] `assets/js/post-nav.js` — `CAT_LABELS['새id']` 라벨 추가
- [ ] `public/index.html` — **`CAT_NAMES['새id']` 추가** (필수! 누락 시 필터 비활성화)
- [ ] `public/index.html` — **`CAT_ICONS['새id']` 추가** (페이지 헤더 아이콘)
- [ ] 학습 순서 시리즈면 `ORDERED_CATS` 배열에도 추가
- [ ] 카드 작성 시 `data-cat="부모 자식"` 형태 (예: `data-cat="tech tech-halcon"`)
- [ ] 학습 순서 시리즈면 카드에 `data-order="N"` 부여
- [ ] 배포 후 `?cat=새id`에서 페이지 타이틀이 카테고리명으로 바뀌었는지, 다른 글이 섞이지 않는지 확인

---

## 9. 과거 실수 사례집 — 이 실수를 절대 반복하지 마

> 이전에 AI가 포스트를 생성하면서 발생한 실제 버그들이다.
> 새 글을 만들 때 아래 항목을 하나씩 체크해라.

---

### 실수 1: HTML 골격 구조 누락/변형 → 레이아웃 완전 깨짐

**증상**: 사이드바, 상단바, 본문 배치가 전부 깨진다.

**실제로 일어난 일**:
- `floating-toc`을 `page-layout` **안에** 넣음 → TOC가 본문에 묻힘 (glossary.html)
- `<div class="page-layout">` 자체를 빠뜨림 → 전체 레이아웃 붕괴 (glossary.html, compare.html)
- `page-layout` 대신 `content-wrapper`, `layout` 같은 임의 클래스를 씀 → CSS 적용 안 됨 (compare.html, mock1.html)
- `<nav class="top-nav">` 누락 → 상단 네비게이션 바 사라짐 (glossary.html, mock1.html)

**규칙**: 아래 순서를 한 글자도 바꾸지 말 것. 클래스명도 정확히 일치해야 한다.
```
<nav class="top-nav">...</nav>
<div class="floating-toc" id="floating-toc">...</div>   ← page-layout 바깥!
<div class="page-layout">
    <aside class="sidebar" id="sidebar"></aside>
    <main class="main-content">
        <article class="post-detail">...</article>
    </main>
</div>
```

---

### 실수 2: `post-nav-bottom` 클래스명 오타 → 이전/다음 글 안 나옴

**증상**: 글 하단에 "이전 글 / 목록 / 다음 글" 3칸 네비게이션이 안 보인다.

**실제로 일어난 일**: mock2.html에서 `<div class="post-nav" id="post-nav">`로 생성함.
`post-nav.js`가 `document.querySelector('.post-nav-bottom')`으로 찾기 때문에 매칭 실패.

**규칙**: 반드시 `<div class="post-nav-bottom" id="post-nav-bottom">` 이 정확한 문자열을 써야 한다.

---

### 실수 3: 매칭형 문제를 sub-question으로 분리 → 빈 선택지 + 중복 ID + 해설 불일치

**증상**: 선택지가 전부 빈칸이고, 해설이 엉뚱한 내용이며, 브라우저 콘솔에 중복 ID 경고가 뜬다.

**실제로 일어난 일** (Sample A~D 4개 파일 전부 해당):
- Q13 "장애 유형과 테스트 레벨을 올바르게 연결한 것은?" 문제:
  - 원본 PDF에는 항목 1~4와 코드 A~D가 있고, 선택지는 `a. 1D,2B,3A,4C` 같은 조합이다.
  - GPT가 이걸 매칭 항목별로 개별 question-card를 만들어버림 (Q1:"사용자 비즈니스 요구...", Q2:"컴포넌트 간 통신...")
  - sub-question의 선택지 `<span>` 안이 전부 비어 있음
  - sub-question에 `id="q1"`, `id="q2"` 부여 → 원래 Q1, Q2와 ID 충돌
  - sub-question 해설에 원래 Q1~Q3의 해설을 그대로 복붙 → 완전히 다른 내용
- 같은 패턴이 Q34(Sample A), Q17/Q34/Q39(Sample B), Q5/Q17(Sample C), Q4/Q17/Q29(Sample D)에서 반복됨

**규칙**: 매칭형 문제는 **절대 분리하지 말고** 하나의 question-card로 유지한다.
```html
<div class="question-card" id="q13">
    <div class="q-text">
        장애 유형과 테스트 레벨을 올바르게 연결한 것은?<br><br>
        1. 사용자의 비즈니스 요구와 다른 시스템 동작으로 인한 장애<br>
        2. 컴포넌트 간 통신 실패로 인한 장애<br>
        3. 코드 내 논리로 인한 장애<br>
        4. 올바르게 구현되지 않은 비즈니스 규칙으로 인한 장애<br><br>
        A. 단위 테스팅 / B. 단위 통합 테스팅 / C. 시스템 테스팅 / D. 인수 테스팅
    </div>
    <ul class="q-options" data-correct="a">
        <li data-val="a"><span class="opt-label">A</span><span>1D, 2B, 3A, 4C</span></li>
        <li data-val="b"><span class="opt-label">B</span><span>1D, 2B, 3C, 4A</span></li>
        <li data-val="c"><span class="opt-label">C</span><span>1B, 2A, 3D, 4C</span></li>
        <li data-val="d"><span class="opt-label">D</span><span>1C, 2B, 3A, 4D</span></li>
    </ul>
</div>
```

---

### 실수 4: HTML minify로 생성 → 디버깅 불가

**증상**: 파일이 100줄짜리 한 줄 HTML이라 어디가 잘못됐는지 찾을 수 없다.

**실제로 일어난 일**: mock2.html이 135줄짜리 minified HTML로 생성됨. 문제 발생 시 라인 번호로 추적 불가.

**규칙**: 가독성 있게 들여쓰기해서 생성한다. minify 절대 금지.

---

### 실수 5: 같은 날짜 카드끼리 정렬 순서가 뒤죽박죽

**증상**: ISTQB FL 카테고리 페이지에서 "공부 계획 → Ch1 → Ch2 → ..." 순서가 아니라 랜덤 순서로 나온다.

**실제로 일어난 일**: 새 글 5개를 모두 `data-date="2026-04-06"`으로 넣고, 기존 Ch1~6은 `data-date="2026-04-03"`. 날짜 기준 정렬하면 새 글이 전부 앞에 나오고, 같은 날짜 안에서는 DOM 순서에 의존해서 예측 불가능.

**규칙**: 학습 순서 카테고리 카드에는 반드시 `data-order="순번"`을 추가한다.
```html
<div class="post-card" data-cat="growth growth-cert growth-cert-istqb" data-date="2026-04-03" data-order="2">
```
ORDERED_CATS에 등록된 카테고리(`growth-cert-istqb`, `growth-lang-toeic` 등)는 date 대신 data-order 기준으로 정렬된다.

---

### 실수 6: PDF 머리글/바닥글이 본문에 섞여 들어옴

**증상**: 해설 텍스트 중간에 "Korean Software Testing Qualifications Board www.kstqb.org 5 of 31" 같은 쓰레기 문자열이 끼어 있다.

**실제로 일어난 일**: PDF에서 텍스트 추출할 때 페이지 헤더/푸터가 본문과 구분 없이 추출됨.

**규칙**: PDF 추출 후 아래 패턴을 전부 제거할 것:
- `Korean Software Testing Qualifications Board`
- `www.kstqb.org`
- `N of M` (페이지 번호 패턴)
- `info@kstqb.org`

---

### 실수 7: 5지선다 / 복수정답 문제를 일반 4지선다로 처리

**증상**: 원래 5개 선택지(a~e)인 문제에서 선택지가 4개만 나오거나, 정답이 2개인데 1개만 표시됨.

**실제로 일어난 일**: ISTQB에는 "2개 선택" 문제가 있다 (예: Q6 "다음 중 테스터가 수행하는 작업 두 가지는?" → 정답 a, e). 이걸 일반 4지선다로 만들면 선택지 e가 누락된다.

**규칙**:
- 선택지가 5개(a~e)면 `<li>` 5개 전부 생성
- 복수정답이면 해설에 "정답: A, E" 식으로 명확히 표시
- 채점 JS에서 복수정답 처리 로직 추가 (data-correct="a,e" 같은 형태)

---

### 실수 8: 새 카테고리 추가 시 `CAT_NAMES`/`CAT_ICONS` 누락 → 카테고리 페이지가 작동 안 함

**증상**:
- `?cat=새카테고리id` URL로 들어갔는데 페이지 타이틀이 "Public Posts" 그대로 (카테고리명으로 안 바뀜)
- 해당 카테고리만 보여야 하는데 다른 카테고리 글이 전부 섞여 보임 (또는 카드가 사라진 것처럼 보임)
- 사이드바에서 카테고리 활성 표시는 정상이라 더 헷갈림

**실제로 일어난 일** (HALCON 시리즈 게시 시):
- `sidebar.js`, `post-nav.js`, `index.html` 카드, `ORDERED_CATS`까지는 모두 추가했으나
- `public/index.html`의 `CAT_NAMES`/`CAT_ICONS` 객체에 `tech-halcon` 키 추가를 빠뜨림
- 결과: filterAndSort()의 `const show = !cat || !CAT_NAMES[cat] || cats.includes(cat);` 라인에서 `!CAT_NAMES['tech-halcon']`이 true가 되어 모든 카드가 표시됨 (필터 비활성화)
- 동시에 `if (cat && CAT_NAMES[cat])` 조건이 false라 페이지 타이틀이 안 바뀜

**규칙**:
- 새 카테고리는 **반드시 5곳** 모두 추가해야 한다: `sidebar.js`(1) + `post-nav.js`(POST_NAV_DATA, CAT_LABELS 2곳) + `index.html`(CAT_NAMES, CAT_ICONS 2곳)
- ORDERED_CATS는 학습 순서 시리즈에만 추가 (선택)
- 이게 가장 자주 까먹는 단계. **위 8-2 체크리스트를 반드시 한 번 훑고 배포할 것.**
- 배포 후 검증: `?cat=새id`에서 ① 페이지 타이틀이 바뀌었는가 ② 다른 카테고리 글이 섞이지 않는가 — 둘 중 하나라도 NG면 CAT_NAMES 누락이다.

---

## 10. PDF 기반 문제/시험 콘텐츠 변환 시 주의사항

- 정답/해설은 **정답 PDF에서 직접 추출**해 번호별로 다시 매핑한다.
- 매칭형은 번호-선택지 짝을 **두 번 검증**한다 (실수 3 참조).
- question id는 `q1`부터 `q40`까지 **중복 없이** 순차 부여한다.
- 문제 텍스트에 표(결정 테이블, 상태 전이도, 추적성 행렬 등)가 있으면 HTML `<table>`로 변환한다.
- PDF의 불릿 기호가 깨져 나오면 `<br>` 또는 `<ul><li>`로 정리한다.
- 생성 완료 후 브라우저에서 열어 Q1~Q40 전부 눈으로 확인한다. 특히 매칭형 문제와 표가 있는 문제를 집중 점검한다.
