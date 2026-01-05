"use client";

import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface JsonEditorCardProps {
  title: string;
  icon: LucideIcon;
  label: string;
  value: Record<string, unknown> | null;
  onChange: (value: Record<string, unknown> | null) => void;
  placeholder: string;
  errorMessage: string;
  helpText?: string;
  className?: string;
  htmlId: string;
}

export function JsonEditorCard({
  title,
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  errorMessage,
  helpText = "JSON 형식으로 입력하세요",
  className,
  htmlId,
}: JsonEditorCardProps) {
  const { theme } = useTheme();

  // 내부에서 텍스트 상태 관리 (초기값으로만 사용)
  const [textValue, setTextValue] = useState(() =>
    value ? JSON.stringify(value, null, 2) : ""
  );

  const handleChange = (newText: string) => {
    setTextValue(newText);

    // 빈 값이면 null로 처리
    if (!newText.trim()) {
      onChange(null);
      return;
    }

    // JSON 파싱 시도
    try {
      const parsed = JSON.parse(newText);
      onChange(parsed);
    } catch (error) {
      // 파싱 실패 시 이전 값 유지 (onChange 호출하지 않음)
      // 사용자가 계속 타이핑 중일 수 있으므로 에러는 표시하지 않음
    }
  };

  const handleBlur = () => {
    // blur 시점에 최종 검증하여 에러가 있으면 toast 표시
    if (!textValue.trim()) return;

    try {
      JSON.parse(textValue);
    } catch (error) {
      toast.error(errorMessage);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={htmlId} className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Label>
          <div className="border rounded-lg overflow-hidden">
            <CodeMirror
              value={textValue}
              onChange={handleChange}
              onBlur={handleBlur}
              extensions={[json()]}
              theme={theme === "dark" ? oneDark : undefined}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                highlightSelectionMatches: false,
              }}
              placeholder={placeholder}
              minHeight="200px"
              maxHeight="400px"
            />
          </div>
          {helpText && (
            <p className="text-xs text-muted-foreground">{helpText}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
