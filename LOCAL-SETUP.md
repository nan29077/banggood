# Windows 로컬 설치 · 포트 3061

## 현재 전달 상태
2026-11-06 기준으로 `E:\프로젝트\방긋마켓`에서 작업을 이어갑니다. Git 이력은 함께 전달된 `banggood-history.bundle`에서 복원했으며, 기본 브랜치는 `main`, 원격 저장소는 https://github.com/nan29077/banggood 입니다.

미리보기는 http://localhost:3061 이며 http://127.0.0.1:3061 로도 접속할 수 있습니다. 두 주소 모두 현재 로컬 소스를 제공하는 것을 확인했고, `npm test` 전체 검증을 통과했습니다. 브라우저 체험 데이터는 주소별로 구분되므로 사용하던 주소를 계속 사용하세요.

이 폴더에서는 아래 ZIP 설치 절차를 다시 실행할 필요가 없습니다. 다음 작업은 현재 폴더에서 `git status`로 상태를 확인한 후 시작합니다. 서버가 종료되어 있으면 `npm run dev` 또는 `start-local.cmd`로 같은 3061 포트에 실행합니다. 프로젝트 작업 규칙은 `AGENTS.md`에 기록되어 있습니다.

## ZIP으로 설치
다운로드한 `banggood-local-3061.zip`을 아래 명령으로 설치합니다. 대상 폴더가 이미 있으면 먼저 내용을 확인해야 하며, 아래 명령은 기존 폴더에 덮어쓰지 않습니다.

```powershell
$target = 'E:\프로젝트\방긋마켓'
if (Test-Path $target) { throw '대상 폴더가 이미 있습니다. 기존 내용을 먼저 확인하세요.' }
Expand-Archive -LiteralPath "$env:USERPROFILE\Downloads\banggood-local-3061.zip" -DestinationPath $target
Set-Location $target
powershell -NoProfile -ExecutionPolicy Bypass -File .\setup-windows.ps1
npm run dev
```

다운로드 위치가 다르면 ZIP 경로를 바꿔 주세요. Node.js 20 이상, Git for Windows가 필요합니다.
설정 스크립트는 현재 폴더에 Git을 초기화하고 `nan29077/banggood`의 main에 소스를 저장합니다. GitHub 로그인 창이 열리면 본인 계정으로 로그인합니다. 기존 원격 이력은 강제로 덮어쓰지 않습니다.
GitHub 저장이 실패해도 로컬 소스는 그대로이며 `npm run dev`로 실행할 수 있습니다.

`http://localhost:3061`을 엽니다. 이후 `start-local.cmd` 더블클릭으로도 실행합니다.
별도 패키지 설치, DB 설치, 빌드는 필요 없습니다. 종료는 Ctrl+C입니다.

## GitHub에 첫 저장이 완료된 이후
다른 PC에는 `git clone https://github.com/nan29077/banggood.git "E:\프로젝트\방긋마켓"`으로 설치할 수 있습니다.
기존 PC에서 작업을 이어갈 때:

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
