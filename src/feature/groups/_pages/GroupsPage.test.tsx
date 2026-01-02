import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import { GroupsPage } from "./GroupsPage";

// useGetGroups 훅 mock
vi.mock("../_hooks/useGetGroups", () => ({
  useGetGroups: vi.fn(() => ({
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

describe("GroupsPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<GroupsPage />);

    expect(screen.getByText("그룹 관리")).toBeInTheDocument();
  });

  it("그룹 생성 버튼이 표시된다", () => {
    renderWithProviders(<GroupsPage />);

    expect(screen.getByText("그룹 생성")).toBeInTheDocument();
  });

  it("전체 그룹 수가 표시된다", () => {
    renderWithProviders(<GroupsPage />);

    expect(screen.getByText(/전체 그룹/)).toBeInTheDocument();
  });

  it("테이블 헤더가 올바르게 표시된다", () => {
    renderWithProviders(<GroupsPage />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("그룹명")).toBeInTheDocument();
    expect(screen.getByText("설명")).toBeInTheDocument();
    expect(screen.getByText("그룹 타입")).toBeInTheDocument();
    expect(screen.getByText("상위 그룹")).toBeInTheDocument();
    expect(screen.getByText("관리자")).toBeInTheDocument();
    expect(screen.getByText("생성자")).toBeInTheDocument();
    expect(screen.getByText("역할")).toBeInTheDocument();
    expect(screen.getByText("회원 수")).toBeInTheDocument();
    expect(screen.getByText("생성일")).toBeInTheDocument();
    expect(screen.getByText("수정일")).toBeInTheDocument();
  });
});
