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

### ⚠️ 흔한 실수 (이전에 깨졌던 원인들)
- `floating-toc`을 `page-layout` 안에 넣으면 안 됨 → **바깥에** 배치
- `page-layout` div 누락 → 레이아웃 완전히 깨짐
- `top-nav` 누락 → 상단바 없어짐
- `post-nav-bottom` 클래스를 `post-nav`로 쓰면 → 이전/다음 글 안 나옴
- HTML을 minify하면 디버깅이 어려움 → **가독성 있게 작성** 권장

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
| book | 책/강의 후기 | fa-book-open |

### 새 카테고리 추가 시 수정할 파일
1. `assets/js/sidebar.js` — publicCats 배열에 추가
2. `assets/js/post-nav.js` — POST_NAV_DATA + CAT_LABELS에 추가
3. `public/index.html` — CAT_NAMES + CAT_ICONS 객체에 추가
4. 학습 순서 카테고리면 → public/index.html의 ORDERED_CATS 배열에도 추가

---

## 5. 정렬 시스템

`public/index.html`의 filterAndSort() 함수:
- 일반 카테고리: date 기준 정렬 (최신순/오래된순)
- ORDERED_CATS 카테고리: data-order 기준 정렬 (최신순=역순, 오래된순=순서대로)
- ORDERED_CATS = `['growth-cert', 'growth-cert-istqb', 'growth-lang', 'growth-lang-toeic']`

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

## 8. 체크리스트 (새 글 추가 시)

- [ ] `public/posts/파일명.html` 생성 (UTF-8 BOM, 위 템플릿 구조 준수)
- [ ] HTML 구조 확인: top-nav → floating-toc(바깥) → page-layout(sidebar+main)
- [ ] `post-nav-bottom` 클래스 확인 (post-nav 아님!)
- [ ] `assets/js/post-nav.js` POST_NAV_DATA에 등록
- [ ] `public/index.html` 카드 추가 (data-cat, data-date, data-order)
- [ ] `index.html` (홈) 카드 추가
- [ ] `python deploy.py`로 배포

## 9. PDF 기반 문제 변환 시 주의사항 (ISTQB 샘플문제 사례)
- PDF 추출 시 불릿 기호(,  등)가 공백 없이 붙어 나와 본문이 뭉개질 수 있다. 변환 스크립트에서 줄바꿈+기호로 치환(예: `` → `\n•`, `` → `\n-`) 후 HTML로 넣는다.
- 매칭형 문제는 sub-question으로 쪼개지 않도록 주의하고, 한 카드에 표(좌: 항목, 우: 코드)와 조합 보기(`1D,2B,3A,4C`)를 넣는다.
- 정답/해설은 정답 PDF에서 직접 추출해 번호별로 다시 매핑한다. 매칭형은 특히 번호-선택지 짝을 두 번 검증한다.
- question id(q1 등)가 중복되지 않았는지 생성 후 점검한다.
