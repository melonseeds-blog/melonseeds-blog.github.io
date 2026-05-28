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
                    <span><i class="fa-regular fa-clock"></i> 약 15분 분량</span>
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
            <span><i class="fa-regular fa-clock"></i> 15분</span>
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
- [ ] **`index.html` (루트/홈) 카드 추가** ⚠️ **가장 자주 까먹는 단계 — 실수 10 참조**
- [ ] **시리즈성 글이거나 새 시리즈 첫 글이면 `series.html`도 업데이트** ⚠️ **실수 12 참조**
- [ ] 연습문제/시험문제가 있으면 **인터랙티브 퀴즈 패턴** 사용 (실수 13 참조)
- [ ] `python deploy.py`로 배포
- [ ] 배포 후 카테고리 페이지에서 새 글이 보이는지 확인
- [ ] **배포 후 루트 `index.html` "최근 게시물"에 새 글이 상단에 뜨는지 확인**
- [ ] **새 시리즈면 `series.html`에 카드가 노출되는지 확인**

> ⚠️ **카드는 반드시 세 곳에 넣는다.** `public/index.html`(카테고리별 목록), 루트 `index.html`(홈의 "최근 게시물"), 그리고 시리즈 첫 등장이면 `series.html`(시리즈 모음 페이지). 세 파일 **모두 카드 형식이 다르다** — 실수 10, 12 참조.

### 8-2. 새 카테고리 추가 시 ⚠️ 누락 1건만 있어도 카테고리 페이지가 깨진다

- [ ] `assets/js/sidebar.js` — publicCats의 subs 배열에 `{ id, label }` 추가
- [ ] `assets/js/post-nav.js` — `POST_NAV_DATA['새id']` 배열 추가
- [ ] `assets/js/post-nav.js` — `CAT_LABELS['새id']` 라벨 추가
- [ ] `public/index.html` — **`CAT_NAMES['새id']` 추가** (필수! 누락 시 필터 비활성화)
- [ ] `public/index.html` — **`CAT_ICONS['새id']` 추가** (페이지 헤더 아이콘)
- [ ] 학습 순서 시리즈면 `ORDERED_CATS` 배열에도 추가
- [ ] 카드 작성 시 `data-cat="부모 자식"` 형태 (예: `data-cat="tech tech-halcon"`)
- [ ] 학습 순서 시리즈면 카드에 `data-order="N"` 부여
- [ ] **새 최상위 카테고리면 루트 `index.html`의 `orbitData` 배열에 객체 추가** (실수 17 참조)
- [ ] 배포 후 `?cat=새id`에서 페이지 타이틀이 카테고리명으로 바뀌었는지, 다른 글이 섞이지 않는지 확인
- [ ] **배포 후 홈(/index.html)에서 카테고리 아이콘이 궤도에 추가되고 Categories 숫자가 새 수로 바뀌는지 확인**

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

### 실수 8 (별도): 서술 톤이 다른 글들과 다름 → 시리즈 전체 재작업

**증상**: 새로 작성한 글이 기존 글들과 톤이 다르다. 기존 글은 "~한다, ~된다, ~이다" 평서체인데 새 글은 "~합니다, ~됩니다, ~입니다" 존댓말로 통일성이 깨진다.

**실제로 일어난 일** (HALCON 시리즈 10편): MD 원문이 "~합니다" 존댓말로 작성되어 있었고, HTML 변환 시 톤을 그대로 옮겨서 다른 카테고리(genicam-standard, ccd-vs-cmos 등)와 톤이 어긋남.

**규칙**:
- 이 블로그의 본문 톤은 **평서체("~한다")**다. "내가 직접 정리한 기록"이라는 1인칭 학습 노트 컨셉이라서 존댓말은 쓰지 않는다.
- MD 원문이 존댓말이어도 HTML 변환 시 평서체로 옮긴다.
- 자주 쓰는 변환:
  - 합니다 → 한다 / 됩니다 → 된다 / 입니다 → 이다 / 있습니다 → 있다 / 없습니다 → 없다
  - 같습니다 → 같다 / 많습니다 → 많다 / 좋습니다 → 좋다 / 어렵습니다 → 어렵다
  - 했습니다 → 했다 / 됐습니다 → 됐다
  - 형용사 어간 + 합니다 → 형용사 어간 + 하다 (예: "당연합니다" → "당연하다", "필요합니다" → "필요하다", "중요합니다" → "중요하다")
  - 동사 어간 + 합니다 → 동사 어간 + 한다 (예: "분석합니다" → "분석한다", "수행합니다" → "수행한다")
- 비교 기준 글: `public/posts/genicam-standard.html`, `public/posts/ccd-vs-cmos.html` 등 기존 tech 카테고리 글의 톤과 일치시킬 것.

---

### 실수 9: 새 카테고리 추가 시 `CAT_NAMES`/`CAT_ICONS` 누락 → 카테고리 페이지가 작동 안 함

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

### 실수 10: 루트 `index.html`(홈)에 카드 추가 누락 → "최근 게시물"에 새 글이 안 뜸

**증상**: 새 글을 잔뜩 올렸는데 `https://melonseeds-blog.github.io/index.html`(홈)의 "최근 게시물"에는 옛날 글이 최신으로 떠 있다. `public/index.html?cat=...`(카테고리 페이지)에서는 정상으로 보임.

**실제로 일어난 일** (한 세션에서 **두 번** 반복됨):
- 1차 — HALCON·C++·토익 시리즈를 만들고 `public/index.html`에만 카드를 넣고 루트 `index.html`을 빼먹음 → 홈에 ISTQB 옛 글이 최신으로 노출
- 2차 — 1차를 고친 직후 스마트 공장 14편에서 **똑같이** 루트 `index.html`을 또 빼먹음

**왜 자꾸 까먹나**: 카드를 넣어야 하는 파일이 **두 개**다.
| 파일 | 역할 | 카드 형식 |
|---|---|---|
| `public/index.html` | 카테고리별 목록 (`?cat=` 필터) | `data-cat`, `data-date`, `data-order` 모두 있음. href = `posts/파일.html` |
| `index.html` (루트) | 홈의 "최근 게시물" (날짜 내림차순) | `data-date`만 있음. **href = `public/posts/파일.html`** (public/ 접두사!) |

루트 `index.html`은 `#public-posts` div 안의 `.post-card[data-date]`를 `data-date` 내림차순으로 정렬한다. 카드가 없으면 그 글은 홈에 영원히 안 뜬다.

**규칙**:
- 새 글/시리즈 작업 시 **두 파일 모두**에 카드를 넣는다. 8-1 체크리스트의 "루트 index.html 카드 추가" 항목을 반드시 확인.
- 루트 카드는 형식이 다르다: `data-cat`/`data-order` 없이 `data-date`만, href에 `public/` 접두사. 한 줄 압축 형식 OK.
- 시리즈처럼 카드가 많으면 `public/index.html`에서 카드를 추출해 변환·삽입하는 일회용 스크립트를 쓰는 게 안전하다 (data-cat/data-order 제거 + href에 `public/` 추가 + `#public-posts` 앵커 뒤에 삽입).
- **배포 후 반드시 홈(`/index.html`)을 열어 새 글이 최근 게시물 상단에 뜨는지 눈으로 확인.**

---

### 실수 11: 루트 `index.html` 히어로 통계 숫자(Posts/Categories)가 하드코딩

**증상**: 홈 히어로 영역의 "Posts" 숫자가 실제 글 수와 다름 (예: 글이 170개인데 38로 표시).

**실제로 일어난 일**: `<div class="hero-stat-num" data-count="38">` 처럼 `data-count` 값이 하드코딩돼 있었음. 카운트업 애니메이션 JS는 이 값을 그대로 쓸 뿐이라, 글을 아무리 추가해도 숫자가 안 바뀜.

**해결(이미 적용됨)**: 카운트업 JS 앞에 `setHeroStats()` IIFE를 추가해 `#public-posts .post-card` 개수를 세서 `data-count`를 동적으로 채운다. 이제 글을 추가/삭제해도 자동 반영된다.

**규칙**:
- 루트 `index.html`의 통계 숫자는 **건드릴 필요 없다** — JS가 카드 수를 세서 자동 갱신한다.
- 새로 통계 항목을 추가할 거면 `data-count`에 숫자를 박지 말고 JS에서 동적으로 세도록 할 것.
- "개수"류 표시는 어디서든 하드코딩 금지 — 항상 실제 DOM/데이터를 세서 표시.

---

### 실수 12: 새 시리즈 만들었는데 `series.html`(시리즈 모음 페이지)을 업데이트 안 함

**증상**: 새 시리즈 18편을 만들고 카테고리/카드/배포까지 다 했는데, `https://melonseeds-blog.github.io/series.html`(시리즈 모음 페이지)에는 새 시리즈가 안 보임. 사용자가 시리즈 페이지에서 클릭할 진입로가 없어진다.

**실제로 일어난 일** (ISTQB CT-AI 18편 게시 후):
- `sidebar.js`, `post-nav.js`, `public/index.html`, 루트 `index.html`까지 모두 업데이트 했으나
- `series.html`에 카드를 추가하지 않아 새 시리즈가 시리즈 모음 페이지에서 누락됨
- 사용자가 "시리즈 페이지에 없네"라고 지적

**규칙**:
- **새 시리즈를 만들면 `series.html`에도 반드시 카드 추가.**
- 카드 위치: 도메인에 맞는 `.series-grid` 안 (개발 공부 / 기술 공부 / 자기계발 / 책)
- 카드 형식:
  ```html
  <a href="public/index.html?cat=새카테고리id" class="series-card">
      <div class="series-card-head">
          <div class="series-card-icon [dev|tech|growth|book]"><i class="fa-solid fa-아이콘"></i></div>
          <div class="series-card-title">시리즈 이름</div>
          <span class="series-card-count">N편</span>
      </div>
      <div class="series-card-desc">시리즈 한 줄 소개 (거시적·간결하게)</div>
      <div class="series-card-meta">
          <span><i class="fa-solid fa-book-open"></i> 키워드 · 키워드 · 키워드</span>
          <span class="series-cta">시리즈 보기 <i class="fa-solid fa-arrow-right"></i></span>
      </div>
  </a>
  ```

**시리즈 소개글 작성 가이드** (사용자 명시 요구):
- 책·기술·도구 이름을 **나열하지 말 것**. 모든 내용을 담으려는 욕심을 버린다.
- **거시적·범주적 표현**을 쓴다. 독자가 한눈에 "이 시리즈가 어떤 흐름인가"를 파악할 수 있어야 한다.
- **❌ 나쁨**: "C++(Effective Modern C++·Concurrency·Coding Standards), 비전(Szeliski·Learning OpenCV), AI(Deep Learning·Hands-On ML), 설계·품질(Clean Code·Refactoring·GoF·Clean Architecture·Pragmatic Programmer·Code Complete·TDD)."
- **✅ 좋음**: "C++ · 컴퓨터 비전 · AI · 설계/품질 분야 명저 14권의 핵심 요약과 실무 적용 메모."
- **❌ 나쁨**: "STL 기초부터 모던 C++(스마트 포인터·이동 의미론·constexpr), 동시성(스레드·async·atomic), 산업 적용(이미지 버퍼·플러그인·CMake)까지 단·중·장기 흐름."
- **✅ 좋음**: "STL부터 모던 C++·동시성·산업 적용까지 단·중·장기 흐름으로 정리한 C++ 학습 노트."
- meta 영역도 마찬가지: 키워드 3~4개 `·`로 구분, "기초 → 응용" 같은 흐름 표현 권장.

---

### 실수 13: 챕터 글 연습문제가 클릭 안 됨 — 비-인터랙티브 패턴 (label / details / quiz-toggle만 있고 채점 없음)

**증상**: 글에 객관식 문제와 "정답 확인" 버튼은 있지만, **보기를 클릭해도 아무 반응 없음**. 정답 확인을 눌러도 단순히 해설만 토글될 뿐 사용자가 고른 답이 맞았는지 색상으로 표시되지 않는다.

**실제로 일어난 일**: 챕터 글(CT-AI 9편, FL 6편)을 만들 때 Agent마다 다른 패턴을 썼다:
- 패턴 A — `<div class="exam-question">` + `<div class="q-options"><label>` (클릭 핸들러 없음)
- 패턴 B — `<div class="quiz-card">` + `<ol class="quiz-options"><li>` (정적 텍스트)
- 패턴 C — `<div class="quiz-box">` + `<ol type="a"><li>` + 정답이 항상 표시
- 패턴 D — `<details class="answer-box">` + 토글만 (sample-d·mock)

모두 "정답 확인 후 옳음/틀림 표시" 동작이 없어 학습 효과가 떨어졌다.

**규칙 — 객관식 문제는 반드시 인터랙티브 패턴 사용**:

```html
<div class="question-card quiz-interactive" data-answer="c">
    <div class="q-text">문제 본문</div>
    <ul class="q-options">
        <li data-val="a">a) 보기 1</li>
        <li data-val="b">b) 보기 2</li>
        <li data-val="c">c) 보기 3</li>
        <li data-val="d">d) 보기 4</li>
    </ul>
    <button class="quiz-check-btn" onclick="checkQuizAnswer(this)">정답 확인</button>
    <div class="quiz-answer">
        <p><strong>정답: c)</strong></p>
        <p>해설...</p>
    </div>
</div>
```

- **`data-answer`**: 정답 한 글자. 복수 정답이면 `data-answer="ac"`처럼 알파벳 정렬·소문자로 이어붙이기. JS가 자동으로 단일/복수 모드 분기.
- **`data-val`**: 각 보기의 식별자.
- 클릭 동작: 단일 정답이면 한 보기만 선택, 복수면 토글로 여러 개 선택.
- "정답 확인" 클릭 시: 정답은 초록, 선택한 오답은 빨강으로 표시 + `<div class="quiz-answer">`가 펼쳐짐.

**색상 표준 (사용자 명시 요구)**:
- **선택(selected)** = 파랑 `#2563eb`
- **정답(correct)** = 초록 `#16a34a`
- **오답(incorrect)** = 빨강 `#dc2626`
- CSS 적용 방법: 각 글 `<style>` 안에 "Quiz color standard" 주석 블록을 두고 `!important`로 강제.
- 적용 범위: 챕터 글 + 샘플문제 + 모의고사 — **모든 객관식 콘텐츠** 일관 적용.

**JS 함수 (모든 인터랙티브 글에 인라인 포함)**:
```js
document.querySelectorAll('.question-card .q-options li, .quiz-interactive .q-options li').forEach(li => {
    li.addEventListener('click', function() {
        const card = this.closest('.question-card, .quiz-interactive');
        const answer = (card.dataset.answer || '').toLowerCase();
        const multi = answer.length > 1;
        if (multi) {
            this.classList.toggle('selected');
        } else {
            this.parentElement.querySelectorAll('li').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        }
        this.parentElement.querySelectorAll('li').forEach(s => { s.classList.remove('correct'); s.classList.remove('incorrect'); });
    });
});

window.checkQuizAnswer = function(btn) {
    const card = btn.closest('.question-card, .quiz-interactive');
    const answer = (card.dataset.answer || '').toLowerCase();
    const opts = card.querySelectorAll('.q-options li');
    opts.forEach(li => {
        li.classList.remove('correct'); li.classList.remove('incorrect');
        const v = (li.dataset.val || '').toLowerCase();
        if (answer.includes(v)) li.classList.add('correct');
        else if (li.classList.contains('selected')) li.classList.add('incorrect');
    });
    const ans = card.querySelector('.quiz-answer, .answer-section');
    if (ans) ans.classList.add('show');
};
```

이미 작성된 글을 변환할 때는 정답 텍스트(`정답: c)` 패턴)에서 정답 글자를 추출해 `data-answer`로 옮기고, 보기를 `<li data-val>`로 바꾸는 일회용 스크립트로 처리한다.

---

### 실수 14: 변환 스크립트의 idempotency 체크 함정 — 함수 호출 텍스트와 함수 정의를 혼동

**증상**: 모든 챕터 글(15편)에 "정답 확인" 버튼은 있는데 클릭해도 아무 일도 안 일어남. 보기 클릭도 반응 없음. 정작 함수 정의가 한 번도 주입되지 않은 상태.

**실제로 일어난 일** (CT-AI/FL 챕터 글 인터랙티브화):
- 변환 스크립트가 중복 주입을 막으려고 이런 체크를 함:
  ```python
  if 'checkQuizAnswer' not in html:
      html += universal_js_with_function_definition
  ```
- 그런데 변환 1단계에서 이미 버튼을 `<button onclick="checkQuizAnswer(this)">`로 바꿔놓아서 HTML 안에 `checkQuizAnswer` 문자열이 등장함
- → `in` 체크가 true가 되어 **함수 정의 주입을 영구 스킵**
- 결과: 모든 챕터 파일에 클릭 핸들러도, `window.checkQuizAnswer` 정의도 없는 채로 배포됨

**규칙**:
- **idempotency 마커는 함수 호출(onclick)이 아니라, 주입할 코드 안에만 등장하는 고유 주석/문자열**로 잡는다. 예: `/* === Universal quiz interactivity v2 === */` 같은 마커 주석.
- 변환 스크립트 작성 시:
  ```python
  MARKER = '/* === Universal quiz interactivity v2 === */'
  if MARKER not in html:  # 함수명이 아니라 주석으로 체크
      html = inject_js(html, MARKER + js_body)
  ```
- 변환 후 자동 검증: `grep -c "window.checkQuizAnswer\s*=\s*function" 파일`로 함수 **정의**가 실제로 들어갔는지 확인. 0이면 실패.

---

### 실수 15: 변환 후 검증을 "함수 호출" 기준으로만 하고 "실제 클릭 동작"을 안 봤음

**증상**: 변환 스크립트가 "N blocks converted"라고 OK 보고하고 배포까지 했는데, 사용자가 페이지 열어보고 "클릭이 안 된다"고 지적해서야 발견.

**실제로 일어난 일**:
- 검증 로직: `if 'checkQuizAnswer' in html: print('OK')` — onclick 텍스트가 있으니 통과
- 함수 정의는 빠져 있고, 클릭 핸들러도 등록 안 됐는데 OK로 표시됨
- 마찬가지로 sample/mock 글의 경우: `showAnswer` 함수는 있지만 **해설 토글만 하고 채점은 안 함** — 검증이 "함수 존재" 까지만 보고 "기능 동작" 은 안 봐서 놓침

**규칙**:
- 인터랙티브 콘텐츠 검증은 **세 단계** 다 확인:
  1. **마크업**: `data-answer`, `<li data-val>` 모두 있는가
  2. **함수 정의**: `window.checkQuizAnswer = function` 또는 `function showAnswer` 본체가 실제로 파일에 있는가 (`grep -c "function\s*\(\s*btn\s*\)\s*{"` 같은 패턴)
  3. **기능 동작**: 함수 본문이 "선택된 li를 정답과 비교하고 correct/incorrect 클래스를 부여하는 로직"을 포함하는가
- 챕터/샘플/모의 글 인터랙티브 변환 후에는 **반드시 브라우저에서 실제로 클릭 테스트**. 정답 확인 → 초록/빨강 색상이 뜨는지 눈으로 확인. 자동 grep만 믿지 말 것.
- 한 번에 여러 파일 패치할 때는 패치 후 자동 검증 함수에 다음을 넣을 것:
  ```python
  # 함수 정의 존재 여부 (정확히 "= function" 또는 "function name(")
  fn_count = len(re.findall(r'window\.\w+\s*=\s*function|function\s+\w+\s*\(', html))
  # 클릭 이벤트 등록 여부
  listener = 'addEventListener(\'click\'' in html or "addEventListener(\"click\"" in html
  # 채점 로직 키워드 (correct/incorrect 클래스 부여)
  scoring = "classList.add('correct')" in html or 'classList.add("correct")' in html
  assert fn_count and listener and scoring, f'{path}: 인터랙티브 깨짐'
  ```

---

### 실수 18: 읽는 시간 표기를 영어 "N min read"로 노출

**증상**: 한국어 블로그에서 글 카드와 본문 메타 영역에 영어 표기 "N min read"가 그대로 노출돼 방문객이 "내가 N분 전에 읽었다고?" 식으로 의미를 오해.

**규칙**:
- 본문 메타 영역: `약 N분 분량` 사용 (예: `약 15분 분량`)
- 카드 영역: `N분` 사용 (공간이 작아 짧게)
- 영어 "min read", "min" 표기 금지

---

### 실수 17: 새 카테고리 추가 시 루트 `index.html`의 궤도 아이콘 배열(`orbitData`) 갱신 누락

**증상**: 새 카테고리(`course`)를 sidebar.js/post-nav.js/CAT_NAMES/CAT_ICONS 5곳에 등록했고 카드도 추가했는데, 홈(`/index.html`) 히어로의 궤도 아이콘에는 새 카테고리가 안 보이고 "Categories" 통계 숫자도 옛값(7) 그대로.

**실제로 일어난 일** (course 카테고리 추가 후):
- 5곳 카테고리 셋업은 완료
- 그러나 루트 `index.html` 안의 자체 `orbitData = [...]` 배열에 `course`를 추가 안 함 (그 배열은 sidebar.js의 publicCats와 별도로 존재했음)
- `<div data-count="7">Categories</div>` 가 하드코딩 (실수 11과 같은 함정)
- `setHeroStats` 함수는 'Posts'만 동적 갱신하고 'Categories'는 처리 안 함

**해결(이미 적용됨)**: `orbitData`를 **단일 source of truth**로 만들고, `setHeroStats`가 `orbitData.length`를 그대로 사용. 새 카테고리 추가 시 이 한 배열에만 추가하면 hero stat 숫자와 궤도 아이콘 양쪽이 자동 갱신.

**규칙**:
- 루트 `index.html`의 `orbitData` 배열은 홈 히어로의 카테고리 표시 SoT(Single Source of Truth)다.
- 새 최상위 카테고리를 만들면 **6곳** 수정: sidebar.js / post-nav.js의 POST_NAV_DATA·CAT_LABELS / public/index.html의 CAT_NAMES·CAT_ICONS / **루트 `index.html`의 `orbitData`**.
- `setHeroStats` 함수는 'Posts'·'Categories' 둘 다 자동 갱신하도록 작성돼 있으니, 하드코딩 절대 금지.
- 새 카테고리 셋업 시 8-2 체크리스트에 다음 한 줄을 추가하라: "루트 `index.html`의 `orbitData`에 새 카테고리 객체 추가".

---

### 실수 16 (운영 절차): 사용자가 "정상 작동하냐?"고 물으면 grep으로만 답하지 말고 실제 동작 확인

**규칙**: 사용자가 "이거 작동해?", "다 됐어?" 같은 검증 질문을 했을 때:
- 단순히 "함수 존재함, OK" 같이 grep 결과만으로 단언하지 말 것.
- 함수 본문/시그니처를 한 번 읽거나, 동작 가능 여부를 정적으로라도 추론해 보고 답할 것.
- 필요하면 사용자에게 직접 한 페이지를 열어보라고 요청하는 게 낫다 — 추측해서 "OK"라고 했다가 틀리면 신뢰가 깨진다.

---

## 10. PDF 기반 문제/시험 콘텐츠 변환 시 주의사항

- 정답/해설은 **정답 PDF에서 직접 추출**해 번호별로 다시 매핑한다.
- 매칭형은 번호-선택지 짝을 **두 번 검증**한다 (실수 3 참조).
- question id는 `q1`부터 `q40`까지 **중복 없이** 순차 부여한다.
- 문제 텍스트에 표(결정 테이블, 상태 전이도, 추적성 행렬 등)가 있으면 HTML `<table>`로 변환한다.
- PDF의 불릿 기호가 깨져 나오면 `<br>` 또는 `<ul><li>`로 정리한다.
- 생성 완료 후 브라우저에서 열어 Q1~Q40 전부 눈으로 확인한다. 특히 매칭형 문제와 표가 있는 문제를 집중 점검한다.
