import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import RoleAddPage from "./RoleAddPage";

// usePostRole 훅 mock
vi.mock("../_hooks/usePostRole", () => ({
  usePostRole: vi.fn(() => ({
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

describe("RoleAddPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(screen.getByText("새 역할 추가")).toBeInTheDocument();
  });

  it("페이지 설명이 표시된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(
      screen.getByText("새로운 시스템 역할을 생성합니다")
    ).toBeInTheDocument();
  });

  it("역할명 입력 필드가 표시된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(screen.getByLabelText(/역할명/)).toBeInTheDocument();
  });

  it("역할명 입력 필드에 placeholder가 표시된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(
      screen.getByPlaceholderText("예: 관리자, 매니저, 사용자")
    ).toBeInTheDocument();
  });

  it("설명 입력 필드가 표시된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(screen.getByLabelText(/설명/)).toBeInTheDocument();
  });

  it("설명 입력 필드에 placeholder가 표시된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(
      screen.getByPlaceholderText("역할에 대한 설명을 입력하세요")
    ).toBeInTheDocument();
  });

  it("역할 생성 버튼이 표시된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(screen.getByText("역할 생성")).toBeInTheDocument();
  });

  it("기본 정보 카드가 표시된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(screen.getByText("기본 정보")).toBeInTheDocument();
  });

  it("안내 메시지가 표시된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(
      screen.getByText(/표시된 필드는 필수 입력 항목입니다/)
    ).toBeInTheDocument();
  });

  it("역할명 입력 필드는 필수 입력이다", () => {
    renderWithProviders(<RoleAddPage />);

    const roleNameInput = screen.getByLabelText(/역할명/);
    expect(roleNameInput).toBeRequired();
  });

  it("역할명 필드에 최대 길이 제한이 있다", () => {
    renderWithProviders(<RoleAddPage />);

    const roleNameInput = screen.getByLabelText(/역할명/);
    expect(roleNameInput).toHaveAttribute("maxLength", "50");
  });

  it("설명 필드에 최대 길이 제한이 있다", () => {
    renderWithProviders(<RoleAddPage />);

    const descriptionInput = screen.getByLabelText(/설명/);
    expect(descriptionInput).toHaveAttribute("maxLength", "500");
  });

  it("역할명 필드 안내 메시지가 표시된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(
      screen.getByText("역할의 이름을 입력하세요 (최대 50자)")
    ).toBeInTheDocument();
  });

  it("설명 필드 안내 메시지가 표시된다", () => {
    renderWithProviders(<RoleAddPage />);

    expect(
      screen.getByText(
        "역할의 목적과 역할 범위를 설명하세요 (최대 500자, 선택사항)"
      )
    ).toBeInTheDocument();
  });
});
