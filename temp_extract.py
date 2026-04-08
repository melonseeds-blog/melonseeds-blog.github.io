import re, html, json
from pathlib import Path
from PyPDF2 import PdfReader

SETS = {
    "a": {
        "q_pdf": r"D:\\0. 클로드\\자료\\ISTQB\\ISTQB_FL_v4.0_샘플문제_A_v1.7_한글_v1.0.pdf",
        "a_pdf": r"D:\\0. 클로드\\자료\\ISTQB\\ISTQB_FL_v4.0_샘플문제_A_v1.7_정답과_해설_한글_v1.0.pdf",
        "title": "ISTQB FL 샘플문제 A",
        "file": "istqb-fl-sample-a.html",
    },
    "b": {
        "q_pdf": r"D:\\0. 클로드\\자료\\ISTQB\\ISTQB_FL_v4.0_샘플문제_B_v1.7_한글_v1.0.pdf",
        "a_pdf": r"D:\\0. 클로드\\자료\\ISTQB\\ISTQB_FL_v4.0_샘플문제_B_v1.7_정답과_해설_한글_v1.0.pdf",
        "title": "ISTQB FL 샘플문제 B",
        "file": "istqb-fl-sample-b.html",
    },
    "c": {
        "q_pdf": r"D:\\0. 클로드\\자료\\ISTQB\\ISTQB_FL_v4.0_샘플문제_C_v1.6_한글_v1.0.pdf",
        "a_pdf": r"D:\\0. 클로드\\자료\\ISTQB\\ISTQB_FL_v4.0_샘플문제_C_v1.6_정답과_해설_한글_v1.0.pdf",
        "title": "ISTQB FL 샘플문제 C",
        "file": "istqb-fl-sample-c.html",
    },
    "d": {
        "q_pdf": r"D:\\0. 클로드\\자료\\ISTQB\\ISTQB_FL_v4.0_샘플문제_D_v1.5_한글_v1.0.1.pdf",
        "a_pdf": r"D:\\0. 클로드\\자료\\ISTQB\\ISTQB_FL_v4.0_샘플문제_D_v1.5_정답과_해설_한글_v1.0.pdf",
        "title": "ISTQB FL 샘플문제 D",
        "file": "istqb-fl-sample-d.html",
    },
}

# 매칭형/특수형 수동 오버라이드 (정확도 보장)
# key: (set_key, question_number)
MATCH_OVERRIDES = {
    ('a', 13): {
        'stem': "장애 유형과 테스트 레벨을 올바르게 연결한 것은?",
        'items_left': [
            "1. 사용자의 비즈니스 요구와 다른 시스템 동작으로 인한 장애",
            "2. 컴포넌트 간 통신 실패로 인한 장애",
            "3. 코드 내 논리로 인한 장애",
            "4. 올바르게 구현되지 않은 비즈니스 규칙으로 인한 장애",
        ],
        'items_right': [
            "A. 단위 테스팅", "B. 단위 통합 테스팅", "C. 시스템 테스팅", "D. 인수 테스팅",
        ],
        'options': {
            'a': "1D, 2B, 3A, 4C",
            'b': "1D, 2B, 3C, 4A",
            'c': "1B, 2A, 3D, 4C",
            'd': "1C, 2B, 3A, 4D",
        },
        'correct': 'a',
        'explain': "요구 불일치→인수(D), 인터페이스 결함→통합(B), 코드 로직→단위(A), 비즈니스 규칙 구현 오류→시스템(C).",
    },
    ('a', 34): {
        'stem': "테스트 유형과 애자일 테스팅 사분면을 올바르게 짝지은 것은?",
        'items_left': [
            "1. 사용성 테스팅",
            "2. 단위 테스팅",
            "3. 기능 테스팅",
            "4. 신뢰성 테스팅",
        ],
        'items_right': [
            "A. 1사분면: 기술 측면, 개발팀 지원",
            "B. 2사분면: 비즈니스 측면, 개발팀 지원",
            "C. 3사분면: 비즈니스 측면, 제품 평가",
            "D. 4사분면: 기술 측면, 제품 평가",
        ],
        'options': {
            'a': "1C, 2A, 3B, 4D",
            'b': "1D, 2A, 3C, 4B",
            'c': "1C, 2B, 3D, 4A",
            'd': "1D, 2B, 3C, 4A",
        },
        'correct': 'a',
        'explain': "사용성은 제품평가(3사분면 C), 단위는 개발지원(1사분면 A), 기능은 개발지원(2사분면 B), 신뢰성은 제품평가(4사분면 D).",
    },
    ('b', 17): {
        'stem': "업무 설명과 리뷰 활동을 올바르게 연결한 것은?",
        'items_left': [
            "1. 평가할 품질 특성과 완료 조건을 선택",
            "2. 모든 사람이 작업 산출물에 접근 가능",
            "3. 작업 산출물에서 이상한 점을 식별",
            "4. 이상한 사항에 대해 논의",
        ],
        'items_right': [
            "A. 개별 리뷰", "B. 리뷰 착수", "C. 리뷰 계획", "D. 의사소통 및 분석",
        ],
        'options': {
            'a': "1B, 2C, 3D, 4A",
            'b': "1B, 2D, 3C, 4A",
            'c': "1C, 2A, 3B, 4D",
            'd': "1C, 2B, 3A, 4D",
        },
        'correct': 'd',
        'explain': "계획(C)→착수(B)→개별(A)→의사소통·분석(D) 순서로 매핑됨.",
    },
    ('b', 34): {
        'stem': "리스크와 완화 활동을 가장 적절하게 연결한 것은?",
        'items_left': [
            "1. 비효율적인 루프 구현으로 시스템 응답 지연",
            "2. 소비자 선호도 변경",
            "3. 서버룸 침수",
            "4. 특정 연령 이상의 환자가 부정확한 보고서 수신",
        ],
        'items_right': [
            "A. 리스크 수용", "B. 성능 효율성 테스팅", "C. 테스트 기법: 경계값 분석", "D. 리스크 전가",
        ],
        'options': {
            'a': "1C, 2D, 3A, 4B",
            'b': "1B, 2D, 3A, 4C",
            'c': "1B, 2A, 3D, 4C",
            'd': "1C, 2A, 3D, 4B",
        },
        'correct': 'c',
        'explain': "지연→성능테스트(B), 선호도변경→수용(A), 침수→전가(D), 연령 경계 오류→BVA(C).",
    },
    ('b', 39): {
        'stem': "도구 설명과 도구 분류를 가장 적절하게 연결한 것은?",
        'items_left': [
            "1. 작업 흐름 추적 지원",
            "2. 의사소통 촉진",
            "3. 가상 머신",
            "4. 리뷰 지원",
        ],
        'items_right': [
            "A. 정적 테스팅 도구",
            "B. 확장성/배포 표준화 지원 도구",
            "C. 데브옵스 도구",
            "D. 협업 도구",
        ],
        'options': {
            'a': "1A, 2B, 3C, 4D",
            'b': "1B, 2D, 3C, 4A",
            'c': "1C, 2D, 3B, 4A",
            'd': "1D, 2C, 3A, 4B",
        },
        'correct': 'c',
        'explain': "CI/CD·워크플로우→데브옵스(C), 소통→협업(D), VM→배포표준화(B), 리뷰→정적도구(A).",
    },
    ('c', 5): {
        'stem': "테스트웨어 유형과 테스트 활동을 올바르게 연결한 것은?",
        'items_left': [
            "1. 커버리지 항목",
            "2. 변경 요청",
            "3. 테스트 실행 일정",
            "4. 테스트 컨디션 우선순위",
        ],
        'items_right': [
            "A. 테스트 분석", "B. 테스트 설계", "C. 테스트 구현", "D. 테스트 완료",
        ],
        'options': {
            'a': "1B, 2D, 3C, 4A",
            'b': "1B, 2D, 3A, 4C",
            'c': "1D, 2C, 3A, 4B",
            'd': "1D, 2C, 3B, 4A",
        },
        'correct': 'a',
        'explain': "커버리지모델→설계(B), 변경요청→완료(D), 실행일정→구현(C), 컨디션우선순위→분석(A).",
    },
    ('c', 17): {
        'stem': "리뷰 유형과 설명을 올바르게 연결한 것은?",
        'items_left': [
            "1. 기술 리뷰", "2. 비공식 리뷰", "3. 인스펙션", "4. 워크쓰루",
        ],
        'items_right': [
            "A. 합의 도출·아이디어 도출·저자 개선 의지 향상",
            "B. 리뷰어 훈련, 공감대 형성, 잠재 결함 식별",
            "C. 잠재 결함 식별, 프로세스 개선 지표 수집",
            "D. 잠재 결함 식별, 공식 결과 문서 작성 없음",
        ],
        'options': {
            'a': "1A, 2B, 3C, 4D",
            'b': "1A, 2D, 3C, 4B",
            'c': "1B, 2C, 3D, 4A",
            'd': "1C, 2D, 3A, 4B",
        },
        'correct': 'b',
        'explain': "기술리뷰는 합의/아이디어(A), 비공식은 문서 없음(D), 인스펙션은 결함+지표(C), 워크쓰루는 훈련/공감대(B).",
    },
    ('d', 4): {
        'stem': "테스트 업무와 테스트 활동을 올바르게 연결한 것은?",
        'items_left': [
            "1. 테스트 컨디션에서 테스트 케이스 도출",
            "2. 재사용 가능한 테스트웨어 식별",
            "3. 테스트 케이스를 테스트 절차로 구성",
            "4. 테스트 베이시스 및 테스트 대상 평가",
        ],
        'items_right': [
            "A. 테스트 분석", "B. 테스트 설계", "C. 테스트 구현", "D. 테스트 완료",
        ],
        'options': {
            'a': "1B, 2A, 3D, 4C",
            'b': "1B, 2D, 3C, 4A",
            'c': "1C, 2A, 3B, 4D",
            'd': "1C, 2D, 3A, 4B",
        },
        'correct': 'b',
        'explain': "컨디션→케이스 도출=설계(B), 재사용 식별=완료(D), 케이스 절차화=구현(C), 베이시스 평가=분석(A).",
    },
    ('d', 17): {
        'stem': "리뷰 활동을 올바른 순서로 나열한 것은?",
        'items_left': [
            "1. 감지된 이상현상 논의 및 상태/소유권/조치 결정",
            "2. 이슈 기록 후 업데이트 처리",
            "3. 리뷰어가 건의사항·질문 도출 및 이상현상 식별",
            "4. 집중적 리뷰를 위해 목적/일정 설정",
            "5. 리뷰 대상 접근 권한 제공",
        ],
        'items_right': [],
        'options': {
            'a': "4-3-5-2-1",
            'b': "4-5-3-1-2",
            'c': "5-4-1-3-2",
            'd': "5-4-3-2-1",
        },
        'correct': 'b',
        'explain': "권한 제공(5) 전에 목적/일정 설정(4), 준비/식별(3), 회의 논의(1), 사후 조치(2) 순.",
    },
}
HEADER = """<!DOCTYPE html>
<html lang='ko'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>$TITLE - Melon Seeds</title>
<link rel='stylesheet' href='../../assets/css/style.css'>
<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'>
<style>
.floating-toc{position:fixed;top:58px;left:0;right:0;background:rgba(255,255,255,.97);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);z-index:90;display:none;box-shadow:0 2px 8px rgba(0,0,0,.05)}
.floating-toc.visible{display:block}
.toc-row1{max-width:1280px;margin:0 auto;padding:0 40px 0 calc(var(--sidebar-w) + 40px);display:flex;gap:0;overflow-x:auto;scrollbar-width:none}
.toc-row1::-webkit-scrollbar{display:none}
.toc-row1 a{padding:9px 14px;font-size:.78rem;font-weight:600;color:var(--text-muted);text-decoration:none;white-space:nowrap;border-bottom:2px solid transparent;transition:all .15s}
.toc-row1 a:hover{color:var(--primary)}
.toc-row1 a.active{color:var(--primary);border-bottom-color:var(--primary)}
.summary-box{background:linear-gradient(135deg,var(--primary-50),var(--seed-light));border:1px solid var(--melon-light);border-left:4px solid var(--melon);border-radius:0 12px 12px 0;padding:20px 24px;margin-bottom:32px}
.summary-title{font-family:'Pretendard',sans-serif;font-weight:700;font-size:.95rem;color:var(--primary-dark);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.question-card{background:var(--card-bg);border:1px solid var(--border);border-radius:14px;padding:24px;margin:20px 0;transition:box-shadow .2s}
.question-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.06)}
.q-header{display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap}
.q-number{display:inline-block;background:var(--primary);color:#fff;font-weight:700;font-size:.85rem;padding:3px 12px;border-radius:12px}
.q-chapter{display:inline-block;background:var(--seed-light);color:var(--seed-dark,#7c6a3a);font-weight:600;font-size:.75rem;padding:2px 10px;border-radius:10px;border:1px solid #e0d4b8}
.q-lo{font-size:.72rem;color:var(--text-muted);margin-left:auto}
.q-text{font-weight:600;margin-bottom:12px;line-height:1.7;font-size:.95rem}
.q-options{list-style:none;padding:0;margin:0}
.q-options li{padding:10px 16px;margin:6px 0;border-radius:10px;border:2px solid var(--border);cursor:pointer;font-size:.9rem;line-height:1.6;transition:.15s;display:flex;align-items:flex-start;gap:10px}
.q-options li:hover{border-color:var(--primary);background:var(--primary-50)}
.q-options li.selected{border-color:var(--primary);background:var(--primary-50);font-weight:600}
.q-options li.correct{border-color:#10b981;background:#ecfdf5}
.q-options li.wrong{border-color:#ef4444;background:#fef2f2}
.q-options li .opt-label{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:var(--bg);border:2px solid var(--border);font-weight:700;font-size:.8rem;flex-shrink:0}
.answer-section{margin-top:16px;padding:16px;border-radius:12px;background:#f0fdf4;border:1px solid #bbf7d0;display:none;font-size:.88rem;line-height:1.7}
.answer-section.show{display:block}
.ans-title{font-weight:700;color:#065f46;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.btn-answer{margin-top:12px;background:var(--primary);color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:.85rem;font-weight:600;cursor:pointer;transition:opacity .15s}
.btn-answer:hover{opacity:.85}
</style>
</head>
<body>
<nav class='top-nav'><div class='top-nav-inner'><div style='display:flex;align-items:center;gap:12px;'><button class='sidebar-toggle' onclick='toggleSidebar()'><i class='fa-solid fa-bars'></i></button><a href='../../index.html' class='nav-logo'><span class='nav-logo-title'>Melon Seeds</span></a></div><div class='nav-right'><div class='nav-search'><i class='fa-solid fa-magnifying-glass'></i><input type='text' placeholder='검색...'></div><button class='nav-auth' id='nav-lock' onclick='showAuthModal()'><i class='fa-solid fa-lock'></i> 비공개</button></div></div></nav>
<div class='floating-toc' id='floating-toc'><div class='toc-row1' id='toc-row1'><a href='#sec-info' data-section='sec-info'>시험안내</a><a href='#sec-q1' data-section='sec-q1'>Q1-10</a><a href='#sec-q11' data-section='sec-q11'>Q11-20</a><a href='#sec-q21' data-section='sec-q21'>Q21-30</a><a href='#sec-q31' data-section='sec-q31'>Q31-40</a><a href='#sec-score' data-section='sec-score'>채점</a></div></div>
<div class='page-layout'><aside class='sidebar' id='sidebar'></aside><main class='main-content'><article class='post-detail'><div class='post-detail-header'><div class='post-card-tags'><span class='post-tag public'>PUBLIC</span><span class='post-tag cat'>자기계발</span></div><h1>$TITLE</h1><div class='post-detail-meta'><span><i class='fa-regular fa-calendar'></i> 2026-04-08</span><span><i class='fa-regular fa-clock'></i> 60 min read</span></div></div><div class='post-detail-body' id='post-body'>
<div class='summary-box'><div class='summary-title'><i class='fa-solid fa-seedling'></i> 이 글에서 다루는 내용</div><ul><li>$TITLE 40문항을 인터랙티브로 제공합니다.</li><li>정답 확인 버튼으로 즉시 피드백.</li><li>CTFL v4.0.1 형식 4지선다.</li></ul></div>
<h2 id='sec-info'><i class='fa-solid fa-circle-info'></i> 시험 안내</h2>
<p>ISTQB CTFL 샘플 모의고사 세트입니다. 40문항, 65분, 합격선 65% 기준으로 연습하세요.</p>
"""

FOOTER = """
</div>
<div class='score-section' id='sec-score'><h2><i class='fa-solid fa-trophy'></i> 채점 결과</h2><p style='color:var(--text-muted);margin-bottom:16px;'>모든 문제에 답한 후 채점 버튼을 누르세요.</p><button class='btn-score' onclick='calculateScore()'>채점하기</button><div id='score-result' style='display:none;margin-top:24px;'><div class='score-big' id='score-text'></div><div class='score-bar'><div class='score-bar-fill' id='score-bar-fill'></div></div><div class='score-detail' id='score-detail'></div><div id='score-verdict' style='margin-top:12px;'></div></div></div>
</div><div class='post-nav-bottom' id='post-nav-bottom'><a href='../index.html'><i class='fa-solid fa-arrow-left'></i> 목록으로</a></div></article></main></div>
<div class='site-footer'><span class='melon-icon sm'></span> Melon Seeds — Powered by GitHub Pages — Generated with Claude</div>
<div class='auth-overlay' id='auth-overlay'><div class='auth-box'><div class='auth-icon'><span class='melon-icon lg'></span></div><h3>비공개 콘텐츠 인증</h3><p>비밀번호를 입력하면 비공개 글을 볼 수 있습니다.</p><input type='password' id='auth-password' placeholder='비밀번호'><button class='auth-btn' onclick='handleLogin()'>인증</button><div class='auth-error' id='auth-error'>비밀번호가 올바르지 않습니다.</div><button class='auth-cancel' onclick='hideAuthModal()'>취소</button></div></div>
<script src='../../assets/js/auth.js'></script>
<script src='../../assets/js/sidebar.js'></script>
<script src='../../assets/js/horizontal-scroll.js'></script>
<script src='../../assets/js/post-nav.js'></script>
<script>
renderSidebar('growth-cert-istqb');
renderPostNav('growth-cert-istqb');
const floatingToc=document.getElementById('floating-toc');
const row1Links=document.querySelectorAll('#toc-row1 a');
const allH2=document.querySelectorAll('h2[id]');
window.addEventListener('scroll',()=>{let cur='';allH2.forEach(h=>{if(h.getBoundingClientRect().top<150)cur=h.id;});row1Links.forEach(a=>a.classList.toggle('active',a.dataset.section===cur));});
const answerKey=$ANSWER_KEY;
document.querySelectorAll('.q-options').forEach(ul=>{
    ul.querySelectorAll('li').forEach(li=>{
        li.addEventListener('click',()=>{
            ul.querySelectorAll('li').forEach(x=>x.classList.remove('selected'));
            li.classList.add('selected');
        });
    });
});
function showAnswer(btn){
    const card=btn.closest('.question-card');
    const ul=card.querySelector('.q-options');
    const ansDiv=card.querySelector('.answer-section');
    const qNum=parseInt(card.id.replace('q',''));
    const correct=answerKey[qNum];
    if(!ul||!correct) return;
    ul.querySelectorAll('li').forEach(x=>x.classList.remove('correct','wrong'));
    const sel=ul.querySelector('li.selected');
    if(sel){
        if(sel.dataset.val===correct){sel.classList.add('correct');}else{sel.classList.add('wrong');}
    }
    ansDiv.classList.toggle('show');
}
function calculateScore(){
    const total=Object.keys(answerKey).length;
    let correctCnt=0, answered=0;
    Object.keys(answerKey).forEach(k=>{
        const card=document.getElementById('q'+k);
        if(!card) return;
        const ul=card.querySelector('.q-options');
        const sel=ul.querySelector('li.selected');
        if(sel){
            answered++;
            if(sel.dataset.val===answerKey[k]) correctCnt++;
        }
        const btn=card.querySelector('.btn-answer');
        if(btn && !card.querySelector('.answer-section').classList.contains('show')) showAnswer(btn);
    });
    const pct=Math.round((correctCnt/total)*100);
    document.getElementById('score-text').textContent=`${correctCnt} / ${total} (${pct}%)`;
    document.getElementById('score-bar-fill').style.width=pct+'%';
    document.getElementById('score-detail').textContent=`정답 ${correctCnt}문항 / 오답 ${answered-correctCnt}문항 / 미응답 ${total-answered}문항`;
    const verdict=document.getElementById('score-verdict');
    verdict.innerHTML = correctCnt>=26 ? '<span class="score-pass">합격! 65% 이상 달성</span>' : '<span class="score-fail">불합격 (26문항 이상 필요)</span>';
    document.getElementById('score-result').style.display='block';
    document.getElementById('sec-score').scrollIntoView({behavior:'smooth'});
}
</script>
</body>
</html>
"""

def extract_questions(pdf_path):
    reader=PdfReader(pdf_path)
    text='\n'.join(page.extract_text() or '' for page in reader.pages)
    lines=[l.strip() for l in text.split('\n') if l.strip()]
    qs=[]; q=None; opt=None
    for line in lines:
        m=re.match(r'^(\d{1,2})\.\s*(.*)', line)
        if m:
            if q: qs.append(q)
            q={'num':int(m.group(1)), 'stem':m.group(2).strip(), 'opts':{}}
            opt=None
            continue
        m=re.match(r'^([a-d])\.\s*(.*)', line)
        if m and q:
            opt=m.group(1)
            q['opts'][opt]=m.group(2).strip()
            continue
        if q:
            if opt:
                q['opts'][opt]+=' '+line
            else:
                q['stem']+=' '+line
    if q: qs.append(q)
    return qs

def extract_answers(pdf_path):
    reader=PdfReader(pdf_path)
    text='\n'.join(page.extract_text() or '' for page in reader.pages)
    lines=[l.strip() for l in text.split('\n') if l.strip()]
    ans={}; cur=None; buf=[]
    for line in lines:
        m=re.match(r'^(\d{1,2})\s+([a-d])\b(.*)', line)
        if m:
            if cur:
                ans[cur[0]]={'correct':cur[1], 'explain':' '.join(buf).strip()}
            cur=(int(m.group(1)), m.group(2))
            buf=[m.group(3).strip()]
        else:
            if cur:
                buf.append(line)
    if cur:
        ans[cur[0]]={'correct':cur[1], 'explain':' '.join(buf).strip()}
    return ans

def to_html(text: str) -> str:
    # Preserve bullet-like markers by forcing line breaks before escaping.
    text = text.replace('', '\n•').replace('', '\n-')
    parts = [p.strip() for p in text.split('\n') if p.strip()]
    return '<br>'.join(html.escape(p) for p in parts)

def build_html(title, qs, ans):
    answer_map = {}
    parts=[HEADER.replace("$TITLE", title)]
    for i,q in enumerate(qs,1):
        if i in (1,11,21,31):
            anchor={1:'sec-q1',11:'sec-q11',21:'sec-q21',31:'sec-q31'}[i]
            parts.append(f"<h2 id='{anchor}'><i class='fa-solid fa-pen-to-square'></i> Q{i} ~ Q{min(i+9,40)}</h2>")
        override = MATCH_OVERRIDES.get((title[-1].lower(), q['num'])) if title.endswith(('A','B','C','D')) else None
        if override:
            corr = override['correct']
            answer_map[q['num']] = corr
            parts.append(f"<div class='question-card' id='q{q['num']}'>")
            parts.append(f"<div class='q-header'><span class='q-number'>Q{q['num']}</span><span class='q-chapter'>CTFL</span><span class='q-lo'>-</span></div>")
            parts.append(f"<div class='q-text'>{to_html(override['stem'])}</div>")
            if override['items_left']:
                parts.append("<table class='match-table'><tr><th>항목</th><th>내용</th></tr>")
                for item in override['items_left']:
                    parts.append(f"<tr><td>{html.escape(item.split('.')[0])}</td><td>{html.escape(item.split('.',1)[1].strip())}</td></tr>")
                parts.append("</table>")
                parts.append("<table class='match-table'><tr><th>코드</th><th>설명</th></tr>")
                for item in override['items_right']:
                    code,desc=item.split('.',1)
                    parts.append(f"<tr><td>{html.escape(code.strip())}</td><td>{html.escape(desc.strip())}</td></tr>")
                parts.append("</table>")
            parts.append(f"<ul class='q-options' data-correct='{corr}'>")
            for opt_key,label in override['options'].items():
                parts.append(f"<li data-val='{opt_key}'><span class='opt-label'>{opt_key.upper()}</span><span>{to_html(label)}</span></li>")
            parts.append("</ul><button class='btn-answer' onclick='showAnswer(this)'>정답 확인</button>")
            parts.append(f"<div class='answer-section'><div class='ans-title'><i class='fa-solid fa-check-circle'></i> 정답: <span class='ans-correct'>{corr.upper()}</span></div><p>{html.escape(override['explain'])}</p></div>")
            parts.append("</div>")
            continue
        ainfo=ans.get(q['num'], {'correct':'a','explain':'정답/해설을 찾지 못했습니다.'})
        answer_map[q['num']] = ainfo['correct']
        parts.append(f"<div class='question-card' id='q{q['num']}'>")
        parts.append(f"<div class='q-header'><span class='q-number'>Q{q['num']}</span><span class='q-chapter'>CTFL</span><span class='q-lo'>-</span></div>")
        parts.append(f"<div class='q-text'>{to_html(q['stem'])}</div>")
        parts.append(f"<ul class='q-options' data-correct='{html.escape(ainfo['correct'])}'>")
        for opt_key in ['a','b','c','d']:
            val=q['opts'].get(opt_key,'')
            parts.append(f"<li data-val='{opt_key}'><span class='opt-label'>{opt_key.upper()}</span><span>{to_html(val)}</span></li>")
        parts.append("</ul><button class='btn-answer' onclick='showAnswer(this)'>정답 확인</button>")
        parts.append(f"<div class='answer-section'><div class='ans-title'><i class='fa-solid fa-check-circle'></i> 정답: <span class='ans-correct'>{ainfo['correct'].upper()}</span></div><p>{html.escape(ainfo['explain'])}</p></div>")
        parts.append("</div>")
    footer = FOOTER.replace('$ANSWER_KEY', json.dumps(answer_map, ensure_ascii=False))
    parts.append(footer)
    return '\n'.join(parts)

for data in SETS.values():
    qs=extract_questions(data['q_pdf'])
    ans=extract_answers(data['a_pdf'])
    html_out=build_html(data['title'], qs, ans)
    out=Path('public/posts')/data['file']
    out.write_text(html_out, encoding='utf-8-sig')
    print('written', out)
