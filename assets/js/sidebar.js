/* Melon Seeds - Sidebar Component (Font Awesome) */
/* 서브 카테고리 지원 */

function renderSidebar(currentCat) {
    const publicCats = [
        { id: 'dev', icon: 'fa-solid fa-code', label: '개발 공부', color: 'dev', desc: '알고리즘, OS, 언어',
          subs: [
              { id: 'dev-lang',   label: '언어 (C++, Python 등)' },
              { id: 'dev-cv',     label: 'CV (Computer Vision)' },
              { id: 'dev-theory', label: '프로그래밍 이론' },
          ]
        },
        { id: 'tech', icon: 'fa-solid fa-microscope', label: '기술 공부', color: 'tech', desc: '카메라, 비전, 스마트공장',
          subs: [
              { id: 'tech-sensor',  label: '센서 / ISP' },
              { id: 'tech-stereo',  label: '3D 스테레오 비전' },
              { id: 'tech-ai',      label: 'AI / OpenAI' },
              { id: 'tech-factory', label: '스마트 공장' },
              { id: 'tech-comm',    label: '통신/인터페이스' },
          ]
        },
        { id: 'trend',  icon: 'fa-solid fa-satellite-dish',    label: '기술 트렌드',    color: 'trend',  desc: '기술 뉴스, 새로운 기술' },
        { id: 'tool',   icon: 'fa-solid fa-screwdriver-wrench', label: '도구/환경 설정', color: 'tool',   desc: 'Git, IDE, Claude' },
        { id: 'debug',  icon: 'fa-solid fa-bug',              label: '트러블슈팅',     color: 'debug',  desc: '문제 해결 기록' },
        { id: 'growth', icon: 'fa-solid fa-seedling',         label: '자기계발',       color: 'growth', desc: '영어, 자격증',
          subs: [
              { id: 'growth-lang', label: '어학',
                subs: [
                    { id: 'growth-lang-toeic', label: 'TOEIC' },
                ]
              },
              { id: 'growth-cert', label: '자격증',
                subs: [
                    { id: 'growth-cert-istqb', label: 'ISTQB FL' },
                ]
              },
          ]
        },
        { id: 'book',   icon: 'fa-solid fa-book-open',        label: '책/강의 후기',   color: 'book',   desc: '읽은 책, 세미나' },
    ];

    const privateCats = [
        { id: 'project', icon: 'fa-solid fa-lock',         label: '프로젝트',  color: 'project', desc: '회사 프로젝트' },
        { id: 'memo',    icon: 'fa-solid fa-pen-to-square', label: '개인 메모', color: 'memo',    desc: '비공개 메모' },
    ];

    // basePath
    const path = window.location.pathname;
    let base = '';
    if (path.includes('/public/posts/') || path.includes('/private/posts/')) base = '../../';
    else if (path.includes('/public/') || path.includes('/private/')) base = '../';

    let html = '';

    // Profile
    html += `<div class="sidebar-profile">
        <div class="sidebar-avatar"><span class="melon-icon"></span></div>
        <div class="sidebar-profile-info">
            <div class="sidebar-profile-name">Melon Seeds</div>
            <div class="sidebar-profile-desc">Plant ideas, grow skills</div>
        </div>
    </div>`;

    // Public
    html += '<div class="sidebar-section">';
    html += '<div class="sidebar-title"><i class="fa-solid fa-circle"></i> Public</div>';
    publicCats.forEach(c => {
        const isParentActive = currentCat === c.id || (c.subs && c.subs.some(s => s.id === currentCat || (s.subs && s.subs.some(ss => ss.id === currentCat))));
        const active = isParentActive ? ' active' : '';

        html += `<a href="${base}public/index.html?cat=${c.id}" class="cat-item${active}" title="${c.desc}">
            <span class="cat-icon ${c.color}"><i class="${c.icon}"></i></span>
            <span class="cat-label">${c.label}</span>
        </a>`;

        // 서브 카테고리
        if (c.subs && isParentActive) {
            c.subs.forEach(s => {
                const isSubActive = currentCat === s.id || (s.subs && s.subs.some(ss => ss.id === currentCat));
                const subActive = isSubActive ? ' active' : '';
                html += `<a href="${base}public/index.html?cat=${s.id}" class="cat-item cat-sub${subActive}">
                    <span class="cat-label">${s.label}</span>
                </a>`;

                // 서브-서브 카테고리 (3단계)
                if (s.subs && isSubActive) {
                    s.subs.forEach(ss => {
                        const ssActive = currentCat === ss.id ? ' active' : '';
                        html += `<a href="${base}public/index.html?cat=${ss.id}" class="cat-item cat-subsub${ssActive}">
                            <span class="cat-label">${ss.label}</span>
                        </a>`;
                    });
                }
            });
        }
    });
    html += '</div>';

    html += '<div class="sidebar-divider"></div>';

    // Private
    html += '<div class="sidebar-section">';
    html += '<div class="sidebar-title"><i class="fa-solid fa-lock"></i> Private</div>';
    privateCats.forEach(c => {
        const active = currentCat === c.id ? ' active' : '';
        html += `<a href="${base}private/index.html?cat=${c.id}" class="cat-item${active}" title="${c.desc}">
            <span class="cat-icon ${c.color}"><i class="${c.icon}"></i></span>
            <span class="cat-label">${c.label}</span>
        </a>`;
    });
    html += '</div>';

    document.getElementById('sidebar').innerHTML = html;
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.sidebar-toggle');
    if (sidebar && toggle && sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});
