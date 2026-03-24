/* Melon Seeds - Sidebar Component (Font Awesome) */

function renderSidebar(currentCat) {
    const publicCats = [
        { id: 'dev',    icon: 'fa-solid fa-code',            label: '개발 공부',      color: 'dev',    desc: '알고리즘, OS, 언어' },
        { id: 'tech',   icon: 'fa-solid fa-microscope',      label: '기술 공부',      color: 'tech',   desc: '카메라, 비전, 스마트공장' },
        { id: 'trend',  icon: 'fa-solid fa-satellite-dish',   label: '기술 트렌드',    color: 'trend',  desc: '기술 뉴스, 새로운 기술' },
        { id: 'tool',   icon: 'fa-solid fa-screwdriver-wrench', label: '도구/환경 설정', color: 'tool',  desc: 'Git, IDE, Claude' },
        { id: 'debug',  icon: 'fa-solid fa-bug',             label: '트러블슈팅',     color: 'debug',  desc: '문제 해결 기록' },
        { id: 'growth', icon: 'fa-solid fa-seedling',        label: '자기계발',       color: 'growth', desc: '영어, 자격증' },
        { id: 'book',   icon: 'fa-solid fa-book-open',       label: '책/강의 후기',   color: 'book',   desc: '읽은 책, 세미나' },
    ];

    const privateCats = [
        { id: 'project', icon: 'fa-solid fa-lock',          label: '프로젝트',  color: 'project', desc: '회사 프로젝트' },
        { id: 'memo',    icon: 'fa-solid fa-pen-to-square',  label: '개인 메모',  color: 'memo',   desc: '비공개 메모' },
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
        const active = currentCat === c.id ? ' active' : '';
        html += `<a href="${base}public/index.html?cat=${c.id}" class="cat-item${active}" title="${c.desc}">
            <span class="cat-icon ${c.color}"><i class="${c.icon}"></i></span>
            <span class="cat-label">${c.label}</span>
        </a>`;
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
