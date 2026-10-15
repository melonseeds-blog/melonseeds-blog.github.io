/* 가로 스크롤 휠 → 세로 스크롤 변환
 * 페이지에 가로 스크롤 가능한 요소가 없을 때,
 * 물리 가로 휠(deltaX)을 세로 스크롤(deltaY)로 변환한다. */
(function () {
    function hasHorizontalScroll(el) {
        while (el && el !== document.documentElement) {
            if (el.scrollWidth > el.clientWidth + 1) {
                var style = window.getComputedStyle(el);
                var overflow = style.overflowX;
                if (overflow === 'auto' || overflow === 'scroll') return true;
            }
            el = el.parentElement;
        }
        return false;
    }

    document.addEventListener('wheel', function (e) {
        // 가로 휠만 처리 (deltaX 있고 deltaY 없을 때)
        if (Math.abs(e.deltaX) <= 0 || Math.abs(e.deltaY) > 0) return;

        // 이벤트 대상에서 가로 스크롤 가능한 부모가 있으면 원래 동작 유지
        if (hasHorizontalScroll(e.target)) return;

        // 가로 휠을 세로 스크롤로 변환
        e.preventDefault();
        window.scrollBy({ top: e.deltaX, behavior: 'auto' });
    }, { passive: false });
})();
