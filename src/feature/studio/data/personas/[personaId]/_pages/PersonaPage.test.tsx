import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import PersonaPage from "./PersonaPage";

// useDeletePersona 훅 mock
vi.mock("../_hooks/useDeletePersona", () => ({
  default: vi.fn(() => ({
    mutate: vi.fn(),
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

describe("PersonaPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<PersonaPage myPersona={mockMyPersona} />);

    expect(screen.getByText("페르소나 상세 정보")).toBeInTheDocument();
  });

  it("페르소나 정보 카드가 표시된다", () => {
    renderWithProviders(<PersonaPage myPersona={mockMyPersona} />);

    expect(screen.getByText("페르소나 정보")).toBeInTheDocument();
    expect(screen.getByText("테스트 페르소나")).toBeInTheDocument();
    expect(screen.getByText("테스트 설명")).toBeInTheDocument();
  });

  it("연결 정보 카드가 표시된다", () => {
    renderWithProviders(<PersonaPage myPersona={mockMyPersona} />);

    expect(screen.getByText("연결 정보")).toBeInTheDocument();
    expect(screen.getByText("연결된 시나리오")).toBeInTheDocument();
    expect(screen.getByText("연결된 에이전트")).toBeInTheDocument();
  });

  it("활동 정보 카드가 표시된다", () => {
    renderWithProviders(<PersonaPage myPersona={mockMyPersona} />);

    expect(screen.getByText("활동 정보")).toBeInTheDocument();
    expect(screen.getByText("생성일")).toBeInTheDocument();
    expect(screen.getByText("마지막 업데이트")).toBeInTheDocument();
  });

  it("추가 정보 카드가 표시된다", () => {
    renderWithProviders(<PersonaPage myPersona={mockMyPersona} />);

    expect(screen.getByText("추가 정보")).toBeInTheDocument();
    expect(screen.getByText("사용자 ID")).toBeInTheDocument();
  });

  it("수정 버튼이 표시된다", () => {
    renderWithProviders(<PersonaPage myPersona={mockMyPersona} />);

    expect(screen.getByText("수정")).toBeInTheDocument();
  });

  it("제거 버튼이 표시된다", () => {
    renderWithProviders(<PersonaPage myPersona={mockMyPersona} />);

    expect(screen.getByText("제거")).toBeInTheDocument();
  });
});
