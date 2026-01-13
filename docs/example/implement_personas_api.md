# Personas API 구현 가이드

## 작업 개요

Personas 관련 API 함수들을 구현하는 작업입니다. `src/feature/studio/data/personas` 폴더에 있는 API 함수들이 `/v1/personas/data` 엔드포인트를 올바르게 사용하도록 구현하고 검증합니다.

## 프롬프트 예제

### 기본 프롬프트

```
Personas API 함수들을 구현해주세요:

1. `src/feature/studio/data/personas/_api/` 폴더의 API 함수들을 확인하세요.
2. 각 함수가 `/v1/personas/data` 엔드포인트를 올바르게 사용하는지 검증하세요.
3. `src/shared/types/api/agents.d.ts`의 Personas 타입 정의를 사용하는지 확인하세요.
4. 누락된 API 함수가 있다면 생성하세요:
   - getPersonas.ts (목록 조회)
   - postPersona.ts (생성)
   - getPersona.ts (단일 조회)
   - putPersona.ts (수정)
   - deletePersona.ts (삭제)
   - patchPersona.ts (부분 수정)
```

### 상세 프롬프트 (단계별)

```
Personas API를 단계별로 구현해주세요:

**1단계: 기존 파일 확인**
- `src/feature/studio/data/personas/_api/` 폴더 구조 확인
- 이미 존재하는 API 함수 파일들 확인
- Templates 폴더에서 복사된 파일인지 확인

**2단계: 타입 정의 확인**
- `src/shared/types/api/agents.d.ts` 파일에서 Personas 관련 타입 확인
- `/v1/personas/data` 엔드포인트의 Request/Response 타입 확인
- 각 HTTP 메서드별 타입 정의 확인 (GET, POST, PUT, DELETE, PATCH)

**3단계: API 함수 구현**
- getPersonas.ts 구현
  - 엔드포인트: GET `/personas/data`
  - 타입: `paths["/v1/personas/data"]["get"]`
  - 쿼리 파라미터: 페이지네이션, 필터링 등

- postPersona.ts 구현
  - 엔드포인트: POST `/personas/data`
  - 타입: `paths["/v1/personas/data"]["post"]`
  - Request Body: Persona 생성 데이터

- getPersona.ts 구현
  - 엔드포인트: GET `/personas/data/{persona_id}`
  - 타입: `paths["/v1/personas/data/{persona_id}"]["get"]`
  - Path 파라미터: persona_id

- putPersona.ts 구현
  - 엔드포인트: PUT `/personas/data/{persona_id}`
  - 타입: `paths["/v1/personas/data/{persona_id}"]["put"]`
  - Request Body: Persona 수정 데이터 (Upsert)

- deletePersona.ts 구현
  - 엔드포인트: DELETE `/personas/data/{persona_id}`
  - 타입: `paths["/v1/personas/data/{persona_id}"]["delete"]`
  - Path 파라미터: persona_id

- patchPersona.ts 구현
  - 엔드포인트: PATCH `/personas/data/{persona_id}`
  - 타입: `paths["/v1/personas/data/{persona_id}"]["patch"]`
  - Request Body: 부분 수정할 데이터

**4단계: 검증**
- 각 함수가 올바른 axiosInstance를 사용하는지 확인
- 타입 추론이 정확히 작동하는지 확인
- 에러 처리가 적절한지 확인
```

### 간결한 프롬프트

```
Personas API 구현:
1. `src/feature/studio/data/personas/_api/` 폴더 확인
2. `/v1/personas/data` 엔드포인트 사용하도록 구현
3. 누락된 함수 생성 (getPersonas, postPersona, getPersona, putPersona, deletePersona, patchPersona)
4. `src/shared/types/api/agents.d.ts` 타입 사용 확인
```

### 검증 중심 프롬프트

```
Personas API를 검증하고 구현해주세요:

**검증 항목:**
1. ✅ API 엔드포인트 확인
   - 목록 조회: GET `/personas/data`
   - 생성: POST `/personas/data`
   - 단일 조회: GET `/personas/data/{persona_id}`
   - 수정: PUT `/personas/data/{persona_id}`
   - 삭제: DELETE `/personas/data/{persona_id}`
   - 부분 수정: PATCH `/personas/data/{persona_id}`

2. ✅ 타입 정의 확인
   - Response 타입: `paths["/v1/personas/data"]["get"]["responses"]["200"]["content"]["application/json"]`
   - Request Body 타입: `paths["/v1/personas/data"]["post"]["requestBody"]["content"]["application/json"]`
   - 각 엔드포인트별 타입 정의 확인

3. ✅ 파일 구조 확인
   - API 함수들이 올바른 폴더에 위치하는지 확인
   - 파일 네이밍 규칙 준수 확인

**구현이 필요한 경우 진행해주세요.**
```

## 확인해야 할 주요 사항

### 1. API 엔드포인트 경로

| 작업 | 메서드 | 경로 | 타입 경로 |
|-----|--------|-----|----------|
| 목록 조회 | GET | `/personas/data` | `/v1/personas/data` |
| 생성 | POST | `/personas/data` | `/v1/personas/data` |
| 단일 조회 | GET | `/personas/data/{persona_id}` | `/v1/personas/data/{persona_id}` |
| 수정 | PUT | `/personas/data/{persona_id}` | `/v1/personas/data/{persona_id}` |
| 삭제 | DELETE | `/personas/data/{persona_id}` | `/v1/personas/data/{persona_id}` |
| 부분 수정 | PATCH | `/personas/data/{persona_id}` | `/v1/personas/data/{persona_id}` |

### 2. 타입 정의 구조

```typescript
// Response 타입 예시
type GetPersonasResponse = paths["/v1/personas/data"]["get"]["responses"]["200"]["content"]["application/json"];

// Request Body 타입 예시
type PostPersonaRequest = paths["/v1/personas/data"]["post"]["requestBody"]["content"]["application/json"];

// Query 파라미터 타입 예시
type GetPersonasParams = paths["/v1/personas/data"]["get"]["parameters"]["query"];

// Path 파라미터 타입 예시
type PersonaIdParam = paths["/v1/personas/data/{persona_id}"]["get"]["parameters"]["path"];
```

### 3. axiosInstance 사용

- `axiosInstance.agent.get()` - 목록/단일 조회 시
- `axiosInstance.agent.post()` - 생성 시
- `axiosInstance.agent.put()` - 수정(Upsert) 시
- `axiosInstance.agent.delete()` - 삭제 시
- `axiosInstance.agent.patch()` - 부분 수정 시

## 예상되는 문제 및 해결 방법

### 문제 1: Templates 엔드포인트 사용
**증상**: `/personas/templates` 경로 사용
**해결**: `/personas/data`로 변경

### 문제 2: 잘못된 타입 경로
**증상**: `/v1/personas/templates` 타입 경로 사용
**해결**: `/v1/personas/data` 타입 경로로 변경

### 문제 3: 누락된 API 함수
**증상**: 일부 CRUD 함수가 구현되지 않음
**해결**: 누락된 함수들을 표준 패턴에 따라 구현

### 문제 4: 타입 추론 오류
**증상**: TypeScript 타입 에러 발생
**해결**: `src/shared/types/api/agents.d.ts`의 정의 확인 및 수정

## 참고 파일

- **작업 대상**: `src/feature/studio/data/personas/_api/*.ts`
- **타입 정의**: `src/shared/types/api/agents.d.ts`
- **참고 구현**: `src/feature/studio/data/agents/api/*.ts`
- **Todo 목록**: `docs/working_history/01_todo_list.md` (106-151번 라인)

## API 함수 구현 템플릿

### getPersonas.ts 예시

```typescript
import type { paths } from "@/shared/types/api/agents";
import { axiosInstance } from "@/shared/lib/axios";

type GetPersonasResponse =
  paths["/v1/personas/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPersonasParams =
  paths["/v1/personas/data"]["get"]["parameters"]["query"];

export const getPersonas = async (params?: GetPersonasParams) => {
  const { data } = await axiosInstance.agent.get<GetPersonasResponse>(
    "/personas/data",
    { params }
  );
  return data;
};
```

### postPersona.ts 예시

```typescript
import type { paths } from "@/shared/types/api/agents";
import { axiosInstance } from "@/shared/lib/axios";

type PostPersonaRequest =
  paths["/v1/personas/data"]["post"]["requestBody"]["content"]["application/json"];

type PostPersonaResponse =
  paths["/v1/personas/data"]["post"]["responses"]["201"]["content"]["application/json"];

export const postPersona = async (data: PostPersonaRequest) => {
  const response = await axiosInstance.agent.post<PostPersonaResponse>(
    "/personas/data",
    data
  );
  return response.data;
};
```

## 완료 기준

- [ ] getPersonas.ts 구현 완료
- [ ] postPersona.ts 구현 완료
- [ ] getPersona.ts 구현 완료
- [ ] putPersona.ts 구현 완료
- [ ] deletePersona.ts 구현 완료
- [ ] patchPersona.ts 구현 완료
- [ ] 모든 함수가 올바른 타입을 사용하는지 확인 완료
- [ ] TypeScript 타입 에러 없음 확인
