"use client";

import { Button } from "@/shared/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import GroupTreeView from "./GroupTreeView";

interface ParentGroupSelectProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  excludeId?: number;
}

export default function ParentGroupSelect({
  value,
  onChange,
  excludeId,
}: ParentGroupSelectProps) {
  return (
    <div className="space-y-4">
      {/* 상위 그룹 없음 옵션 */}
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start h-auto py-3 px-4",
          !value && "border-primary bg-primary/5"
        )}
        onClick={() => onChange(undefined)}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start">
            <span className="font-medium">상위 그룹 없음</span>
            <span className="text-xs text-muted-foreground">
              최상위 그룹으로 생성됩니다
            </span>
          </div>
          {!value && <Check className="h-5 w-5 text-primary" />}
        </div>
      </Button>

      {/* 트리 뷰 */}
      <div className="space-y-2">
        <GroupTreeView
          selectedIds={value ? [value] : []}
          onSelect={(ids) => onChange(ids.length > 0 ? ids[0] : undefined)}
          multiSelect={false}
          excludeIds={excludeId ? [excludeId] : []}
          className="min-h-[200px]"
        />
        <p className="text-xs text-muted-foreground">
          * 폴더를 클릭하여 상위 그룹을 선택하세요.
        </p>
      </div>
    </div>
  );
}
