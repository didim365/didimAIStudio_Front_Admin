"use client";

import { X } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Label } from "@/shared/ui/label";
import GroupTreeView from "./GroupTreeView";
import { useGetGroups } from "../_hooks/useGetGroups";

interface ChildGroupsSelectProps {
  value?: number[];
  onClick: (value: number[]) => void;
  excludeGroupId?: number;
}

export default function ChildGroupsSelect({
  value = [],
  onClick,
  excludeGroupId,
}: ChildGroupsSelectProps) {
  // 그룹 이름을 가져오기 위해 동일한 쿼리 사용 (캐시 공유)
  const { data: groups } = useGetGroups({
    page: 1,
    size: 100,
  });

  const handleRemove = (idToRemove: number) => {
    onClick(value.filter((id) => id !== idToRemove));
  };

  const getGroupName = (id: number) => {
    return groups?.items.find((g) => g.id === id)?.group_name || `Group ${id}`;
  };

  return (
    <div className="space-y-4">
      {/* 선택된 그룹 표시 */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            선택된 하위 그룹 ({value.length}개)
          </Label>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md border border-dashed min-h-12">
            {value.map((id) => (
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
          selectedIds={value}
          onSelect={onClick}
          multiSelect={true}
          excludeIds={excludeGroupId ? [excludeGroupId] : []}
          className="min-h-[200px]"
        />
        <p className="text-xs text-muted-foreground">
          * 폴더를 클릭하여 하위 그룹을 선택하세요. (다중 선택 가능)
        </p>
      </div>
    </div>
  );
}
