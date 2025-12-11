# Studio Data API 및 페이지 구현 Todo 목록

## 개요
`src/feature/studio/data` 폴더에서 사용될 API와 페이지를 구현합니다. 현재 `templates` 폴더를 복사해서 가져왔기 때문에 템플릿 데이터를 조회/수정/삭제하는 API나 hook이 사용되고 있으나, 이를 실제 데이터 API로 변경해야 합니다.

## API 타입 정의 확인
- `src/shared/types/api/agents.d.ts`: Agents, Personas, Scenarios API 타입 정의
- `src/shared/types/api/tools.d.ts`: Tools API 타입 정의
- `src/shared/types/api/models.d.ts`: Models API 타입 정의

## 주요 API 엔드포인트

### Agents API (`/v1/agents/data`)
- `GET /v1/agents/data`: 에이전트 데이터 목록 조회
- `POST /v1/agents/data`: 에이전트 데이터 생성
- `GET /v1/agents/data/{agent_id}`: 특정 에이전트 데이터 조회
- `PUT /v1/agents/data/{agent_id}`: 에이전트 데이터 수정 (Upsert)
- `DELETE /v1/agents/data/{agent_id}`: 에이전트 데이터 삭제
- `PATCH /v1/agents/data/{agent_id}`: 에이전트 데이터 부분 수정

### Personas API (`/v1/personas/data`)
- `GET /v1/personas/data`: 페르소나 데이터 목록 조회
- `POST /v1/personas/data`: 페르소나 데이터 생성
- `GET /v1/personas/data/{persona_id}`: 특정 페르소나 데이터 조회
- `PUT /v1/personas/data/{persona_id}`: 페르소나 데이터 수정 (Upsert)
- `DELETE /v1/personas/data/{persona_id}`: 페르소나 데이터 삭제
- `PATCH /v1/personas/data/{persona_id}`: 페르소나 데이터 부분 수정

### Scenarios API (`/v1/scenarios/data`)
- `GET /v1/scenarios/data`: 시나리오 데이터 목록 조회
- `POST /v1/scenarios/data`: 시나리오 데이터 생성
- `GET /v1/scenarios/data/{scenario_id}`: 특정 시나리오 데이터 조회
- `PUT /v1/scenarios/data/{scenario_id}`: 시나리오 데이터 수정 (Upsert)
- `DELETE /v1/scenarios/data/{scenario_id}`: 시나리오 데이터 삭제
- `PATCH /v1/scenarios/data/{scenario_id}`: 시나리오 데이터 부분 수정

### Tools API (`/v1/mcp-tools/`)
- `GET /v1/mcp-tools/`: 도구 목록 조회
- 기타 Tools 관련 API들 (tools.d.ts 확인 필요)

### Models API (`/v1/settings`)
- `GET /v1/settings`: LLM 모델 설정 목록 조회
- `GET /v1/settings/config/{user_model_id}`: 특정 설정 조회
- 기타 Models 관련 API들 (models.d.ts 확인 필요)

---

## Todo 목록

### 01. Agents 관련 작업

#### 01.01. Agents API 함수 구현
- [ ] `src/feature/studio/data/agents/api/getAgents.ts` 확인 및 수정
  - 현재 templates에서 복사된 파일인지 확인
  - API 엔드포인트가 `/v1/agents/data`를 올바르게 사용하는지 확인
- [ ] `src/feature/studio/data/agents/api/postAgent.ts` 확인 및 수정
  - POST 요청이 올바른 타입을 사용하는지 확인
- [ ] `src/feature/studio/data/agents/api/getAgent.ts` 생성 (필요시)
  - 단일 에이전트 조회 API 함수
- [ ] `src/feature/studio/data/agents/api/putAgent.ts` 생성 (필요시)
  - 에이전트 수정 API 함수
- [ ] `src/feature/studio/data/agents/api/deleteAgent.ts` 생성 (필요시)
  - 에이전트 삭제 API 함수
- [ ] `src/feature/studio/data/agents/api/patchAgent.ts` 생성 (필요시)
  - 에이전트 부분 수정 API 함수

#### 01.02. Agents Hooks 구현
- [ ] `src/feature/studio/data/agents/hooks/useGetAgents.ts` 확인 및 수정
  - React Query를 사용한 목록 조회 hook
  - queryKey가 적절한지 확인
- [ ] `src/feature/studio/data/agents/hooks/useGetAgent.ts` 생성 (필요시)
  - 단일 에이전트 조회 hook
- [ ] `src/feature/studio/data/agents/hooks/usePostAgent.ts` 생성 (필요시)
  - 에이전트 생성 mutation hook
- [ ] `src/feature/studio/data/agents/hooks/usePutAgent.ts` 생성 (필요시)
  - 에이전트 수정 mutation hook
- [ ] `src/feature/studio/data/agents/hooks/useDeleteAgent.ts` 생성 (필요시)
  - 에이전트 삭제 mutation hook
- [ ] `src/feature/studio/data/agents/hooks/usePatchAgent.ts` 생성 (필요시)
  - 에이전트 부분 수정 mutation hook

#### 01.03. Agents 페이지 구현
- [ ] `src/feature/studio/data/agents/pages/AgentsPage.tsx` 확인 및 수정
  - templates에서 복사된 페이지인지 확인
  - 올바른 hooks를 사용하는지 확인
  - API 호출이 data API를 사용하는지 확인
- [ ] `src/feature/studio/data/agents/[agentId]/pages/AgentDetailPage.tsx` 생성 (필요시)
  - 에이전트 상세 페이지
- [ ] `src/feature/studio/data/agents/add/pages/AddAgentPage.tsx` 생성 (필요시)
  - 에이전트 추가 페이지
- [ ] `src/feature/studio/data/agents/[agentId]/edit/pages/EditAgentPage.tsx` 생성 (필요시)
  - 에이전트 수정 페이지

---

### 02. Personas 관련 작업

#### 02.01. Personas API 함수 구현
- [ ] `src/feature/studio/data/personas/_api/getPersonas.ts` 확인 및 수정
  - 현재 templates에서 복사된 파일인지 확인
  - API 엔드포인트가 `/v1/personas/data`를 올바르게 사용하는지 확인
- [ ] `src/feature/studio/data/personas/add/_api/postPersona.ts` 확인 및 수정
  - POST 요청이 올바른 타입을 사용하는지 확인
- [ ] `src/feature/studio/data/personas/[personaId]/_api/getPersona.ts` 확인 및 수정
  - 단일 페르소나 조회 API 함수 확인
- [ ] `src/feature/studio/data/personas/[personaId]/edit/_api/putPersona.ts` 확인 및 수정
  - 페르소나 수정 API 함수 확인
- [ ] `src/feature/studio/data/personas/[personaId]/_api/deletePersona.ts` 확인 및 수정
  - 페르소나 삭제 API 함수 확인
- [ ] `src/feature/studio/data/personas/[personaId]/_api/patchPersona.ts` 생성 (필요시)
  - 페르소나 부분 수정 API 함수

#### 02.02. Personas Hooks 구현
- [ ] `src/feature/studio/data/personas/_hooks/useGetPersonas.ts` 생성 또는 확인
  - React Query를 사용한 목록 조회 hook
  - queryKey가 적절한지 확인
- [ ] `src/feature/studio/data/personas/[personaId]/_hooks/useGetPersona.ts` 생성 (필요시)
  - 단일 페르소나 조회 hook
- [ ] `src/feature/studio/data/personas/add/_hooks/usePostPersona.ts` 생성 (필요시)
  - 페르소나 생성 mutation hook
- [ ] `src/feature/studio/data/personas/[personaId]/edit/_hooks/usePutPersona.ts` 생성 (필요시)
  - 페르소나 수정 mutation hook
- [ ] `src/feature/studio/data/personas/[personaId]/_hooks/useDeletePersona.ts` 생성 (필요시)
  - 페르소나 삭제 mutation hook
- [ ] `src/feature/studio/data/personas/[personaId]/_hooks/usePatchPersona.ts` 생성 (필요시)
  - 페르소나 부분 수정 mutation hook

#### 02.03. Personas 페이지 구현
- [ ] `src/feature/studio/data/personas/_pages/PersonasPage.tsx` 생성 또는 확인
  - templates에서 복사된 페이지인지 확인
  - 올바른 hooks를 사용하는지 확인
  - API 호출이 data API를 사용하는지 확인
- [ ] `src/feature/studio/data/personas/[personaId]/_pages/PersonaDetailPage.tsx` 생성 (필요시)
  - 페르소나 상세 페이지
- [ ] `src/feature/studio/data/personas/add/_pages/AddPersonaPage.tsx` 생성 (필요시)
  - 페르소나 추가 페이지
- [ ] `src/feature/studio/data/personas/[personaId]/edit/_pages/EditPersonaPage.tsx` 생성 (필요시)
  - 페르소나 수정 페이지

---

### 03. Scenarios 관련 작업

#### 03.01. Scenarios API 함수 구현
- [ ] `src/feature/studio/data/scenarios/_api/getScenarios.ts` 확인 및 수정
  - 현재 templates에서 복사된 파일인지 확인
  - API 엔드포인트가 `/v1/scenarios/data`를 올바르게 사용하는지 확인
- [ ] `src/feature/studio/data/scenarios/add/_api/postScenario.ts` 생성 (필요시)
  - 시나리오 생성 API 함수
- [ ] `src/feature/studio/data/scenarios/[scenarioId]/_api/getScenario.ts` 확인 및 수정
  - 단일 시나리오 조회 API 함수 확인
- [ ] `src/feature/studio/data/scenarios/[scenarioId]/edit/_api/putScenario.ts` 확인 및 수정
  - 시나리오 수정 API 함수 확인
- [ ] `src/feature/studio/data/scenarios/[scenarioId]/_api/deleteScenario.ts` 확인 및 수정
  - 시나리오 삭제 API 함수 확인
- [ ] `src/feature/studio/data/scenarios/[scenarioId]/_api/patchScenario.ts` 생성 (필요시)
  - 시나리오 부분 수정 API 함수

#### 03.02. Scenarios Hooks 구현
- [ ] `src/feature/studio/data/scenarios/_hooks/useGetScenarios.ts` 생성 또는 확인
  - React Query를 사용한 목록 조회 hook
  - queryKey가 적절한지 확인
- [ ] `src/feature/studio/data/scenarios/[scenarioId]/_hooks/useGetScenario.ts` 생성 (필요시)
  - 단일 시나리오 조회 hook
- [ ] `src/feature/studio/data/scenarios/add/_hooks/usePostScenario.ts` 생성 (필요시)
  - 시나리오 생성 mutation hook
- [ ] `src/feature/studio/data/scenarios/[scenarioId]/edit/_hooks/usePutScenario.ts` 생성 (필요시)
  - 시나리오 수정 mutation hook
- [ ] `src/feature/studio/data/scenarios/[scenarioId]/_hooks/useDeleteScenario.ts` 생성 (필요시)
  - 시나리오 삭제 mutation hook
- [ ] `src/feature/studio/data/scenarios/[scenarioId]/_hooks/usePatchScenario.ts` 생성 (필요시)
  - 시나리오 부분 수정 mutation hook

#### 03.03. Scenarios 페이지 구현
- [ ] `src/feature/studio/data/scenarios/_pages/ScenariosPage.tsx` 생성 또는 확인
  - templates에서 복사된 페이지인지 확인
  - 올바른 hooks를 사용하는지 확인
  - API 호출이 data API를 사용하는지 확인
- [ ] `src/feature/studio/data/scenarios/[scenarioId]/_pages/ScenarioDetailPage.tsx` 생성 (필요시)
  - 시나리오 상세 페이지
- [ ] `src/feature/studio/data/scenarios/add/_pages/AddScenarioPage.tsx` 생성 (필요시)
  - 시나리오 추가 페이지
- [ ] `src/feature/studio/data/scenarios/[scenarioId]/edit/_pages/EditScenarioPage.tsx` 생성 (필요시)
  - 시나리오 수정 페이지

---

### 04. Tools 관련 작업

#### 04.01. Tools API 함수 구현
- [ ] `src/feature/studio/data/tools/_api/getTools.ts` 생성 또는 확인
  - 현재 templates에서 복사된 파일인지 확인
  - API 엔드포인트가 올바른지 확인 (tools.d.ts 확인 필요)
- [ ] `src/feature/studio/data/tools/add/_api/postTool.ts` 생성 (필요시)
  - 도구 생성 API 함수
- [ ] `src/feature/studio/data/tools/[toolId]/_api/getTool.ts` 생성 (필요시)
  - 단일 도구 조회 API 함수
- [ ] `src/feature/studio/data/tools/[toolId]/edit/_api/putTool.ts` 생성 (필요시)
  - 도구 수정 API 함수
- [ ] `src/feature/studio/data/tools/[toolId]/_api/deleteTool.ts` 생성 (필요시)
  - 도구 삭제 API 함수
- [ ] `src/feature/studio/data/tools/[toolId]/_api/getToolConfig.ts` 생성 (필요시)
  - 도구 설정 조회 API 함수
- [ ] `src/feature/studio/data/tools/[toolId]/_api/putToolConfig.ts` 생성 (필요시)
  - 도구 설정 수정 API 함수
- [ ] `src/feature/studio/data/tools/[toolId]/_api/postToolStart.ts` 생성 (필요시)
  - 도구 시작 API 함수
- [ ] `src/feature/studio/data/tools/[toolId]/_api/postToolStop.ts` 생성 (필요시)
  - 도구 중지 API 함수
- [ ] `src/feature/studio/data/tools/[toolId]/_api/postToolDeploy.ts` 생성 (필요시)
  - 도구 배포 API 함수

#### 04.02. Tools Hooks 구현
- [ ] `src/feature/studio/data/tools/_hooks/useGetTools.ts` 생성 또는 확인
  - React Query를 사용한 목록 조회 hook
  - queryKey가 적절한지 확인
- [ ] `src/feature/studio/data/tools/[toolId]/_hooks/useGetTool.ts` 생성 (필요시)
  - 단일 도구 조회 hook
- [ ] `src/feature/studio/data/tools/add/_hooks/usePostTool.ts` 생성 (필요시)
  - 도구 생성 mutation hook
- [ ] `src/feature/studio/data/tools/[toolId]/edit/_hooks/usePutTool.ts` 생성 (필요시)
  - 도구 수정 mutation hook
- [ ] `src/feature/studio/data/tools/[toolId]/_hooks/useDeleteTool.ts` 생성 (필요시)
  - 도구 삭제 mutation hook
- [ ] `src/feature/studio/data/tools/[toolId]/_hooks/useGetToolConfig.ts` 생성 (필요시)
  - 도구 설정 조회 hook
- [ ] `src/feature/studio/data/tools/[toolId]/_hooks/usePutToolConfig.ts` 생성 (필요시)
  - 도구 설정 수정 mutation hook
- [ ] `src/feature/studio/data/tools/[toolId]/_hooks/usePostToolStart.ts` 생성 (필요시)
  - 도구 시작 mutation hook
- [ ] `src/feature/studio/data/tools/[toolId]/_hooks/usePostToolStop.ts` 생성 (필요시)
  - 도구 중지 mutation hook
- [ ] `src/feature/studio/data/tools/[toolId]/_hooks/usePostToolDeploy.ts` 생성 (필요시)
  - 도구 배포 mutation hook

#### 04.03. Tools 페이지 구현
- [ ] `src/feature/studio/data/tools/_pages/ToolsPage.tsx` 생성 또는 확인
  - templates에서 복사된 페이지인지 확인
  - 올바른 hooks를 사용하는지 확인
  - API 호출이 data API를 사용하는지 확인
- [ ] `src/feature/studio/data/tools/[toolId]/_pages/ToolDetailPage.tsx` 생성 (필요시)
  - 도구 상세 페이지
- [ ] `src/feature/studio/data/tools/add/_pages/AddToolPage.tsx` 생성 (필요시)
  - 도구 추가 페이지
- [ ] `src/feature/studio/data/tools/[toolId]/edit/_pages/EditToolPage.tsx` 생성 (필요시)
  - 도구 수정 페이지

---

### 05. Models 관련 작업

#### 05.01. Models API 함수 구현
- [ ] `src/feature/studio/data/models/_api/getSettings.ts` 확인 및 수정
  - 현재 templates에서 복사된 파일인지 확인
  - API 엔드포인트가 올바른지 확인
- [ ] `src/feature/studio/data/models/[userModelId]/_api/getConfig.ts` 확인 및 수정
  - 특정 설정 조회 API 함수 확인
- [ ] `src/feature/studio/data/models/_api/getCatalogs.ts` 생성 (필요시)
  - 모델 카탈로그 조회 API 함수
- [ ] `src/feature/studio/data/models/[modelId]/_api/getCatalog.ts` 생성 (필요시)
  - 특정 모델 카탈로그 조회 API 함수
- [ ] 기타 Models 관련 API 함수들 확인 및 생성

#### 05.02. Models Hooks 구현
- [ ] `src/feature/studio/data/models/_hooks/useGetSettings.ts` 생성 또는 확인
  - React Query를 사용한 설정 목록 조회 hook
- [ ] `src/feature/studio/data/models/[userModelId]/_hooks/useGetConfig.ts` 생성 (필요시)
  - 특정 설정 조회 hook
- [ ] `src/feature/studio/data/models/_hooks/useGetCatalogs.ts` 생성 (필요시)
  - 모델 카탈로그 조회 hook
- [ ] 기타 Models 관련 hooks 생성

#### 05.03. Models 페이지 구현
- [ ] `src/feature/studio/data/models/_pages/ModelsPage.tsx` 생성 또는 확인
  - templates에서 복사된 페이지인지 확인
  - 올바른 hooks를 사용하는지 확인
  - API 호출이 data API를 사용하는지 확인
- [ ] `src/feature/studio/data/models/[modelId]/_pages/ModelDetailPage.tsx` 생성 (필요시)
  - 모델 상세 페이지
- [ ] 기타 Models 관련 페이지 생성

---

### 06. 공통 작업

#### 06.01. API 타입 검증
- [ ] 모든 API 함수가 `src/shared/types/api/*.d.ts`의 타입을 올바르게 사용하는지 확인
- [ ] API 응답 타입이 올바르게 추출되어 있는지 확인
- [ ] API 요청 파라미터 타입이 올바르게 추출되어 있는지 확인

#### 06.02. Hook 패턴 통일
- [ ] 모든 hooks가 React Query를 일관되게 사용하는지 확인
- [ ] queryKey 네이밍이 일관된지 확인
- [ ] mutation hooks가 올바르게 구현되어 있는지 확인

#### 06.03. 페이지 라우팅 확인
- [ ] 모든 페이지가 올바른 경로에 있는지 확인
- [ ] Next.js 라우팅 규칙을 준수하는지 확인
- [ ] 페이지 간 네비게이션이 올바르게 작동하는지 확인

#### 06.04. 에러 처리
- [ ] 모든 API 호출에 적절한 에러 처리가 있는지 확인
- [ ] 사용자에게 적절한 에러 메시지가 표시되는지 확인

#### 06.05. 테스트
- [ ] 각 API 함수가 올바르게 작동하는지 테스트
- [ ] 각 Hook이 올바르게 작동하는지 테스트
- [ ] 각 페이지가 올바르게 렌더링되는지 테스트

---

## 참고사항

1. **Templates vs Data 구분**
   - Templates: 템플릿 데이터를 관리하는 기능 (예: `/studio/templates`)
   - Data: 실제 데이터를 관리하는 기능 (예: `/studio/data`)
   - 두 폴더의 구조는 유사하지만, 사용하는 API 엔드포인트가 다를 수 있음

2. **API 엔드포인트 확인**
   - `src/shared/types/api/agents.d.ts`에서 `/v1/agents/data`, `/v1/personas/data`, `/v1/scenarios/data` 엔드포인트 확인
   - `src/shared/types/api/tools.d.ts`에서 Tools 관련 엔드포인트 확인
   - `src/shared/types/api/models.d.ts`에서 Models 관련 엔드포인트 확인

3. **파일 구조**
   - API 함수: `{resource}/_api/{action}{Resource}.ts`
   - Hooks: `{resource}/_hooks/use{Action}{Resource}.ts`
   - Pages: `{resource}/_pages/{Resource}Page.tsx`

4. **TDD 원칙 준수**
   - `docs/00_manage_template/99_TDD_plan.md`의 TDD 원칙을 따라 개발 진행
   - 테스트를 먼저 작성하고, 최소한의 코드로 테스트를 통과시킨 후 리팩토링

