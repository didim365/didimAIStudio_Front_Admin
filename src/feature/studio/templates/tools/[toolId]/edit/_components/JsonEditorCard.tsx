"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "next-themes";

interface JsonEditorCardProps {
  title: string;
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
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
  helpText = "JSON 형식으로 입력하세요",
  className,
  htmlId,
}: JsonEditorCardProps) {
  const { theme } = useTheme();

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
              value={value}
              onChange={onChange}
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
