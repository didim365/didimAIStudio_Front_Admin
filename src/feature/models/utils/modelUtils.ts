import { CATEGORY_LABELS } from "../constants/modelConstants";

export const getCategoryLabel = (category: string): string => {
  return CATEGORY_LABELS[category] || category;
};

export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "-";
  return num.toLocaleString();
};

export const formatCost = (cost: number | null | undefined): string => {
  if (cost === null || cost === undefined) return "-";
  return `$${cost.toFixed(6)}`;
};

