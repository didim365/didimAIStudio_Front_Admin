"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import { Moon, Sun } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

export default function SettingsPage() {
  const { selectedTheme, selectedFont, handleThemeChange, handleFontChange } = useSettings();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">설정</h1>
        <p className="text-muted-foreground mt-2">
          애플리케이션 테마를 변경하세요
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>테마 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedTheme === "dark" ? (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <Label className="text-base font-medium">다크 모드</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTheme === "dark" ? "어두운 테마 사용 중" : "밝은 테마 사용 중"}
                  </p>
                </div>
              </div>
              <Switch checked={selectedTheme === "dark"} onCheckedChange={(checked) => handleThemeChange(checked ? "dark" : "light")} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
