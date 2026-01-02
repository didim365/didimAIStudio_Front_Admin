import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import PrivilegesPage from "./PrivilegesPage";

// useGetPrivileges 훅 mock
vi.mock("../_hooks/useGetPrivileges", () => ({
  useGetPrivileges: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
}));

describe("PrivilegesPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<PrivilegesPage />);

    expect(screen.getByText("권한 관리")).toBeInTheDocument();
  });

  it("권한 생성 버튼이 표시된다", () => {
    renderWithProviders(<PrivilegesPage />);

    expect(screen.getByText("권한 생성")).toBeInTheDocument();
  });

  it("전체 권한 텍스트가 표시된다", () => {
    renderWithProviders(<PrivilegesPage />);

    expect(screen.getByText(/전체 권한/)).toBeInTheDocument();
  });

  it("테이블 헤더가 표시된다", () => {
    renderWithProviders(<PrivilegesPage />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("권한명")).toBeInTheDocument();
    expect(screen.getByText("설명")).toBeInTheDocument();
    expect(screen.getByText("리소스 타입")).toBeInTheDocument();
    expect(screen.getByText("액션 타입")).toBeInTheDocument();
  });
});
