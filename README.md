# Admin FE

Next.js 기반 관리자 대시보드 애플리케이션

## 기술 스택

- **Framework:** Next.js 16.0.10
- **React:** 19.2.3
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS 4 + SCSS
- **UI Components:** Radix UI
- **State Management:** TanStack Query (React Query)
- **Charts:** Recharts
- **Notifications:** Sonner
- **Code Editor:** CodeMirror
- **Error Monitoring:** Sentry
- **Testing:** Vitest (Unit/Integration), Playwright (E2E)
- **Package Manager:** npm
- **Reverse Proxy:** Nginx

## 로컬 개발

### 필수 요구사항

- Node.js 20+
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

개발 서버는 [http://localhost:4000](http://localhost:4000)에서 실행됩니다. (포트 변경: `npm run dev -- -p 4000`)

### 빌드

```bash
npm run build
npm start
```

## 테스트

### Unit/Integration 테스트 (Vitest)

```bash
# 테스트 실행 (watch 모드)
npm run test

# 테스트 한 번 실행
npm run test:run

# UI 모드로 테스트 실행
npm run test:ui

# 커버리지 리포트 생성
npm run test:coverage
```

### E2E 테스트 (Playwright)

```bash
# E2E 테스트 실행
npm run test:e2e

# UI 모드로 E2E 테스트 실행
npm run test:e2e:ui

# 디버그 모드로 E2E 테스트 실행
npm run test:e2e:debug
```

**참고:** `npm run build` 실행 시 `prebuild` 스크립트로 인해 테스트가 자동으로 실행됩니다.

## 에러 모니터링 (Sentry)

프로젝트에 Sentry가 통합되어 있어 프론트엔드 및 백엔드 에러를 실시간으로 모니터링할 수 있습니다.

### 설정 파일

- `sentry.server.config.ts` - 서버 환경 Sentry 초기화
- `sentry.edge.config.ts` - Edge 환경 (미들웨어, 엣지 라우트) Sentry 초기화
- `src/instrumentation-client.ts` - 클라이언트 Sentry 초기화 및 Replay 통합
- `src/instrumentation.ts` - Next.js instrumentation 훅
- `src/app/global-error.tsx` - 전역 에러 핸들러

### 주요 기능

- **에러 캡처:** 프론트엔드/백엔드 에러 자동 캡처
- **Session Replay:** 사용자 세션 리플레이 (10% 샘플링, 에러 발생 시 100%)
- **Performance Tracing:** 성능 추적 (tracesSampleRate: 1)
- **Tunnel Route:** 광고 차단기 우회를 위한 `/monitoring` 라우트

### 테스트 페이지

Sentry 연동 테스트를 위한 예제 페이지가 제공됩니다:

- `/sentry-example-page` - 프론트엔드/백엔드 에러 테스트 페이지
- `/api/sentry-example-api` - 백엔드 에러 테스트 API

## Docker 배포

### 🔧 개발 환경 (Hot Reload 지원)

```bash
# 개발 환경 시작 (로그 확인)
docker-compose up

# 백그라운드 실행
docker-compose up -d

# 빌드 강제 실행
docker-compose build --no-cache

# 로그 확인
docker-compose logs -f nextjs

# 종료
docker-compose down
```

**개발 환경 특징:**

- ✅ **Hot Reload** - 코드 변경 시 자동 반영
- ✅ **Volume 마운트** - 실시간 개발 가능
- ✅ **Turbopack** - 빠른 개발 서버
- ✅ **Nginx 프록시** - API 프록시 및 리버스 프록시 (포트 4000)
- ✅ **FortiGate 인증서** - 내부 인증서 지원
- ✅ **환경 변수** - docker-compose.yml에서 직접 설정
- 📁 **Dockerfile**: `Dockerfile.dev`
- 🔧 **Compose**: `docker-compose.yml`

### 🚀 프로덕션 환경 (배포용)

```bash
# 프로덕션 이미지 빌드
docker build -t admin-fe:latest .

# 컨테이너 실행
docker run -p 4000:4000 --env-file .env.production admin-fe:latest

# 또는 docker-compose 사용 시
docker-compose -f docker-compose.yml up -d
```

**프로덕션 환경 특징:**

- ✅ **Multi-stage Build** - 최적화된 이미지
- ✅ **Standalone Output** - 최소 번들 크기
- ✅ **Alpine Linux** - 경량 이미지 (~150MB)
- ✅ **포트 4000** - 통일된 포트 사용
- 📁 **Dockerfile**: `Dockerfile`

### 직접 Docker 명령어 사용

```bash
# 프로덕션 이미지 빌드
docker build -t admin-fe:latest .

# 개발 이미지 빌드
docker build -f Dockerfile.dev -t admin-fe:dev .

# 프로덕션 컨테이너 실행
docker run -p 4000:4000 --env-file .env.production admin-fe:latest

# 개발 컨테이너 실행
docker run -p 4000:4000 -v $(pwd):/app admin-fe:dev
```

## 환경 변수

환경 변수는 `docker-compose.yml`에서 직접 설정하거나, 프로덕션 배포 시 `.env.production` 파일을 사용할 수 있습니다.

**주요 환경 변수:**

- `NODE_ENV` - 실행 환경 (development/production)
- `NEXT_PUBLIC_API_BACKEND_URL` - 백엔드 API URL
- `PORT` - 서버 포트 (기본값: 4000)

## 프로젝트 구조

```
.
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── api/                # API 라우트
│   │   └── global-error.tsx    # 전역 에러 핸들러 (Sentry 연동)
│   ├── feature/                # 기능별 컴포넌트
│   ├── shared/                 # 공유 UI 컴포넌트
│   ├── test/                   # 테스트 유틸리티 및 설정
│   ├── instrumentation.ts      # Next.js instrumentation (Sentry 서버)
│   ├── instrumentation-client.ts # Sentry 클라이언트 초기화
│   └── proxy.ts                # 프록시 설정
├── public/                     # 정적 파일
├── certs/                      # SSL 인증서 및 FortiGate CA 인증서
├── docs/                       # 프로젝트 문서
├── sentry.server.config.ts     # Sentry 서버 설정
├── sentry.edge.config.ts       # Sentry Edge 설정
├── vitest.config.ts            # Vitest 설정
├── playwright.config.ts        # Playwright E2E 설정
├── Dockerfile                  # 프로덕션 Dockerfile
├── Dockerfile.dev              # 개발 Dockerfile
├── docker-compose.yml          # Docker Compose 설정
├── nginx.conf                  # Nginx 설정
├── next.config.ts              # Next.js 설정
├── package.json                # 의존성 및 스크립트
└── tsconfig.json               # TypeScript 설정
```

## 주요 설정

### Next.js 설정 (next.config.ts)

- `output: 'standalone'` - Docker 최적화
- `reactCompiler: true` - React Compiler 활성화
- `reactStrictMode: false` - React Strict Mode 비활성화
- SCSS 지원 (자동 import)
- 이미지 최적화 비활성화 (`unoptimized: true`)
- API 프록시 설정 (`/api` → `http://auth:8000/api`)
- 외부 이미지 도메인 허용 설정
- **Sentry 통합** - `withSentryConfig` 래핑, 소스맵 업로드, 트리쉐이킹 최적화

### 네트워크 구조

**개발 환경:**

```
외부 요청 (포트 4000)
    ↓
Nginx (HTTP, 리버스 프록시)
    ↓
Next.js (포트 3000, 내부)
    ↓
Backend API (https://aistudio-dev-admin.didim365.com)
```

**프로덕션 환경:**

```
외부 요청 (포트 4000)
    ↓
Next.js (포트 4000, 직접 서빙)
    ↓
Backend API (환경 변수로 설정)
```

**포트 구성:**

- `4000`: Next.js 서버 & 관리자 페이지 (통일된 포트)
- `3000`: Next.js 내부 포트 (개발 환경, Nginx 프록시용)

## 성능 최적화

### Docker 최적화

- **Multi-stage build**: 빌드 의존성과 런타임 분리
- **npm install --legacy-peer-deps**: 의존성 충돌 해결
- **Alpine Linux**: 최소 이미지 크기 (~150MB)
- **Standalone output**: 필요한 파일만 포함
- **FortiGate 인증서**: 개발 환경 내부 인증서 지원

### Next.js 최적화

- **React Compiler**: 자동 메모이제이션
- **Turbopack**: 개발 및 빌드 환경 빠른 빌드
- **이미지 최적화 비활성화**: 외부 이미지 직접 로드
- **SCSS 자동 import**: 전역 스타일 자동 적용

## 문제 해결

### package-lock.json이 없는 경우

```bash
# package-lock.json 생성
npm install
```

### 인증서 설정

**개발 환경:**

- FortiGate CA 인증서가 `Dockerfile.dev`에 포함되어 있음
- `certs/fortigate-ca.crt` 파일이 필요함
- SSL 인증서 없이 HTTP로 실행 가능 (포트 4000)

**프로덕션 환경:**

- Next.js가 직접 서빙하므로 Nginx SSL 설정 불필요
- 필요시 로드 밸런서나 리버스 프록시에서 SSL 처리

### 포트 충돌

`docker-compose.yml`에서 포트를 변경하세요:

```yaml
ports:
  - "4001:4000" # 호스트:컨테이너
```

또는 Dockerfile에서 `PORT` 환경 변수를 변경:

```dockerfile
ENV PORT=4001
```

## 배포 체크리스트

- [ ] 테스트 통과 확인 (`npm run test:run`)
- [ ] `.env.production` 파일 생성 및 환경 변수 설정 (선택사항)
- [ ] `docker-compose.yml` 환경 변수 확인
- [ ] Sentry DSN 및 프로젝트 설정 확인
- [ ] FortiGate CA 인증서 준비 (`certs/fortigate-ca.crt`, 개발 환경)
- [ ] `nginx.conf` 설정 확인 (개발 환경)
- [ ] Docker 이미지 빌드 테스트
- [ ] 프로덕션 환경에서 실행 테스트
- [ ] Sentry 에러 모니터링 동작 확인
- [ ] 백업 및 롤백 계획 수립

## 유용한 명령어

```bash
# 개발 환경 로그 실시간 확인
docker-compose logs -f

# 특정 서비스 재시작
docker-compose restart nextjs

# 컨테이너 내부 접속
docker-compose exec nextjs sh

# 볼륨 및 네트워크 포함 전체 정리
docker-compose down -v

# 디스크 정리
docker system prune -a

# 이미지 크기 확인
docker images admin-fe

# 개발 서버 직접 실행 (Docker 없이)
npm run dev

# 프로덕션 빌드
npm run build
npm start

# 테스트 실행
npm run test:run

# E2E 테스트 실행
npm run test:e2e

# 린트 검사
npm run lint
```
