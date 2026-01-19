# React Query 패턴 설정 가이드

## 작업 개요

프로젝트 전반에 일관된 React Query 패턴을 적용하는 작업입니다. queryKey 네이밍 규칙, 캐시 전략, 에러 처리 등을 표준화하여 코드 품질과 유지보수성을 향상시킵니다.

## 프롬프트 예제

### 기본 프롬프트

```
React Query 패턴을 표준화해주세요:

1. 프로젝트의 모든 React Query hooks를 확인하세요.
2. queryKey 네이밍 규칙을 일관되게 적용하세요.
3. 캐시 전략(staleTime, cacheTime)을 표준화하세요.
4. 에러 처리 패턴을 통일하세요.
5. mutation 성공/실패 처리를 표준화하세요.
6. React Query 설정 파일을 생성하거나 개선하세요.
```

### 상세 프롬프트 (단계별)

```
React Query 패턴을 단계별로 표준화해주세요:

**1단계: 현재 패턴 분석**
- `src/feature/studio/data/*/hooks/` 폴더의 모든 hooks 확인
- 현재 사용 중인 queryKey 패턴 분석
- 현재 캐시 설정 확인
- 에러 처리 방식 확인

**2단계: queryKey 네이밍 규칙 정의**
- 계층적 구조 사용: [domain, subdomain, identifier, ...params]
- 예시:
  - ['agents', 'data'] - 전체 agents 관련
  - ['agents', 'data', 'list', params] - 목록 조회
  - ['agents', 'data', 'detail', agent_id] - 단일 조회
  - ['agents', 'templates', 'list', params] - 템플릿 목록

**3단계: queryKey 팩토리 패턴 구현**
- 각 도메인별 queryKey 팩토리 생성
- `src/feature/studio/data/agents/queries.ts` 예시:
  ```typescript
  export const agentQueries = {
    all: ['agents', 'data'] as const,
    lists: () => [...agentQueries.all, 'list'] as const,
    list: (params?: GetAgentsParams) =>
      [...agentQueries.lists(), params] as const,
    details: () => [...agentQueries.all, 'detail'] as const,
    detail: (id: string) => [...agentQueries.details(), id] as const,
  };
  ```

**4단계: 캐시 전략 표준화**
- 기본 staleTime 설정: 5분 (데이터 신선도에 따라 조정)
- 기본 cacheTime 설정: 10분 (기본값 사용)
- refetchOnWindowFocus: false (필요에 따라 true)
- refetchOnMount: true (기본값)

**5단계: 에러 처리 패턴 통일**
- QueryClientProvider에 기본 에러 핸들러 설정
- 각 hook에서 onError 콜백 사용
- 에러 토스트 메시지 표시
- 에러 바운더리 설정

**6단계: Mutation 패턴 표준화**
- onSuccess: 캐시 무효화 + 성공 메시지
- onError: 에러 메시지 표시
- meta.successMessage: 성공 메시지 정의
- optimistic update 적용 (필요시)

**7단계: React Query 설정 파일 개선**
- `src/shared/lib/react-query.ts` 생성 또는 개선
- QueryClient 기본 옵션 설정
- 전역 에러 핸들러 설정
- devtools 설정
```

### 간결한 프롬프트

```
React Query 패턴 표준화:
1. queryKey 네이밍 규칙 통일 ([domain, subdomain, type, id/params])
2. queryKey 팩토리 패턴 구현
3. 캐시 전략 표준화 (staleTime: 5분)
4. 에러 처리 패턴 통일
5. mutation 성공/실패 처리 표준화
6. React Query 설정 파일 개선
```

### 검증 중심 프롬프트

```
React Query 패턴을 검증하고 표준화해주세요:

**검증 항목:**
1. ✅ queryKey 네이밍 규칙
   - 계층적 구조 사용 확인
   - 일관된 패턴 적용 확인
   - queryKey 팩토리 사용 확인

2. ✅ 캐시 전략
   - staleTime 설정 확인
   - cacheTime 설정 확인
   - refetch 옵션 확인

3. ✅ 에러 처리
   - 전역 에러 핸들러 설정 확인
   - 개별 hook의 에러 처리 확인
   - 에러 메시지 표시 확인

4. ✅ Mutation 패턴
   - onSuccess 캐시 무효화 확인
   - meta.successMessage 설정 확인
   - optimistic update 적용 확인 (필요시)

5. ✅ React Query 설정
   - QueryClient 기본 옵션 확인
   - devtools 설정 확인

**표준화가 필요한 경우 진행해주세요.**
```

## 확인해야 할 주요 사항

### 1. queryKey 네이밍 규칙

```typescript
// ✅ 좋은 예시 - 계층적 구조
['agents', 'data', 'list', { page: 1 }]
['agents', 'data', 'detail', 'agent-123']
['personas', 'templates', 'list']

// ❌ 나쁜 예시 - 일관성 없음
['agentsList', page]
['agent-detail-123']
['getPersonasTemplates']
```

### 2. queryKey 팩토리 패턴

```typescript
// src/feature/studio/data/agents/queries.ts
export const agentQueries = {
  // 모든 agents 관련
  all: ['agents', 'data'] as const,

  // 목록 조회 관련
  lists: () => [...agentQueries.all, 'list'] as const,
  list: (params?: GetAgentsParams) =>
    [...agentQueries.lists(), params] as const,

  // 상세 조회 관련
  details: () => [...agentQueries.all, 'detail'] as const,
  detail: (id: string) =>
    [...agentQueries.details(), id] as const,
};

// 사용 예시
useQuery({
  queryKey: agentQueries.list({ page: 1 }),
  queryFn: () => getAgents({ page: 1 }),
});

// 캐시 무효화
queryClient.invalidateQueries({
  queryKey: agentQueries.lists()
});
```

### 3. React Query 설정

```typescript
// src/shared/lib/react-query.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### 4. 에러 처리 패턴

```typescript
// 전역 에러 핸들러
import { QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`오류 발생: ${error.message}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(`오류 발생: ${error.message}`);
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      const successMessage = mutation.meta?.successMessage;
      if (successMessage) {
        toast.success(successMessage as string);
      }
    },
  }),
});
```

## 예상되는 문제 및 해결 방법

### 문제 1: 불일치하는 queryKey 패턴
**증상**: 캐시 무효화가 제대로 작동하지 않음
**해결**: queryKey 팩토리 패턴 적용 및 일관된 네이밍 사용

### 문제 2: 과도한 refetch
**증상**: 불필요한 API 호출이 많이 발생
**해결**: staleTime을 적절히 설정하고 refetchOnWindowFocus를 false로 설정

### 문제 3: 에러 처리 누락
**증상**: 에러 발생 시 사용자에게 피드백 없음
**해결**: 전역 에러 핸들러 설정 및 토스트 메시지 표시

### 문제 4: 캐시 무효화 누락
**증상**: mutation 후 UI가 자동으로 업데이트되지 않음
**해결**: onSuccess에 적절한 invalidateQueries 호출 추가

## 참고 파일

- **작업 대상**: `src/feature/studio/data/*/hooks/*.ts`
- **queryKey 팩토리**: `src/feature/studio/data/*/queries.ts` (생성 필요)
- **React Query 설정**: `src/shared/lib/react-query.ts`
- **Todo 목록**: `docs/working_history/01_todo_list.md` (315-318번 라인)

## 구현 템플릿

### queries.ts 예시

```typescript
// src/feature/studio/data/agents/queries.ts
import type { GetAgentsParams } from "./api/getAgents";

export const agentQueries = {
  all: ['agents', 'data'] as const,
  lists: () => [...agentQueries.all, 'list'] as const,
  list: (params?: GetAgentsParams) =>
    [...agentQueries.lists(), params] as const,
  details: () => [...agentQueries.all, 'detail'] as const,
  detail: (id: string) =>
    [...agentQueries.details(), id] as const,
};

export const personaQueries = {
  all: ['personas', 'data'] as const,
  lists: () => [...personaQueries.all, 'list'] as const,
  list: (params?: GetPersonasParams) =>
    [...personaQueries.lists(), params] as const,
  details: () => [...personaQueries.all, 'detail'] as const,
  detail: (id: string) =>
    [...personaQueries.details(), id] as const,
};

// 다른 도메인들도 동일한 패턴으로...
```

### useGetAgents.ts 개선 예시

```typescript
// Before
export const useGetAgents = (params?: GetAgentsParams) => {
  return useQuery({
    queryKey: ["agents-data", params],
    queryFn: () => getAgents(params),
  });
};

// After - queryKey 팩토리 사용
import { agentQueries } from "../queries";

export const useGetAgents = (params?: GetAgentsParams) => {
  return useQuery({
    queryKey: agentQueries.list(params),
    queryFn: () => getAgents(params),
    staleTime: 5 * 60 * 1000,
  });
};
```

### usePostAgent.ts 개선 예시

```typescript
// Before
export const usePostAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostAgentRequest) => postAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["agents-data"]);
    },
  });
};

// After - queryKey 팩토리 + meta 사용
import { agentQueries } from "../queries";

export const usePostAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostAgentRequest) => postAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: agentQueries.lists()
      });
    },
    meta: {
      successMessage: "에이전트가 생성되었습니다.",
    },
  });
};
```

## React Query 베스트 프랙티스

### 1. queryKey 관리
- [ ] queryKey 팩토리 패턴 사용
- [ ] 계층적 구조 적용
- [ ] 일관된 네이밍 사용

### 2. 캐시 전략
- [ ] 적절한 staleTime 설정
- [ ] 불필요한 refetch 방지
- [ ] 캐시 무효화 전략 수립

### 3. 에러 처리
- [ ] 전역 에러 핸들러 설정
- [ ] 에러 메시지 표시
- [ ] 재시도 로직 구현

### 4. 성능 최적화
- [ ] 불필요한 리렌더링 방지
- [ ] select 옵션 활용
- [ ] Optimistic Update 적용 (필요시)

## 완료 기준

- [ ] 모든 도메인에 queryKey 팩토리 생성 완료
- [ ] 모든 hooks가 queryKey 팩토리를 사용하도록 수정 완료
- [ ] React Query 설정 파일 개선 완료
- [ ] 전역 에러 핸들러 설정 완료
- [ ] 캐시 전략이 일관되게 적용되었는지 확인
- [ ] mutation 성공 메시지가 표시되는지 확인
- [ ] 불필요한 API 호출이 없는지 확인
