import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import AgentsPage from "./AgentsPage";

// useGetAgents 훅 mock
vi.mock("../hooks/useGetAgents", () => ({
  useGetAgents: vi.fn(() => ({
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

describe("AgentsPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<AgentsPage />);

    expect(screen.getByText("에이전트 데이터 관리")).toBeInTheDocument();
  });

  it("검색 입력창이 표시된다", () => {
    renderWithProviders(<AgentsPage />);

    const searchInput = screen.getByPlaceholderText("에이전트 이름 검색");
    expect(searchInput).toBeInTheDocument();
  });

  it("에이전트 생성 버튼이 표시된다", () => {
    renderWithProviders(<AgentsPage />);

    expect(screen.getByText("에이전트 생성")).toBeInTheDocument();
  });

  it("필터 열기/닫기 버튼이 표시된다", () => {
    renderWithProviders(<AgentsPage />);

    expect(screen.getByText("필터 열기")).toBeInTheDocument();
  });

  it("필터 초기화 버튼이 표시된다", () => {
    renderWithProviders(<AgentsPage />);

    expect(screen.getByText("필터 초기화")).toBeInTheDocument();
  });
});
