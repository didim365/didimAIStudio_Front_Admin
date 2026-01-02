import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import PersonasPage from "./PersonasPage";

// useGetPersonas 훅 mock
vi.mock("../_hooks/useGetPersonas", () => ({
  default: vi.fn(() => ({
    data: {
      items: [],
      total: 0,
      page: 1,
      total_pages: 1,
    },
    isLoading: false,
    refetch: vi.fn(),
  })),
}));

// useQueryParam 훅 mock
vi.mock("@/shared/hooks/useQueryParams", () => ({
  useQueryParam: vi.fn((_key: string, defaultValue: any) => {
    return [defaultValue, vi.fn()];
  }),
}));

describe("PersonasPage (templates)", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<PersonasPage />);

    expect(screen.getByText("페르소나 템플릿 관리")).toBeInTheDocument();
  });

  it("검색 입력창이 표시된다", () => {
    renderWithProviders(<PersonasPage />);

    const searchInput = screen.getByPlaceholderText("이름 검색");
    expect(searchInput).toBeInTheDocument();
  });

  it("페르소나 추가 버튼이 표시된다", () => {
    renderWithProviders(<PersonasPage />);

    expect(screen.getByText("페르소나 생성")).toBeInTheDocument();
  });

  it("새로고침 버튼이 표시된다", () => {
    renderWithProviders(<PersonasPage />);

    expect(screen.getByText("새로고침")).toBeInTheDocument();
  });
});
