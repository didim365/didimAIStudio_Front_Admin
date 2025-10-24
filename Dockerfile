# 런타임 단계
FROM node:18-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 의존성 파일 복사
COPY package.json pnpm-lock.yaml ./

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]

# # 런타임 단계
# FROM node:18-alpine AS builder

# WORKDIR /app
# COPY package*.json ./
# RUN npm install --legacy-peer-deps
# COPY . .
# RUN npm run build 

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

# CMD ["npm", "run", "start"]