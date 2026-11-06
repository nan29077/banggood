# Windows 로컬 설치 · 포트 3061

## Git으로 설치 (권장)
PowerShell에서 실행합니다. Node.js 20 이상과 Git이 필요합니다.

```powershell
New-Item -ItemType Directory -Force "E:\프로젝트" | Out-Null
git clone https://github.com/nan29077/banggood.git "E:\프로젝트\방긋마켓"
Set-Location "E:\프로젝트\방긋마켓"
npm run dev
```

`http://localhost:3061`을 엽니다. `start-local.cmd` 더블클릭으로도 실행합니다.
별도 패키지 설치, DB 설치, 빌드는 필요 없습니다. 종료는 Ctrl+C입니다.
기존 폴더가 있으면 덮어쓰지 말고 먼저 내용을 확인합니다.

## ZIP으로 설치
압축 내 파일을 `E:\프로젝트\방긋마켓` 바로 아래에 풀어 package.json과 dist 폴더가 위치하게 합니다. `start-local.cmd`를 실행합니다.
ZIP에는 Git 이력이 없으므로 Git으로 이어서 작업하려면 위 clone 방식이 권장됩니다.

## 이후 작업

```powershell
Set-Location "E:\프로젝트\방긋마켓"
git status
git pull --ff-only
npm run dev
```

수정 후 `npm test`로 검증하고 변경 내용을 확인한 뒤 필요한 파일만 커밋·푸시합니다.
Codex CLI도 이 폴더에서 `codex` 명령으로 시작할 수 있습니다.

## 저장 및 기능 범위
소스 파일은 PC에 저장되고 Git 커밋·푸시로 GitHub에 반영됩니다. 상품·주문 등 체험 데이터는 브라우저 localStorage/IndexedDB에 저장되며 Git에 포함되지 않습니다.
기존 온라인 미리보기의 체험 데이터가 localhost로 자동 복사되지는 않습니다. 같은 브라우저와 `http://localhost:3061` 주소를 계속 사용하세요.
카카오·네이버 로그인, 실결제, 실제 송출·배송·정산은 별도 서버와 외부 서비스 연동이 필요합니다.

## 포트 충돌
3061이 사용 중이면 기존 방긋마켓 실행 창을 종료하세요. 자동으로 다른 포트로 바뀌지 않습니다.
서버는 로컬 PC의 127.0.0.1에만 바인딩합니다. 다른 기기에서 접속하는 서버는 아닙니다.
