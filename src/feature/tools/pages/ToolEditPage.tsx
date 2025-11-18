"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePutMcpTool } from "../hooks/usePutMcpTool";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import {
  Wrench,
  ArrowLeft,
  Save,
  Hash,
  Package,
  Server,
  Container,
  Globe,
  Zap,
  GitBranch,
  Code2,
  FileCode,
  Tag,
  Key,
  Settings,
  Layers,
  Link2,
  Database,
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
import { GetMcpToolResponse } from "../api/getMcpTool";
import {
  statusConfig,
  providerConfig,
  deploymentTypeConfig,
} from "../constants/toolConfigs";

export function ToolEditPage({ tool }: { tool: GetMcpToolResponse }) {
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

  const [tagsInput, setTagsInput] = useState(formData.tags.join(", "));
  const [keywordsInput, setKeywordsInput] = useState(
    formData.keywords.join(", ")
  );
  const [envVarsText, setEnvVarsText] = useState(
    JSON.stringify(formData.environment_variables, null, 2)
  );
  const [dockerComposeText, setDockerComposeText] = useState(
    formData.docker_compose_config
      ? JSON.stringify(formData.docker_compose_config, null, 2)
      : ""
  );
  const [resourceReqText, setResourceReqText] = useState(
    formData.resource_requirements
      ? JSON.stringify(formData.resource_requirements, null, 2)
      : ""
  );
  const [metadataText, setMetadataText] = useState(
    formData.metadata ? JSON.stringify(formData.metadata, null, 2) : ""
  );

  const { mutate: updateTool, isPending: isUpdating } = usePutMcpTool({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mcp-tools"],
      });

      router.push(`/studio/tools/${tool.id}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Parse JSON fields
    let envVars = {};
    let dockerCompose = null;
    let resourceReq = null;
    let metadata = null;

    try {
      if (envVarsText.trim()) {
        envVars = JSON.parse(envVarsText);
      }
    } catch (error) {
      alert("환경 변수 JSON 형식이 올바르지 않습니다.");
      return;
    }

    try {
      if (dockerComposeText.trim()) {
        dockerCompose = JSON.parse(dockerComposeText);
      }
    } catch (error) {
      alert("Docker Compose 설정 JSON 형식이 올바르지 않습니다.");
      return;
    }

    try {
      if (resourceReqText.trim()) {
        resourceReq = JSON.parse(resourceReqText);
      }
    } catch (error) {
      alert("리소스 요구사항 JSON 형식이 올바르지 않습니다.");
      return;
    }

    try {
      if (metadataText.trim()) {
        metadata = JSON.parse(metadataText);
      }
    } catch (error) {
      alert("메타데이터 JSON 형식이 올바르지 않습니다.");
      return;
    }

    // Parse tags and keywords
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    updateTool({
      params: { tool_id: tool.id },
      data: {
        description: formData.description || null,
        version: formData.version || null,
        status: formData.status || null,
        icon_url: formData.icon_url || null,
        repo_url: formData.repo_url || null,
        server_url: formData.server_url || null,
        container_image: formData.container_image || null,
        tags: tags.length > 0 ? tags : null,
        keywords: keywords.length > 0 ? keywords : null,
        environment_variables: Object.keys(envVars).length > 0 ? envVars : null,
        docker_compose_config: dockerCompose,
        resource_requirements: resourceReq,
        metadata: metadata,
      },
    });
  };

  if (!tool) {
    return (
      <div className="py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              도구를 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const DeploymentIcon =
    deploymentTypeConfig[tool.deployment_type]?.icon || Server;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/studio/tools/${tool.id}`)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
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
                  {/* Tool ID (Read-only) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="tool_id"
                      className="flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <span>도구 ID</span>
                    </Label>
                    <Input
                      id="tool_id"
                      value={tool.id}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  {/* Tool Name (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      <span>도구 이름</span>
                    </Label>
                    <Input
                      id="name"
                      value={tool.name}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  {/* Definition Name (Read-only) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="definition_name"
                      className="flex items-center gap-2"
                    >
                      <Code2 className="h-4 w-4" />
                      <span>정의 이름</span>
                    </Label>
                    <Input
                      id="definition_name"
                      value={tool.definition_name || "-"}
                      disabled
                      className="bg-muted font-mono"
                    />
                  </div>

                  {/* Version */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="version"
                      className="flex items-center gap-2"
                    >
                      <GitBranch className="h-4 w-4" />
                      <span>버전 *</span>
                    </Label>
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
                  </div>

                  {/* Category (Read-only) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      <span>카테고리</span>
                    </Label>
                    <Input
                      id="category"
                      value={tool.category}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>상태 *</span>
                    </Label>
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
                  </div>

                  {/* Provider (Read-only) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="provider"
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      <span>프로바이더</span>
                    </Label>
                    <Input
                      id="provider"
                      value={
                        providerConfig[tool.provider]?.label || tool.provider
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  {/* Deployment Type (Read-only) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="deployment_type"
                      className="flex items-center gap-2"
                    >
                      <Server className="h-4 w-4" />
                      <span>배포 타입</span>
                    </Label>
                    <Input
                      id="deployment_type"
                      value={
                        deploymentTypeConfig[tool.deployment_type]?.label ||
                        tool.deployment_type
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      <FileCode className="h-4 w-4" />
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
                      placeholder="도구에 대한 설명을 입력하세요"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
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
              {/* Icon URL */}
              <div className="space-y-2">
                <Label htmlFor="icon_url" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  <span>아이콘 URL</span>
                </Label>
                <Input
                  id="icon_url"
                  value={formData.icon_url}
                  onChange={(e) =>
                    setFormData({ ...formData, icon_url: e.target.value })
                  }
                  placeholder="https://example.com/icon.png"
                  type="url"
                />
              </div>

              {/* Repo URL */}
              <div className="space-y-2">
                <Label htmlFor="repo_url" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  <span>저장소 URL</span>
                </Label>
                <Input
                  id="repo_url"
                  value={formData.repo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, repo_url: e.target.value })
                  }
                  placeholder="https://github.com/user/repo"
                  type="url"
                />
              </div>

              {/* Server URL */}
              <div className="space-y-2">
                <Label htmlFor="server_url" className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  <span>서버 URL</span>
                </Label>
                <Input
                  id="server_url"
                  value={formData.server_url}
                  onChange={(e) =>
                    setFormData({ ...formData, server_url: e.target.value })
                  }
                  placeholder="https://server.example.com"
                  type="url"
                />
              </div>
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
              {/* Container Image */}
              <div className="space-y-2">
                <Label
                  htmlFor="container_image"
                  className="flex items-center gap-2"
                >
                  <Container className="h-4 w-4" />
                  <span>컨테이너 이미지</span>
                </Label>
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
              </div>

              {/* Transport (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="transport" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>전송 방식</span>
                </Label>
                <Input
                  id="transport"
                  value={tool.transport || "-"}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Server Type (Read-only) */}
              <div className="space-y-2">
                <Label
                  htmlFor="server_type"
                  className="flex items-center gap-2"
                >
                  <Server className="h-4 w-4" />
                  <span>서버 타입</span>
                </Label>
                <Input
                  id="server_type"
                  value={tool.server_type || "-"}
                  disabled
                  className="bg-muted"
                />
              </div>
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
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>태그</span>
                  </Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-xs text-muted-foreground">
                    쉼표로 구분하여 입력하세요
                  </p>
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <Label htmlFor="keywords" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>키워드</span>
                  </Label>
                  <Input
                    id="keywords"
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-xs text-muted-foreground">
                    쉼표로 구분하여 입력하세요
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                환경 변수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label
                  htmlFor="environment_variables"
                  className="flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  <span>환경 변수 (JSON)</span>
                </Label>
                <Textarea
                  id="environment_variables"
                  value={envVarsText}
                  onChange={(e) => setEnvVarsText(e.target.value)}
                  placeholder='{"KEY": "value", "API_KEY": "secret"}'
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  JSON 형식으로 입력하세요
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Configuration Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                고급 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Docker Compose Config */}
              <div className="space-y-2">
                <Label
                  htmlFor="docker_compose_config"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Docker Compose 설정 (JSON)</span>
                </Label>
                <Textarea
                  id="docker_compose_config"
                  value={dockerComposeText}
                  onChange={(e) => setDockerComposeText(e.target.value)}
                  placeholder='{"version": "3", "services": {...}}'
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <Separator />

              {/* Resource Requirements */}
              <div className="space-y-2">
                <Label
                  htmlFor="resource_requirements"
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  <span>리소스 요구사항 (JSON)</span>
                </Label>
                <Textarea
                  id="resource_requirements"
                  value={resourceReqText}
                  onChange={(e) => setResourceReqText(e.target.value)}
                  placeholder='{"cpu": "1", "memory": "512Mi"}'
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <Separator />

              {/* Metadata */}
              <div className="space-y-2">
                <Label htmlFor="metadata" className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span>메타데이터 (JSON)</span>
                </Label>
                <Textarea
                  id="metadata"
                  value={metadataText}
                  onChange={(e) => setMetadataText(e.target.value)}
                  placeholder='{"author": "name", "license": "MIT"}'
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export default ToolEditPage;
