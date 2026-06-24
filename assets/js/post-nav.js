/* 같은 카테고리 이전/다음 글 네비게이션 */
const POST_NAV_DATA = {
    'debug': [
        { file: 'github-pages-404.html', title: 'GitHub Pages 배포 시 404 에러 해결' },
    ],
    'debug-windbg': [
        { file: 'windbg-01-dump-types.html', title: 'Windows 크래시 덤프 — 종류와 생성 설정' },
        { file: 'windbg-02-setup.html', title: 'WinDbg 입문 — 분석 환경 세팅과 심볼' },
        { file: 'windbg-03-crash-analysis.html', title: '크래시 원인 분석 실전 — 콜스택과 !analyze' },
        { file: 'windbg-04-heap-corruption.html', title: '힙·메모리 손상 디버깅 — PageHeap과 !heap' },
        { file: 'windbg-05-deadlock-hang.html', title: '데드락·행(Hang) 분석 — 멀티스레드 추적' },
        { file: 'windbg-06-support-workflow.html', title: '실무 기술지원 워크플로 — 고객사 덤프 대응' },
    ],
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
    'book': [
        { file: 'clean-code-review.html', title: '클린 코드 (Clean Code) 리뷰' },
        { file: 'book-refactoring.html', title: 'Refactoring — Martin Fowler' },
        { file: 'book-design-patterns.html', title: 'Design Patterns (GoF)' },
        { file: 'book-clean-architecture.html', title: 'Clean Architecture — Robert C. Martin' },
        { file: 'book-pragmatic-programmer.html', title: 'The Pragmatic Programmer' },
        { file: 'book-code-complete.html', title: 'Code Complete — Steve McConnell' },
        { file: 'book-tdd-by-example.html', title: 'Test-Driven Development by Example — Kent Beck' },
        { file: 'book-effective-modern-cpp.html', title: 'Effective Modern C++ — Scott Meyers' },
        { file: 'book-cpp-concurrency.html', title: 'C++ Concurrency in Action — Anthony Williams' },
        { file: 'book-cpp-coding-standards.html', title: 'C++ Coding Standards — Sutter & Alexandrescu' },
        { file: 'book-computer-vision-szeliski.html', title: 'Computer Vision: Algorithms and Applications — Szeliski' },
        { file: 'book-learning-opencv.html', title: 'Learning OpenCV — Bradski & Kaehler' },
        { file: 'book-deep-learning.html', title: 'Deep Learning — Goodfellow·Bengio·Courville' },
        { file: 'book-hands-on-ml.html', title: 'Hands-On Machine Learning — Aurélien Géron' },
        { file: 'book-missing-readme.html', title: '개발자 온보딩 가이드 (The Missing README)' },
        { file: 'book-git-for-teams.html', title: '팀을 위한 git (Git for Teams)' },
        { file: 'book-continuous-delivery.html', title: '신뢰할 수 있는 소프트웨어 출시 (Continuous Delivery)' },
    ],
    'dev-theory': [
        { file: 'theory-01-oop-fundamentals.html', title: '객체지향 4대 특성' },
        { file: 'theory-02-solid-1.html', title: 'SOLID 원칙 (상) — SRP·OCP·LSP' },
        { file: 'theory-03-solid-2.html', title: 'SOLID 원칙 (하) — ISP·DIP' },
        { file: 'theory-04-coupling-cohesion.html', title: '결합도와 응집도' },
        { file: 'theory-05-design-patterns-intro.html', title: '디자인 패턴 개요 — GoF' },
        { file: 'theory-06-creational-patterns.html', title: '생성 패턴 — Singleton·Factory·Builder' },
        { file: 'theory-07-structural-patterns.html', title: '구조 패턴 — Adapter·Decorator·Facade·Proxy' },
        { file: 'theory-08-behavioral-patterns.html', title: '행위 패턴 — Strategy·Observer·Command·State' },
        { file: 'theory-09-antipatterns.html', title: '안티패턴 — God Object·Spaghetti' },
        { file: 'theory-10-complexity.html', title: '시간·공간 복잡도 — Big-O' },
        { file: 'theory-11-data-structures.html', title: '핵심 자료구조' },
        { file: 'theory-12-sorting-searching.html', title: '정렬·탐색 알고리즘' },
        { file: 'theory-13-algorithm-design.html', title: '알고리즘 설계 기법' },
        { file: 'theory-14-clean-code.html', title: '클린 코드 — 네이밍·함수·주석' },
        { file: 'theory-15-refactoring.html', title: '리팩토링 — 코드 스멜과 개선' },
        { file: 'theory-16-unit-test-tdd.html', title: '단위 테스트와 TDD' },
    ],
    'dev-cv': [
        { file: 'cv-01-opencv-intro.html', title: 'OpenCV 시작하기 — cv::Mat과 C++ 빌드' },
        { file: 'cv-02-image-representation.html', title: '이미지 표현 — 채널·픽셀 포맷·메모리 레이아웃' },
        { file: 'cv-03-pixel-access-roi.html', title: '픽셀 접근과 ROI' },
        { file: 'cv-04-image-io.html', title: '이미지 입출력 — imread/imwrite·비디오·카메라' },
        { file: 'cv-05-color-spaces.html', title: '색공간 변환 — BGR/HSV/Lab/YCrCb' },
        { file: 'cv-06-arithmetic-logic.html', title: '산술·논리 연산 — 블렌딩·마스킹·비트 연산' },
        { file: 'cv-07-histogram.html', title: '히스토그램 — 평활화·매칭·CLAHE' },
        { file: 'cv-08-spatial-filtering.html', title: '공간 필터링 — 블러·가우시안·미디언·양방향' },
        { file: 'cv-09-sharpening-frequency.html', title: '샤프닝과 주파수 영역 — 언샤프 마스킹·푸리에 변환' },
        { file: 'cv-10-edge-detection.html', title: '엣지 검출 — Sobel·Scharr·Laplacian·Canny' },
        { file: 'cv-11-thresholding.html', title: '임계화 — 전역·Otsu·적응형' },
        { file: 'cv-12-morphology.html', title: '형태학 연산 — 침식·팽창·열림·닫힘' },
        { file: 'cv-13-contours.html', title: '윤곽선(Contour) — 검출·계층·모멘트·근사' },
        { file: 'cv-14-blob-analysis.html', title: '블롭 분석 — 연결 요소와 특징 필터링' },
        { file: 'cv-15-template-matching.html', title: '템플릿 매칭 — matchTemplate과 한계' },
        { file: 'cv-16-feature-detection.html', title: '특징점 — Harris·ORB·SIFT와 매칭' },
        { file: 'cv-17-geometric-transform.html', title: '기하 변환 — 어파인·원근·호모그래피' },
        { file: 'cv-18-camera-calibration.html', title: '카메라 캘리브레이션 — 왜곡 보정' },
        { file: 'cv-19-contour-measurement.html', title: '윤곽 기반 측정 — 치수·각도·서브픽셀' },
        { file: 'cv-20-inspection-pipeline.html', title: '실전 통합 — 검사 파이프라인 예제' },
    ],
    'dev-lang-python': [
        { file: 'py-01-intro.html', title: 'Python 입문 — 설치·REPL·가상환경' },
        { file: 'py-02-data-types.html', title: '자료형과 변수 — 동적 타이핑' },
        { file: 'py-03-collections.html', title: '컬렉션 — list·tuple·dict·set' },
        { file: 'py-04-control-functions.html', title: '제어 흐름과 함수' },
        { file: 'py-05-oop.html', title: 'OOP — class·상속·매직 메서드' },
        { file: 'py-06-generators-iterators.html', title: '제너레이터와 이터레이터' },
        { file: 'py-07-decorators.html', title: '데코레이터' },
        { file: 'py-08-context-managers.html', title: '컨텍스트 매니저' },
        { file: 'py-09-exceptions.html', title: '예외 처리' },
        { file: 'py-10-asyncio.html', title: '비동기 — asyncio' },
        { file: 'py-11-stdlib.html', title: '표준 라이브러리 핵심' },
        { file: 'py-12-numpy.html', title: 'numpy — 배열·브로드캐스팅·벡터화' },
        { file: 'py-13-image-processing.html', title: 'Python 이미지 처리 — Pillow·OpenCV·numpy' },
        { file: 'py-14-packaging.html', title: '패키징과 배포 — pyproject·pip·venv' },
        { file: 'py-15-testing.html', title: '테스팅 — pytest' },
    ],
    'dev-wpf': [
        { file: 'wpf-01-csharp-intro.html', title: 'C# 입문 — 환경·문법 핵심' },
        { file: 'wpf-02-type-system.html', title: 'C# 타입 시스템 — value/reference·제네릭' },
        { file: 'wpf-03-linq.html', title: 'LINQ — 쿼리·메서드 체이닝' },
        { file: 'wpf-04-async-await.html', title: 'C# async/await' },
        { file: 'wpf-05-wpf-intro.html', title: 'WPF 개요 — XAML·의존성 속성' },
        { file: 'wpf-06-layout.html', title: 'WPF 레이아웃 — Grid/StackPanel/DockPanel' },
        { file: 'wpf-07-data-binding.html', title: 'WPF 데이터 바인딩' },
        { file: 'wpf-08-commands.html', title: '명령 패턴 — ICommand·RelayCommand' },
        { file: 'wpf-09-mvvm.html', title: 'MVVM 패턴' },
        { file: 'wpf-10-custom-controls.html', title: '커스텀 컨트롤·Template' },
        { file: 'wpf-11-block-editor.html', title: '데이터 플로우 블록 에디터' },
        { file: 'wpf-12-cli-integration.html', title: 'C++/CLI로 비전 코어 통합' },
    ],
    'tech-gpu': [
        { file: 'gpu-01-cuda-intro.html', title: 'CUDA란 / GPU vs CPU / 환경 셋업' },
        { file: 'gpu-02-memory-hierarchy.html', title: 'GPU 메모리 계층' },
        { file: 'gpu-03-first-kernel.html', title: '첫 CUDA 커널 — 그리드·블록·스레드' },
        { file: 'gpu-04-memory-transfer.html', title: '메모리 전송과 핀드 메모리' },
        { file: 'gpu-05-streams-async.html', title: '스트림과 비동기 실행' },
        { file: 'gpu-06-shared-memory.html', title: 'Shared Memory와 동기화·뱅크 충돌' },
        { file: 'gpu-07-warp-occupancy.html', title: 'Warp·점유율·메모리 결합' },
        { file: 'gpu-08-profiling.html', title: '성능 측정 — nvprof·Nsight' },
        { file: 'gpu-09-opencv-cuda.html', title: 'cv::cuda 모듈 — OpenCV GPU 가속' },
        { file: 'gpu-10-image-kernels.html', title: '이미지 처리 CUDA 커널 직접 작성' },
        { file: 'gpu-11-tensorrt.html', title: 'TensorRT — 딥러닝 추론 가속' },
        { file: 'gpu-12-industrial-pipeline.html', title: '산업 비전 GPU 파이프라인 통합' },
    ],
    'tech-ai': [
        { file: 'ai-01-deep-learning-vision-intro.html', title: '딥러닝 비전 입문 — 전통적 비전 vs 딥러닝' },
        { file: 'ai-02-neural-network-basics.html', title: '신경망 기초 — 퍼셉트론·활성화·손실·역전파' },
        { file: 'ai-03-cnn-architecture.html', title: 'CNN 구조 — 합성곱·풀링·수용 영역' },
        { file: 'ai-04-cnn-models.html', title: '주요 CNN 아키텍처 — LeNet에서 ResNet까지' },
        { file: 'ai-05-training-practice.html', title: '학습 실전 — 데이터셋·증강·과적합·전이학습' },
        { file: 'ai-06-image-classification.html', title: '이미지 분류 — 태스크와 평가지표' },
        { file: 'ai-07-object-detection.html', title: '객체 검출 — YOLO·mAP·NMS' },
        { file: 'ai-08-segmentation.html', title: '세그멘테이션 — U-Net·Mask R-CNN' },
        { file: 'ai-09-anomaly-detection.html', title: '이상 탐지 — 산업 결함 검사' },
        { file: 'ai-10-model-optimization.html', title: '모델 경량화·최적화 — 양자화·프루닝·증류' },
        { file: 'ai-11-onnx-deployment.html', title: 'ONNX와 배포' },
        { file: 'ai-12-opencv-dnn.html', title: 'OpenCV DNN 모듈 실전' },
        { file: 'ai-13-industrial-deep-learning.html', title: '산업 비전에서의 딥러닝 — 하이브리드 전략' },
    ],
    'tech-ai-llm': [
        { file: 'llm-decoding-01-sampling.html', title: 'LLM 디코딩 심화 1 — 샘플링의 내부 동작' },
        { file: 'llm-decoding-02-penalties.html', title: 'LLM 디코딩 심화 2 — 반복 억제와 고급 샘플러' },
        { file: 'llm-decoding-03-search-control.html', title: 'LLM 디코딩 심화 3 — 탐색과 제어' },
        { file: 'llm-decoding-04-acceleration.html', title: 'LLM 디코딩 심화 4 — 추론 가속' },
        { file: 'llm-decoding-05-quality-control.html', title: 'LLM 디코딩 심화 5 — 품질·환각 제어' },
    ],
    'tech-factory': [
        { file: 'factory-01-what-is-smart-factory.html', title: '스마트 공장이란' },
        { file: 'factory-02-vision-system-components.html', title: '산업용 머신비전 검사 시스템의 구성' },
        { file: 'factory-03-inspection-pipeline.html', title: '비전 검사 파이프라인' },
        { file: 'factory-04-lighting-design.html', title: '머신비전 조명 설계' },
        { file: 'factory-05-inspection-algorithms.html', title: '검사 대상별 알고리즘 전략' },
        { file: 'factory-06-plc-integration.html', title: 'PLC 연동' },
        { file: 'factory-07-opc-ua.html', title: 'OPC UA — 스마트 공장의 표준 통신' },
        { file: 'factory-08-mes-scada.html', title: 'MES / SCADA 연동' },
        { file: 'factory-09-traceability.html', title: '추적성(Traceability)' },
        { file: 'factory-10-inspection-reliability.html', title: '검사 신뢰성 평가 — Gage R&R, MSA' },
        { file: 'factory-11-predictive-maintenance.html', title: '예지보전과 IoT 센서' },
        { file: 'factory-12-edge-computing.html', title: '엣지 컴퓨팅과 데이터 파이프라인' },
        { file: 'factory-13-digital-twin.html', title: '디지털 트윈' },
        { file: 'factory-14-adoption-strategy.html', title: '스마트 공장 도입 전략' },
    ],
    'dev-lang-cpp': [
        { file: 'cpp-stl-basics.html', title: 'C++ STL 핵심 정리' },
        { file: 'cpp-iterator-categories.html', title: '이터레이터 카테고리와 무효화 규칙' },
        { file: 'cpp-container-performance.html', title: 'STL 컨테이너 성능 비교' },
        { file: 'cpp-stl-algorithms.html', title: 'STL 알고리즘 활용 패턴' },
        { file: 'cpp-functors-lambdas.html', title: 'STL 함수 객체와 람다' },
        { file: 'cpp-ranges.html', title: 'C++20 ranges 라이브러리 입문' },
        { file: 'cpp17-essentials.html', title: 'C++17 핵심 기능 정리' },
        { file: 'cpp-optional-variant-any.html', title: 'std::optional / std::variant / std::any' },
        { file: 'cpp-smart-pointers.html', title: '스마트 포인터 깊이 보기' },
        { file: 'cpp-move-semantics.html', title: '이동 의미론(Move semantics)' },
        { file: 'cpp-raii.html', title: 'RAII 패턴과 리소스 관리' },
        { file: 'cpp-constexpr.html', title: 'constexpr와 컴파일 타임 계산' },
        { file: 'cpp-thread-basics.html', title: 'C++ 스레드 기초' },
        { file: 'cpp-async-future.html', title: 'std::async / std::future / std::promise' },
        { file: 'cpp-packaged-task.html', title: 'std::packaged_task와 태스크 큐' },
        { file: 'cpp-thread-pool.html', title: '스레드 풀 직접 만들기' },
        { file: 'cpp-coroutines.html', title: 'C++20 코루틴 입문' },
        { file: 'cpp-atomic-memory-model.html', title: 'std::atomic과 C++ 메모리 모델' },
        { file: 'cpp-false-sharing.html', title: 'false sharing과 캐시 라인' },
        { file: 'cpp-image-buffer-design.html', title: 'C++ 이미지 버퍼 클래스 설계' },
        { file: 'cpp-interface-patterns.html', title: '인터페이스 설계 패턴' },
        { file: 'cpp-callback-function.html', title: '콜백과 std::function' },
        { file: 'cpp-plugin-architecture.html', title: 'C++ 플러그인 아키텍처' },
        { file: 'cpp-cli-binding.html', title: 'C++/CLI 입문 — C++와 C# 바인딩' },
        { file: 'cpp-cmake-vcpkg.html', title: 'CMake + vcpkg manifest 실전' },
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
        { file: 'halcon-sg2a-image-acquisition.html', title: 'Solution Guide II-A: Image Acquisition 심화' },
        { file: 'halcon-sg2b-matching.html', title: 'Solution Guide II-B: Matching 심화' },
        { file: 'halcon-sg2c-2d-data-codes.html', title: 'Solution Guide II-C: 2D Data Codes' },
        { file: 'halcon-sg2d-classification.html', title: 'Solution Guide II-D: Classification' },
        { file: 'halcon-sg3a-1d-measuring.html', title: 'Solution Guide III-A: 1D Measuring' },
        { file: 'halcon-sg3b-2d-measuring.html', title: 'Solution Guide III-B: 2D Measuring' },
        { file: 'halcon-sg3c-3d-vision.html', title: 'Solution Guide III-C: 3D Vision' },
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
    'growth-cert-ctai': [
        { file: 'istqb-ctai-plan.html', title: 'ISTQB CT-AI 자격증 학습 계획' },
        { file: 'istqb-ctai-strategy.html', title: 'ISTQB CT-AI 학습 전략 & 가성비 공략' },
        { file: 'istqb-ctai-ch1.html', title: 'ISTQB CT-AI Ch1. AI 소개' },
        { file: 'istqb-ctai-ch2.html', title: 'ISTQB CT-AI Ch2. AI 기반 시스템 품질 특성' },
        { file: 'istqb-ctai-ch3.html', title: 'ISTQB CT-AI Ch3. 머신러닝 개요' },
        { file: 'istqb-ctai-ch4.html', title: 'ISTQB CT-AI Ch4. ML 데이터' },
        { file: 'istqb-ctai-ch5.html', title: 'ISTQB CT-AI Ch5. ML 기능적 성능 측정지표' },
        { file: 'istqb-ctai-ch6.html', title: 'ISTQB CT-AI Ch6. 신경망과 테스팅' },
        { file: 'istqb-ctai-ch7-8.html', title: 'ISTQB CT-AI Ch7+8. AI 테스팅 개요 & AI 특유 품질 테스팅' },
        { file: 'istqb-ctai-ch9.html', title: 'ISTQB CT-AI Ch9. AI 시스템 테스팅 방법과 기법' },
        { file: 'istqb-ctai-ch10-11.html', title: 'ISTQB CT-AI Ch10+11. 테스트 환경 & 테스팅에 AI 활용' },
        { file: 'istqb-ctai-compare.html', title: 'ISTQB CT-AI 헷갈리는 개념 비교' },
        { file: 'istqb-ctai-glossary.html', title: 'ISTQB CT-AI 핵심 용어 사전' },
        { file: 'istqb-ctai-sample-a.html', title: 'ISTQB CT-AI 샘플문제 A (Q1~14)' },
        { file: 'istqb-ctai-sample-b.html', title: 'ISTQB CT-AI 샘플문제 B (Q15~28)' },
        { file: 'istqb-ctai-sample-c.html', title: 'ISTQB CT-AI 샘플문제 C (Q29~40)' },
        { file: 'istqb-ctai-sample-d.html', title: 'ISTQB CT-AI 샘플문제 D (부록 Q1~14)' },
        { file: 'istqb-ctai-mock.html', title: 'ISTQB CT-AI 모의고사 (부록 Q15~27)' },
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
        { file: 'toeic-grammar-adv-1.html', title: '900+ 문법 1. 자리(품사) 판별' },
        { file: 'toeic-grammar-adv-2.html', title: '900+ 문법 2. 동사 — 수일치·시제·태·가정법' },
        { file: 'toeic-grammar-adv-3.html', title: '900+ 문법 3. 준동사 — 부정사·동명사·분사' },
        { file: 'toeic-grammar-adv-4.html', title: '900+ 문법 4. 연결어 — 접속사·전치사·관계사' },
        { file: 'toeic-grammar-adv-5.html', title: '900+ 문법 5. 고난도 — 비교·도치·대명사·한정사' },
        { file: 'toeic-grammar-adv-6.html', title: '900+ 문법 6. Part 6 문맥 문법' },
    ],
    'course-claude': [
        { file: 'course-claude-code-101.html', title: 'Claude Code 101 — 공식 입문 강의 정리' },
        { file: 'course-claude-code-extensions.html', title: 'Subagents & Agent Skills — 확장 강의 정리' },
        { file: 'course-claude-code-in-action.html', title: 'Claude Code in Action — 실전 워크플로 정리' },
        { file: 'course-claude-ai-fluency-foundations.html', title: 'AI Fluency: Framework & Foundations 학습 노트' },
        { file: 'course-claude-ai-capabilities-limitations.html', title: 'AI Capabilities and Limitations 학습 노트' },
        { file: 'course-claude-ai-fluency-audiences.html', title: 'AI Fluency 대상별 강의 모음 (SMB·Nonprofits·Educators·Students·Teaching)' },
        { file: 'course-claude-api-building.html', title: 'Building with the Claude API 강의 정리' },
        { file: 'course-claude-cloud-bedrock-vertex.html', title: 'Claude with Amazon Bedrock & Google Vertex AI 비교 정리' },
        { file: 'course-claude-mcp-intro.html', title: 'Anthropic 강의 — MCP 입문' },
        { file: 'course-claude-mcp-advanced.html', title: 'Anthropic 강의 — MCP 심화' },
    ],
    'read': [
        { file: 'read-recommended-sites.html', title: '개발자가 북마크해둘 추천 사이트 모음' },
    ],
    'tool': [
        { file: 'git-basics.html', title: 'Git 기본 명령어 가이드' },
        { file: 'claude-code-practical.html', title: 'Claude Code 실전 활용 가이드' },
        { file: 'claude-code-plugins.html', title: 'Claude Code 유용한 플러그인 모음' },
        { file: 'claude-desktop-guide.html', title: 'Claude Desktop 활용 가이드' },
        { file: 'vs2022-productivity.html', title: 'Visual Studio 2022 생산성 팁' },
    ],
};

const CAT_LABELS = {
    'tech-sensor': '센서/ISP',
    'tech-comm': '통신/인터페이스',
    'tech-stereo': '3D 스테레오 비전',
    'tech-halcon': 'HALCON 비전 라이브러리',
    'tech-factory': '스마트 공장',
    'tech-ai': 'AI / OpenAI',
    'tech-ai-llm': 'LLM 디코딩·프롬프트',
    'tech-gpu': 'GPU / CUDA',
    'dev-lang-python': 'Python 시리즈',
    'dev-wpf': 'WPF / C#',
    'dev-lang-cpp': 'C++ 시리즈',
    'dev-cv': 'CV (Computer Vision)',
    'dev-theory': '프로그래밍 이론',
    'book': '책/강의 후기',
    'tool': '도구/환경 설정',
    'growth-cert': '자격증',
    'growth-cert-istqb': 'ISTQB FL',
    'growth-cert-ctai': 'ISTQB CT-AI',
    'growth-lang': '어학',
    'growth-lang-toeic': 'TOEIC',
    'course': '강의 정리',
    'course-claude': 'Claude 공식 강의',
    'read': '읽을거리',
    'debug': '트러블슈팅',
    'debug-windbg': 'Windows 크래시 덤프 분석'
};

function renderPostNav(category) {
    const posts = POST_NAV_DATA[category];
    if (!posts) return;

    const currentFile = window.location.pathname.split('/').pop();
    const idx = posts.findIndex(p => p.file === currentFile);
    if (idx === -1) return;

    // ===== 시리즈 진행도 (글 상단) =====
    if (!document.querySelector('.series-progress')) {
        const meta = document.querySelector('.post-detail-meta');
        if (meta) {
            const total = posts.length;
            const current = idx + 1;
            const percent = Math.round((current / total) * 100);
            const catLabel = CAT_LABELS[category] || category;
            const listUrl = '../index.html?cat=' + category;
            const progress = document.createElement('div');
            progress.className = 'series-progress';
            progress.innerHTML =
                '<div class="sp-info">' +
                    '<i class="fa-solid fa-layer-group"></i>' +
                    '<a href="' + listUrl + '" class="sp-label">' + catLabel + '</a>' +
                    '<span class="sp-count">' + current + ' / ' + total + '</span>' +
                '</div>' +
                '<div class="sp-bar"><div class="sp-fill" style="width:' + percent + '%"></div></div>';
            meta.parentNode.insertBefore(progress, meta.nextSibling);
        }
    }

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
