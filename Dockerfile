# 런타임 단계
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

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