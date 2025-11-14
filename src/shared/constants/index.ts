const SERVER_API_BASE_URL =
  process.env.NGINX_INTERNAL_URL || "http://nginx:4000";

export { SERVER_API_BASE_URL };
