import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import ToolsPage from "./ToolsPage";

// useGetUserConfigs 훅 mock
vi.mock("../_hooks/useGetUserConfigs", () => ({
  useGetUserConfigs: vi.fn(() => ({
    data: {
      items: [],
      total: 0,
      page: 1,
      size: 10,
    },
    refetch: vi.fn(),
    isFetching: false,
  })),
}));

// useQueryParam 훅 mock
vi.mock("@/shared/hooks/useQueryParams", () => ({
  useQueryParam: vi.fn((_key: string, defaultValue: any) => {
    return [defaultValue, vi.fn()];
  }),
}));

describe("ToolsPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<ToolsPage />);

    expect(screen.getByText("컨테이너 관리")).toBeInTheDocument();
  });

  it("사용자 ID 검색 입력창이 표시된다", () => {
    renderWithProviders(<ToolsPage />);

    const searchInput = screen.getByPlaceholderText("사용자 ID 입력");
    expect(searchInput).toBeInTheDocument();
  });

  it("도구 ID 검색 입력창이 표시된다", () => {
    renderWithProviders(<ToolsPage />);

    const searchInput = screen.getByPlaceholderText("도구 ID 입력");
    expect(searchInput).toBeInTheDocument();
  });

  it("설정 이름 검색 입력창이 표시된다", () => {
    renderWithProviders(<ToolsPage />);

    const searchInput = screen.getByPlaceholderText("설정 이름 검색");
    expect(searchInput).toBeInTheDocument();
  });

  it("새로고침 버튼이 표시된다", () => {
    renderWithProviders(<ToolsPage />);

    expect(screen.getByText("새로고침")).toBeInTheDocument();
  });

  it("컨테이너 목록 테이블이 표시된다", () => {
    renderWithProviders(<ToolsPage />);

    expect(screen.getByText("컨테이너 목록")).toBeInTheDocument();
  });
});
