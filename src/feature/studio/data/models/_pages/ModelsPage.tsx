"use client";

import { useState } from "react";
import { components } from "@/shared/types/api/models";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import useGetSettings from "../_hooks/useGetSettings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
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
import {
  RefreshCw,
  AlertCircle,
  Terminal,
  Database,
  Settings2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

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
        <code className="text-xs bg-muted px-1 rounded">
          {JSON.stringify(value).substring(0, 20)}...
        </code>
      );
    return value.toString();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">모델 설정 관리</h1>
        <p className="text-muted-foreground">
          시스템의 LLM 모델 설정을 조회하고 관리합니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Filters Panel */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              필터 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">배포 타입</label>
              <Select value={deploymentType} onValueChange={setDeploymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="public_api">Public API</SelectItem>
                  <SelectItem value="private_vllm">Private vLLM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">사용자 ID</label>
              <Input
                type="number"
                placeholder="User ID..."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <Button
              className="w-full gap-2"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              조회하기
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="md:col-span-3 space-y-6">
          {/* Request Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Request Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-mono">
                  deployment_type:{" "}
                  {deploymentType === "all" ? "undefined" : deploymentType}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  user_id: {userId || "undefined"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Response Data */}
          <Card className="min-h-[400px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Response Data
                  <Badge variant="secondary" className="ml-2">
                    {settingsList.length} items
                  </Badge>
                </CardTitle>
              </div>
              <CardDescription>조회된 설정 데이터 목록입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <RefreshCw className="h-8 w-8 animate-spin mb-4" />
                  <p>데이터를 불러오는 중입니다...</p>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center py-12 text-destructive">
                  <AlertCircle className="h-8 w-8 mb-4" />
                  <p>데이터를 불러오는데 실패했습니다.</p>
                  <p className="text-sm mt-1">{(error as Error).message}</p>
                </div>
              )}

              {!isLoading && !error && settingsList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Database className="h-8 w-8 mb-4 opacity-20" />
                  <p>표시할 데이터가 없습니다.</p>
                </div>
              )}

              {!isLoading && !error && settingsList.length > 0 && (
                <Tabs defaultValue="table" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="json">JSON View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="table" className="border rounded-md">
                    <div className="h-[500px] overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            {Object.keys(settingsList[0] || {}).map((key) => (
                              <TableHead
                                key={key}
                                className="whitespace-nowrap"
                              >
                                {key}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {settingsList.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-muted-foreground">
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
                  </TabsContent>

                  <TabsContent value="json">
                    <div className="h-[500px] w-full bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-xs overflow-auto">
                      <pre>{JSON.stringify(settingsList, null, 2)}</pre>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ModelsPage;
