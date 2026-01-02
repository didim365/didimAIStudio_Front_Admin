import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import ModelPage from "./ModelPage";

const mockConfig = {
  user_model_id: 1,
  id: 1,
  model_name: "테스트 모델",
  provider: "OpenAI",
  deployment_type: "public_api",
  user_id: 123,
  is_active: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
  model_id: "gpt-4",
};

describe("ModelPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<ModelPage config={mockConfig} />);

    expect(screen.getByText("모델 상세 정보")).toBeInTheDocument();
  });

  it("기본 정보 카드가 표시된다", () => {
    renderWithProviders(<ModelPage config={mockConfig} />);

    expect(screen.getByText("기본 정보")).toBeInTheDocument();
    expect(screen.getByText("테스트 모델")).toBeInTheDocument();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
  });

  it("모델 상태 배지가 표시된다", () => {
    renderWithProviders(<ModelPage config={mockConfig} />);

    expect(screen.getByText("활성화")).toBeInTheDocument();
  });

  it("배포 타입이 표시된다", () => {
    renderWithProviders(<ModelPage config={mockConfig} />);

    expect(screen.getByText("배포 타입")).toBeInTheDocument();
  });

  it("사용자 ID가 표시된다", () => {
    renderWithProviders(<ModelPage config={mockConfig} />);

    expect(screen.getByText("사용자 ID")).toBeInTheDocument();
  });

  it("생성일과 수정일이 표시된다", () => {
    renderWithProviders(<ModelPage config={mockConfig} />);

    expect(screen.getByText("생성일")).toBeInTheDocument();
    expect(screen.getByText("최근 수정일")).toBeInTheDocument();
  });
});
