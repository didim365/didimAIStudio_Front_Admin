import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import ToolsPage from "./ToolsPage";

// useGetTools 훅 mock
vi.mock("../_hooks/useGetTools", () => ({
  useGetTools: vi.fn(() => ({
    data: {
      items: [],
      total: 0,
      page: 1,
      total_pages: 1,
    },
    isLoading: false,
  })),
}));

// useQueryParam 훅 mock
vi.mock("@/shared/hooks/useQueryParams", () => ({
  useQueryParam: vi.fn((_key: string, defaultValue: any) => {
    return [defaultValue, vi.fn()];
  }),
}));

describe("ToolsPage (templates)", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<ToolsPage />);

    expect(screen.getByText("도구 템플릿 관리")).toBeInTheDocument();
  });

  it("상태 필터가 표시된다", () => {
    renderWithProviders(<ToolsPage />);

    expect(screen.getByText("전체 상태")).toBeInTheDocument();
  });

  it("도구 추가 버튼이 표시된다", () => {
    renderWithProviders(<ToolsPage />);

    expect(screen.getByText("도구 추가")).toBeInTheDocument();
  });
});
