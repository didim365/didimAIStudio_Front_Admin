import { components } from "@/shared/types/api/models";

type GPUStackSourceType = components["schemas"]["GPUStackSourceType"];
type GPUStackDeploymentType = components["schemas"]["GPUStackDeploymentType"];
type GPUStackBackend = components["schemas"]["GPUStackBackend"];

export const SOURCE_OPTIONS: { value: GPUStackSourceType; label: string }[] = [
  { value: "huggingface", label: "HuggingFace" },
  { value: "model_scope", label: "Model Scope" },
  { value: "local_path", label: "로컬 경로" },
  { value: "ollama_library", label: "Ollama Library" },
];

export const DEPLOYMENT_TYPE_OPTIONS: {
  value: GPUStackDeploymentType;
  label: string;
}[] = [
  { value: "local_gpu", label: "로컬 GPU" },
  { value: "local_cpu", label: "로컬 CPU" },
  { value: "remote", label: "원격" },
];

export const BACKEND_OPTIONS: { value: GPUStackBackend; label: string }[] = [
  { value: "llama-box", label: "Llama Box" },
  { value: "vllm", label: "vLLM" },
  { value: "ollama", label: "Ollama" },
];

