import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { tokenStorage, isValidJWTToken } from "./shared/utils/tokenStorage";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일과 API 요청은 미들웨어를 건너뜀
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token");

  // 토큰이 없으면 redirect
  if (!accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // JWT 토큰 형식 및 만료 시간 검증
  if (!isValidJWTToken(accessToken.value)) {
    await tokenStorage.clearTokens();
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!^/$).*)"],
};
