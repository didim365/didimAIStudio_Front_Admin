import { NextRequest, NextResponse } from 'next/server';

// CI 환경 또는 Playwright 테스트 환경에서는 실제 개발 서버로 프록시
// Docker Compose 환경에서는 auth 컨테이너로 프록시
const getApiBaseUrl = () => {
  if (process.env.CI || process.env.PLAYWRIGHT_TEST) {
    return 'https://aistudio-dev-admin.didim365.com';
  }
  return 'http://auth:8000';
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams.path, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams.path, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams.path, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  const baseUrl = getApiBaseUrl();
  const path = pathSegments.join('/');
  const targetUrl = `${baseUrl}/api/${path}`;

  console.log(`[API Proxy] ${method} ${targetUrl}`);

  try {
    const headers = new Headers();

    // 원본 요청의 헤더 복사 (host 제외)
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
        headers.set(key, value);
      }
    });

    const body = method !== 'GET' && method !== 'HEAD'
      ? await request.text()
      : undefined;

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      // CI 환경에서 SSL 인증서 검증 비활성화
      // @ts-ignore - Node.js fetch에서만 사용 가능한 옵션
      ...(process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0' && {
        rejectUnauthorized: false,
      }),
    });

    console.log(`[API Proxy] ${response.status} ${targetUrl}`);

    // 응답 헤더 복사
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // CORS 관련 헤더는 제외
      if (!key.toLowerCase().startsWith('access-control-') &&
          key.toLowerCase() !== 'connection' &&
          key.toLowerCase() !== 'transfer-encoding') {
        responseHeaders.set(key, value);
      }
    });

    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[API Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: error instanceof Error ? error.message : String(error) },
      { status: 502 }
    );
  }
}
