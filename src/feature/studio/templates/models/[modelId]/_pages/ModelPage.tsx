"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import JsonView from "@uiw/react-json-view";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { formatDate } from "@/shared/utils/formatDate";

import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Info,
  Layers,
  Link2,
  Tag,
  Hash,
  Calendar,
  Coins,
  Cpu,
  AlertCircle,
} from "lucide-react";

import { StatusBadge } from "../../_components/StatusBadge";
import { getCategoryLabel } from "../../_utils/getCategoryLabel";
import { formatNumber } from "../../_utils/formatNumber";
import { formatCost } from "../../_utils/formatCost";
import { GetCatalogResponse } from "../_api/getCatalog";

interface ModelPageProps {
  catalog: GetCatalogResponse;
}

type AnyRecord = Record<string, unknown>;

const isRecord = (v: unknown): v is AnyRecord =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const stringifySafely = (v: unknown) => {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (v === null) return "null";
  if (v === undefined) return "-";
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

function FieldRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background p-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="mt-1 text-sm font-semibold wrap-break-word">
          {value}
        </div>
      </div>
    </div>
  );
}

function ModelPage({ catalog }: ModelPageProps) {
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/studio/data")
    ? "/studio/data"
    : "/studio/templates";

  const items = (catalog as AnyRecord)?.items as AnyRecord[] | undefined;
  const current = items?.[0];

  const responseMeta = useMemo(() => {
    if (!isRecord(catalog)) return null;
    const { items: _items, ...rest } = catalog;
    return rest;
  }, [catalog]);

  const currentKnown = useMemo(() => {
    if (!isRecord(current)) return null;
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
    const extra: AnyRecord = {};
    for (const [k, v] of Object.entries(current)) {
      if (!knownKeys.has(k)) extra[k] = v;
    }
    return { extra };
  }, [current]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} 복사 완료`);
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  const modelId =
    typeof current?.id === "number" ? (current.id as number) : null;
  const title =
    (typeof current?.model_name === "string"
      ? (current.model_name as string)
      : undefined) ?? "모델 상세";
  const subtitleId = modelId !== null ? String(modelId) : "-";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href={`${basePath}/models`}>
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Hash className="h-4 w-4" />
                모델 ID: {subtitleId}
              </span>
              {typeof current?.status === "string" && (
                <span className="ml-1">
                  <StatusBadge status={current.status as string} />
                </span>
              )}
              {typeof current?.category === "string" && (
                <Badge variant="secondary" className="gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  {getCategoryLabel(current.category as string)}
                </Badge>
              )}
              {typeof current?.version === "string" && (
                <Badge variant="outline" className="gap-1">
                  <Layers className="h-3.5 w-3.5" />v{current.version as string}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {current?.endpoints_url ? (
            <Button variant="outline" className="gap-2" asChild>
              <a
                href={String(current.endpoints_url)}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                엔드포인트 열기
              </a>
            </Button>
          ) : (
            <Button variant="outline" className="gap-2" disabled>
              <ExternalLink className="h-4 w-4" />
              엔드포인트 없음
            </Button>
          )}

          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => handleCopy(stringifySafely(current), "모델 데이터")}
            disabled={!current}
          >
            <Copy className="h-4 w-4" />
            복사
          </Button>
        </div>
      </div>

      {/* Summary */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24 border bg-muted">
                <AvatarImage
                  src={
                    (current?.logo as string | null | undefined) || undefined
                  }
                  alt={title}
                />
                <AvatarFallback className="text-xl font-semibold">
                  {(title || "AI").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Provider</p>
                <p className="font-semibold">
                  {(current?.provider as string | undefined) || "-"}
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid gap-3 md:grid-cols-2">
                <FieldRow
                  icon={<Hash className="h-4 w-4" />}
                  label="ID"
                  value={
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{String(subtitleId)}</span>
                      {current?.id !== undefined && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleCopy(String(current.id), "모델 ID")
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  }
                />
                <FieldRow
                  icon={<Tag className="h-4 w-4" />}
                  label="카테고리"
                  value={
                    typeof current?.category === "string"
                      ? getCategoryLabel(current.category as string)
                      : "-"
                  }
                />
                <FieldRow
                  icon={<Layers className="h-4 w-4" />}
                  label="버전"
                  value={(current?.version as string | undefined) || "-"}
                />
                <FieldRow
                  icon={<Cpu className="h-4 w-4" />}
                  label="상태"
                  value={
                    typeof current?.status === "string" ? (
                      <StatusBadge status={current.status as string} />
                    ) : (
                      "-"
                    )
                  }
                />
              </div>

              <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  설명
                </p>
                <p className="mt-1 text-sm leading-relaxed">
                  {(current?.description as string | null | undefined) ||
                    "설명 정보 없음"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details" className="gap-2">
                <Info />
                상세
              </TabsTrigger>
              <TabsTrigger value="raw" className="gap-2">
                <Link2 />
                원본 응답(JSON)
              </TabsTrigger>
              <TabsTrigger value="extra" className="gap-2">
                <Layers />
                추가 필드
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              {!current ? (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-4 text-muted-foreground">
                  <AlertCircle className="h-5 w-5" />
                  응답에 items가 없거나 비어있습니다.
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Cpu className="h-4 w-4" />
                        토큰 제한
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        <FieldRow
                          icon={<Hash className="h-4 w-4" />}
                          label="최대 토큰"
                          value={formatNumber(
                            current.max_tokens as number | null | undefined
                          )}
                        />
                        <FieldRow
                          icon={<Hash className="h-4 w-4" />}
                          label="최대 입력 토큰"
                          value={formatNumber(
                            current.max_input_tokens as
                              | number
                              | null
                              | undefined
                          )}
                        />
                        <FieldRow
                          icon={<Hash className="h-4 w-4" />}
                          label="최대 출력 토큰"
                          value={formatNumber(
                            current.max_output_tokens as
                              | number
                              | null
                              | undefined
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Coins className="h-4 w-4" />
                        비용(토큰당)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        <FieldRow
                          icon={<Coins className="h-4 w-4" />}
                          label="입력 토큰 비용"
                          value={formatCost(
                            current.input_cost_per_token as
                              | number
                              | null
                              | undefined
                          )}
                        />
                        <FieldRow
                          icon={<Coins className="h-4 w-4" />}
                          label="출력 토큰 비용"
                          value={formatCost(
                            current.output_cost_per_token as
                              | number
                              | null
                              | undefined
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Link2 className="h-4 w-4" />
                        연동 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        <FieldRow
                          icon={<Link2 className="h-4 w-4" />}
                          label="엔드포인트 URL"
                          value={
                            current.endpoints_url ? (
                              <div className="flex items-center gap-2">
                                <span className="break-all">
                                  {String(current.endpoints_url)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    handleCopy(
                                      String(current.endpoints_url),
                                      "엔드포인트 URL"
                                    )
                                  }
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  asChild
                                >
                                  <a
                                    href={String(current.endpoints_url)}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <FieldRow
                          icon={<Calendar className="h-4 w-4" />}
                          label="생성일"
                          value={formatDate(
                            current.created_at as string | null | undefined
                          )}
                        />
                        <FieldRow
                          icon={<Calendar className="h-4 w-4" />}
                          label="수정일"
                          value={formatDate(
                            current.updated_at as string | null | undefined
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base">응답 메타</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-4">
                        <FieldRow
                          icon={<Hash className="h-4 w-4" />}
                          label="total"
                          value={stringifySafely((catalog as AnyRecord)?.total)}
                        />
                        <FieldRow
                          icon={<Hash className="h-4 w-4" />}
                          label="page"
                          value={stringifySafely((catalog as AnyRecord)?.page)}
                        />
                        <FieldRow
                          icon={<Hash className="h-4 w-4" />}
                          label="size"
                          value={stringifySafely((catalog as AnyRecord)?.size)}
                        />
                        <FieldRow
                          icon={<Hash className="h-4 w-4" />}
                          label="total_pages"
                          value={stringifySafely(
                            (catalog as AnyRecord)?.total_pages
                          )}
                        />
                      </div>
                      {responseMeta && Object.keys(responseMeta).length > 0 && (
                        <div className="mt-4 rounded-lg border bg-muted/30 p-3 overflow-x-auto">
                          <JsonView
                            value={responseMeta}
                            style={{
                              backgroundColor: "transparent",
                              fontSize: "0.875rem",
                            }}
                            displayDataTypes={false}
                            displayObjectSize={false}
                            enableClipboard={true}
                            collapsed={1}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="raw" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">원본 응답</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/30 p-3 overflow-x-auto">
                    <JsonView
                      value={catalog as unknown as AnyRecord}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "0.875rem",
                      }}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      enableClipboard={true}
                      collapsed={1}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="extra" className="mt-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      모델 추가 필드(known 제외)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border bg-muted/30 p-3 overflow-x-auto">
                      <JsonView
                        value={(currentKnown?.extra ?? {}) as AnyRecord}
                        style={{
                          backgroundColor: "transparent",
                          fontSize: "0.875rem",
                        }}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        enableClipboard={true}
                        collapsed={1}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      items 전체(여러 건일 수 있음)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border bg-muted/30 p-3 overflow-x-auto">
                      <JsonView
                        value={(items ?? []) as unknown as AnyRecord}
                        style={{
                          backgroundColor: "transparent",
                          fontSize: "0.875rem",
                        }}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        enableClipboard={true}
                        collapsed={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ModelPage;
