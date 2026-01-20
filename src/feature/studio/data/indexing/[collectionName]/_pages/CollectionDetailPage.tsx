import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  FileText,
  Layers,
  List,
  Table,
  Zap,
} from "lucide-react";
import { formatNumber } from "@/shared/utils/formatNumber";
import { getIcon } from "../../_components/getIcon";
import { getBadgeVariant } from "../../_utils/getBadgeVariant";
import { getStyle } from "../../_utils/getStyle";
import { GetCollectionDetailResponse } from "../_api/getCollectionDetail";

interface CollectionDetailPageProps {
  collection: GetCollectionDetailResponse;
}

export default function CollectionDetailPage({
  collection,
}: CollectionDetailPageProps) {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/studio/data/indexing">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${getStyle(collection.db_type)} shadow-sm`}
            >
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {collection.collection_name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Milvus 컬렉션 요약 정보
              </p>
            </div>
          </div>
        </div>

        {/* 데이터 조회 CTA */}
        <Link href={`/studio/data/indexing/${collection.collection_name}/${collection.db_type}`} className="block">
          <Card className="group cursor-pointer overflow-hidden border-border bg-linear-to-br from-foreground/5 to-foreground/10 transition-all hover:border-foreground/30 hover:shadow-lg dark:from-foreground/5 dark:to-foreground/10">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-foreground text-background shadow-lg">
                    <Table className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">데이터 조회</h2>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">{formatNumber(collection.row_count)}</span>개의 레코드 보기
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                  <span className="text-sm font-medium">
                    이동하기
                  </span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Statistics Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-linear-to-br from-background to-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    컬렉션 타입
                  </p>
                  <div className="mt-2">
                    <Badge
                      variant={getBadgeVariant(collection.db_type)}
                      className="gap-1.5 px-3 py-1"
                    >
                      {getIcon(collection.db_type)}
                      {collection.db_type}
                    </Badge>
                  </div>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${getStyle(collection.db_type)}`}
                >
                  {getIcon(collection.db_type)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-background to-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    스키마 필드
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {formatNumber(collection.schema_fields.length)}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-background to-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    인덱스 수
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {collection.indexes?.length ?? 0}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 스키마 필드 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                스키마 필드
                <Badge variant="secondary" className="ml-2">
                  {formatNumber(collection.schema_fields.length)}개
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {collection.schema_fields.map((field, index) => (
                  <div
                    key={field}
                    className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-medium text-muted-foreground bg-background">
                      {index + 1}
                    </span>
                    <span className="truncate font-mono text-sm">
                      {field}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 인덱스 정보 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                인덱스 정보
                <Badge variant="secondary" className="ml-2">
                  {collection.indexes?.length ?? 0}개
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {collection.indexes && collection.indexes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {collection.indexes.map((index, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border bg-linear-to-br from-muted/30 to-muted/10 p-4 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                          <List className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">인덱스 {idx + 1}</span>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        {Object.entries(index as Record<string, unknown>).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/_/g, " ")}
                              </span>
                              <Badge variant="outline" className="font-mono">
                                {String(value)}
                              </Badge>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Layers className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    인덱스 정보가 없습니다.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    이 컬렉션에는 설정된 인덱스가 없습니다.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
