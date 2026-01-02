import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import PersonaAddPage from "./PersonaAddPage";

// usePostPersona 훅 mock
vi.mock("../_hooks/usePostPersona", () => ({
  usePostPersona: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

// useGetPersonas 훅 mock
vi.mock("@/feature/studio/templates/personas/_hooks/useGetPersonas", () => ({
  useGetPersonas: vi.fn(() => ({
    data: {
      items: [],
      total: 0,
      page: 1,
      total_pages: 1,
    },
    isLoading: false,
  })),
}));

const mockMyInfo = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
};

describe("PersonaAddPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<PersonaAddPage myInfo={mockMyInfo} />);

    expect(screen.getByText("마이페이지에 페르소나 추가")).toBeInTheDocument();
  });

  it("페르소나 선택 필드가 표시된다", () => {
    renderWithProviders(<PersonaAddPage myInfo={mockMyInfo} />);

    expect(screen.getByText("페르소나 선택")).toBeInTheDocument();
    expect(screen.getByLabelText(/페르소나/)).toBeInTheDocument();
  });

  it("개인 설정 입력 필드가 표시된다", () => {
    renderWithProviders(<PersonaAddPage myInfo={mockMyInfo} />);

    expect(screen.getByText("개인 설정")).toBeInTheDocument();
    expect(screen.getByLabelText(/개인 제목/)).toBeInTheDocument();
    expect(screen.getByLabelText(/개인 메모/)).toBeInTheDocument();
  });

  it("즐겨찾기 스위치가 표시된다", () => {
    renderWithProviders(<PersonaAddPage myInfo={mockMyInfo} />);

    expect(screen.getByText("즐겨찾기")).toBeInTheDocument();
  });

  it("페르소나 추가 버튼이 표시된다", () => {
    renderWithProviders(<PersonaAddPage myInfo={mockMyInfo} />);

    expect(screen.getByText("페르소나 추가")).toBeInTheDocument();
  });
});
