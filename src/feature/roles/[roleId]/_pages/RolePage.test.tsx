import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import RolePage from "./RolePage";

const mockRole = {
  id: 1,
  role_name: "관리자",
  description: "시스템 관리자 역할",
  created_at: "2024-01-01T00:00:00Z",
};

// useDeleteRole 훅 mock
vi.mock("../_hooks/useDeleteRole", () => ({
  useDeleteRole: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
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

// RolePrivileges 컴포넌트 mock
vi.mock("../_components/RolePrivileges", () => ({
  RolePrivileges: vi.fn(() => <div>RolePrivileges Component</div>),
}));

describe("RolePage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    expect(screen.getByText("역할 상세 정보")).toBeInTheDocument();
  });

  it("역할 ID가 표시된다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    expect(screen.getByText(`역할 ID: ${mockRole.id}`)).toBeInTheDocument();
  });

  it("역할명이 표시된다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    const roleNames = screen.getAllByText(mockRole.role_name);
    expect(roleNames.length).toBeGreaterThan(0);
  });

  it("역할 설명이 표시된다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    expect(screen.getByText(mockRole.description)).toBeInTheDocument();
  });

  it("역할 설명이 없을 때 대체 텍스트가 표시된다", () => {
    const roleWithoutDescription = { ...mockRole, description: null };
    renderWithProviders(<RolePage role={roleWithoutDescription} />);

    expect(screen.getByText("설명이 없습니다")).toBeInTheDocument();
  });

  it("수정 버튼이 표시된다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    expect(screen.getByText("수정")).toBeInTheDocument();
  });

  it("제거 버튼이 표시된다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    expect(screen.getByText("제거")).toBeInTheDocument();
  });

  it("역할 정보 카드가 표시된다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    expect(screen.getByText("역할 정보")).toBeInTheDocument();
  });

  it("활동 정보 카드가 표시된다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    expect(screen.getByText("활동 정보")).toBeInTheDocument();
  });

  it("추가 정보 카드가 표시된다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    expect(screen.getByText("추가 정보")).toBeInTheDocument();
  });

  it("RolePrivileges 컴포넌트가 렌더링된다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    expect(screen.getByText("RolePrivileges Component")).toBeInTheDocument();
  });

  it("삭제 확인 다이얼로그가 초기에는 표시되지 않는다", () => {
    renderWithProviders(<RolePage role={mockRole} />);

    expect(screen.queryByText("역할 삭제 확인")).not.toBeInTheDocument();
  });
});
