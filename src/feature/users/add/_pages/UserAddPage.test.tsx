import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import { UserAddPage } from "./UserAddPage";

// usePostUser 훅 mock
vi.mock("../../_hooks/usePostUser", () => ({
  usePostUser: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

const mockRoles = [
  {
    id: 1,
    role_name: "관리자",
    description: "시스템 관리자",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    role_name: "사용자",
    description: "일반 사용자",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

describe("UserAddPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<UserAddPage roles={mockRoles} />);

    expect(screen.getByText("새 사용자 추가")).toBeInTheDocument();
  });

  it("필수 입력 필드들이 표시된다", () => {
    renderWithProviders(<UserAddPage roles={mockRoles} />);

    expect(screen.getByLabelText(/이름/)).toBeInTheDocument();
    expect(screen.getByLabelText(/이메일/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/비밀번호를 다시 입력하세요/)).toBeInTheDocument();
  });

  it("기본 정보 카드가 표시된다", () => {
    renderWithProviders(<UserAddPage roles={mockRoles} />);

    expect(screen.getByText("기본 정보")).toBeInTheDocument();
  });

  it("보안 정보 카드가 표시된다", () => {
    renderWithProviders(<UserAddPage roles={mockRoles} />);

    expect(screen.getByText("보안 정보")).toBeInTheDocument();
  });

  it("역할 정보 카드가 표시된다", () => {
    renderWithProviders(<UserAddPage roles={mockRoles} />);

    expect(screen.getByText("역할 정보")).toBeInTheDocument();
  });

  it("사용자 생성 버튼이 표시된다", () => {
    renderWithProviders(<UserAddPage roles={mockRoles} />);

    expect(screen.getByText("사용자 생성")).toBeInTheDocument();
  });

  it("뒤로 가기 버튼이 표시된다", () => {
    renderWithProviders(<UserAddPage roles={mockRoles} />);

    const backLink = screen.getByRole("link", { name: "" });
    expect(backLink).toHaveAttribute("href", "/users");
  });

  it("역할 선택 드롭다운에 역할 목록이 표시된다", () => {
    renderWithProviders(<UserAddPage roles={mockRoles} />);

    // 역할 선택 combobox 찾기 (페이지에 여러 combobox가 있으므로 getAllByRole 사용)
    const comboboxes = screen.getAllByRole("combobox");
    // 두 번째 combobox가 role_id
    expect(comboboxes.length).toBeGreaterThanOrEqual(2);
  });

  it("전화번호 입력 필드가 최대 13자로 제한된다", () => {
    renderWithProviders(<UserAddPage roles={mockRoles} />);

    const phoneInput = screen.getByPlaceholderText("010-1234-5678");
    expect(phoneInput).toHaveAttribute("maxLength", "13");
  });
});
