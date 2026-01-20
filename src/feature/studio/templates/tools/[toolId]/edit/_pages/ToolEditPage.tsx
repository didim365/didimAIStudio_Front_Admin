"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePutTool } from "../_hooks/usePutTool";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  ArrowLeft,
  Save,
  Tag,
  Key,
  Database,
  FileCode,
  Settings,
  Wrench,
  Hash,
  Package,
  Server,
  GitBranch,
  Code2,
  Link2,
  Container,
  Layers,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useRouter } from "next/navigation";
import { GetToolResponse } from "../../_api/getTool";
import Link from "next/link";
import { JsonEditorCard } from "../_components/JsonEditorCard";
import { ChipInput } from "../_components/ChipInput";
import { FormField } from "../_components/FormField";
import {
  statusConfig,
  providerConfig,
  deploymentTypeConfig,
} from "../../../_constants/toolConfigs";

export function ToolEditPage({ tool }: { tool: GetToolResponse }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    description: tool.description || "",
    version: tool.version || "",
    status: tool.status as "ACTIVE" | "INACTIVE" | "PENDING" | "ERROR",
    icon_url: tool.icon_url || "",
    repo_url: tool.repo_url || "",
    server_url: tool.server_url || "",
    container_image: tool.container_image || "",
    tags: tool.tags || [],
    keywords: tool.keywords || [],
    environment_variables: tool.environment_variables || {},
    docker_compose_config: tool.docker_compose_config || null,
    resource_requirements: tool.resource_requirements || null,
    metadata: tool.metadata || null,
  });

  const { mutate: updateTool, isPending: isUpdating } = usePutTool({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mcp-tools"],
      });

      router.push(`/studio/templates/tools/${tool.id}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Tags and keywords are already arrays in formData
    const tags = formData.tags.filter((t) => t.length > 0);
    const keywords = formData.keywords.filter((k) => k.length > 0);

    // 초기 environment_variables 값
    const initialEnvVars = tool.environment_variables || {};
    const currentEnvVars = formData.environment_variables || {};
    
    // environment_variables 변화 여부 확인
    const envVarsChanged = JSON.stringify(initialEnvVars) !== JSON.stringify(currentEnvVars);

    // 전송할 데이터 객체 생성
    const updateData: Record<string, unknown> = {
      description: formData.description || null,
      version: formData.version || null,
      status: formData.status || null,
      icon_url: formData.icon_url || null,
      repo_url: formData.repo_url || null,
      server_url: formData.server_url || null,
      container_image: formData.container_image || null,
      tags: tags.length > 0 ? tags : null,
      keywords: keywords.length > 0 ? keywords : null,
      docker_compose_config: formData.docker_compose_config || null,
      resource_requirements: formData.resource_requirements || null,
      metadata: formData.metadata || null,
    };

    // environment_variables가 변경된 경우에만 포함
    if (envVarsChanged) {
      updateData.environment_variables =
        Object.keys(currentEnvVars).length > 0
          ? (currentEnvVars as Record<string, string>)
          : null;
    }

    updateTool({
      params: { tool_id: tool.id },
      data: updateData,
    });
  };

  const DeploymentIcon =
    deploymentTypeConfig[tool.deployment_type]?.icon || Server;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/studio/templates/tools/${tool.id}`}>
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
              <h1 className="text-3xl font-bold tracking-tight">
                도구 정보 수정
              </h1>
              <p className="text-muted-foreground">도구 ID: {tool.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="shrink-0" disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Icon Preview */}
                <div className="flex flex-col items-center gap-4">
                  <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <DeploymentIcon className="h-16 w-16 text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge
                      className={`${
                        statusConfig[formData.status].color
                      } border justify-center`}
                    >
                      {statusConfig[formData.status].label}
                    </Badge>
                    <Badge
                      className={`${
                        providerConfig[tool.provider].color
                      } border justify-center`}
                    >
                      {providerConfig[tool.provider].label}
                    </Badge>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  <FormField icon={Hash} label="도구 ID" htmlFor="tool_id">
                    <Input
                      id="tool_id"
                      value={tool.id}
                      disabled
                      className="bg-muted"
                    />
                  </FormField>

                  <FormField icon={Wrench} label="도구 이름" htmlFor="name">
                    <Input
                      id="name"
                      value={tool.name}
                      disabled
                      className="bg-muted"
                    />
                  </FormField>

                  <FormField
                    icon={Code2}
                    label="시스템 내부 식별자"
                    htmlFor="definition_name"
                  >
                    <Input
                      id="definition_name"
                      value={tool.definition_name || "-"}
                      disabled
                      className="bg-muted font-mono"
                    />
                  </FormField>

                  <FormField
                    icon={GitBranch}
                    label="버전"
                    htmlFor="version"
                    required
                  >
                    <Input
                      id="version"
                      value={formData.version}
                      onChange={(e) =>
                        setFormData({ ...formData, version: e.target.value })
                      }
                      placeholder="1.0.0"
                      className="font-mono"
                      required
                    />
                  </FormField>

                  <FormField icon={Package} label="카테고리" htmlFor="category">
                    <Input
                      id="category"
                      value={tool.category}
                      disabled
                      className="bg-muted"
                    />
                  </FormField>

                  <FormField icon={Settings} label="상태" htmlFor="status" required>
                    <Select
                      value={formData.status}
                      onValueChange={(
                        value: "ACTIVE" | "INACTIVE" | "PENDING" | "ERROR"
                      ) => setFormData({ ...formData, status: value })}
                      required
                    >
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">활성</SelectItem>
                        <SelectItem value="INACTIVE">비활성</SelectItem>
                        <SelectItem value="PENDING">대기 중</SelectItem>
                        <SelectItem value="ERROR">오류</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField
                    icon={Package}
                    label="프로바이더"
                    htmlFor="provider"
                  >
                    <Input
                      id="provider"
                      value={
                        providerConfig[tool.provider]?.label || tool.provider
                      }
                      disabled
                      className="bg-muted"
                    />
                  </FormField>

                  <FormField
                    icon={Server}
                    label="배포 타입"
                    htmlFor="deployment_type"
                  >
                    <Input
                      id="deployment_type"
                      value={
                        deploymentTypeConfig[tool.deployment_type]?.label ||
                        tool.deployment_type
                      }
                      disabled
                      className="bg-muted"
                    />
                  </FormField>

                  <FormField
                    icon={FileCode}
                    label="설명"
                    htmlFor="description"
                    className="md:col-span-2"
                  >
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="도구에 대한 설명을 입력하세요"
                      rows={3}
                      className="resize-none"
                    />
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* URLs Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                URL 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField icon={Link2} label="아이콘 URL" htmlFor="icon_url">
                <Input
                  id="icon_url"
                  value={formData.icon_url}
                  onChange={(e) =>
                    setFormData({ ...formData, icon_url: e.target.value })
                  }
                  placeholder="https://example.com/icon.png"
                  type="url"
                />
              </FormField>

              <FormField icon={GitBranch} label="저장소 URL" htmlFor="repo_url">
                <Input
                  id="repo_url"
                  value={formData.repo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, repo_url: e.target.value })
                  }
                  placeholder="https://github.com/user/repo"
                  type="url"
                />
              </FormField>

              <FormField icon={Server} label="서버 URL" htmlFor="server_url">
                <Input
                  id="server_url"
                  value={formData.server_url}
                  onChange={(e) =>
                    setFormData({ ...formData, server_url: e.target.value })
                  }
                  placeholder="https://server.example.com"
                  type="url"
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Container Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5" />
                컨테이너 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                icon={Container}
                label="컨테이너 이미지"
                htmlFor="container_image"
              >
                <Input
                  id="container_image"
                  value={formData.container_image}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      container_image: e.target.value,
                    })
                  }
                  placeholder="docker.io/library/image:tag"
                  className="font-mono"
                />
              </FormField>

              <FormField icon={Layers} label="전송 방식" htmlFor="transport">
                <Input
                  id="transport"
                  value={tool.transport || "-"}
                  disabled
                  className="bg-muted"
                />
              </FormField>

              <FormField icon={Server} label="서버 타입" htmlFor="server_type">
                <Input
                  id="server_type"
                  value={tool.server_type || "-"}
                  disabled
                  className="bg-muted"
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Tags and Keywords Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                태그 및 키워드
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>태그</span>
                </Label>
                <ChipInput
                  id="tags"
                  chips={formData.tags}
                  onChipsChange={(tags) => setFormData({ ...formData, tags })}
                  placeholder="태그 입력..."
                  chipClassName="bg-primary/10 text-primary border-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  Enter, 쉼표 또는 스페이스로 추가
                </p>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label htmlFor="keywords" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span>키워드</span>
                </Label>
                <ChipInput
                  id="keywords"
                  chips={formData.keywords}
                  onChipsChange={(keywords) => setFormData({ ...formData, keywords })}
                  placeholder="키워드 입력..."
                  chipClassName="bg-secondary/30 text-foreground border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Enter, 쉼표 또는 스페이스로 추가
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables Card */}
          <JsonEditorCard
            className="md:col-span-2"
            title="환경 변수"
            icon={Key}
            label="환경 변수 (JSON)"
            value={formData.environment_variables as Record<string, unknown> | null}
            onChange={(value) =>
              setFormData({
                ...formData,
                environment_variables: (value as Record<string, string>) || {},
              })
            }
            placeholder='{ "KEY": "value", "API_KEY": "secret" }'
            errorMessage="환경 변수 JSON 형식이 올바르지 않습니다."
            htmlId="environment_variables"
          />

          {/* Docker Compose Configuration Card */}
          <JsonEditorCard
            className="md:col-span-2"
            title="Docker Compose 설정"
            icon={Settings}
            label="Docker Compose 설정 (JSON)"
            value={formData.docker_compose_config}
            onChange={(value) =>
              setFormData({ ...formData, docker_compose_config: value })
            }
            placeholder='{ "version": "3", "services": {...} }'
            errorMessage="Docker Compose 설정 JSON 형식이 올바르지 않습니다."
            htmlId="docker_compose_config"
          />

          {/* Resource Requirements Card */}
          <JsonEditorCard
            className="md:col-span-2"
            title="리소스 요구사항"
            icon={Database}
            label="리소스 요구사항 (JSON)"
            value={formData.resource_requirements}
            onChange={(value) =>
              setFormData({ ...formData, resource_requirements: value })
            }
            placeholder='{ "cpu": "1", "memory": "512Mi" }'
            errorMessage="리소스 요구사항 JSON 형식이 올바르지 않습니다."
            htmlId="resource_requirements"
          />

          {/* Metadata Card */}
          <JsonEditorCard
            className="md:col-span-2"
            title="메타데이터"
            icon={FileCode}
            label="메타데이터 (JSON)"
            value={formData.metadata}
            onChange={(value) =>
              setFormData({ ...formData, metadata: value })
            }
            placeholder='{ "author": "name", "license": "MIT" }'
            errorMessage="메타데이터 JSON 형식이 올바르지 않습니다."
            htmlId="metadata"
          />
        </div>
      </div>
    </form>
  );
}

export default ToolEditPage;
