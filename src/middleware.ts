import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token");

  // 시작 지점 `/`가 아닌 페이지에 접근하는데 토큰이 없으면 redirect
  if (pathname !== "/" && !accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!^/$).*)"],
};
