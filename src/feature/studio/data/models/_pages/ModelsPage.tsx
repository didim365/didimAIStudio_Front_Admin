"use client";

import { components } from "@/shared/types/api/models";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import useGetSettings from "../_hooks/useGetSettings";
import { getColumnLabel } from "../_utils/getColumnLabel";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { RefreshCw, AlertCircle } from "lucide-react";

type DeploymentType = components["schemas"]["DeploymentType"];

function ModelsPage() {
  // Query Params
  const [deploymentType, setDeploymentType] = useQueryParam<string>(
    "deploymentType",
    "all"
  );
  const [userId, setUserId] = useQueryParam<string>("userId", "");

  // API Call
  const { data, isLoading, refetch, error } = useGetSettings({
    deployment_type:
      deploymentType === "all" ? undefined : (deploymentType as DeploymentType),
    user_id: userId ? parseInt(userId) : undefined,
  });

  const settingsList = Array.isArray(data) ? data : [];

  // Helper to safely render cell values
  const renderValue = (value: any) => {
    if (value === null || value === undefined)
      return <span className="text-muted-foreground">-</span>;
    if (typeof value === "boolean")
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value.toString()}
        </Badge>
      );
    if (typeof value === "object")
      return (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {JSON.stringify(value).substring(0, 20)}...
        </code>
      );
    return value.toString();
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">모델 설정 관리</h1>
        <p className="mt-2 text-slate-600">
          시스템의 LLM 모델 설정을 조회하고 관리합니다.
        </p>
      </div>

      {/* 필터 */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* 필터 옵션 */}
            <div className="flex flex-wrap gap-2">
              <Select value={deploymentType} onValueChange={setDeploymentType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="배포 타입" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 배포 타입</SelectItem>
                  <SelectItem value="public_api">Public API</SelectItem>
                  <SelectItem value="private_vllm">Private vLLM</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="사용자 ID 필터..."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-[180px]"
              />

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                새로고침
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 설정 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            설정 목록 ({settingsList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
              <p className="text-slate-500">로딩 중...</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center py-12 text-destructive">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">
                데이터를 불러오는데 실패했습니다
              </p>
              <p className="text-sm mt-1">{(error as Error).message}</p>
            </div>
          )}
          {!isLoading && !error && settingsList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">설정을 찾을 수 없습니다</p>
              <p className="text-sm">필터 조건을 변경해보세요</p>
            </div>
          )}
          {!isLoading && !error && settingsList.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    {Object.keys(settingsList[0] || {}).map((key) => (
                      <TableHead key={key} className="whitespace-nowrap">
                        {getColumnLabel(key)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settingsList.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      {Object.keys(settingsList[0] || {}).map((key) => (
                        <TableCell key={key}>
                          {renderValue(item[key])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ModelsPage;
