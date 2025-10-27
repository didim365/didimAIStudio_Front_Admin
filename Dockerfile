<<<<<<< HEAD
# 런타임 단계
FROM node:18-alpine AS builder
=======
# syntax=docker/dockerfile:1

# 빌드 단계
FROM node:20-alpine AS builder
>>>>>>> c4ad53d0f292fbd087929664e40ccff692fcc572

WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 의존성 파일 복사
<<<<<<< HEAD
COPY package.json pnpm-lock.yaml ./
=======
COPY package.json pnpm-lock.yaml* ./
>>>>>>> c4ad53d0f292fbd087929664e40ccff692fcc572

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

<<<<<<< HEAD
EXPOSE 3000

CMD ["pnpm", "run", "dev"]

# # 프로덕션 빌드 단계
# FROM node:18-alpine AS builder

# WORKDIR /app

# # pnpm 설치
# RUN corepack enable && corepack prepare pnpm@latest --activate

# # 의존성 파일 복사
# COPY package.json pnpm-lock.yaml ./

# # 의존성 설치
# RUN pnpm install --frozen-lockfile

# # 소스 코드 복사
# COPY . .

# # 빌드 실행
# RUN pnpm run build

# # 런타임 단계
# FROM node:18-alpine

# WORKDIR /app

# # Next.js 애플리케이션 복사
# COPY --from=builder /app/nextjs-build/standalone ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/nextjs-build/static ./nextjs-build/static
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/nextjs-build .next

# EXPOSE 3000

# CMD ["pnpm", "run", "start"]
=======
# 환경 변수 설정
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js 빌드
RUN pnpm build

# 런타임 단계
FROM node:20-alpine AS runner

WORKDIR /app

# pnpm 설치 (런타임에서도 필요할 수 있음)
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 보안을 위한 non-root 유저 생성
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js standalone 파일 복사
COPY --from=builder --chown=nextjs:nodejs /app/nextjs-build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/nextjs-build/static ./nextjs-build/static

USER nextjs

EXPOSE 4000

ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
>>>>>>> c4ad53d0f292fbd087929664e40ccff692fcc572
