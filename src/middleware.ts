import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getMyInfo from "./shared/api/getMyInfo";

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

  try {
    await getMyInfo();
  } catch (err) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!^/$).*)"],
};
