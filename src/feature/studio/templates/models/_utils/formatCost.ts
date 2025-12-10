export const formatCost = (cost: number | null | undefined): string => {
  if (cost === null || cost === undefined) return "-";
  return `$${cost.toFixed(6)}`;
};

