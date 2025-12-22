"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { usePostDeploy } from "../_hooks/usePostDeploy";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import {
  Server,
  Hash,
  FileText,
  ArrowLeft,
  Rocket,
  Database,
  Cpu,
  HardDrive,
  Cloud,
  Info,
} from "lucide-react";
import { components } from "@/shared/types/api/models";

type GPUStackSourceType = components["schemas"]["GPUStackSourceType"];
type GPUStackDeploymentType = components["schemas"]["GPUStackDeploymentType"];
type GPUStackBackend = components["schemas"]["GPUStackBackend"];

const SOURCE_OPTIONS: { value: GPUStackSourceType; label: string }[] = [
  { value: "huggingface", label: "HuggingFace" },
  { value: "model_scope", label: "Model Scope" },
  { value: "local_path", label: "로컬 경로" },
  { value: "ollama_library", label: "Ollama Library" },
];

const DEPLOYMENT_TYPE_OPTIONS: {
  value: GPUStackDeploymentType;
  label: string;
}[] = [
  { value: "local_gpu", label: "로컬 GPU" },
  { value: "local_cpu", label: "로컬 CPU" },
  { value: "remote", label: "원격" },
];

const BACKEND_OPTIONS: { value: GPUStackBackend; label: string }[] = [
  { value: "llama-box", label: "Llama Box" },
  { value: "vllm", label: "vLLM" },
  { value: "ollama", label: "Ollama" },
];

function PrivateModelAddPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    model_name: "",
    source: "huggingface" as GPUStackSourceType,
    description: "",
    deployment_type: "local_gpu" as GPUStackDeploymentType,
    backend: undefined as GPUStackBackend | undefined,
    replicas: "",
    // HuggingFace 필드
    huggingface_repo_id: "",
    huggingface_filename: "",
    // Model Scope 필드
    model_scope_model_id: "",
    model_scope_file_path: "",
    // Ollama Library 필드
    ollama_library_model_name: "",
    // Local Path 필드
    local_path: "",
  });

  // 모델 배포 mutation
  const { mutate: deployModel, isPending: isDeploying } = usePostDeploy({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["private-models"],
      });
      // 배포된 모델 목록 페이지로 이동
      router.push("/studio/templates/models/private");
    },
    meta: {
      successMessage: "모델 배포가 성공적으로 시작되었습니다.",
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    deployModel({ ...formData, replicas: Number(formData.replicas) });
  };

  return (
    <div className="py-8 px-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/studio/templates/models/private">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 cursor-pointer"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  로컬 LLM 배포
                </h1>
                <p className="text-muted-foreground mt-1">
                  GPUStack에 모델을 배포합니다
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" className="shrink-0" disabled={isDeploying}>
                <Rocket className="h-4 w-4 mr-2" />
                {isDeploying ? "배포 중..." : "모델 배포"}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* 기본 정보 Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* 모델명 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="model_name"
                      className="flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <span>모델명 *</span>
                    </Label>
                    <Input
                      id="model_name"
                      value={formData.model_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          model_name: e.target.value,
                        })
                      }
                      placeholder="예: qwen3-0.6b-q4km"
                      className="pl-6"
                      required
                    />
                  </div>

                  {/* 소스 타입 */}
                  <div className="space-y-2">
                    <Label htmlFor="source" className="flex items-center gap-2">
                      <span>소스 타입 *</span>
                    </Label>
                    <Select
                      value={formData.source}
                      onValueChange={(value: GPUStackSourceType) =>
                        setFormData({ ...formData, source: value })
                      }
                      required
                    >
                      <SelectTrigger id="source" className="pl-6 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SOURCE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 배포 타입 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="deployment_type"
                      className="flex items-center gap-2"
                    >
                      <Server className="h-4 w-4" />
                      <span>배포 타입 *</span>
                    </Label>
                    <Select
                      value={formData.deployment_type}
                      onValueChange={(value: GPUStackDeploymentType) =>
                        setFormData({ ...formData, deployment_type: value })
                      }
                      required
                    >
                      <SelectTrigger
                        id="deployment_type"
                        className="pl-6 w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPLOYMENT_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 백엔드 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="backend"
                      className="flex items-center gap-2"
                    >
                      <Cpu className="h-4 w-4" />
                      <span>백엔드</span>
                    </Label>
                    <Select
                      value={formData.backend || "none"}
                      onValueChange={(value: GPUStackBackend | "none") =>
                        setFormData({
                          ...formData,
                          backend: value === "none" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger id="backend" className="pl-6 w-full">
                        <SelectValue placeholder="자동 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">자동 선택</SelectItem>
                        {BACKEND_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      선택하지 않으면 자동으로 선택됩니다
                    </p>
                  </div>

                  {/* 복제본 수 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="replicas"
                      className="flex items-center gap-2"
                    >
                      <Database className="h-4 w-4" />
                      <span>복제본 수</span>
                    </Label>
                    <Input
                      id="replicas"
                      type="number"
                      value={formData.replicas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          replicas: e.target.value,
                        })
                      }
                      placeholder="예: 1"
                      className="pl-6"
                      min="1"
                    />
                    <p className="text-xs text-muted-foreground">
                      모델 인스턴스 복제본 수 (GPUStack 2.0)
                    </p>
                  </div>

                  {/* 설명 */}
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>설명</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="모델에 대한 상세 설명을 입력하세요"
                      className="min-h-[100px]"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 소스별 설정 Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  소스별 설정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* HuggingFace 설정 */}
                  {formData.source === "huggingface" && (
                    <>
                      <div className="space-y-2">
                        <Label
                          htmlFor="huggingface_repo_id"
                          className="flex items-center gap-2"
                        >
                          <Cloud className="h-4 w-4" />
                          <span>HuggingFace 리포지토리 ID *</span>
                        </Label>
                        <Input
                          id="huggingface_repo_id"
                          value={formData.huggingface_repo_id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              huggingface_repo_id: e.target.value,
                            })
                          }
                          placeholder="예: unsloth/Qwen3-0.6B-GGUF"
                          className="pl-6"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="huggingface_filename"
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          <span>GGUF 파일명</span>
                        </Label>
                        <Input
                          id="huggingface_filename"
                          value={formData.huggingface_filename}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              huggingface_filename: e.target.value,
                            })
                          }
                          placeholder="예: Qwen3-0.6B-Q4_K_M.gguf"
                          className="pl-6"
                        />
                        <p className="text-xs text-muted-foreground">
                          GGUF 파일명 (선택사항)
                        </p>
                      </div>
                    </>
                  )}

                  {/* Model Scope 설정 */}
                  {formData.source === "model_scope" && (
                    <>
                      <div className="space-y-2">
                        <Label
                          htmlFor="model_scope_model_id"
                          className="flex items-center gap-2"
                        >
                          <Database className="h-4 w-4" />
                          <span>Model Scope 모델 ID *</span>
                        </Label>
                        <Input
                          id="model_scope_model_id"
                          value={formData.model_scope_model_id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              model_scope_model_id: e.target.value,
                            })
                          }
                          placeholder="예: model-scope/model-id"
                          className="pl-6"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="model_scope_file_path"
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Model Scope 파일 경로</span>
                        </Label>
                        <Input
                          id="model_scope_file_path"
                          value={formData.model_scope_file_path}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              model_scope_file_path: e.target.value,
                            })
                          }
                          placeholder="예: /path/to/model/file"
                          className="pl-6"
                        />
                        <p className="text-xs text-muted-foreground">
                          Model Scope 파일 경로 (선택사항)
                        </p>
                      </div>
                    </>
                  )}

                  {/* Ollama Library 설정 */}
                  {formData.source === "ollama_library" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="ollama_library_model_name"
                        className="flex items-center gap-2"
                      >
                        <Cpu className="h-4 w-4" />
                        <span>Ollama 라이브러리 모델명 *</span>
                      </Label>
                      <Input
                        id="ollama_library_model_name"
                        value={formData.ollama_library_model_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ollama_library_model_name: e.target.value,
                          })
                        }
                        placeholder="예: llama2:7b"
                        className="pl-6"
                        required
                      />
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Ollama Library는 GPUStack 2.0에서
                          Deprecated되었습니다. HuggingFace 소스로
                          마이그레이션을 권장합니다.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {/* Local Path 설정 */}
                  {formData.source === "local_path" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="local_path"
                        className="flex items-center gap-2"
                      >
                        <HardDrive className="h-4 w-4" />
                        <span>로컬 모델 파일 경로 *</span>
                      </Label>
                      <Input
                        id="local_path"
                        value={formData.local_path}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            local_path: e.target.value,
                          })
                        }
                        placeholder="예: /path/to/model"
                        className="pl-6"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        로컬 파일 시스템의 모델 경로를 입력하세요
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="flex items-center gap-2">
              <span className="text-sm">
                * 표시된 필드는 필수 입력 항목입니다. 모델 배포는 비동기로
                진행되며, 배포 상태는 모델 목록에서 확인할 수 있습니다.
              </span>
            </AlertDescription>
          </Alert>
        </div>
      </form>
    </div>
  );
}

export default PrivateModelAddPage;
