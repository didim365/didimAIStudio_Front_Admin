/**
 * 토큰 저장소 유틸리티
 * Cookie를 사용하여 accessToken과 refreshToken을 관리합니다.
 */

export const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const COOKIE_MAX_AGE_DAYS = 7;

/**
 * Cookie 설정 헬퍼 함수
 */
const setCookie = (
  name: string,
  value: string,
  days: number = COOKIE_MAX_AGE_DAYS
): void => {
  if (typeof document !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
};

/**
 * Cookie 조회 헬퍼 함수
 * SSR과 CSR 환경 모두에서 동작합니다.
 */
const getCookie = async (name: string): Promise<string | null> => {
  // CSR 환경
  if (typeof document !== "undefined") {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // SSR 환경
  try {
    const { cookies: getCookies } = await import("next/headers");
    const cookieStore = await getCookies();
    return cookieStore.get(name)?.value ?? null;
  } catch (error) {
    console.error(error);
    // next/headers가 사용 불가능한 환경에서는 null 반환
    return null;
  }
};

/**
 * Cookie 삭제 헬퍼 함수
 * SSR과 CSR 환경 모두에서 동작합니다.
 */
const deleteCookie = async (name: string): Promise<void> => {
  // CSR 환경
  if (typeof document !== "undefined") {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    return;
  }

  // SSR 환경
  try {
    const { cookies: getCookies } = await import("next/headers");
    const cookieStore = await getCookies();
    cookieStore.delete(name);
  } catch (error) {
    console.error(error);
  }
};

/**
 * JWT 토큰의 payload 부분을 디코딩하고 검증합니다.
 * @param token JWT 토큰 문자열
 * @returns payload가 유효한 JSON 형식이고 만료되지 않았으면 true, 그렇지 않으면 false
 */
export const isValidJWTToken = (token: string): boolean => {
  try {
    // JWT 토큰은 header.payload.signature 형식
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    // payload 부분 디코딩 (base64url 디코딩)
    const payload = parts[1];

    // base64url을 base64로 변환 (padding 추가)
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    if (padding) {
      base64 += "=".repeat(4 - padding);
    }

    // base64 디코딩 (Edge Runtime 호환을 위해 atob 사용)
    const decodedPayload = atob(base64);

    // JSON 파싱 검증
    const parsedPayload = JSON.parse(decodedPayload);

    // exp(만료 시간)가 있으면 검증
    if (parsedPayload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (parsedPayload.exp < currentTime) {
        return false; // 토큰이 만료됨
      }
    }

    return true;
  } catch (error) {
    // 파싱 실패 또는 디코딩 실패
    return false;
  }
};

export const tokenStorage = {
  /**
   * Access Token 저장
   */
  setAccessToken: (token: string): void => {
    setCookie(ACCESS_TOKEN_KEY, token);
  },

  /**
   * Refresh Token 저장
   */
  setRefreshToken: (token: string): void => {
    setCookie(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Access Token 조회
   */
  getAccessToken: async (): Promise<string | null> => {
    return await getCookie(ACCESS_TOKEN_KEY);
  },

  /**
   * Refresh Token 조회
   */
  getRefreshToken: async (): Promise<string | null> => {
    return await getCookie(REFRESH_TOKEN_KEY);
  },

  /**
   * 모든 토큰 삭제
   */
  clearTokens: async (): Promise<void> => {
    await deleteCookie(ACCESS_TOKEN_KEY);
    await deleteCookie(REFRESH_TOKEN_KEY);
  },

  /**
   * Access Token 삭제
   */
  clearAccessToken: async (): Promise<void> => {
    await deleteCookie(ACCESS_TOKEN_KEY);
  },

  /**
   * Refresh Token 삭제
   */
  clearRefreshToken: async (): Promise<void> => {
    await deleteCookie(REFRESH_TOKEN_KEY);
  },
};
