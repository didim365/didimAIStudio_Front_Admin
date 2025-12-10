import { CATEGORY_LABELS } from "../_constants/modelConstants";

export const getCategoryLabel = (category: string): string => {
  return CATEGORY_LABELS[category] || category;
};

