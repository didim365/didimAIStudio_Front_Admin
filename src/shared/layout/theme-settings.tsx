"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Settings, Check, Moon, Sun } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { Switch } from "@/shared/ui/switch";

// 테마 옵션
const themes = [
  {
    id: "monochrome",
    name: "모노크롬",
    description: "검정, 회색, 하얀색",
    colors: {
      primary: "#0f172a",
      secondary: "#64748b",
      accent: "#94a3b8",
    },
  },
  {
    id: "blue",
    name: "블루",
    description: "파란색 계열",
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#60a5fa",
    },
  },
  {
    id: "purple",
    name: "퍼플",
    description: "보라색 계열",
    colors: {
      primary: "#6b21a8",
      secondary: "#a855f7",
      accent: "#c084fc",
    },
  },
];


export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const mounted = typeof window !== 'undefined';

  // localStorage에서 초기값 읽기 (lazy initialization)
  const [selectedTheme, setSelectedTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("theme") || "monochrome";
    }
    return "monochrome";
  });

  const applySettings = (themeId: string) => {
    if (typeof window === 'undefined') return;

    const theme = themes.find((t) => t.id === themeId);

    if (theme) {
      document.documentElement.style.setProperty("--color-primary", theme.colors.primary);
      document.documentElement.style.setProperty("--color-secondary", theme.colors.secondary);
      document.documentElement.style.setProperty("--color-accent", theme.colors.accent);

      // 차트 색상도 업데이트
      document.documentElement.style.setProperty("--chart-color-1", theme.colors.primary);
      document.documentElement.style.setProperty("--chart-color-2", theme.colors.secondary);
      document.documentElement.style.setProperty("--chart-color-3", theme.colors.accent);
    }
  };

  // 초기 설정 적용
  useEffect(() => {
    applySettings(selectedTheme);
  }, [selectedTheme]);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem("theme", themeId);
    applySettings(themeId);

    // 테마 변경 이벤트 발생시켜 차트 리렌더링
    window.dispatchEvent(new Event('themeChanged'));
  };

  const handleDarkModeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);

    // 다크모드 스타일 적용
    if (checked) {
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }

    window.dispatchEvent(new Event('themeChanged'));
  };

  const isDarkMode = theme === "dark";

  // 마운트 전에는 버튼을 숨겨서 FOUC 방지
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* 플로팅 다크모드 토글 버튼 */}
      <button
        onClick={() => handleDarkModeChange(!isDarkMode)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        style={{
          backgroundColor: isDarkMode ? '#ffffff' : '#1f2937',
          color: isDarkMode ? '#1f2937' : '#ffffff',
        }}
        aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
      >
        {isDarkMode ? (
          <Sun className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <Moon className="h-6 w-6 transition-transform duration-300" />
        )}
      </button>

      {/* 설정 패널 (숨김) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button style={{ display: 'none' }} aria-label="테마 설정">
            <Settings className="h-6 w-6" />
          </button>
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>테마 설정</SheetTitle>
            <SheetDescription>
              컬러 테마를 선택하여 맞춤 설정하세요
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 p-6">
            {/* 다크모드 토글 */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                배경 테마
              </Label>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {isDarkMode ? "다크 모드" : "라이트 모드"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isDarkMode ? "어두운 배경 테마" : "밝은 배경 테마"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleDarkModeChange}
                />
              </div>
            </div>

            <Separator />

            {/* 컬러 테마 섹션 */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                컬러 테마
              </Label>
              <div className="grid gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-full p-4 rounded-lg border transition-all text-left group ${
                      selectedTheme === theme.id
                        ? "border-primary bg-accent/50"
                        : "border-border hover:border-primary/50 hover:bg-accent/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm">
                            {theme.name}
                          </h3>
                          {selectedTheme === theme.id && (
                            <div className="bg-primary text-primary-foreground rounded-full p-0.5">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {theme.description}
                        </p>
                        <div className="flex gap-1.5">
                          <div
                            className="w-6 h-6 rounded-md ring-1 ring-border/50"
                            style={{ backgroundColor: theme.colors.primary }}
                            title="Primary"
                          />
                          <div
                            className="w-6 h-6 rounded-md ring-1 ring-border/50"
                            style={{ backgroundColor: theme.colors.secondary }}
                            title="Secondary"
                          />
                          <div
                            className="w-6 h-6 rounded-md ring-1 ring-border/50"
                            style={{ backgroundColor: theme.colors.accent }}
                            title="Accent"
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* 미리보기 섹션 */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                미리보기
              </Label>
              <div className="p-4 border rounded-lg bg-card">
                <h3 className="text-base font-semibold mb-2">
                  관리자 콘솔
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  선택한 테마가 적용된 미리보기입니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <div
                    className="px-3 py-1.5 text-white rounded-md text-xs font-medium shadow-sm"
                    style={{
                      backgroundColor: themes.find((t) => t.id === selectedTheme)
                        ?.colors.primary,
                    }}
                  >
                    Primary
                  </div>
                  <div
                    className="px-3 py-1.5 text-white rounded-md text-xs font-medium shadow-sm"
                    style={{
                      backgroundColor: themes.find((t) => t.id === selectedTheme)
                        ?.colors.secondary,
                    }}
                  >
                    Secondary
                  </div>
                  <div
                    className="px-3 py-1.5 text-white rounded-md text-xs font-medium shadow-sm"
                    style={{
                      backgroundColor: themes.find((t) => t.id === selectedTheme)
                        ?.colors.accent,
                    }}
                  >
                    Accent
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
