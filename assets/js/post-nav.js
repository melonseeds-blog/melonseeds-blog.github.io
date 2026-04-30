/* 같은 카테고리 이전/다음 글 네비게이션 */
const POST_NAV_DATA = {
    'tech-sensor': [
        { file: 'ccd-vs-cmos.html', title: 'CCD vs CMOS 이미지 센서 비교' },
        { file: 'sensor-parameters.html', title: '이미지 센서 핵심 파라미터' },
        { file: 'global-vs-rolling-shutter.html', title: '글로벌 셔터 vs 롤링 셔터' },
        { file: 'isp-pipeline.html', title: 'ISP 파이프라인 이해하기' },
        { file: 'bayer-demosaicing.html', title: 'Bayer 패턴과 디모자이킹' },
        { file: 'dsnu-prnu-correction.html', title: 'DSNU / PRNU 보정' },
        { file: 'hdr-imaging.html', title: 'HDR 이미징 기법' },
        { file: 'nir-swir-sensors.html', title: 'NIR / SWIR 센서와 특수 파장 촬영' },
        { file: 'linescan-vs-areascan.html', title: '라인스캔 vs 에어리어스캔 센서' },
        { file: 'sensor-selection-guide.html', title: '센서 선정 가이드' },
    ],
    'tech-comm': [
        { file: 'industrial-comm.html', title: '산업용 통신 인터페이스 비교' },
        { file: 'genicam-standard.html', title: 'GenICam 표준 이해하기' },
        { file: 'serial-programming.html', title: 'RS-232/485 실전 통신 프로그래밍' },
        { file: 'gige-network-setup.html', title: 'GigE Vision 네트워크 설정 가이드' },
        { file: 'gentl-transport-layer.html', title: 'GenTL과 Transport Layer 구조' },
        { file: 'modbus-protocol.html', title: 'Modbus RTU/TCP 프로토콜 정리' },
        { file: 'tcp-vs-udp-industrial.html', title: 'TCP vs UDP 산업용 통신에서의 차이' },
        { file: 'trigger-sync.html', title: '트리거 신호와 동기화' },
        { file: 'coaxpress-vs-clhs.html', title: 'CoaXPress vs Camera Link HS' },
        { file: 'poe-power-delivery.html', title: 'PoE / PoCL / PoCXP 전원 공급 방식' },
        { file: 'industrial-ethernet.html', title: 'EtherCAT, PROFINET, EtherNet/IP' },
    ],
    'tech-stereo': [
        { file: 'stereo-vision-basics.html', title: '스테레오 비전 기본 원리' },
        { file: 'epipolar-geometry.html', title: '에피폴라 기하학 이해하기' },
        { file: 'camera-calibration.html', title: '카메라 캘리브레이션' },
        { file: 'stereo-matching.html', title: '스테레오 정합(Stereo Matching)' },
        { file: 'disparity-to-3d.html', title: '시차 맵에서 3D 포인트 클라우드로' },
        { file: 'structured-light.html', title: '구조광(Structured Light) 3D 스캐닝' },
        { file: 'tof-sensors.html', title: 'ToF(Time-of-Flight) 센서' },
        { file: '3d-vision-guide.html', title: '3D 비전 시스템 선택 가이드' },
        { file: 'point-cloud-basics.html', title: '포인트 클라우드 처리 기초' },
        { file: '3d-inspection-cases.html', title: '산업용 3D 검사 적용 사례' },
    ],
    'dev-lang-cpp': [
        { file: 'cpp-stl-basics.html', title: 'C++ STL 핵심 정리' },
        { file: 'cpp-iterator-categories.html', title: '이터레이터 카테고리와 무효화 규칙' },
        { file: 'cpp-container-performance.html', title: 'STL 컨테이너 성능 비교' },
        { file: 'cpp-stl-algorithms.html', title: 'STL 알고리즘 활용 패턴' },
    ],
    'tech-halcon': [
        { file: 'halcon-sg1-00-overview.html', title: 'HALCON Solution Guide I 개요와 학습법' },
        { file: 'halcon-sg1-01-methods-map.html', title: 'HALCON 방법론 전체 지도' },
        { file: 'halcon-sg1-02-image-acquisition.html', title: 'Image Acquisition 영상 입력 설계' },
        { file: 'halcon-sg1-03-roi-domain.html', title: 'ROI / Domain / Alignment 설계' },
        { file: 'halcon-sg1-04-blob-segmentation.html', title: 'Blob과 Segmentation' },
        { file: 'halcon-sg1-05-measuring-edges-contours.html', title: 'Measuring / Edge / XLD Contour' },
        { file: 'halcon-sg1-06-matching-recognition.html', title: 'Matching과 Recognition' },
        { file: 'halcon-sg1-07-inspection-classification-codes-ocr.html', title: 'Inspection / Classification / Code / OCR' },
        { file: 'halcon-sg1-08-3d-robot-calibration.html', title: '3D / Robot Vision / Calibration' },
        { file: 'halcon-sg1-09-performance-debugging-design.html', title: '성능 / 디버깅 / 실무 설계 패턴' },
    ],
    'growth-cert-istqb': [
        { file: 'istqb-fl-plan.html', title: 'ISTQB FL 자격증 공부 계획' },
        { file: 'istqb-fl-ch1.html', title: 'ISTQB FL Ch1. 테스팅의 기초' },
        { file: 'istqb-fl-ch2.html', title: 'ISTQB FL Ch2. SDLC와 테스팅' },
        { file: 'istqb-fl-ch3.html', title: 'ISTQB FL Ch3. 정적 테스팅' },
        { file: 'istqb-fl-ch4.html', title: 'ISTQB FL Ch4. 테스트 분석과 설계' },
        { file: 'istqb-fl-ch5.html', title: 'ISTQB FL Ch5. 테스트 관리' },
        { file: 'istqb-fl-ch6.html', title: 'ISTQB FL Ch6. 테스트 도구' },
        { file: 'istqb-fl-glossary.html', title: 'ISTQB FL 핵심 용어 사전' },
        { file: 'istqb-fl-compare.html', title: 'ISTQB FL 헷갈리는 개념 비교' },
        { file: 'istqb-fl-mock1.html', title: 'ISTQB FL 모의고사 1회' },
        { file: 'istqb-fl-mock2.html', title: 'ISTQB FL 모의고사 2회' },
        { file: 'istqb-fl-sample-a.html', title: 'ISTQB FL 샘플문제 A' },
        { file: 'istqb-fl-sample-b.html', title: 'ISTQB FL 샘플문제 B' },
        { file: 'istqb-fl-sample-c.html', title: 'ISTQB FL 샘플문제 C' },
        { file: 'istqb-fl-sample-d.html', title: 'ISTQB FL 샘플문제 D' },
        { file: 'istqb-fl-strategy.html', title: 'ISTQB FL 시험 전략 & 벼락치기' },
    ],
    'growth-lang-toeic': [
        { file: 'toeic-900-strategy.html', title: '토익 900점 달성 전략' },
        { file: 'toeic-part1-2.html', title: '토익 Part 1-2 공략법' },
        { file: 'toeic-part3-4.html', title: '토익 Part 3-4 공략법' },
        { file: 'toeic-part5.html', title: '토익 Part 5 공략법' },
        { file: 'toeic-part6.html', title: '토익 Part 6 공략법' },
        { file: 'toeic-part7.html', title: '토익 Part 7 공략법' },
        { file: 'toeic-grammar-1.html', title: '토익 필수 문법 (상)' },
        { file: 'toeic-grammar-2.html', title: '토익 필수 문법 (하)' },
        { file: 'toeic-vocab-1.html', title: '토익 빈출 어휘 (비즈니스)' },
        { file: 'toeic-vocab-2.html', title: '토익 빈출 어휘 (일상)' },
    ],
    'tool': [
        { file: 'git-basics.html', title: 'Git 기본 명령어 가이드' },
        { file: 'claude-code-practical.html', title: 'Claude Code 실전 활용 가이드' },
        { file: 'claude-desktop-guide.html', title: 'Claude Desktop 활용 가이드' },
        { file: 'vs2022-productivity.html', title: 'Visual Studio 2022 생산성 팁' },
    ],
};

const CAT_LABELS = {
    'tech-sensor': '센서/ISP',
    'tech-comm': '통신/인터페이스',
    'tech-stereo': '3D 스테레오 비전',
    'tech-halcon': 'HALCON 비전 라이브러리',
    'dev-lang-cpp': 'C++ 시리즈',
    'tool': '도구/환경 설정',
    'growth-cert': '자격증',
    'growth-cert-istqb': 'ISTQB FL',
    'growth-lang': '어학',
    'growth-lang-toeic': 'TOEIC'
};

function renderPostNav(category) {
    const posts = POST_NAV_DATA[category];
    if (!posts) return;

    const currentFile = window.location.pathname.split('/').pop();
    const idx = posts.findIndex(p => p.file === currentFile);
    if (idx === -1) return;

    const nav = document.querySelector('.post-nav-bottom');
    if (!nav) return;

    const prev = idx > 0 ? posts[idx - 1] : null;
    const next = idx < posts.length - 1 ? posts[idx + 1] : null;
    const catLabel = CAT_LABELS[category] || category;
    const listUrl = '../index.html?cat=' + category;

    // 기존 내용 교체
    nav.innerHTML = '<div class="post-nav-grid">' +
        // 이전 글 (좌)
        (prev
            ? '<a href="' + prev.file + '" class="post-nav-card prev">' +
              '<span class="post-nav-label"><i class="fa-solid fa-chevron-left"></i> 이전 글</span>' +
              '<span class="post-nav-title">' + prev.title + '</span></a>'
            : '<div class="post-nav-card empty"></div>') +
        // 목록 (중앙)
        '<a href="' + listUrl + '" class="post-nav-card list">' +
        '<span class="post-nav-label"><i class="fa-solid fa-th-list"></i> 목록</span>' +
        '<span class="post-nav-title">' + catLabel + '</span></a>' +
        // 다음 글 (우)
        (next
            ? '<a href="' + next.file + '" class="post-nav-card next">' +
              '<span class="post-nav-label">다음 글 <i class="fa-solid fa-chevron-right"></i></span>' +
              '<span class="post-nav-title">' + next.title + '</span></a>'
            : '<div class="post-nav-card empty"></div>') +
        '</div>';
}
