# Tools 페이지 구현 가이드

## 작업 개요

MCP Tools 관련 페이지들을 구현하는 작업입니다. `src/feature/studio/data/tools` 폴더에 있는 페이지 컴포넌트들이 Tools API와 hooks를 올바르게 사용하도록 구현하고 검증합니다.

## 프롬프트 예제

### 기본 프롬프트

```
MCP Tools 페이지를 구현해주세요:

1. `src/feature/studio/data/tools/_pages/` 폴더의 페이지 파일들을 확인하세요.
2. 각 페이지가 올바른 hooks를 사용하는지 검증하세요.
3. 페이지 라우팅이 Next.js 규칙을 따르는지 확인하세요.
4. 필요한 페이지가 있다면 생성하세요:
   - ToolsPage.tsx (목록 페이지)
   - ToolDetailPage.tsx (상세 페이지)
   - AddToolPage.tsx (추가 페이지)
   - EditToolPage.tsx (수정 페이지)
5. UI 컴포넌트와 레이아웃이 일관되게 적용되었는지 확인하세요.
```

### 상세 프롬프트 (단계별)

```
MCP Tools 페이지를 단계별로 구현해주세요:

**1단계: 기존 페이지 확인**
- `src/feature/studio/data/tools/_pages/` 폴더 구조 확인
- 이미 존재하는 페이지 파일들 확인
- Templates 폴더에서 복사된 페이지인지 확인

**2단계: Hooks 및 API 확인**
- `src/feature/studio/data/tools/_hooks/` 폴더의 hooks 확인
- `src/feature/studio/data/tools/_api/` 폴더의 API 함수들 확인
- 각 hook과 API의 시그니처 확인

**3단계: 목록 페이지 구현 (ToolsPage.tsx)**
- useGetTools hook 사용하여 도구 목록 조회
- 테이블 또는 카드 레이아웃으로 목록 표시
- 페이지네이션 구현 (필요시)
- 필터링 및 검색 기능 (필요시)
- "도구 추가" 버튼 추가
- 각 도구 항목에 상세/수정/삭제 버튼 추가

**4단계: 상세 페이지 구현 (ToolDetailPage.tsx)**
- useGetTool hook으로 특정 도구 조회
- 도구 정보 표시 (이름, 설명, 상태, 설정 등)
- 도구 관리 액션 버튼:
  - 시작/중지 버튼 (usePostToolStart, usePostToolStop)
  - 배포 버튼 (usePostToolDeploy)
  - 수정 버튼 (EditToolPage로 이동)
  - 삭제 버튼 (useDeleteTool)
- 도구 설정 정보 표시 (useGetToolConfig)
- 로딩 및 에러 상태 처리

**5단계: 추가 페이지 구현 (AddToolPage.tsx)**
- 도구 추가 폼 구현
- usePostTool hook으로 도구 생성
- 폼 validation 추가
- 성공 시 목록 페이지로 리다이렉트

**6단계: 수정 페이지 구현 (EditToolPage.tsx)**
- useGetTool hook으로 기존 도구 데이터 로드
- 도구 수정 폼 구현
- usePutTool hook으로 도구 수정
- 폼 validation 추가
- 성공 시 상세 페이지로 리다이렉트

**7단계: 공통 컴포넌트 및 스타일링**
- 일관된 레이아웃 적용
- 로딩 스피너 추가
- 에러 메시지 표시
- 성공/실패 토스트 메시지
- 반응형 디자인 적용
```

### 간결한 프롬프트

```
MCP Tools 페이지 구현:
1. `src/feature/studio/data/tools/_pages/` 확인
2. ToolsPage.tsx: 목록 페이지 (useGetTools)
3. ToolDetailPage.tsx: 상세 페이지 (useGetTool, 관리 액션)
4. AddToolPage.tsx: 추가 페이지 (usePostTool)
5. EditToolPage.tsx: 수정 페이지 (usePutTool)
6. 라우팅, UI, 에러 처리 확인
```

### 검증 중심 프롬프트

```
MCP Tools 페이지를 검증하고 구현해주세요:

**검증 항목:**
1. ✅ 목록 페이지 (ToolsPage.tsx)
   - useGetTools hook 사용
   - 도구 목록 표시
   - "도구 추가" 버튼
   - 상세/수정/삭제 액션

2. ✅ 상세 페이지 (ToolDetailPage.tsx)
   - useGetTool hook 사용
   - 도구 정보 표시
   - 관리 액션 버튼 (시작, 중지, 배포)
   - 설정 정보 표시 (useGetToolConfig)

3. ✅ 추가 페이지 (AddToolPage.tsx)
   - 도구 추가 폼
   - usePostTool hook 사용
   - validation
   - 성공 시 리다이렉트

4. ✅ 수정 페이지 (EditToolPage.tsx)
   - 도구 수정 폼
   - usePutTool hook 사용
   - 기존 데이터 로드
   - 성공 시 리다이렉트

5. ✅ 라우팅 확인
   - Next.js App Router 규칙 준수
   - 페이지 경로가 올바른지 확인

**구현이 필요한 경우 진행해주세요.**
```

## 확인해야 할 주요 사항

### 1. 페이지별 주요 기능

| 페이지 | 경로 | 주요 Hooks | 주요 기능 |
|-------|-----|-----------|----------|
| ToolsPage | `/studio/data/tools` | useGetTools | 목록 조회, 필터링, 검색 |
| ToolDetailPage | `/studio/data/tools/[toolId]` | useGetTool, useGetToolConfig | 상세 정보, 관리 액션 |
| AddToolPage | `/studio/data/tools/add` | usePostTool | 도구 생성 폼 |
| EditToolPage | `/studio/data/tools/[toolId]/edit` | useGetTool, usePutTool | 도구 수정 폼 |

### 2. 관리 액션 버튼

```typescript
// 시작 버튼
const { mutate: startTool } = usePostToolStart();
<Button onClick={() => startTool(toolId)}>시작</Button>

// 중지 버튼
const { mutate: stopTool } = usePostToolStop();
<Button onClick={() => stopTool(toolId)}>중지</Button>

// 배포 버튼
const { mutate: deployTool } = usePostToolDeploy();
<Button onClick={() => deployTool(toolId)}>배포</Button>

// 삭제 버튼
const { mutate: deleteTool } = useDeleteTool();
<Button onClick={() => deleteTool(toolId)} variant="destructive">삭제</Button>
```

### 3. 라우팅 구조

```
src/feature/studio/data/tools/
├── _pages/
│   └── ToolsPage.tsx             # GET /studio/data/tools
├── [toolId]/
│   ├── _pages/
│   │   └── ToolDetailPage.tsx    # GET /studio/data/tools/[toolId]
│   └── edit/
│       └── _pages/
│           └── EditToolPage.tsx  # GET /studio/data/tools/[toolId]/edit
└── add/
    └── _pages/
        └── AddToolPage.tsx        # GET /studio/data/tools/add
```

## 예상되는 문제 및 해결 방법

### 문제 1: Templates 페이지 그대로 사용
**증상**: 페이지가 templates API를 호출함
**해결**: data hooks와 API로 변경

### 문제 2: 라우팅 오류
**증상**: 페이지가 올바르게 렌더링되지 않음
**해결**: Next.js App Router 규칙 확인 및 수정

### 문제 3: 도구 상태 관리 오류
**증상**: 시작/중지 버튼이 작동하지 않음
**해결**: 적절한 mutation hooks 사용 및 캐시 무효화

### 문제 4: 폼 validation 누락
**증상**: 잘못된 데이터가 제출됨
**해결**: react-hook-form + zod 사용하여 validation 추가

## 참고 파일

- **작업 대상**: `src/feature/studio/data/tools/_pages/*.tsx`
- **Hooks**: `src/feature/studio/data/tools/_hooks/*.ts`
- **API 함수**: `src/feature/studio/data/tools/_api/*.ts`
- **타입 정의**: `src/shared/types/api/tools.d.ts`
- **참고 구현**: `src/feature/studio/data/agents/pages/*.tsx`
- **Todo 목록**: `docs/working_history/01_todo_list.md` (254-265번 라인)

## 페이지 구현 템플릿

### ToolsPage.tsx 예시

```typescript
"use client";

import { useGetTools } from "../_hooks/useGetTools";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default function ToolsPage() {
  const { data: tools, isLoading, error } = useGetTools();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MCP 도구 관리</h1>
        <Link href="/studio/data/tools/add">
          <Button>도구 추가</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {tools?.map((tool) => (
          <div key={tool.id} className="border p-4 rounded">
            <h3 className="font-semibold">{tool.name}</h3>
            <p className="text-sm text-gray-600">{tool.description}</p>
            <div className="flex gap-2 mt-2">
              <Link href={`/studio/data/tools/${tool.id}`}>
                <Button size="sm" variant="outline">상세</Button>
              </Link>
              <Link href={`/studio/data/tools/${tool.id}/edit`}>
                <Button size="sm" variant="outline">수정</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### ToolDetailPage.tsx 예시

```typescript
"use client";

import { useParams } from "next/navigation";
import { useGetTool } from "../_hooks/useGetTool";
import { usePostToolStart } from "../_hooks/usePostToolStart";
import { usePostToolStop } from "../_hooks/usePostToolStop";
import { useDeleteTool } from "../_hooks/useDeleteTool";
import { Button } from "@/shared/components/ui/button";

export default function ToolDetailPage() {
  const params = useParams();
  const toolId = params.toolId as string;

  const { data: tool, isLoading } = useGetTool(toolId);
  const { mutate: startTool } = usePostToolStart();
  const { mutate: stopTool } = usePostToolStop();
  const { mutate: deleteTool } = useDeleteTool();

  if (isLoading) return <div>로딩 중...</div>;
  if (!tool) return <div>도구를 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{tool.name}</h1>
      <p className="text-gray-600 mb-6">{tool.description}</p>

      <div className="flex gap-2">
        <Button onClick={() => startTool(toolId)}>시작</Button>
        <Button onClick={() => stopTool(toolId)} variant="outline">
          중지
        </Button>
        <Button
          onClick={() => deleteTool(toolId)}
          variant="destructive"
        >
          삭제
        </Button>
      </div>
    </div>
  );
}
```

## UI/UX 체크리스트

- [ ] 로딩 상태 표시 (Spinner, Skeleton)
- [ ] 에러 상태 표시 (에러 메시지, 재시도 버튼)
- [ ] 빈 상태 표시 (데이터 없을 때)
- [ ] 성공 토스트 메시지
- [ ] 확인 다이얼로그 (삭제 시)
- [ ] 반응형 레이아웃
- [ ] 접근성 (aria-label, 키보드 네비게이션)

## 완료 기준

- [ ] ToolsPage.tsx 구현 완료
- [ ] ToolDetailPage.tsx 구현 완료
- [ ] AddToolPage.tsx 구현 완료
- [ ] EditToolPage.tsx 구현 완료
- [ ] 모든 페이지에서 올바른 hooks 사용 확인
- [ ] 라우팅이 정상 작동하는지 확인
- [ ] UI/UX가 일관되게 적용되었는지 확인
- [ ] 에러 처리가 적절한지 확인
