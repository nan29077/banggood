# 방긋마켓 · 라이브 바자회

모바일 중심의 방긋마켓 디자인·운영 흐름 체험 버전입니다.

## 화면 구성
- PC: 가운데 560px 콘텐츠, 왼쪽 브랜드 문구와 실사형 생성 바자회 이미지, 오른쪽 고정 메뉴
- 모바일/태블릿: 최대 520px 콘텐츠, 하단 고정 메뉴
- 4개 메인 배너, 자체 라이브 미리보기, 카테고리·검색·정렬, 상품 상세·찜·장바구니·주문 체험
- 기관별 나눔가게: 상품, 기관 소개, 나눔 소식, 투명한 나눔 / 커버·색상·설명 편집
- 구매자, 개인 기부자, 기업 기부자, 사회복지기관, 최고관리자 역할 체험
- 관리자 16개 메뉴: 방송 준비, 상품 등록·수정, 재고, 매칭, 주문·배송, 정산, 계정, 배너 등
- 기관 접수·검수, 기부자별 진행 조회, 샘플 증빙, CSV 내보내기

## Windows 로컬 작업
- 경로: `E:\프로젝트\방긋마켓`
- 저장소: https://github.com/nan29077/banggood
- 실행: `npm run dev` 또는 `start-local.cmd`
- 주소: http://localhost:3061
- Node.js 20 이상, 추가 패키지 설치 없음
- 자세한 설치/업데이트 안내: [LOCAL-SETUP.md](LOCAL-SETUP.md)

## 실행
빌드가 없는 HTML/CSS/JavaScript입니다. `dist`를 정적 파일 서버로 제공합니다.
로컬 서버는 `scripts/dev-server.mjs`이며 `dist`만 제공합니다.

## 구현 범위
이 버전은 디자인과 흐름을 검토하기 위한 인터랙티브 프로토타입입니다. 기관·상품·실적은 가상 예시이며, 변경 내역은 localStorage에만 저장됩니다. 역할 선택은 실제 인증이나 접근 제어가 아닙니다.
실제 운영을 위해 서버 데이터 저장·인증과 역할별 접근 제어, PG 결제, 주문·재고 트랜잭션, 영상 송출, 배송 API, 정산 이체, 공식 기부금 영수증 발급을 연동해야 합니다. 네이티브 앱은 아직 포함되지 않습니다.
최고관리자에게만 방송 UI를 제공합니다. 카메라 미리보기는 기기 안에서만 동작하며 외부 전송하지 않습니다.

## 이미지
`dist/assets/hero.jpg`, `community.jpg`, `objects.jpg`, `bazaar.jpg`, `people.jpg`는 내장 이미지 생성 도구로 만든 웹용 생성 이미지입니다. 핵심 프롬프트는 각각 따뜻한 기부 선물 상자, 기부 상자를 전하는 손길, 생활용품 스틸라이프, 한국 성인들이 물건을 나누는 바자회, 한국 성인 참여자들이 웃으며 물건을 고르는 바자회입니다. 로고는 SVG로 제작했습니다.
상품 예시 사진은 Unsplash 이미지이며 실제 판매 상품이 아닙니다.

## 검증
- `node --check dist/app.js` 통과
- PC 가운데 콘텐츠·고정 메뉴·여백 이미지 시각 검토
- 390px iframe에서 홈·기관몰·하단 메뉴 반응형 검토
- 기부 신청 → 기관 접수 승인 상태 연결 확인
- 기관몰 소개 수정 → 기관몰 반영 확인
- 상품 구매 체험 → 마이 주문·관리자 주문·정산 데이터 생성 확인
- 관리자 전체 16개 메뉴 렌더링 확인

## 고도화 시 주의
운영 전에는 기부자 원본 기록과 주문 시점의 상품·기관 연결을 서버에서 보존하고, 기관별 데이터 범위를 강제해야 합니다. 판매금액·반품·비용·정산의 확정 시점과 영수증 검토/발급 권한을 별도로 설계해야 합니다.

## 2차 디자인 및 이미지 관리
- 기관 독립몰: 기관 로고/이름 중심의 전용 헤더, 나눔 소개, 상품, 후원 흐름, 기관 전용 PC 여백/메뉴로 재구성했습니다.
- 최고관리자 `사이트 관리`, 기관 관리자 `기관 쇼핑몰 관리`에서 여백 10개와 배너 10개를 각각 선택/편집합니다.
- 총 20개의 서로 다른 기본 이미지(생성형 18종 + 실제 인물 스톡 사진 2종)를 사용합니다. 양쪽 풀에 인물 실사형 생성 이미지와 실제 인물 사진을 모두 포함합니다. 추가 생성 이미지 2종도 원본 자산으로 보존합니다. 동일한 기본 풀을 각 기관에 독립 복제하여 선택/교체가 다른 기관에 영향을 주지 않습니다.
- 이미지 이름/설명, 가로·세로 구도, 여백 밝기를 조정하고 JPG/PNG/WebP로 교체하거나 기본 이미지로 복원할 수 있습니다.
- 업로드 원본은 브라우저에서 최대 1800px JPEG로 정리하여 IndexedDB에 저장합니다. 메타데이터와 선택값은 localStorage에 보존됩니다. 서버/다른 기기로 공유되는 이미지 저장은 아직 없습니다.
- 기본 프로필 SVG 캐릭터 30종을 추가했습니다. 계정 유형별, 기관 담당자 계정별로 최초 랜덤 배정하며 설정에서 직접 선택/랜덤 변경합니다. 기관 로고는 별도로 유지합니다. 구매자는 `마이 방긋 → 나의 프로필과 설정`, 다른 역할은 콘솔 설정에서 변경합니다.
- `scripts/generate-avatars.py`가 편집 가능한 30개 SVG 원본을 생성합니다.
- 검증: 메인 여백 적용과 기관 기본값 분리, 기관 배너/여백 적용, 관리자 프로필 새로고침 유지, 업로드 이미지 새로고침 유지 및 기본 이미지 복원을 UI에서 확인했습니다.

### 실제 인물 예시 사진
- 여백 10번: https://images.unsplash.com/photo-1529156069898-49953e39b3ac
- 배너 10번: https://images.unsplash.com/photo-1559027615-cd4628902d4a
- Unsplash 스톡 예시 사진으로, 표시된 가상 기관의 실제 활동 사진이나 협력 관계를 의미하지 않습니다.

## 3차: 기관별 쇼핑몰 운영
- 고객 화면의 나눔 물품 표현을 판매 상품으로 정리했습니다. 기관 쇼핑몰은 3단계 카테고리, 검색, 정렬, 추천 진열, 옵션 선택으로 상품을 판매하는 구조입니다.
- 기관 관리자: 상품/옵션/재고 등록·수정, 카테고리 추가·수정·숨김·정렬·빈 분류 삭제, 주문 단계 변경, 택배사/운송장 등록 및 일괄 등록, 취소/교환/반품, 쿠폰, 고객 문의, 판매 집계와 CSV, 정산 생성이 연결됩니다.
- 최고관리자: 전체 기관 또는 한 기관을 선택해 상품·주문·배송·판매·정산·문의·쿠폰을 관리합니다. 기관별 쇼핑몰 설정과 메인 페이지 운영 설정도 제공합니다.
- 디자인: 테마 6종, 상품 카드/그리드/배너 높이, 배너 순환(1~5장), 기관별 여백·배너 이미지 각 10종, 섹션 순서·노출, 추천 상품, 배송비·무료 배송 기준·교환/반품 정책을 설정합니다.
- 주문 상품은 구매 당시 이름/가격/기관/옵션/쿠폰 할인액을 별도 보존합니다. 여러 기관 상품은 기관별 배송 단위로 나누며, 기관은 자신의 상품과 배송 단위만 관리합니다.
- 취소·반품 시 재고를 중복 복구하지 않습니다. 구매 확정 주문으로 정산을 생성하고 중복 정산을 막습니다. 정산 후 반품은 이후 정산 조정으로 기록합니다.
- 상품·주문·쿠폰·문의·디자인 변경은 localStorage 및 IndexedDB를 사용하는 체험 기능입니다. 실제 회원 인증, 서버 권한 강제, 결제/환불/택배 접수/송금/공식 기부금 영수증 연동은 아직 구현 범위 밖입니다.
- `node scripts/test-commerce.cjs`가 기관 범위, 카테고리 깊이/순환/노출, 주문 기록 불변성, 다기관 배송/쿠폰, 옵션 재고, 일괄 수정 검증, 재고 중복 복원 방지, 중복 정산 방지, 정산 후 반품 조정을 검증합니다.
- UI에서 3단계 분류 → 옵션 상품 등록 → 기관몰 필터 → 쿠폰 주문 → 기관 출고 → 최고관리자 기관별 조회 → 구매 확정 → 정산 생성(30,600원 판매액 / 1,530원 비용 / 29,070원 정산액)을 검증했습니다.


## Mobile navigation and institution accounts (V4)

- Mobile header and bottom navigation are viewport-fixed. Safe-area insets and matching content spacing prevent overlap; product purchase actions sit above the bottom navigation. Form text avoids iOS focus zoom.
- Main page has immediate test logins for individual donor, company donor, institution administrator and highest administrator. Each institution mall has its own buyer test login and scoped email signup/login screens. Membership can be a supporter, volunteer, both, or ordinary buyer.
- Institution shopper identity, profiles, cart, wishlist and owned orders are separated by account context. Role-specific consoles retain independent profile settings. Institution administrators can inspect their store membership directory; highest administrators can inspect all stores.
- Email accounts are **browser-local prototype accounts**, using salted PBKDF2 password derivation. They are not server-authorized accounts, do not verify email ownership, and must not receive real credentials. Social buttons explicitly show that Kakao/Naver OAuth is not connected. No provider environment keys are configured. Sites hosting sign-in remains unchanged. Real email authentication, cross-device membership, external OAuth and server authorization require a supported production auth/backend integration.
- 30 original character avatars are assigned randomly. Users can upload a profile image or restore a character. Institution logos are independent, with four original sample logo SVGs and logo upload/reset controls. Mall title can be configured separately from institution legal/display name.
- Product reassignment preserves a valid destination category and historical order snapshots.

Validation: `node scripts/test-commerce.cjs`, `node scripts/test-accounts.cjs`, `node scripts/verify-design-assets.mjs`; syntax checks on all app scripts. Browser QA covers 375px mobile scrolling (header top=0 and navigation bottom=viewport after >1800px scroll), every existing console menu, donation intake/review/sample receipt flow, inquiry/cart flow, direct role switching, institution buyer membership, logo/mall-title controls and social integration status. Email derivation/login/scope behavior is covered by the pure-model tests; no real provider authentication, email ownership verification or production payment was tested.


## Viewport chrome, test entry placement and selected logo (V5)

- Header and bottom navigation mount in the dedicated body-level `#app-chrome` host. They are siblings of the content shell, preventing an app/content ancestor from changing the reference for fixed positioning. Rails have zero outer margin/radius, opaque backgrounds, top/bottom anchors and matching content offsets. Desktop retains the centered 560px shell and right navigation; mobile retains the bottom menu.
- Main test-entry cards now appear before the hero banner, with explicit accessible names for individual/company donor, institution administrator and highest administrator. Institution buyer test entry also appears above the store hero. Browser clicks verified all five immediate destinations.
- The user selected the third displayed concept: green flower petals around a yellow smile. Generated transparent horizontal wordmark and icon assets are under `dist/assets/brand/`. Applied to main header, desktop brand area, footer, favicon and service login branding. Institution branding remains separate. The selected concept master is in `docs/banggeut-selected-logo-concept.png`.
- Browser measurement at a 375px content viewport: before and after 1872px scrolling, both main and store header top=0 and bottom navigation bottom=850 (viewport height=850); body width and scroll width both 375. No application errors were captured. Screenshots: `docs/banggeut-v5-logo-login.png`, `docs/banggeut-v5-fixed-scrolled.png`.

## Visual polish V6

Main content begins with the hero immediately below the fixed header; navigation, announcement and test login follow it. Logo widths reduced to 128px on small phones / 136px on other headers / 190px on the PC brand panel. Main/store spacing and card surfaces refined. Added an original generated plush animal atlas with 30 distinct animals, displayed as individual CSS sprite avatars without altering user uploads or institution logos. Existing random assignment and character choice IDs remain intact. Reference character originals from the requested other services were not available in the connected file results; these are new original designs.

Browser QA: hero is first app child; at 375px wide and 840px tall, after 1872px scroll header top=0, bottom navigation bottom=840, header logo width=128. Character picker visually inspected with new 30-animal artwork. Account and commerce model checks pass.

### V7: console navigation and viewport proportions
- Grouped role-specific console navigation into a fixed left sidebar, with independently scrolling menu and pinned profile/home/logout actions. Mobile uses a dismissible left drawer.
- Corrected the profile shortcut's flex rule so animal avatars remain square; kept wordmarks and institutional logos proportional.
- Mobile content scrolls inside a viewport-sized pane; header/footer track the visual viewport. This avoids document scrolling underneath in-app browser chrome.
- Checks: account and commerce suites pass. Browser QA: desktop order navigation; mobile drawer open; profile avatar 67×67; after mobile scroll header top 0 and bottom-nav bottom 812 in an 812px viewport. Physical iOS in-app browser not available for direct verification.

### V8 — brand film, circular portraits, buyer account
- Added an original 42-second 720p H.264/AAC brand film using existing generated bazaar imagery, gentle zooms/crossfades, Korean captions, original synthesized music and a logo ending. Native player with poster/controls/inline playback; no autoplay or initial video download.
- Added buyer-specific My page with owned order search/status/date filters, fulfillment counts, claims, available coupons, saved products/stores, own inquiries/answers, delivery-gated editable reviews and independent address books. Default address prepopulates checkout; saved addresses can be selected. Reviews remain private browser-local records, not public reviews.
- All generated and uploaded account avatars have fixed square dimensions, non-shrinking flex, circular clipping and cover for uploaded photos. Institution logos remain separate.
- Validation: account/commerce/buyer suites passed. Browser observed 42-second video playing with readyState 4; mobile portraits 54×54/29×29 and admin header/sidebar 29×29/32×32, all radius 50%. Earlier browser flow verified address save, checkout prefill and test purchase in My orders. Existing demo limitations remain: no production OAuth, payment, shipping or refund services.
- Video can be reassembled with `python scripts/assemble-promo.py`; its source clips/music are in docs/promo-source.

## V9 PC 레이아웃·문의 상담
- PC 메인/기관몰 600px, 모바일 520px 이하 유지. 콘솔은 좌측 메뉴 제외 전체 폭 사용.
- 우측 세로 메뉴와 하단 문의 버튼, 왼쪽 여백 로고 제거·하단 텍스트 박스 제거.
- 새 정원 바자회 생성 이미지: dist/assets/bazaar-garden-v9.jpg. 사이트 관리에서 선택·교체 가능.
- 생성 프롬프트: 따뜻한 아이보리·세이지·살구색의 3D 스토리북 한국 바자회. 양끝의 봉사자·어르신·꽃·도자기·니트, 가운데 여백. 글자와 로고 없음. 내장 이미지 생성 도구 사용.
- 문의 작성·유형·내 주문 연결·내 상담 기록·추가 메시지·FAQ, 관리자 검색·상태·우선순위·답변 템플릿·내부 메모·종료/재개.
- 상담은 같은 브라우저 저장소에서 역할별로 검증하는 체험이며 실제 기기 간 상담은 서버 연동 필요.
- 로컬 접속은 http://127.0.0.1:3061 사용 (localhost에 기존 별도 서버가 열려 있을 수 있음).
