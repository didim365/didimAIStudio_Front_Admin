import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import PersonaEditPage from "./PersonaEditPage";

// usePutMyPersona 훅 mock
vi.mock("../../_hooks/usePutMyPersona", () => ({
  usePutMyPersona: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

const mockMyPersona = {
  id: 1,
  user_id: 1,
  persona_data_id: 10,
  user_my_persona_title: "테스트 페르소나",
  user_my_persona_description: "테스트 설명",
  is_favorite: true,
  count_scenario: 5,
  count_agent: 3,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
};

describe("PersonaEditPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<PersonaEditPage myPersona={mockMyPersona} />);

    expect(screen.getByText("페르소나 정보 수정")).toBeInTheDocument();
  });

  it("페르소나 정보 입력 필드가 표시된다", () => {
    renderWithProviders(<PersonaEditPage myPersona={mockMyPersona} />);

    expect(screen.getByText("페르소나 정보")).toBeInTheDocument();
    expect(screen.getByLabelText(/제목/)).toBeInTheDocument();
    expect(screen.getByLabelText(/설명/)).toBeInTheDocument();
    expect(screen.getByLabelText(/카테고리/)).toBeInTheDocument();
    expect(screen.getByLabelText(/공개 설정/)).toBeInTheDocument();
  });

  it("저장 버튼이 표시된다", () => {
    renderWithProviders(<PersonaEditPage myPersona={mockMyPersona} />);

    expect(screen.getByText("저장")).toBeInTheDocument();
  });

  it("기존 데이터가 폼에 채워진다", () => {
    renderWithProviders(<PersonaEditPage myPersona={mockMyPersona} />);

    const titleInput = screen.getByLabelText(/제목/) as HTMLInputElement;
    expect(titleInput.value).toBe("테스트 페르소나");
  });
});
