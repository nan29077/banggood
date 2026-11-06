# 방긋마켓 로컬 개발

- Windows 작업 폴더: `E:\프로젝트\방긋마켓`
- GitHub: https://github.com/nan29077/banggood
- 기본 브랜치: main
- 로컬 미리보기: http://localhost:3061
- 실행: `npm run dev` 또는 `start-local.cmd`; Node.js 20 이상, 설치 의존성 없음.
- 소스: `dist/`의 HTML/CSS/JS. 빌드 결과물이 아닌 직접 편집하는 원본이다.
- 검증: `npm test`. 수정한 JS에는 `node --check`도 실행한다.
- 로그인·결제·주문·정산은 브라우저 내 체험 기능이다. 실제 서버 인증/결제로 표현하지 않는다.
- 로고 비율, 모든 아바타 정원형, 고정 상하단 메뉴, 계정별 데이터 분리를 유지한다.
- `docs/promo-source`와 `scripts/assemble-promo.py`는 홍보 영상 재생성이 필요할 때 사용한다. 일반 실행에는 Python/ffmpeg가 필요 없다.
- 사용자 요청 없이 브라우저 저장 데이터 초기화, 인증정보 커밋, force push를 하지 않는다.
