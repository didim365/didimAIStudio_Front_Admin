"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePutTool } from "../_hooks/usePutTool";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft, Save, Tag, Key, Database, FileCode, Settings } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { useRouter } from "next/navigation";
import { GetToolResponse } from "../../_api/getTool";
import Link from "next/link";
import { JsonEditorCard } from "../_components/JsonEditorCard";
import { BasicInfoSection } from "../_components/BasicInfoSection";
import { UrlInfoSection } from "../_components/UrlInfoSection";
import { ContainerConfigSection } from "../_components/ContainerConfigSection";
import { ChipInput } from "../_components/ChipInput";
import { parseJsonFields } from "../_utils/parseJsonFields";

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

  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
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

    // Parse JSON fields
    const { envVars, dockerCompose, resourceReq, metadata, hasError } =
      parseJsonFields({
        envVarsText,
        dockerComposeText,
        resourceReqText,
        metadataText,
      });

    if (hasError) return;

    // Tags and keywords are already arrays in formData
    const tags = formData.tags.filter((t) => t.length > 0);
    const keywords = formData.keywords.filter((k) => k.length > 0);

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
        environment_variables: Object.keys(envVars).length > 0 ? (envVars as Record<string, string>) : null,
        docker_compose_config: dockerCompose as Record<string, unknown> | null,
        resource_requirements: resourceReq as Record<string, unknown> | null,
        metadata: metadata as Record<string, unknown> | null,
      },
    });
  };

  // Tag handlers
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmed] });
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "," || e.key === " ") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Keyword handlers
  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !formData.keywords.includes(trimmed)) {
      setFormData({ ...formData, keywords: [...formData.keywords, trimmed] });
      setKeywordInput("");
    }
  };

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    } else if (e.key === "," || e.key === " ") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((keyword) => keyword !== keywordToRemove),
    });
  };

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
          <BasicInfoSection
            tool={tool}
            formData={{
              description: formData.description,
              version: formData.version,
              status: formData.status,
            }}
            onFormChange={(updates) =>
              setFormData({ ...formData, ...updates })
            }
          />

          {/* URLs Card */}
          <UrlInfoSection
            formData={{
              icon_url: formData.icon_url,
              repo_url: formData.repo_url,
              server_url: formData.server_url,
            }}
            onFormChange={(updates) =>
              setFormData({ ...formData, ...updates })
            }
          />

          {/* Container Configuration Card */}
          <ContainerConfigSection
            tool={tool}
            formData={{
              container_image: formData.container_image,
            }}
            onFormChange={(updates) =>
              setFormData({ ...formData, ...updates })
            }
          />

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
                  value={tagInput}
                  chips={formData.tags}
                  onChange={setTagInput}
                  onAdd={handleAddTag}
                  onRemove={handleRemoveTag}
                  onKeyDown={handleTagKeyDown}
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
                  value={keywordInput}
                  chips={formData.keywords}
                  onChange={setKeywordInput}
                  onAdd={handleAddKeyword}
                  onRemove={handleRemoveKeyword}
                  onKeyDown={handleKeywordKeyDown}
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
            value={envVarsText}
            onChange={setEnvVarsText}
            placeholder='{ "KEY": "value", "API_KEY": "secret" }'
            htmlId="environment_variables"
          />

          {/* Docker Compose Configuration Card */}
          <JsonEditorCard
            className="md:col-span-2"
            title="Docker Compose 설정"
            icon={Settings}
            label="Docker Compose 설정 (JSON)"
            value={dockerComposeText}
            onChange={setDockerComposeText}
            placeholder='{ "version": "3", "services": {...} }'
            htmlId="docker_compose_config"
          />

          {/* Resource Requirements Card */}
          <JsonEditorCard
            className="md:col-span-2"
            title="리소스 요구사항"
            icon={Database}
            label="리소스 요구사항 (JSON)"
            value={resourceReqText}
            onChange={setResourceReqText}
            placeholder='{ "cpu": "1", "memory": "512Mi" }'
            htmlId="resource_requirements"
          />

          {/* Metadata Card */}
          <JsonEditorCard
            className="md:col-span-2"
            title="메타데이터"
            icon={FileCode}
            label="메타데이터 (JSON)"
            value={metadataText}
            onChange={setMetadataText}
            placeholder='{ "author": "name", "license": "MIT" }'
            htmlId="metadata"
          />
        </div>
      </div>
    </form>
  );
}

export default ToolEditPage;
