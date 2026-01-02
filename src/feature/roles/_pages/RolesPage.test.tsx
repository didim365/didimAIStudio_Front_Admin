import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import RolesPage from "./RolesPage";

// useGetRoles 훅 mock
vi.mock("../_hooks/useGetRoles", () => ({
  useGetRoles: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
}));

// Next.js router mock
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
  })),
}));

// formatDate mock
vi.mock("@/shared/utils/formatDate", () => ({
  formatDate: vi.fn((date: string) => date),
}));

describe("RolesPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<RolesPage />);

    expect(screen.getByText("역할 관리")).toBeInTheDocument();
  });

  it("페이지 설명이 표시된다", () => {
    renderWithProviders(<RolesPage />);

    expect(
      screen.getByText("시스템 역할 및 역할을 관리할 수 있습니다.")
    ).toBeInTheDocument();
  });

  it("역할 생성 버튼이 표시된다", () => {
    renderWithProviders(<RolesPage />);

    expect(screen.getByText("역할 생성")).toBeInTheDocument();
  });

  it("전체 역할 수가 표시된다", () => {
    renderWithProviders(<RolesPage />);

    expect(screen.getByText(/전체 역할/)).toBeInTheDocument();
  });

  it("테이블 헤더가 올바르게 표시된다", () => {
    renderWithProviders(<RolesPage />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("역할명")).toBeInTheDocument();
    expect(screen.getByText("설명")).toBeInTheDocument();
    expect(screen.getByText("생성일")).toBeInTheDocument();
  });
});
