#!/bin/sh
set -e

# 환경 변수로 nginx.conf 템플릿 처리
envsubst '${API_BACKEND_URL} ${API_BACKEND_HOST}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# nginx 실행
exec nginx -g 'daemon off;'

