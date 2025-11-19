# Admin FE

Next.js 기반 관리자 대시보드 애플리케이션

## 기술 스택

- **Framework:** Next.js 15.5.6
- **React:** 19.1.0
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS 4 + SCSS
- **UI Components:** Radix UI
- **Package Manager:** pnpm
- **Reverse Proxy:** Nginx

## 로컬 개발

### 필수 요구사항

- Node.js 20+
- pnpm

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

개발 서버는 [http://localhost:4000](http://localhost:4000)에서 실행됩니다.

### 빌드

```bash
pnpm build
pnpm start
```

## Docker 배포

### 🔧 개발 환경 (Hot Reload 지원)

```bash
# 개발 환경 시작 (로그 확인)
pnpm docker:dev
# 또는
docker-compose -f docker-compose.dev.yml up

# 백그라운드 실행
docker-compose -f docker-compose.dev.yml up -d

# 빌드 강제 실행
pnpm docker:dev:build

# 로그 확인
docker-compose -f docker-compose.dev.yml logs -f nextjs

# 종료
pnpm docker:dev:down
```

**개발 환경 특징:**

- ✅ **Hot Reload** - 코드 변경 시 자동 반영
- ✅ **Volume 마운트** - 실시간 개발 가능
- ✅ **Turbopack** - 빠른 개발 서버
- ✅ **Nginx 프록시** - API 테스트 (포트 3002)
- ✅ **환경 변수** - `.env.develop` 사용
- 📁 **Dockerfile**: `Dockerfile.dev`
- 🔧 **Compose**: `docker-compose.dev.yml`

### 🚀 프로덕션 환경 (배포용)

```bash
# 프로덕션 빌드 및 실행
pnpm docker:prod
# 또는
docker-compose -f docker-compose.prod.yml up -d

# 빌드 강제 실행
pnpm docker:prod:build

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f

# 종료
pnpm docker:prod:down
```

**프로덕션 환경 특징:**

- ✅ **Multi-stage Build** - 최적화된 이미지
- ✅ **Standalone Output** - 최소 번들 크기
- ✅ **Non-root User** - 보안 강화
- ✅ **Alpine Linux** - 경량 이미지 (~150MB)
- ✅ **자동 재시작** - `restart: unless-stopped`
- ✅ **환경 변수** - `.env.production` 사용
- 📁 **Dockerfile**: `Dockerfile`
- 🚀 **Compose**: `docker-compose.prod.yml`

### 직접 Docker 명령어 사용

```bash
# 프로덕션 이미지 빌드
docker build -t admin-fe:latest .

# 개발 이미지 빌드
docker build -f Dockerfile.dev -t admin-fe:dev .

# 컨테이너 실행
docker run -p 3000:3000 --env-file .env.production admin-fe:latest
```

## 환경 변수

프로젝트 루트에 환경 변수 파일을 생성하세요:

- `.env.develop` - 개발 환경
- `.env.production` - 프로덕션 환경

## 프로젝트 구조

```
.
├── src/
│   ├── app/              # Next.js App Router 페이지
│   ├── feature/          # 기능별 컴포넌트
│   ├── shared/           # 공유 UI 컴포넌트
│   └── assets/           # SCSS 스타일
├── public/               # 정적 파일
├── certs/                # SSL 인증서 (nginx용)
├── Dockerfile            # 프로덕션 Dockerfile
├── Dockerfile.dev        # 개발 Dockerfile
├── docker-compose.yml    # 개발 환경 설정
├── docker-compose.prod.yml # 프로덕션 환경 설정
├── nginx.conf            # Nginx 설정 (개발)
├── nginx.prod.conf       # Nginx 설정 (프로덕션)
└── next.config.ts        # Next.js 설정
```

## 주요 설정

### Next.js 설정 (next.config.ts)

- `output: 'standalone'` - Docker 최적화
- `distDir: 'nextjs-build'` - 빌드 출력 디렉토리
- `reactCompiler: true` - React Compiler 활성화
- SCSS 지원
- 이미지 최적화 설정
- API 프록시 설정 (`/api` → `http://auth:8000/api`)

### 네트워크 구조

**개발 환경:**

```
외부 요청 (포트 3002)
    ↓
Nginx (HTTP, 리버스 프록시)
    ↓
Next.js (포트 3000)
    ↓
Backend API (https://aistudio-dev.hell0world.net)
```

**프로덕션 환경:**

```
외부 요청 (포트 80/443)
    ↓
Nginx (SSL/TLS, 리버스 프록시)
    ↓
Next.js (포트 3000)
    ↓
Backend API (https://aistudio.hell0world.net:8000)
```

**포트 구성:**

- `4000`: Next.js 서버 & 관리자 페이지 (통일된 포트)
- `3002`: Nginx API 테스트 (개발/테스트용)
- `80`: Nginx HTTP (프로덕션, ALB 연결용)

## 성능 최적화

### Docker 최적화

- **Multi-stage build**: 빌드 의존성과 런타임 분리
- **pnpm fetch**: 레이어 캐싱으로 빌드 속도 향상
- **Alpine Linux**: 최소 이미지 크기 (~150MB)
- **Standalone output**: 필요한 파일만 포함

### Next.js 최적화

- **React Compiler**: 자동 메모이제이션
- **Turbopack**: 개발 환경 빠른 빌드
- **이미지 최적화**: 외부 이미지 지원

## 문제 해결

### pnpm-lock.yaml이 없는 경우

```bash
# pnpm-lock.yaml 생성
pnpm install
```

### Nginx SSL 인증서 설정

**개발 환경:**

- SSL 인증서 없이 HTTP로 실행 가능 (포트 3002)
- docker-compose.yml에서 SSL 관련 volume을 주석 처리하면 됨

**프로덕션 환경:**
`certs/` 디렉토리에 SSL 인증서 파일을 배치하세요:

```bash
certs/
  ├── fullchain.pem
  └── privkey.pem
```

인증서가 없는 경우 Let's Encrypt로 발급:

```bash
# Certbot 설치 (Ubuntu)
sudo apt-get install certbot

# 인증서 발급
sudo certbot certonly --standalone -d aistudio.hell0world.net

# 인증서 복사
sudo cp /etc/letsencrypt/live/aistudio.hell0world.net/fullchain.pem ./certs/
sudo cp /etc/letsencrypt/live/aistudio.hell0world.net/privkey.pem ./certs/
sudo chmod 644 ./certs/*.pem
```

### 포트 충돌

`.env` 파일 또는 `docker-compose.yml`에서 포트를 변경하세요:

```yaml
ports:
  - "3001:3000" # 호스트:컨테이너
```

## 배포 체크리스트

- [ ] `.env.production` 파일 생성 및 환경 변수 설정
- [ ] SSL 인증서 파일 준비 (`certs/` 디렉토리)
- [ ] `nginx.conf` 설정 확인
- [ ] Docker 이미지 빌드 테스트
- [ ] 프로덕션 환경에서 실행 테스트
- [ ] 로그 모니터링 설정
- [ ] 백업 및 롤백 계획 수립

## 유용한 명령어

```bash
# 개발 환경 로그 실시간 확인
docker-compose logs -f

# 특정 서비스 재시작
docker-compose restart nextjs

# 컨테이너 내부 접속
docker-compose exec nextjs sh

# 디스크 정리
docker system prune -a

# 이미지 크기 확인
docker images admin-fe
```