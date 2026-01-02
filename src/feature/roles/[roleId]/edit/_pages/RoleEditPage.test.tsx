import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import { RoleEditPage } from "./RoleEditPage";

const mockRole = {
  id: 1,
  role_name: "관리자",
  description: "시스템 관리자 역할",
  created_at: "2024-01-01T00:00:00Z",
};

// usePutRole 훅 mock
vi.mock("../_hooks/usePutRole", () => ({
  usePutRole: vi.fn(() => ({
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

describe("RoleEditPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    expect(screen.getByText("역할 정보 수정")).toBeInTheDocument();
  });

  it("역할 ID가 표시된다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    expect(screen.getByText(`역할 ID: ${mockRole.id}`)).toBeInTheDocument();
  });

  it("역할명 입력 필드가 기본값으로 채워진다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    const roleNameInput = screen.getByLabelText(/역할명/);
    expect(roleNameInput).toHaveValue(mockRole.role_name);
  });

  it("설명 입력 필드가 기본값으로 채워진다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    const descriptionInput = screen.getByLabelText(/설명/);
    expect(descriptionInput).toHaveValue(mockRole.description);
  });

  it("역할명 입력 필드에 placeholder가 표시된다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    expect(
      screen.getByPlaceholderText("역할명을 입력하세요")
    ).toBeInTheDocument();
  });

  it("설명 입력 필드에 placeholder가 표시된다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    expect(
      screen.getByPlaceholderText("역할에 대한 설명을 입력하세요")
    ).toBeInTheDocument();
  });

  it("저장 버튼이 표시된다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    expect(screen.getByText("저장")).toBeInTheDocument();
  });

  it("역할 정보 카드가 표시된다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    expect(screen.getByText("역할 정보")).toBeInTheDocument();
  });

  it("활동 정보 카드가 표시된다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    expect(screen.getByText("활동 정보")).toBeInTheDocument();
  });

  it("추가 정보 카드가 표시된다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    expect(screen.getByText("추가 정보")).toBeInTheDocument();
  });

  it("역할명 입력 필드는 필수 입력이다", () => {
    renderWithProviders(<RoleEditPage role={mockRole} />);

    const roleNameInput = screen.getByLabelText(/역할명/);
    expect(roleNameInput).toBeRequired();
  });

  it("설명이 없는 역할의 경우 빈 값으로 초기화된다", () => {
    const roleWithoutDescription = { ...mockRole, description: null };
    renderWithProviders(<RoleEditPage role={roleWithoutDescription} />);

    const descriptionInput = screen.getByLabelText(/설명/);
    expect(descriptionInput).toHaveValue("");
  });
});
