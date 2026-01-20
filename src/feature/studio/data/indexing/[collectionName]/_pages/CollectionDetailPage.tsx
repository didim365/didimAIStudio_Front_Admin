"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  ArrowLeft,
  Database,
  FileText,
  Hash,
  Layers,
  List,
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
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${getStyle(collection.db_type)}`}
          >
            {getIcon(collection.db_type)}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {collection.collection_name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Milvus 컬렉션 상세 정보
            </p>
          </div>
        </div>
      </div>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                컬렉션 이름
              </label>
              <p className="mt-1 font-mono text-sm">{collection.collection_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                타입
              </label>
              <div className="mt-1">
                <Badge
                  variant={getBadgeVariant(collection.db_type)}
                  className="gap-1"
                >
                  {getIcon(collection.db_type)}
                  {collection.db_type}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                레코드 수
              </label>
              <p className="mt-1 font-mono text-sm">
                {formatNumber(collection.row_count)}개
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                스키마 필드 수
              </label>
              <p className="mt-1 font-mono text-sm">
                {formatNumber(collection.schema_fields.length)}개
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 스키마 필드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            스키마 필드
            <Badge variant="secondary" className="ml-2">
              {formatNumber(collection.schema_fields.length)}개
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {collection.schema_fields.map((field) => (
              <Badge
                key={field}
                variant="outline"
                className="font-mono text-xs"
              >
                <Hash className="mr-1 h-3 w-3" />
                {field}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 인덱스 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            인덱스 정보
            <Badge variant="secondary" className="ml-2">
              {collection.indexes && collection.indexes.length > 0
                ? formatNumber(collection.indexes.length)
                : 0}
              개
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {collection.indexes && collection.indexes.length > 0 ? (
            <div className="space-y-4">
              {collection.indexes.map((index, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border bg-muted/50 p-4"
                >
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">인덱스 {idx + 1}</span>
                  </div>
                  <div className="mt-2">
                    <pre className="overflow-x-auto rounded bg-background p-2 text-xs">
                      {JSON.stringify(index, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              인덱스 정보가 없습니다.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
