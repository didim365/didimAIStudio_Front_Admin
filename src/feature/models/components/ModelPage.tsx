"use client";

import { useState } from "react";
import { Database, RefreshCw } from "lucide-react";
import { components } from "@/shared/types/api/models";
import useGetCatalog from "../hooks/useGetCatalog";
import ModelFilters from "./ModelFilters";
import ModelTable from "./ModelTable";
import ModelPagination from "./ModelPagination";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { toast } from "sonner";

type AICategoryEnum = components["schemas"]["AICategoryEnum"];

function ModelPage() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [category, setCategory] = useState<AICategoryEnum | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [deploymentType, setDeploymentType] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetCatalog({
    category: category || undefined,
    provider: provider || undefined,
    deployment_type: deploymentType || undefined,
    page,
    size,
  });

  const handleFilterChange = (filters: {
    category?: string | null;
    provider?: string | null;
    deployment_type?: string | null;
  }) => {
    setCategory((filters.category as AICategoryEnum) || null);
    setProvider(filters.provider || null);
    setDeploymentType(filters.deployment_type || null);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(1); // Reset to first page when page size changes
  };

  const handleRefresh = () => {
    refetch();
    toast.success("모델 목록을 새로고침했습니다");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI 모델 카탈로그</h1>
              <p className="mt-2 text-muted-foreground">
                {data?.total
                  ? `총 ${data.total.toLocaleString()}개의 AI 모델을 관리하고 있습니다`
                  : "AI 모델을 검색하고 관리하세요"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            새로고침
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ModelFilters onFilterChange={handleFilterChange} className="mb-6" />

      {/* Statistics */}
      {data && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {data.total.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">전체 모델</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {data.total_pages.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">총 페이지</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {data.items.length.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  현재 페이지
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{page}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  현재 페이지 번호
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      <ModelTable models={data?.items || []} isLoading={isLoading} />

      {/* Pagination */}
      {data && data.total > 0 && (
        <Card>
          <CardContent className="p-0">
            <ModelPagination
              currentPage={page}
              totalPages={data.total_pages}
              pageSize={size}
              totalItems={data.total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ModelPage;
