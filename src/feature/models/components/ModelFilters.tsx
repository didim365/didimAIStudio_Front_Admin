"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
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
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

export interface ModelFiltersProps {
  onFilterChange: (filters: {
    category?: string | null;
    provider?: string | null;
    deployment_type?: string | null;
  }) => void;
  className?: string;
}

const CATEGORIES = [
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
];

const DEPLOYMENT_TYPES = [
  { value: "PRIVATE_VLLM", label: "Private vLLM" },
  { value: "PUBLIC_API", label: "Public API" },
];

export default function ModelFilters({ onFilterChange, className }: ModelFiltersProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [provider, setProvider] = useState<string>("");
  const [deploymentType, setDeploymentType] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      category: category || null,
      provider: provider || null,
      deployment_type: deploymentType || null,
    });
  };

  const handleResetFilters = () => {
    setCategory(null);
    setProvider("");
    setDeploymentType(null);
    onFilterChange({
      category: null,
      provider: null,
      deployment_type: null,
    });
  };

  const activeFiltersCount = [category, provider, deploymentType].filter(
    Boolean
  ).length;

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">필터</h3>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "접기" : "펼치기"}
            </Button>
          </div>

          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select
                  value={category || undefined}
                  onValueChange={(value) =>
                    setCategory(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">제공자</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="provider"
                    placeholder="예: OpenAI, Anthropic..."
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deployment-type">배포 타입</Label>
                <Select
                  value={deploymentType || undefined}
                  onValueChange={(value) =>
                    setDeploymentType(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger id="deployment-type">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {DEPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {isExpanded && (
            <div className="flex gap-2 pt-2">
              <Button onClick={handleApplyFilters} className="flex-1">
                <Filter className="mr-2 h-4 w-4" />
                필터 적용
              </Button>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                disabled={activeFiltersCount === 0}
              >
                <X className="mr-2 h-4 w-4" />
                초기화
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
