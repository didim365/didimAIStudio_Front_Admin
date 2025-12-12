"use client";

import Link from "next/link";
import JsonView from "@uiw/react-json-view";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Bot,
  Calendar,
  Clock,
  Coins,
  Database,
  Hash,
  Link2,
  Layers,
  Tag,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { formatDate } from "@/shared/utils/formatDate";
import type { GetCatalogResponse } from "../_api/getCatalog";

interface ModelPageProps {
  catalog: GetCatalogResponse;
}

function getStatusBadgeVariant(
  status?: GetCatalogResponse["status"]
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "STABLE":
      return "default";
    case "BETA":
      return "secondary";
    case "ALPHA":
      return "outline";
    case "DEPRECATED":
      return "destructive";
    default:
      return "outline";
  }
}

function formatNumber(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatCurrency(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  // 비용 단위가 명확하지 않아서, 통화 기호 없이 숫자만 보기 좋게 표기
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 10,
  }).format(value);
}

function isLikelyUrl(value: unknown) {
  if (typeof value !== "string") return false;
  return /^https?:\/\//i.test(value);
}

function renderFieldValue(value: unknown) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">N/A</span>;
  }

  if (typeof value === "boolean") {
    return (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "Yes" : "No"}
      </Badge>
    );
  }

  if (typeof value === "number") {
    return <span>{formatCurrency(value)}</span>;
  }

  if (typeof value === "string") {
    if (isLikelyUrl(value)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-4 break-all"
        >
          {value}
        </a>
      );
    }
    return <span className="break-all">{value}</span>;
  }

  // object / array -> compact json viewer
  return (
    <div className="rounded-md border bg-muted/30 p-2 overflow-x-auto">
      <JsonView
        value={value as any}
        style={{ backgroundColor: "transparent", fontSize: "0.8125rem" }}
        displayDataTypes={false}
        displayObjectSize={true}
        enableClipboard={true}
        collapsed={1}
      />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="shrink-0">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className={["text-lg font-semibold pl-6", valueClassName].join(" ")}>
        {value}
      </div>
    </div>
  );
}

function pickPrimaryModel(
  catalog: GetCatalogResponse
): GetCatalogResponse | null {
  return catalog ?? null;
}

function sortEntriesForDisplay(entries: Array<[string, unknown]>) {
  return entries.sort(([a], [b]) => a.localeCompare(b, "en"));
}

function getInitials(value?: string | null) {
  const text = (value ?? "").trim();
  if (!text) return "M";
  const parts = text.split(/\s+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return initials || text[0]?.toUpperCase() || "M";
}

function ModelPage({ catalog }: ModelPageProps) {
  const model = pickPrimaryModel(catalog);
  if (!model) return null;

  const knownKeys = new Set([
    "id",
    "model_name",
    "provider",
    "description",
    "logo",
    "endpoints_url",
    "category",
    "version",
    "status",
    "max_tokens",
    "max_input_tokens",
    "max_output_tokens",
    "input_cost_per_token",
    "output_cost_per_token",
    "created_at",
    "updated_at",
  ]);

  const additionalEntries = sortEntriesForDisplay(
    Object.entries(model as Record<string, unknown>).filter(
      ([key]) => !knownKeys.has(key)
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/templates/models">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              템플릿 모델 상세 정보
            </h1>
            <p className="text-muted-foreground">모델 ID: {model.id}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="raw">Raw JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo / Status */}
                  <div className="flex flex-col items-center gap-4 min-w-[150px]">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                      <AvatarImage
                        src={model.logo || undefined}
                        alt={model.model_name}
                      />
                      <AvatarFallback className="text-3xl">
                        {getInitials(model.model_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Badge variant={getStatusBadgeVariant(model.status)}>
                        {model.status}
                      </Badge>
                      <Badge variant="outline">{model.category}</Badge>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="flex-1 grid gap-4 md:grid-cols-2">
                    <InfoRow
                      icon={<Hash className="h-4 w-4" />}
                      label="모델명"
                      value={model.model_name}
                    />
                    <InfoRow
                      icon={<Tag className="h-4 w-4" />}
                      label="Provider"
                      value={model.provider}
                    />
                    <InfoRow
                      icon={<Tag className="h-4 w-4" />}
                      label="Version"
                      value={model.version || "N/A"}
                    />
                    <InfoRow
                      icon={<Link2 className="h-4 w-4" />}
                      label="Endpoint URL"
                      value={
                        model.endpoints_url ? (
                          <a
                            href={model.endpoints_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline underline-offset-4 break-all"
                          >
                            {model.endpoints_url}
                          </a>
                        ) : (
                          "N/A"
                        )
                      }
                      valueClassName="break-all"
                    />
                    <InfoRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="생성일"
                      value={formatDate(model.created_at)}
                    />
                    <InfoRow
                      icon={<Clock className="h-4 w-4" />}
                      label="최근 수정일"
                      value={formatDate(model.updated_at)}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Description
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed">
                    {model.description?.trim() || "설명이 없습니다."}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  비용 (per token)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoRow
                    icon={<Coins className="h-4 w-4" />}
                    label="Input"
                    value={formatCurrency(model.input_cost_per_token)}
                  />
                  <InfoRow
                    icon={<Coins className="h-4 w-4" />}
                    label="Output"
                    value={formatCurrency(model.output_cost_per_token)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  * 단위 정보가 명확하지 않아 숫자 포맷만 적용했습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  토큰 제한
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <InfoRow
                  icon={<Hash className="h-4 w-4" />}
                  label="Max tokens"
                  value={formatNumber(model.max_tokens)}
                />
                <InfoRow
                  icon={<Hash className="h-4 w-4" />}
                  label="Max input"
                  value={formatNumber(model.max_input_tokens)}
                />
                <InfoRow
                  icon={<Hash className="h-4 w-4" />}
                  label="Max output"
                  value={formatNumber(model.max_output_tokens)}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  모든 필드 (key/value)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[260px]">Key</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">id</TableCell>
                        <TableCell>{renderFieldValue(model.id)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          model_name
                        </TableCell>
                        <TableCell>
                          {renderFieldValue(model.model_name)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">provider</TableCell>
                        <TableCell>
                          {renderFieldValue(model.provider)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">category</TableCell>
                        <TableCell>
                          {renderFieldValue(model.category)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">status</TableCell>
                        <TableCell>{renderFieldValue(model.status)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">version</TableCell>
                        <TableCell>{renderFieldValue(model.version)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          endpoints_url
                        </TableCell>
                        <TableCell>
                          {renderFieldValue(model.endpoints_url)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">logo</TableCell>
                        <TableCell>{renderFieldValue(model.logo)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          description
                        </TableCell>
                        <TableCell>
                          {renderFieldValue(model.description)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          max_tokens
                        </TableCell>
                        <TableCell>
                          {renderFieldValue(model.max_tokens)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          max_input_tokens
                        </TableCell>
                        <TableCell>
                          {renderFieldValue(model.max_input_tokens)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          max_output_tokens
                        </TableCell>
                        <TableCell>
                          {renderFieldValue(model.max_output_tokens)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          input_cost_per_token
                        </TableCell>
                        <TableCell>
                          {renderFieldValue(model.input_cost_per_token)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          output_cost_per_token
                        </TableCell>
                        <TableCell>
                          {renderFieldValue(model.output_cost_per_token)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          created_at
                        </TableCell>
                        <TableCell>
                          {renderFieldValue(model.created_at)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          updated_at
                        </TableCell>
                        <TableCell>
                          {renderFieldValue(model.updated_at)}
                        </TableCell>
                      </TableRow>

                      {additionalEntries.length ? (
                        additionalEntries.map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium">{key}</TableCell>
                            <TableCell>{renderFieldValue(value)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            className="text-muted-foreground"
                            colSpan={2}
                          >
                            추가 필드 없음
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="raw">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                전체 응답 데이터
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-muted/30 rounded-lg border border-border overflow-x-auto">
                <JsonView
                  value={catalog as any}
                  style={{
                    backgroundColor: "transparent",
                    fontSize: "0.875rem",
                  }}
                  displayDataTypes={false}
                  displayObjectSize={true}
                  enableClipboard={true}
                  collapsed={false}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ModelPage;
