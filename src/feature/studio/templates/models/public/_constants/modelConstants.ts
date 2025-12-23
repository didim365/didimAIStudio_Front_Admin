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

import type { AICategoryEnum, ModelStatusEnum } from "../_types/modelTypes";

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

// ModelAddPage에서 사용하는 카테고리 옵션 (라벨이 약간 다름)
export const CATEGORY_OPTIONS: { value: AICategoryEnum; label: string }[] = [
  { value: "TEXT", label: "텍스트" },
  { value: "IMAGE", label: "이미지" },
  { value: "MULTIMODAL", label: "멀티모달" },
  { value: "EMBEDDING", label: "임베딩" },
  { value: "AUDIO", label: "오디오" },
  { value: "VIDEO", label: "비디오" },
  { value: "CHAT", label: "채팅" },
  { value: "COMPLETION", label: "완성" },
  { value: "IMAGE_GENERATION", label: "이미지 생성" },
  { value: "AUDIO_TRANSCRIPTION", label: "오디오 전사" },
  { value: "AUDIO_SPEECH", label: "오디오 음성" },
];

export const STATUS_OPTIONS: { value: ModelStatusEnum; label: string }[] = [
  { value: "STABLE", label: "안정" },
  { value: "BETA", label: "베타" },
  { value: "ALPHA", label: "알파" },
  { value: "DEPRECATED", label: "사용 중단" },
];
