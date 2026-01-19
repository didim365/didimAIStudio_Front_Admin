# Scenarios Hooks 구현 가이드

## 작업 개요

Scenarios 관련 React Query Hooks를 구현하는 작업입니다. `src/feature/studio/data/scenarios` 폴더에 있는 hooks들이 Scenarios API 함수들을 올바르게 사용하도록 구현하고 검증합니다.

## 프롬프트 예제

### 기본 프롬프트

```
Scenarios Hooks를 구현해주세요:

1. `src/feature/studio/data/scenarios/_hooks/` 폴더의 hook 파일들을 확인하세요.
2. 각 hook이 React Query를 올바르게 사용하는지 검증하세요.
3. API 함수들과 연결이 제대로 되어 있는지 확인하세요.
4. 누락된 hooks가 있다면 생성하세요:
   - useGetScenarios (목록 조회)
   - useGetScenario (단일 조회)
   - usePostScenario (생성)
   - usePutScenario (수정)
   - useDeleteScenario (삭제)
   - usePatchScenario (부분 수정)
5. queryKey와 mutation 패턴이 일관되게 적용되었는지 확인하세요.
```

### 상세 프롬프트 (단계별)

```
Scenarios Hooks를 단계별로 구현해주세요:

**1단계: 기존 hooks 확인**
- `src/feature/studio/data/scenarios/_hooks/` 폴더 구조 확인
- 이미 존재하는 hook 파일들 확인
- Templates 폴더에서 복사된 hook인지 확인

**2단계: API 함수 확인**
- `src/feature/studio/data/scenarios/_api/` 폴더의 API 함수들 확인
- 각 API 함수의 시그니처와 리턴 타입 확인
- API 함수가 제대로 구현되어 있는지 검증

**3단계: Query Hooks 구현**
- useGetScenarios 구현
  - useQuery 사용
  - queryKey: ['scenarios', 'data', params]
  - queryFn: getScenarios API 호출
  - 옵션: staleTime, cacheTime 등

- useGetScenario 구현
  - useQuery 사용
  - queryKey: ['scenarios', 'data', scenario_id]
  - queryFn: getScenario API 호출
  - enabled 옵션: scenario_id가 있을 때만 실행

**4단계: Mutation Hooks 구현**
- usePostScenario 구현
  - useMutation 사용
  - mutationFn: postScenario API 호출
  - onSuccess: queryClient.invalidateQueries(['scenarios', 'data'])
  - meta.successMessage 설정

- usePutScenario 구현
  - useMutation 사용
  - mutationFn: putScenario API 호출
  - onSuccess: 상세 및 목록 쿼리 무효화
  - meta.successMessage 설정

- useDeleteScenario 구현
  - useMutation 사용
  - mutationFn: deleteScenario API 호출
  - onSuccess: 목록 쿼리 무효화
  - meta.successMessage 설정

- usePatchScenario 구현
  - useMutation 사용
  - mutationFn: patchScenario API 호출
  - onSuccess: 상세 쿼리 무효화
  - meta.successMessage 설정

**5단계: 검증 및 테스트**
- 각 hook의 타입 추론이 정확한지 확인
- queryKey 네이밍이 일관된지 확인
- 캐시 무효화 로직이 올바른지 확인
- 에러 처리가 적절한지 확인
```

### 간결한 프롬프트

```
Scenarios Hooks 구현:
1. `src/feature/studio/data/scenarios/_hooks/` 폴더 확인
2. 누락된 hooks 생성 (useGetScenarios, useGetScenario, usePostScenario, usePutScenario, useDeleteScenario, usePatchScenario)
3. React Query 패턴 적용 (useQuery, useMutation)
4. queryKey 일관성 확인: ['scenarios', 'data', ...]
5. 캐시 무효화 로직 추가
```

### 검증 중심 프롬프트

```
Scenarios Hooks를 검증하고 구현해주세요:

**검증 항목:**
1. ✅ Query Hooks 확인
   - useGetScenarios: 목록 조회
     - queryKey: ['scenarios', 'data', params]
     - API: getScenarios
   - useGetScenario: 단일 조회
     - queryKey: ['scenarios', 'data', scenario_id]
     - API: getScenario

2. ✅ Mutation Hooks 확인
   - usePostScenario: 생성
     - API: postScenario
     - 캐시 무효화: ['scenarios', 'data']
   - usePutScenario: 수정
     - API: putScenario
     - 캐시 무효화: ['scenarios', 'data']
   - useDeleteScenario: 삭제
     - API: deleteScenario
     - 캐시 무효화: ['scenarios', 'data']
   - usePatchScenario: 부분 수정
     - API: patchScenario
     - 캐시 무효화: ['scenarios', 'data', scenario_id]

3. ✅ React Query 옵션 확인
   - Query 옵션: staleTime, cacheTime, enabled, refetchOnWindowFocus
   - Mutation 옵션: onSuccess, onError, meta

**구현이 필요한 경우 진행해주세요.**
```

## 확인해야 할 주요 사항

### 1. React Query Hook 패턴

| Hook 타입 | 용도 | React Query Hook | 주요 옵션 |
|----------|-----|-----------------|----------|
| Query | 데이터 조회 | useQuery | queryKey, queryFn, staleTime, enabled |
| Mutation | 데이터 변경 | useMutation | mutationFn, onSuccess, onError, meta |

### 2. queryKey 네이밍 규칙

```typescript
// 목록 조회
['scenarios', 'data', params]

// 단일 조회
['scenarios', 'data', scenario_id]

// 필터링이 있는 경우
['scenarios', 'data', { filter: 'active', page: 1 }]
```

### 3. 캐시 무효화 전략

```typescript
// 생성 후: 목록 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ['scenarios', 'data'] });

// 수정 후: 특정 시나리오 + 목록 무효화
queryClient.invalidateQueries({ queryKey: ['scenarios', 'data', scenario_id] });
queryClient.invalidateQueries({ queryKey: ['scenarios', 'data'] });

// 삭제 후: 목록 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ['scenarios', 'data'] });

// 부분 수정 후: 특정 시나리오만 무효화
queryClient.invalidateQueries({ queryKey: ['scenarios', 'data', scenario_id] });
```

## 예상되는 문제 및 해결 방법

### 문제 1: 잘못된 queryKey 사용
**증상**: 캐시 무효화가 제대로 작동하지 않음
**해결**: queryKey 네이밍 규칙을 일관되게 적용

### 문제 2: Templates hooks 그대로 사용
**증상**: 'scenarios-templates' queryKey 사용
**해결**: 'scenarios', 'data'로 변경

### 문제 3: API 함수 연결 오류
**증상**: API 함수를 찾을 수 없거나 타입 에러
**해결**: API 함수가 제대로 구현되어 있는지 확인

### 문제 4: 캐시 무효화 누락
**증상**: mutation 후 UI가 자동으로 업데이트되지 않음
**해결**: onSuccess에 적절한 invalidateQueries 추가

## 참고 파일

- **작업 대상**: `src/feature/studio/data/scenarios/_hooks/*.ts`
- **API 함수**: `src/feature/studio/data/scenarios/_api/*.ts`
- **타입 정의**: `src/shared/types/api/agents.d.ts`
- **참고 구현**: `src/feature/studio/data/agents/hooks/*.ts`
- **Todo 목록**: `docs/working_history/01_todo_list.md` (173-187번 라인)

## Hooks 구현 템플릿

### useGetScenarios.ts 예시

```typescript
import { useQuery } from "@tanstack/react-query";
import { getScenarios } from "../_api/getScenarios";
import type { paths } from "@/shared/types/api/agents";

type GetScenariosParams =
  paths["/v1/scenarios/data"]["get"]["parameters"]["query"];

export const useGetScenarios = (params?: GetScenariosParams) => {
  return useQuery({
    queryKey: ["scenarios", "data", params],
    queryFn: () => getScenarios(params),
    staleTime: 5 * 60 * 1000, // 5분
  });
};
```

### useGetScenario.ts 예시

```typescript
import { useQuery } from "@tanstack/react-query";
import { getScenario } from "../_api/getScenario";

export const useGetScenario = (scenarioId?: string) => {
  return useQuery({
    queryKey: ["scenarios", "data", scenarioId],
    queryFn: () => getScenario(scenarioId!),
    enabled: !!scenarioId,
  });
};
```

### usePostScenario.ts 예시

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postScenario } from "../_api/postScenario";
import type { paths } from "@/shared/types/api/agents";

type PostScenarioRequest =
  paths["/v1/scenarios/data"]["post"]["requestBody"]["content"]["application/json"];

export const usePostScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostScenarioRequest) => postScenario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scenarios", "data"] });
    },
    meta: {
      successMessage: "시나리오가 생성되었습니다.",
    },
  });
};
```

### useDeleteScenario.ts 예시

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScenario } from "../_api/deleteScenario";

export const useDeleteScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scenarioId: string) => deleteScenario(scenarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scenarios", "data"] });
    },
    meta: {
      successMessage: "시나리오가 삭제되었습니다.",
    },
  });
};
```

## React Query 옵션 가이드

### Query 옵션

| 옵션 | 설명 | 추천 값 |
|-----|------|--------|
| staleTime | 데이터가 신선한 것으로 간주되는 시간 | 5분 (5 * 60 * 1000) |
| cacheTime | 사용하지 않는 데이터를 메모리에 유지하는 시간 | 10분 (기본값) |
| enabled | 쿼리 실행 여부 | 조건부 실행 시 사용 |
| refetchOnWindowFocus | 창 포커스 시 재조회 | false (필요시) |

### Mutation 옵션

| 옵션 | 설명 | 필수 여부 |
|-----|------|----------|
| mutationFn | API 호출 함수 | 필수 |
| onSuccess | 성공 시 콜백 | 캐시 무효화에 필수 |
| onError | 실패 시 콜백 | 선택 |
| meta.successMessage | 성공 메시지 | 권장 |

## 완료 기준

- [ ] useGetScenarios 구현 완료
- [ ] useGetScenario 구현 완료
- [ ] usePostScenario 구현 완료
- [ ] usePutScenario 구현 완료
- [ ] useDeleteScenario 구현 완료
- [ ] usePatchScenario 구현 완료
- [ ] queryKey 네이밍이 일관되게 적용되었는지 확인
- [ ] 캐시 무효화 로직이 올바르게 작동하는지 확인
- [ ] TypeScript 타입 에러 없음 확인
