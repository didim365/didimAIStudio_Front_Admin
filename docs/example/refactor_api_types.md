# API 타입 정의 리팩토링 가이드

## 작업 개요

API 타입 정의 파일들을 리팩토링하여 타입 안정성을 개선하고, OpenAPI 스키마와의 일관성을 유지하는 작업입니다. `src/shared/types/api/*.d.ts` 파일들을 검토하고 개선합니다.

## 프롬프트 예제

### 기본 프롬프트

```
API 타입 정의를 리팩토링해주세요:

1. `src/shared/types/api/` 폴더의 모든 타입 정의 파일을 확인하세요.
2. OpenAPI 스키마와 일치하는지 검증하세요.
3. 타입 정의가 누락되거나 잘못된 부분을 수정하세요.
4. 공통 타입을 추출하여 재사용성을 높이세요.
5. JSDoc 주석을 추가하여 타입 설명을 명확히 하세요.
```

### 상세 프롬프트 (단계별)

```
API 타입 정의를 단계별로 리팩토링해주세요:

**1단계: 기존 타입 정의 검토**
- `src/shared/types/api/agents.d.ts` 확인
- `src/shared/types/api/tools.d.ts` 확인
- `src/shared/types/api/models.d.ts` 확인
- 각 파일의 paths 정의 확인

**2단계: OpenAPI 스키마 확인**
- 백엔드 API 문서 확인
- 각 엔드포인트의 Request/Response 스키마 확인
- 타입 정의와 실제 API 스키마 비교

**3단계: 공통 타입 추출**
- 여러 엔드포인트에서 공통으로 사용되는 타입 식별
- 페이지네이션 타입 (PageInfo, PageRequest 등)
- 공통 Response 타입 (BaseResponse, ErrorResponse 등)
- 공통 Entity 타입 (Agent, Persona, Scenario 등)

**4단계: 타입 정의 개선**
- 각 엔드포인트별 타입 정의 개선
  - GET: parameters.query, responses[200]
  - POST: requestBody, responses[201]
  - PUT: parameters.path, requestBody, responses[200]
  - DELETE: parameters.path, responses[204]
  - PATCH: parameters.path, requestBody, responses[200]

**5단계: JSDoc 주석 추가**
- 각 타입에 설명 추가
- 필수/선택 필드 명시
- 예시 값 추가 (필요시)

**6단계: 타입 검증**
- 실제 API 함수에서 타입이 올바르게 추론되는지 확인
- 타입 에러가 없는지 확인
- IDE 자동완성이 제대로 작동하는지 확인
```

### 간결한 프롬프트

```
API 타입 리팩토링:
1. `src/shared/types/api/*.d.ts` 확인
2. OpenAPI 스키마와 비교
3. 공통 타입 추출 (페이지네이션, 에러 등)
4. 누락/잘못된 타입 수정
5. JSDoc 주석 추가
```

### 검증 중심 프롬프트

```
API 타입 정의를 검증하고 리팩토링해주세요:

**검증 항목:**
1. ✅ Agents API 타입 (agents.d.ts)
   - /v1/agents/data: GET, POST
   - /v1/agents/data/{agent_id}: GET, PUT, DELETE, PATCH
   - /v1/personas/data: GET, POST
   - /v1/personas/data/{persona_id}: GET, PUT, DELETE, PATCH
   - /v1/scenarios/data: GET, POST
   - /v1/scenarios/data/{scenario_id}: GET, PUT, DELETE, PATCH

2. ✅ Tools API 타입 (tools.d.ts)
   - /v1/mcp-tools/: GET, POST
   - /v1/mcp-tools/{tool_id}: GET, PUT, DELETE
   - /v1/mcp-tools/{tool_id}/config: GET, PUT
   - /v1/mcp-tools/{tool_id}/start: POST
   - /v1/mcp-tools/{tool_id}/stop: POST
   - /v1/mcp-tools/{tool_id}/deploy: POST

3. ✅ Models API 타입 (models.d.ts)
   - /v1/settings: GET
   - /v1/settings/config/{user_model_id}: GET
   - 기타 Models 관련 엔드포인트

4. ✅ 공통 타입 확인
   - 페이지네이션: PageInfo, PageRequest
   - 에러 응답: ErrorResponse
   - 공통 Entity: 중복 타입 제거

**리팩토링이 필요한 경우 진행해주세요.**
```

## 확인해야 할 주요 사항

### 1. OpenAPI 타입 구조

```typescript
// paths 구조
export interface paths {
  "/v1/agents/data": {
    get: {
      parameters: {
        query?: {
          page?: number;
          size?: number;
          sort?: string;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": {
              data: Agent[];
              page_info: PageInfo;
            };
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          "application/json": {
            name: string;
            description?: string;
            // ...
          };
        };
      };
      responses: {
        201: {
          content: {
            "application/json": Agent;
          };
        };
      };
    };
  };
}
```

### 2. 공통 타입 추출

```typescript
// 페이지네이션
export interface PageInfo {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

// 에러 응답
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// 공통 Entity 필드
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}
```

### 3. 타입 추출 유틸리티

```typescript
// Response 타입 추출
type GetAgentsResponse =
  paths["/v1/agents/data"]["get"]["responses"]["200"]["content"]["application/json"];

// Request Body 타입 추출
type PostAgentRequest =
  paths["/v1/agents/data"]["post"]["requestBody"]["content"]["application/json"];

// Query 파라미터 타입 추출
type GetAgentsParams =
  paths["/v1/agents/data"]["get"]["parameters"]["query"];

// Path 파라미터 타입 추출
type AgentIdParam =
  paths["/v1/agents/data/{agent_id}"]["get"]["parameters"]["path"];
```

## 예상되는 문제 및 해결 방법

### 문제 1: OpenAPI 스키마와 불일치
**증상**: 타입 정의가 실제 API 응답과 다름
**해결**: OpenAPI 스펙 문서 확인 후 타입 수정

### 문제 2: 중복 타입 정의
**증상**: 여러 파일에 동일한 타입이 중복 정의됨
**해결**: 공통 타입을 별도 파일로 분리

### 문제 3: 타입이 너무 광범위함
**증상**: `any` 또는 `unknown`이 과도하게 사용됨
**해결**: 구체적인 타입으로 좁히기

### 문제 4: 선택적 필드 누락
**증상**: 필수가 아닌 필드가 필수로 표시됨
**해결**: `?` 연산자를 사용하여 선택적 필드로 변경

## 참고 파일

- **작업 대상**: `src/shared/types/api/*.d.ts`
- **API 함수**: `src/feature/studio/data/*/api/*.ts`
- **OpenAPI 스펙**: 백엔드 API 문서
- **Todo 목록**: `docs/working_history/01_todo_list.md` (308-312번 라인)

## 타입 정의 템플릿

### agents.d.ts 예시

```typescript
/**
 * Agents API 타입 정의
 *
 * Agent, Persona, Scenario 관련 API 엔드포인트의 타입을 정의합니다.
 */

import type { PageInfo } from "./common";

/**
 * Agent 엔티티
 */
export interface Agent {
  /** Agent ID */
  id: string;
  /** Agent 이름 */
  name: string;
  /** Agent 설명 */
  description?: string;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
}

export interface paths {
  "/v1/agents/data": {
    /**
     * Agent 목록 조회
     */
    get: {
      parameters: {
        query?: {
          /** 페이지 번호 (1부터 시작) */
          page?: number;
          /** 페이지 크기 */
          size?: number;
          /** 정렬 기준 (예: "created_at:desc") */
          sort?: string;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": {
              data: Agent[];
              page_info: PageInfo;
            };
          };
        };
      };
    };
    /**
     * Agent 생성
     */
    post: {
      requestBody: {
        content: {
          "application/json": {
            name: string;
            description?: string;
          };
        };
      };
      responses: {
        201: {
          content: {
            "application/json": Agent;
          };
        };
      };
    };
  };
  // ... 다른 엔드포인트
}
```

### common.d.ts 예시

```typescript
/**
 * 공통 API 타입 정의
 */

/**
 * 페이지네이션 정보
 */
export interface PageInfo {
  /** 현재 페이지 (1부터 시작) */
  current_page: number;
  /** 페이지 크기 */
  page_size: number;
  /** 전체 항목 수 */
  total_items: number;
  /** 전체 페이지 수 */
  total_pages: number;
}

/**
 * 에러 응답
 */
export interface ErrorResponse {
  error: {
    /** 에러 코드 */
    code: string;
    /** 에러 메시지 */
    message: string;
    /** 추가 상세 정보 */
    details?: unknown;
  };
}

/**
 * 기본 엔티티 필드
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}
```

## 타입 안정성 체크리스트

- [ ] 모든 API 엔드포인트에 타입 정의가 있는지 확인
- [ ] Request Body 타입이 정확한지 확인
- [ ] Response 타입이 정확한지 확인
- [ ] Query 파라미터 타입이 정확한지 확인
- [ ] Path 파라미터 타입이 정확한지 확인
- [ ] 선택적 필드가 올바르게 표시되었는지 확인
- [ ] JSDoc 주석이 추가되었는지 확인
- [ ] 공통 타입이 재사용되는지 확인

## 완료 기준

- [ ] agents.d.ts 리팩토링 완료
- [ ] tools.d.ts 리팩토링 완료
- [ ] models.d.ts 리팩토링 완료
- [ ] 공통 타입 파일 생성 (common.d.ts)
- [ ] OpenAPI 스키마와 일치하는지 확인
- [ ] 모든 API 함수에서 타입이 올바르게 추론되는지 확인
- [ ] TypeScript 타입 에러 없음 확인
- [ ] JSDoc 주석이 적절히 추가되었는지 확인
