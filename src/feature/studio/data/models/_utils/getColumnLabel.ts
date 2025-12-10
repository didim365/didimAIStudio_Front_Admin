export const getColumnLabel = (key: string): string => {
  const columnMap: Record<string, string> = {
    user_model_id: "회원 모델 ID",
    model_name: "모델명",
    user_id: "사용자 ID",
    deployment_type: "배포 타입",
    created_at: "생성일",
    updated_at: "수정일",
    is_active: "활성화 여부",
    settings: "설정",
    config: "설정",
    id: "ID",
    model_id: "모델 ID",
    provider: "제공자",
    category: "카테고리",
    version: "버전",
    status: "상태",
    max_tokens: "최대 토큰",
    max_input_tokens: "최대 입력 토큰",
    max_output_tokens: "최대 출력 토큰",
    input_cost_per_token: "입력 토큰당 비용",
    output_cost_per_token: "출력 토큰당 비용",
  };

  return columnMap[key] || key;
};

