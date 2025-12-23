import type { ReactNode } from "react";

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  valueClassName?: string;
}

/**
 * 정보 행 컴포넌트
 * 아이콘, 레이블, 값을 표시하는 재사용 가능한 컴포넌트
 */
export function InfoRow({ icon, label, value, valueClassName }: InfoRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="shrink-0">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className={["text-lg font-semibold pl-6", valueClassName].join(" ")}>
        {value}
      </div>
    </div>
  );
}
