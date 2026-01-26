---
name: frontend
description: 이 프로젝트의 프론트엔드 개발 패턴과 컨벤션. 컴포넌트, API 함수, React Query 훅 작성 시 사용합니다.
---

# Frontend Development Guide

## 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19
- **Language**: TypeScript
- **State Management**: TanStack Query (서버 상태)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI 기반)
- **HTTP Client**: Axios
- **Testing**: Vitest (Unit), Playwright (E2E)

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
├── feature/                # Feature-Sliced Design 패턴
│   └── [feature-name]/
│       ├── _api/           # API 함수
│       ├── _hooks/         # React Query 훅
│       ├── _components/    # Feature 전용 컴포넌트
│       ├── _constants/     # Feature 상수
│       ├── _utils/         # Feature 유틸리티
│       └── _pages/         # Page 컴포넌트
├── shared/                 # 공유 모듈
│   ├── api/                # 공통 API 유틸
│   ├── components/         # 공통 컴포넌트
│   ├── hooks/              # 공통 훅
│   ├── ui/                 # shadcn/ui 컴포넌트
│   └── utils/              # 유틸리티 함수
```

## 컴포넌트 작성 패턴

```tsx
"use client"; // 클라이언트 컴포넌트인 경우

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/ui/button";
import { useDeleteSome } from "../_hooks/useDeleteSome";
import type { SomeType } from "../_api/getSome";

interface ComponentProps {
  data: SomeType;
}

function ComponentName({ data }: ComponentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useDeleteSome({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["some", "key"] });
      router.refresh();
    },
  });

  return <div className="space-y-6">{/* JSX */}</div>;
}

export default ComponentName;
```

## API 함수 작성 패턴

```typescript
import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetSomeParams = paths["/api/v1/admin/some/{id}"]["get"]["parameters"]["path"];
type GetSomeResponse = paths["/api/v1/admin/some/{id}"]["get"]["responses"]["200"]["content"]["application/json"];

const getSome = async (params: GetSomeParams): Promise<GetSomeResponse> => {
  const response = await axiosInstance.auth.get<GetSomeResponse>(`/admin/some/${params.id}`);
  return response.data;
};

export default getSome;
export type { GetSomeParams, GetSomeResponse };
```

## React Query 훅 패턴

**Query (GET)**:
```typescript
"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import getSome, { GetSomeParams, GetSomeResponse } from "../_api/getSome";

export const useGetSome = (
  params: GetSomeParams,
  options?: Omit<UseQueryOptions<GetSomeResponse, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<GetSomeResponse, Error>({
    queryKey: ["admin", "some", params.id],
    queryFn: () => getSome(params),
    ...options,
  });
};
```

**Mutation (POST/PATCH/DELETE)**:
```typescript
"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import deleteSome, { DeleteSomeParams } from "../_api/deleteSome";

export const useDeleteSome = (
  options?: Omit<UseMutationOptions<void, Error, DeleteSomeParams>, "mutationFn">
) => {
  return useMutation<void, Error, DeleteSomeParams>({
    mutationFn: (params: DeleteSomeParams) => deleteSome(params),
    ...options,
  });
};
```

## axiosInstance Gateway

```typescript
axiosInstance.auth     // /api/auth/v1
axiosInstance.admin    // /api/admin/v1
axiosInstance.models   // /api/models/v1
axiosInstance.indexing // /api/indexing/v1
axiosInstance.agent    // /api/agents/v1
axiosInstance.presigned // /api/cloud-storage/v1
axiosInstance.tools    // /api/mcp-tools/v1
```

## Import 순서

1. `"use client"` 선언
2. React (`react`)
3. Next.js (`next/navigation`, `next/link`)
4. 외부 라이브러리 (`@tanstack/react-query`, `lucide-react`)
5. shared imports (`@/shared/...`)
6. feature imports (상대 경로 `../`)
7. types (`import type`)

## 파일 네이밍

- **컴포넌트**: PascalCase (`GroupPage.tsx`)
- **훅**: camelCase + `use` prefix (`useDeleteGroup.ts`)
- **API**: camelCase + HTTP method (`getGroup.ts`, `postUser.ts`)
- **유틸리티**: camelCase (`formatDate.ts`)

## UI 컴포넌트

shadcn/ui는 `@/shared/ui/`에서 import:
```tsx
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
```

아이콘은 lucide-react:
```tsx
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
```

## 주의사항

1. 클라이언트 컴포넌트는 `"use client"` 필수
2. API 타입은 OpenAPI 스키마(`paths`)에서 추출
3. mutation 성공 시 관련 쿼리 무효화 필수
4. UI 텍스트는 한국어로 작성
