FROM node:20-alpine

# SSL 우회용 HTTP mirror 사용
RUN sed -i 's/https/http/g' /etc/apk/repositories \
    && apk update && apk add --no-cache ca-certificates

# FortiGate 인증서 복사
COPY certs/fortigate-ca.crt /usr/local/share/ca-certificates/fortigate-ca.crt
RUN update-ca-certificates

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]