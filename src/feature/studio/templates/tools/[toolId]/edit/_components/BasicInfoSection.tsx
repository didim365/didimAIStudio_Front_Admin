import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  Wrench,
  Hash,
  Package,
  Server,
  GitBranch,
  Code2,
  FileCode,
  Settings,
} from "lucide-react";
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
  statusConfig,
  providerConfig,
  deploymentTypeConfig,
} from "../../../_constants/toolConfigs";
import { GetToolResponse } from "../../_api/getTool";

interface BasicInfoSectionProps {
  tool: GetToolResponse;
  formData: {
    description: string;
    version: string;
    status: "ACTIVE" | "INACTIVE" | "PENDING" | "ERROR";
  };
  onFormChange: (updates: Partial<BasicInfoSectionProps["formData"]>) => void;
}

export function BasicInfoSection({
  tool,
  formData,
  onFormChange,
}: BasicInfoSectionProps) {
  const DeploymentIcon =
    deploymentTypeConfig[tool.deployment_type]?.icon || Server;

  return (
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
              <Label htmlFor="tool_id" className="flex items-center gap-2">
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
                <span>시스템 내부 식별자</span>
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
              <Label htmlFor="version" className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <span>버전 *</span>
              </Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => onFormChange({ version: e.target.value })}
                placeholder="1.0.0"
                className="font-mono"
                required
              />
            </div>

            {/* Category (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
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
                ) => onFormChange({ status: value })}
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
              <Label htmlFor="provider" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>프로바이더</span>
              </Label>
              <Input
                id="provider"
                value={providerConfig[tool.provider]?.label || tool.provider}
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
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                <span>설명</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => onFormChange({ description: e.target.value })}
                placeholder="도구에 대한 설명을 입력하세요"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
