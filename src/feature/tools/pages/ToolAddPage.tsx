"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostTool } from "../hooks/usePostTool";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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
import {
  Wrench,
  ArrowLeft,
  Save,
  Package,
  Tag,
  Hash,
  Link,
  Image as ImageIcon,
  Server,
  Container,
  CloudUpload,
  Settings,
} from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import {
  MCPToolProvider,
  MCPToolCategory,
  MCPToolDeploymentType,
  PROVIDER_OPTIONS,
  CATEGORY_OPTIONS,
  DEPLOYMENT_TYPE_OPTIONS,
} from "../constants/toolConfigs";

function ToolAddPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    provider: undefined as MCPToolProvider | undefined,
    category: undefined as MCPToolCategory | undefined,
    deployment_type: undefined as MCPToolDeploymentType | undefined,
    version: "",
    repo_url: "",
    icon_url: "",
    server_url: "",
    container_image: "",
  });

  // 도구 생성 mutation
  const { mutate: createTool, isPending: isCreating } = usePostTool({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["mcp-tools"],
      });
      // 생성된 도구 상세 페이지로 이동
      router.push(`/studio/tools/${data.id}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.provider || !formData.category || !formData.deployment_type) {
      toast.error("필수 항목을 모두 선택해주세요.");
      return;
    }

    createTool({
      name: formData.name,
      description: formData.description || null,
      provider: formData.provider,
      category: formData.category,
      deployment_type: formData.deployment_type,
      version: formData.version,
      repo_url: formData.repo_url || null,
      icon_url: formData.icon_url || null,
      server_url: formData.server_url || null,
      container_image: formData.container_image || null,
      docker_compose_config: null,
      environment_variables: null,
    });
  };

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
              onClick={() => router.push("/studio/tools")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Wrench className="h-8 w-8" />새 MCP 도구 추가
              </h1>
              <p className="text-muted-foreground mt-1">
                새로운 MCP 도구를 시스템에 등록합니다
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="shrink-0" disabled={isCreating}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "등록 중..." : "도구 등록"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 기본 정보 Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* 도구 이름 */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>도구 이름 *</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="예: youtube-search-tool"
                    className="pl-6"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    시스템 식별자로 사용될 고유한 이름입니다
                  </p>
                </div>

                {/* 버전 */}
                <div className="space-y-2">
                  <Label htmlFor="version" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span>버전 *</span>
                  </Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) =>
                      setFormData({ ...formData, version: e.target.value })
                    }
                    placeholder="예: 1.0.0"
                    className="pl-6"
                    required
                  />
                </div>

                {/* 설명 */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    <span>설명</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="도구에 대한 설명을 입력하세요"
                    className="pl-6 min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 분류 정보 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                분류 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 제공업체 */}
                <div className="space-y-2">
                  <Label htmlFor="provider" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>제공업체 *</span>
                  </Label>
                  <Select
                    value={formData.provider || ""}
                    onValueChange={(value: MCPToolProvider) =>
                      setFormData({ ...formData, provider: value })
                    }
                    required
                  >
                    <SelectTrigger id="provider" className="pl-6 w-full">
                      <SelectValue placeholder="제공업체를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 카테고리 */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>카테고리 *</span>
                  </Label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(value: MCPToolCategory) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger id="category" className="pl-6 w-full">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
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
                    <CloudUpload className="h-4 w-4" />
                    <span>배포 타입 *</span>
                  </Label>
                  <Select
                    value={formData.deployment_type || ""}
                    onValueChange={(value: MCPToolDeploymentType) =>
                      setFormData({ ...formData, deployment_type: value })
                    }
                    required
                  >
                    <SelectTrigger id="deployment_type" className="pl-6 w-full">
                      <SelectValue placeholder="배포 타입을 선택하세요" />
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
              </div>
            </CardContent>
          </Card>

          {/* URL 및 이미지 정보 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                URL 및 이미지 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 저장소 URL */}
                <div className="space-y-2">
                  <Label htmlFor="repo_url" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    <span>저장소 URL</span>
                  </Label>
                  <Input
                    id="repo_url"
                    type="url"
                    value={formData.repo_url}
                    onChange={(e) =>
                      setFormData({ ...formData, repo_url: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="pl-6"
                  />
                </div>

                {/* 아이콘 URL */}
                <div className="space-y-2">
                  <Label htmlFor="icon_url" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>아이콘 URL</span>
                  </Label>
                  <Input
                    id="icon_url"
                    type="url"
                    value={formData.icon_url}
                    onChange={(e) =>
                      setFormData({ ...formData, icon_url: e.target.value })
                    }
                    placeholder="https://example.com/icon.png"
                    className="pl-6"
                  />
                </div>

                {/* 서버 URL */}
                <div className="space-y-2">
                  <Label
                    htmlFor="server_url"
                    className="flex items-center gap-2"
                  >
                    <Server className="h-4 w-4" />
                    <span>서버 URL</span>
                  </Label>
                  <Input
                    id="server_url"
                    type="url"
                    value={formData.server_url}
                    onChange={(e) =>
                      setFormData({ ...formData, server_url: e.target.value })
                    }
                    placeholder="http://localhost:7000/mcp/"
                    className="pl-6"
                  />
                </div>

                {/* 컨테이너 이미지 */}
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
                    placeholder="예: didim365/mcp-web-search:latest"
                    className="pl-6"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            <span className="text-sm">
              * 표시된 필드는 필수 입력 항목입니다. 도구 등록 후 추가 설정은
              도구 상세 페이지에서 구성할 수 있습니다.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </form>
  );
}

export default ToolAddPage;
