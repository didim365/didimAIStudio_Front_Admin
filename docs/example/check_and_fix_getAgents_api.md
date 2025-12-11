# getAgents.ts 파일 확인 및 수정 프롬프트 가이드

## 작업 개요

`src/feature/studio/data/agents/api/getAgents.ts` 파일을 확인하고 수정하는 작업입니다. 이 파일이 templates에서 복사된 파일인지 확인하고, API 엔드포인트가 `/v1/agents/data`를 올바르게 사용하는지 검증해야 합니다.

## 프롬프트 예제

### 기본 프롬프트

```
다음 작업을 수행해주세요:

1. `src/feature/studio/data/agents/api/getAgents.ts` 파일을 확인하세요.
2. `src/feature/studio/templates/agents/api/getAgents.ts` 파일과 비교하여 templates에서 복사된 파일인지 확인하세요.
3. API 엔드포인트가 `/v1/agents/data`를 올바르게 사용하는지 확인하세요.
4. 타입 정의가 `src/shared/types/api/agents.d.ts`의 `/v1/agents/data` 엔드포인트 타입을 올바르게 사용하는지 확인하세요.
5. 필요한 경우 파일을 수정하세요.
```

### 상세 프롬프트 (단계별)

```
다음 단계를 순서대로 수행해주세요:

**1단계: 파일 확인**
- `src/feature/studio/data/agents/api/getAgents.ts` 파일을 읽어보세요.
- `src/feature/studio/templates/agents/api/getAgents.ts` 파일도 읽어보세요.
- 두 파일의 내용을 비교하세요.

**2단계: 템플릿 복사 여부 확인**
- 두 파일이 동일한지 확인하세요.
- 만약 동일하다면, templates에서 복사된 것으로 판단할 수 있습니다.
- 차이점이 있다면 어떤 부분이 다른지 확인하세요.

**3단계: API 엔드포인트 확인**
- 현재 파일에서 사용하는 API 엔드포인트 경로를 확인하세요.
- `axiosInstance.agent.get()` 호출에서 사용하는 경로가 `/agents/data`인지 확인하세요.
- 타입 정의에서 `paths["/v1/agents/data"]["get"]`를 사용하는지 확인하세요.

**4단계: 타입 정의 확인**
- `src/shared/types/api/agents.d.ts` 파일에서 `/v1/agents/data` 엔드포인트의 타입 정의를 확인하세요.
- `GetAgentsResponse` 타입이 올바른 응답 타입을 사용하는지 확인하세요.
- `GetAgentsParams` 타입이 올바른 쿼리 파라미터 타입을 사용하는지 확인하세요.

**5단계: 수정 (필요시)**
- 문제가 발견되면 수정하세요.
- API 엔드포인트가 올바르지 않다면 `/agents/data`로 수정하세요.
- 타입 정의가 올바르지 않다면 수정하세요.
```

### 간결한 프롬프트

```
`src/feature/studio/data/agents/api/getAgents.ts` 파일을 확인하고:
1. templates에서 복사된 파일인지 확인 (`src/feature/studio/templates/agents/api/getAgents.ts`와 비교)
2. API 엔드포인트가 `/v1/agents/data`를 올바르게 사용하는지 확인
3. 타입이 `src/shared/types/api/agents.d.ts`의 `/v1/agents/data` 타입을 사용하는지 확인
4. 문제가 있으면 수정
```

### 검증 중심 프롬프트

```
`src/feature/studio/data/agents/api/getAgents.ts` 파일을 검증해주세요:

**검증 항목:**
1. ✅ 파일이 templates에서 복사되었는지 확인
   - 비교 대상: `src/feature/studio/templates/agents/api/getAgents.ts`
   
2. ✅ API 엔드포인트 확인
   - 예상 경로: `/agents/data` (axiosInstance.agent.get 호출 시)
   - 타입 경로: `/v1/agents/data` (paths 타입 정의 시)
   
3. ✅ 타입 정의 확인
   - Response 타입: `paths["/v1/agents/data"]["get"]["responses"]["200"]["content"]["application/json"]`
   - Params 타입: `paths["/v1/agents/data"]["get"]["parameters"]["query"]`

**발견된 문제가 있으면 수정해주세요.**
```

## 확인해야 할 주요 사항

### 1. API 엔드포인트 경로
- **올바른 경로**: `/agents/data` (axiosInstance 호출 시)
- **타입 경로**: `/v1/agents/data` (타입 정의 시)
- **잘못된 예시**: `/agents/templates`, `/v1/agents/templates` 등

### 2. 타입 정의
- **Response 타입**: `paths["/v1/agents/data"]["get"]["responses"]["200"]["content"]["application/json"]`
- **Params 타입**: `paths["/v1/agents/data"]["get"]["parameters"]["query"]`
- 타입 소스: `src/shared/types/api/agents.d.ts`

### 3. Templates와의 차이점
- Templates 버전은 템플릿 데이터를 조회하는 API를 사용할 수 있음
- Data 버전은 실제 데이터 API(`/v1/agents/data`)를 사용해야 함
- 두 파일이 동일하다면 templates에서 복사된 것으로 판단 가능

## 예상되는 문제 및 해결 방법

### 문제 1: 잘못된 API 엔드포인트 사용
**증상**: `/agents/templates` 또는 다른 경로 사용
**해결**: `/agents/data`로 변경

### 문제 2: 잘못된 타입 정의 사용
**증상**: `/v1/agents/templates` 또는 다른 타입 경로 사용
**해결**: `/v1/agents/data` 타입 경로로 변경

### 문제 3: Templates 파일과 동일한 내용
**증상**: 두 파일이 완전히 동일함
**해결**: 이는 정상일 수 있으나, API 엔드포인트가 올바른지 확인 필요

## 참고 파일

- **작업 대상**: `src/feature/studio/data/agents/api/getAgents.ts`
- **비교 대상**: `src/feature/studio/templates/agents/api/getAgents.ts`
- **타입 정의**: `src/shared/types/api/agents.d.ts`
- **Todo 목록**: `docs/working_history/01_todo_list.md` (53-55번 라인)

## 완료 기준

- [ ] 파일이 templates에서 복사되었는지 확인 완료
- [ ] API 엔드포인트가 `/v1/agents/data`를 올바르게 사용하는지 확인 완료
- [ ] 타입 정의가 올바른지 확인 완료
- [ ] 필요한 수정 사항이 있으면 수정 완료

