# -*- coding: utf-8 -*-
"""Add Korean pronunciation [한국발음] next to English words in TOEIC posts.

Sample run on toeic-part3-4.html only first. User reviews format, then we
expand to other files.
"""
import re
import os

# Pronunciation dictionary — TOEIC vocab + part3-4 specific words.
# Korean phonetics (한국식 표기). Multi-word phrases included.
PRON = {
    # Vocab-card section
    "postpone": "포스트폰", "delay": "딜레이", "put off": "풋 오프", "push back": "푸시 백",
    "purchase": "퍼처스", "buy": "바이", "acquire": "어콰이어", "get": "겟",
    "repair": "리페어", "fix": "픽스", "mend": "멘드", "restore": "리스토어",
    "reduce": "리듀스", "lower": "로어", "cut": "컷", "decrease": "디크리스",
    "employ": "임플로이", "hire": "하이어", "recruit": "리크룻", "take on": "테이크 온", "bring on board": "브링 온 보드",
    "assist": "어시스트", "help": "헬프", "support": "서포트", "aid": "에이드",
    "revise": "리바이즈", "update": "업데이트", "modify": "모디파이", "amend": "어멘드",
    "inquire": "인콰이어", "ask": "애스크", "question": "퀘스천", "request info": "리퀘스트 인포",
    "complimentary": "컴플리멘터리", "free": "프리", "at no charge": "앳 노 차지", "on the house": "온 더 하우스",
    "mandatory": "맨더토리", "required": "리콰이어드", "compulsory": "컴펄서리", "obligatory": "어블리거토리",
    "adjacent to": "어드제이슨트 투", "next to": "넥스트 투", "beside": "비사이드", "near": "니어",
    "approximately": "어프록시메이틀리", "about": "어바웃", "around": "어라운드", "roughly": "러플리",
    "promptly": "프롬프틀리", "immediately": "이미디어틀리", "right away": "라잇 어웨이", "at once": "앳 원스",
    "renowned": "리나운드", "famous": "페이머스", "well-known": "웰 노운", "celebrated": "셀러브레이티드",
    "discontinue": "디스컨티뉴", "stop": "스탑", "cease": "시스", "halt": "홀트",
    "anticipate": "앤티시페이트", "expect": "익스펙트", "predict": "프리딕트", "foresee": "포어시",
    "venue": "베뉴", "location": "로케이션", "place": "플레이스", "site": "사이트",
    "reimburse": "리임버스", "refund": "리펀드", "pay back": "페이 백", "compensate": "컴펜세이트",
    "itinerary": "아이티너러리", "schedule": "스케줄", "plan": "플랜", "route": "루트",
    "malfunction": "맬펑션", "break down": "브레이크 다운", "not work": "낫 워크", "fail": "페일",

    # 장소별 키워드 표
    "meeting": "미팅", "deadline": "데드라인", "report": "리포트", "supervisor": "수퍼바이저",
    "colleague": "콜리그", "department": "디파트먼트", "conference room": "컨퍼런스 룸",
    "reservation": "레저베이션", "menu": "메뉴", "order": "오더", "appetizer": "애피타이저",
    "bill": "빌", "table for two": "테이블 포 투", "specials": "스페셜스",
    "on sale": "온 세일", "discount": "디스카운트", "receipt": "리시트", "exchange": "익스체인지",
    "fitting room": "피팅 룸", "aisle": "아일",
    "boarding pass": "보딩 패스", "gate": "게이트", "departure": "디파처", "layover": "레이오버",
    "baggage claim": "배기지 클레임", "check-in": "체크 인",
    "check in/out": "체크 인/아웃", "front desk": "프론트 데스크", "room service": "룸 서비스",
    "amenities": "어메니티스", "vacancy": "베이컨시", "suite": "스위트",
    "appointment": "어포인트먼트", "prescription": "프리스크립션", "symptom": "심텀",
    "examination": "이그재미네이션", "waiting room": "웨이팅 룸",
    "account": "어카운트", "deposit": "디포짓", "withdrawal": "위드드로얼",
    "interest rate": "인터레스트 레이트", "loan": "론", "transfer": "트랜스퍼",
    "overdue": "오버듀", "renew": "리뉴", "borrow": "바로우", "return": "리턴",
    "reference section": "레퍼런스 섹션", "library card": "라이브러리 카드",
}


def add_pron(word):
    """Look up pronunciation; return original if not found."""
    k = word.strip().lower()
    if k in PRON:
        return f'{word} [{PRON[k]}]'
    return None  # not in dict


def process_vocab_card(html):
    """In <div class="word">X</div> and <div class="meaning">= a, b, c</div>, attach [pron]."""
    def word_repl(m):
        text = m.group(1)
        # text may be "postpone" or "employ / hire" — split on '/' and process each
        parts = re.split(r'\s*/\s*', text)
        new_parts = []
        for p in parts:
            pron = PRON.get(p.strip().lower())
            new_parts.append(f'{p.strip()} [{pron}]' if pron else p.strip())
        return f'<div class="word">{" / ".join(new_parts)}</div>'

    def meaning_repl(m):
        text = m.group(1)
        # Format: "= delay, put off, push back"  (may have leading "= ")
        prefix_m = re.match(r'^(\s*=\s*)(.*)$', text, re.DOTALL)
        if not prefix_m:
            return m.group(0)
        prefix = prefix_m.group(1)
        body = prefix_m.group(2)
        items = re.split(r'\s*,\s*', body)
        new_items = []
        for it in items:
            it = it.strip()
            pron = PRON.get(it.lower())
            new_items.append(f'{it} [{pron}]' if pron else it)
        return f'<div class="meaning">{prefix}{", ".join(new_items)}</div>'

    html = re.sub(r'<div class="word">([^<]+)</div>', word_repl, html)
    html = re.sub(r'<div class="meaning">([^<]+)</div>', meaning_repl, html)
    return html


def process_keyword_table_row(html):
    """In rows like <tr><td><strong>Office</strong></td><td>w1, w2, w3</td></tr>,
    attach [pron] to each comma-separated word in the right cell."""
    def row_repl(m):
        td_strong_label = m.group(1)
        cell = m.group(2)
        # Only process cells that look like a CSV list of plain words
        if '<' in cell:
            return m.group(0)  # contains nested HTML — skip
        items = re.split(r'\s*,\s*', cell)
        new_items = []
        for it in items:
            it = it.strip()
            pron = PRON.get(it.lower())
            new_items.append(f'{it} [{pron}]' if pron else it)
        return f'<tr><td><strong>{td_strong_label}</strong></td><td>{", ".join(new_items)}</td></tr>'

    html = re.sub(
        r'<tr><td><strong>([^<]+)</strong></td><td>([^<]+)</td></tr>',
        row_repl, html
    )
    return html


path = r'D:\0. 클로드\GitHub Pages\public\posts\toeic-part3-4.html'
with open(path, 'rb') as f:
    raw = f.read()
bom = raw.startswith(b'\xef\xbb\xbf')
h = raw.decode('utf-8-sig')

# Idempotency: skip if pronunciation marker already present
if '[포스트폰]' in h:
    print('Already has pronunciation, skip')
else:
    h = process_vocab_card(h)
    h = process_keyword_table_row(h)
    with open(path, 'wb') as f:
        if bom: f.write(b'\xef\xbb\xbf')
        f.write(h.encode('utf-8'))
    print('part3-4 processed')

# Quick verification
vc_total = h.count('<div class="word">')
vc_done = len(re.findall(r'<div class="word">[^<]*\[', h))
print(f'vocab-card words with pron: {vc_done}/{vc_total}')
