import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import { PersonaAddPage } from "./PersonaAddPage";

// usePostPersona 훅 mock
vi.mock("../../_hooks/usePostPersona", () => ({
  usePostPersona: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

const mockMyInfo = {
  id: 1,
  email: "test@example.com",
  full_name: "testuser",
  created_at: "2024-01-01T00:00:00Z",
  status: "ACTIVE",
  roles: {
    group_roles: [],
    in_group_roles: [],
    total_roles: [],
  },
  groups: {
    groups: [],
  },
};

describe("PersonaAddPage (templates)", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<PersonaAddPage myInfo={mockMyInfo} />);

    expect(screen.getByText("새 페르소나 추가")).toBeInTheDocument();
  });

  it("기본 정보 입력 필드가 표시된다", () => {
    renderWithProviders(<PersonaAddPage myInfo={mockMyInfo} />);

    expect(screen.getByText("기본 정보")).toBeInTheDocument();
    expect(screen.getByLabelText(/페르소나 이름/)).toBeInTheDocument();
  });

  it("페르소나 추가 버튼이 표시된다", () => {
    renderWithProviders(<PersonaAddPage myInfo={mockMyInfo} />);

    expect(screen.getByText("페르소나 생성")).toBeInTheDocument();
  });
});
