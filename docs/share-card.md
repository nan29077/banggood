# 방긋마켓 공유 카드

- 메인 슬로건: **좋은 물건의 다음 이야기, 함께 방긋.**
- 보조 슬로건: **사는 마음도, 나누는 마음도 방긋**
- 이미지: `dist/assets/brand/banggeut-share-v1.png` (1731 × 909 PNG, 약 2.15 MiB)
- 제작: 내장 image_gen 도구. 기존 꽃 미소 로고와 `bazaar-garden-v9.jpg`를 참고해 새 공유 카드 이미지를 생성했습니다.
- 적용: `dist/index.html`의 정적 Open Graph 및 Twitter Card 메타 태그. JavaScript를 실행하지 않는 링크 수집기도 제목·설명·이미지 정보를 읽을 수 있습니다.

## 공개 주소가 생기면

현재는 공개 주소가 없으므로 이미지 경로는 사이트 루트 기준이며 `og:url`과 canonical은 임의로 지정하지 않았습니다. localhost 링크는 카카오톡 수집기가 접근할 수 없습니다. GitHub 소스 푸시는 웹사이트 배포와 별개입니다.

실제 HTTPS 공개 주소가 정해지면 아래 명령에서 예시 주소를 실제 주소로 바꿔 실행하고, 변경된 `dist/`를 그 주소에 배포합니다. 추가 패키지나 API 키는 필요 없습니다.

```powershell
npm run share:configure -- https://your-domain.example
npm test
```

명령은 OG/Twitter 이미지 주소를 절대 URL로 바꾸고 `og:url` 및 canonical을 설정합니다. 카카오톡 앱 키나 SDK는 일반 링크 카드 메타 태그에 필요하지 않습니다. `#/` 뒤의 화면 경로는 서버에 전달되지 않아 현재 카드가 사이트 전체의 공통 카드로 사용됩니다.

배포 후에는 로그아웃한 환경에서 페이지와 이미지가 모두 열리는지 확인합니다. 이전 이미지가 표시되면 [카카오 OG 캐시 도구](https://developers.kakao.com/tool/debugger/sharing)에서 해당 공개 주소를 새로 수집합니다. 현재 작업에서 실제 카카오톡 메시지 발송이나 공개 사이트 수집 검증은 진행하지 않았습니다.

근거: [카카오 스크랩 메타정보](https://developers.kakao.com/docs/ko/message-template/common), [Open Graph 명세](https://ogp.me/).

## 최종 생성 프롬프트

```text
Use case: ads-marketing.
Create a polished Korean social link preview artwork for 방긋마켓, a warm charity bazaar prototype.
Output: a single opaque landscape raster image, exactly 1200 x 630 pixels (1.9048:1). Not a mockup, no device frame.
Input image 1 is the official transparent horizontal flower-smile wordmark. Preserve the provided wordmark, proportions, green/yellow colors and spelling; composite it cleanly near the top with generous breathing room, no distortion or reinvention.
Input image 2 is a style and atmosphere reference only: soft sophisticated 3D storybook garden bazaar, warm ivory, sage green, apricot, natural tactile ceramics and knitwear, friendly Korean adult volunteers and older shoppers.
Create a NEW clean composition appropriate to a premium social sharing card. Warm ivory background across the upper and central area, gentle garden light, restrained flowers and green leaves framing corners, beautifully detailed small bazaar scene along the bottom/right showing a smiling adult volunteer passing a ceramic cup to an older shopper, donated knitwear and canvas bag. Keep illustration secondary to the copy. Soft tactile high-quality 3D editorial illustration, kind and welcoming, airy and uncluttered.
Typeset the EXACT Korean headline, very large bold dark forest green, two lines:
"좋은 물건의 다음 이야기,"
"함께 방긋."
Make "방긋" a restrained warm coral accent if tasteful. Accurate Korean characters, clean modern rounded Korean sans typography, no outlines, no excessive decorative elements.
Below it, a smaller but readable support line EXACTLY:
"사는 마음도, 나누는 마음도 방긋"
Official wordmark at top, headline centered in the upper-middle safe region, secondary copy below. Keep all logo and text within generous safe margins at least 70 px from sides and 45 px from top/bottom. Headline must remain visually readable at phone link-card size. No false real-service claims, no pricing, no social platform logos, no English filler, no watermarks, no CTA buttons. Render finished card including all typography.
```
