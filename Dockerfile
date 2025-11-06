# syntax=docker/dockerfile:1

# 빌드 단계
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 의존성 파일 복사
COPY package.json pnpm-lock.yaml* ./

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

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

# Next.js standalone 파일 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 4000

ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
