import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import UsersPage from "./UsersPage";

// useGetUsers 훅 mock
vi.mock("../_hooks/useGetUsers", () => ({
  useGetUsers: vi.fn(() => ({
    data: {
      items: [],
      total: 0,
      page: 1,
      pages: 1,
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

describe("UsersPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<UsersPage />);

    expect(screen.getByText("회원 관리")).toBeInTheDocument();
  });

  it("검색 입력창이 표시된다", () => {
    renderWithProviders(<UsersPage />);

    const searchInput = screen.getByPlaceholderText("이메일 또는 이름으로 검색");
    expect(searchInput).toBeInTheDocument();
  });

  it("회원 추가 버튼이 표시된다", () => {
    renderWithProviders(<UsersPage />);

    expect(screen.getByText("회원 추가")).toBeInTheDocument();
  });

  it("전체 회원 수가 표시된다", () => {
    renderWithProviders(<UsersPage />);

    expect(screen.getByText(/전체 회원/)).toBeInTheDocument();
  });
});
