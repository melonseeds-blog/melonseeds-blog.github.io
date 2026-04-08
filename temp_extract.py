import re, html
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
<div class='floating-toc' id='floating-toc'><div class='toc-row1' id='toc-row1'><a href='#sec-info' data-section='sec-info'>시험안내</a><a href='#sec-q1' data-section='sec-q1'>Q1-10</a><a href='#sec-q11' data-section='sec-q11'>Q11-20</a><a href='#sec-q21' data-section='sec-q21'>Q21-30</a><a href='#sec-q31' data-section='sec-q31'>Q31-40</a></div></div>
<div class='page-layout'><aside class='sidebar' id='sidebar'></aside><main class='main-content'><article class='post-detail'><div class='post-detail-header'><div class='post-card-tags'><span class='post-tag public'>PUBLIC</span><span class='post-tag cat'>자기계발</span></div><h1>$TITLE</h1><div class='post-detail-meta'><span><i class='fa-regular fa-calendar'></i> 2026-04-08</span><span><i class='fa-regular fa-clock'></i> 60 min read</span></div></div><div class='post-detail-body' id='post-body'>
<div class='summary-box'><div class='summary-title'><i class='fa-solid fa-seedling'></i> 이 글에서 다루는 내용</div><ul><li>$TITLE 40문항을 인터랙티브로 제공합니다.</li><li>정답 확인 버튼으로 즉시 피드백.</li><li>CTFL v4.0.1 형식 4지선다.</li></ul></div>
<h2 id='sec-info'><i class='fa-solid fa-circle-info'></i> 시험 안내</h2>
<p>ISTQB CTFL 샘플 모의고사 세트입니다. 40문항, 65분, 합격선 65% 기준으로 연습하세요.</p>
"""

FOOTER = """
</div>
<div class='post-nav-bottom' id='post-nav-bottom'><a href='../index.html'><i class='fa-solid fa-arrow-left'></i> 목록으로</a></div></article></main></div>
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
function showAnswer(btn){const ans=btn.nextElementSibling;ans.classList.toggle('show');}
document.querySelectorAll('.q-options').forEach(ul=>{const correct=ul.dataset.correct;ul.querySelectorAll('li').forEach(li=>{li.addEventListener('click',()=>{ul.querySelectorAll('li').forEach(x=>x.classList.remove('selected','correct','wrong'));li.classList.add('selected');if(li.dataset.val==correct){li.classList.add('correct');}else{li.classList.add('wrong');}});});});
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

def build_html(title, qs, ans):
    parts=[HEADER.replace("$TITLE", title)]
    for i,q in enumerate(qs,1):
        if i in (1,11,21,31):
            anchor={1:'sec-q1',11:'sec-q11',21:'sec-q21',31:'sec-q31'}[i]
            parts.append(f"<h2 id='{anchor}'><i class='fa-solid fa-pen-to-square'></i> Q{i} ~ Q{min(i+9,40)}</h2>")
        ainfo=ans.get(q['num'], {'correct':'a','explain':'정답/해설을 찾지 못했습니다.'})
        parts.append(f"<div class='question-card' id='q{q['num']}'>")
        parts.append(f"<div class='q-header'><span class='q-number'>Q{q['num']}</span><span class='q-chapter'>CTFL</span><span class='q-lo'>-</span></div>")
        parts.append(f"<div class='q-text'>{html.escape(q['stem'])}</div>")
        parts.append(f"<ul class='q-options' data-correct='{html.escape(ainfo['correct'])}'>")
        for opt_key in ['a','b','c','d']:
            val=q['opts'].get(opt_key,'')
            parts.append(f"<li data-val='{opt_key}'><span class='opt-label'>{opt_key.upper()}</span><span>{html.escape(val)}</span></li>")
        parts.append("</ul><button class='btn-answer' onclick='showAnswer(this)'>정답 확인</button>")
        parts.append(f"<div class='answer-section'><div class='ans-title'><i class='fa-solid fa-check-circle'></i> 정답: <span class='ans-correct'>{ainfo['correct'].upper()}</span></div><p>{html.escape(ainfo['explain'])}</p></div>")
        parts.append("</div>")
    parts.append(FOOTER)
    return '\n'.join(parts)

for data in SETS.values():
    qs=extract_questions(data['q_pdf'])
    ans=extract_answers(data['a_pdf'])
    html_out=build_html(data['title'], qs, ans)
    out=Path('public/posts')/data['file']
    out.write_text(html_out, encoding='utf-8-sig')
    print('written', out)
