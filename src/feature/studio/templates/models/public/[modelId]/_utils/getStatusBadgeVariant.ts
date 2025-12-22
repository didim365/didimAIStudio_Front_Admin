import type { GetCatalogResponse } from "../_api/getCatalog";

/**
 * 모델 상태에 따른 Badge variant 반환
 */
export function getStatusBadgeVariant(
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
