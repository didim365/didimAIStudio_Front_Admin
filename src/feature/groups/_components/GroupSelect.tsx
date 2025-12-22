"use client";

import { X } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Label } from "@/shared/ui/label";
import GroupTreeView from "./GroupTreeView";
import { useGetGroups } from "../_hooks/useGetGroups";

interface GroupSelectProps {
  value?: number | number[];
  onChange: (value: number | number[] | undefined) => void;
  multiSelect?: boolean;
  showSelectedBadges?: boolean;
  excludeId?: number;
  selectedLabel?: string;
}

export default function GroupSelect({
  value,
  onChange,
  multiSelect = false,
  showSelectedBadges = false,
  excludeId,
  selectedLabel,
}: GroupSelectProps) {
  // 그룹 이름을 가져오기 위해 동일한 쿼리 사용 (캐시 공유)
  const { data: groups } = useGetGroups({
    page: 1,
    size: 100,
  });

  const selectedIds = multiSelect
    ? (value as number[] | undefined) || []
    : value !== undefined
    ? [value as number]
    : [];

  const handleRemove = (idToRemove: number) => {
    if (multiSelect) {
      const currentIds = (value as number[] | undefined) || [];
      onChange(currentIds.filter((id) => id !== idToRemove));
    } else {
      onChange(undefined);
    }
  };

  const getGroupName = (id: number) => {
    return groups?.items.find((g) => g.id === id)?.group_name || `Group ${id}`;
  };

  const handleTreeSelect = (ids: number[]) => {
    if (multiSelect) {
      onChange(ids);
    } else {
      onChange(ids.length > 0 ? ids[0] : undefined);
    }
  };

  return (
    <div className="space-y-4">
      {/* 선택된 그룹 표시 */}
      {showSelectedBadges && selectedIds.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            {selectedLabel || `선택된 그룹 (${selectedIds.length}개)`}
          </Label>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md border border-dashed min-h-12">
            {selectedIds.map((id) => (
              <Badge
                key={id}
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-2"
              >
                <span>{getGroupName(id)}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(id)}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                  aria-label="제거"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 트리 뷰 */}
      <div className="space-y-2">
        <GroupTreeView
          selectedIds={selectedIds}
          onSelect={handleTreeSelect}
          multiSelect={multiSelect}
          excludeIds={excludeId ? [excludeId] : []}
          className="min-h-[200px]"
        />
        <p className="text-xs text-muted-foreground">
          * 폴더를 클릭하여 그룹을 선택하세요.
          {multiSelect && " (다중 선택 가능)"}
        </p>
      </div>
    </div>
  );
}
