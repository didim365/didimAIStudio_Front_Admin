/**
 * 배포 상태를 한국어로 변환하는 유틸 함수
 */
export function getDeploymentStatusLabel(status: string | null | undefined): string {
  if (!status) return "알 수 없음";

  const statusMap: Record<string, string> = {
    running: "실행 중",
    pending: "대기 중",
    deploying: "배포 중",
    stopped: "중지됨",
    failed: "실패",
    error: "오류",
    completed: "완료",
    ready: "준비됨",
    unknown: "알 수 없음",
  };

  return statusMap[status.toLowerCase()] || status;
}

/**
 * 소스 타입을 한국어로 변환하는 유틸 함수
 */
export function getSourceLabel(source: string): string {
  const sourceMap: Record<string, string> = {
    huggingface: "HuggingFace",
    model_scope: "Model Scope",
    ollama_library: "Ollama Library",
    local_path: "Local Path",
  };
  return sourceMap[source] || source;
}

/**
 * 배포 타입을 한국어로 변환하는 유틸 함수
 */
export function getDeploymentTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    local_gpu: "로컬 GPU",
    local_cpu: "로컬 CPU",
  };
  return typeMap[type] || type;
}

/**
 * 백엔드를 한국어로 변환하는 유틸 함수
 */
export function getBackendLabel(backend: string | null | undefined): string {
  if (!backend) return "자동 선택";
  const backendMap: Record<string, string> = {
    llama_box: "llama-box",
    vllm: "vLLM",
  };
  return backendMap[backend] || backend;
}
