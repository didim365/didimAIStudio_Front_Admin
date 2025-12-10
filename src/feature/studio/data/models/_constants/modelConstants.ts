export const CATEGORIES = [
  { value: "TEXT", label: "텍스트" },
  { value: "IMAGE", label: "이미지" },
  { value: "MULTIMODAL", label: "멀티모달" },
  { value: "EMBEDDING", label: "임베딩" },
  { value: "AUDIO", label: "오디오" },
  { value: "VIDEO", label: "비디오" },
  { value: "CHAT", label: "채팅" },
  { value: "COMPLETION", label: "완성" },
  { value: "IMAGE_GENERATION", label: "이미지 생성" },
  { value: "AUDIO_TRANSCRIPTION", label: "오디오 변환" },
  { value: "AUDIO_SPEECH", label: "음성 합성" },
] as const;

export const DEPLOYMENT_TYPES = [
  { value: "PRIVATE_VLLM", label: "Private vLLM" },
  { value: "PUBLIC_API", label: "Public API" },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  TEXT: "텍스트",
  IMAGE: "이미지",
  MULTIMODAL: "멀티모달",
  EMBEDDING: "임베딩",
  AUDIO: "오디오",
  VIDEO: "비디오",
  CHAT: "채팅",
  COMPLETION: "완성",
  IMAGE_GENERATION: "이미지 생성",
  AUDIO_TRANSCRIPTION: "오디오 변환",
  AUDIO_SPEECH: "음성 합성",
} as const;

