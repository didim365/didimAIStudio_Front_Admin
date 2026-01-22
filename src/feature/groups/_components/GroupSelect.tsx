"use client";

import GroupTreeView from "./GroupTreeView";

interface GroupSelectProps {
  value?: number | number[];
  onChange: (value: number | number[] | undefined) => void;
  multiSelect?: boolean;
  excludeId?: number;
}

export default function GroupSelect({
  value,
  onChange,
  multiSelect = false,
  excludeId,
}: GroupSelectProps) {
  const selectedIds = multiSelect
    ? (value as number[] | undefined) || []
    : value !== undefined
    ? [value as number]
    : [];

  const handleTreeSelect = (ids: number[]) => {
    if (multiSelect) {
      onChange(ids);
    } else {
      onChange(ids.length > 0 ? ids[0] : undefined);
    }
  };

  return (
    <div className="h-full flex flex-col gap-2">
      <GroupTreeView
        selectedIds={selectedIds}
        onSelect={handleTreeSelect}
        multiSelect={multiSelect}
        excludeIds={excludeId ? [excludeId] : []}
        className="flex-1 min-h-[200px]"
      />
      <p className="text-xs text-muted-foreground shrink-0">
        * 폴더를 클릭하여 그룹을 선택하세요.
        {multiSelect && " (다중 선택 가능)"}
      </p>
    </div>
  );
}
