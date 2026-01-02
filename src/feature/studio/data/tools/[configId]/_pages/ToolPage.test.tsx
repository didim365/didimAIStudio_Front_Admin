import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import ToolPage from "./ToolPage";

// useDeleteUserConfig 훅 mock
vi.mock("../_hooks/useDeleteUserConfig", () => ({
  useDeleteUserConfig: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

const mockConfig = {
  config_id: 1,
  user_id: "user123",
  tool_id: 10,
  tool_name: "테스트 도구",
  config_name: "테스트 설정",
  container_status: "running",
  is_active: true,
  has_secrets: true,
  config_schema_version: "1.0.0",
  server_config: { host: "localhost", port: 8080 },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
};

describe("ToolPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<ToolPage config={mockConfig} />);

    expect(screen.getByText("도구 설정 상세 정보")).toBeInTheDocument();
  });

  it("기본 정보 카드가 표시된다", () => {
    renderWithProviders(<ToolPage config={mockConfig} />);

    expect(screen.getByText("기본 정보")).toBeInTheDocument();
    expect(screen.getByText("테스트 설정")).toBeInTheDocument();
    expect(screen.getByText("테스트 도구")).toBeInTheDocument();
  });

  it("컨테이너 정보 카드가 표시된다", () => {
    renderWithProviders(<ToolPage config={mockConfig} />);

    expect(screen.getByText("컨테이너 정보")).toBeInTheDocument();
  });

  it("서버 설정 카드가 표시된다", () => {
    renderWithProviders(<ToolPage config={mockConfig} />);

    expect(screen.getByText("서버 설정")).toBeInTheDocument();
  });

  it("수정 버튼이 표시된다", () => {
    renderWithProviders(<ToolPage config={mockConfig} />);

    expect(screen.getByText("수정")).toBeInTheDocument();
  });

  it("제거 버튼이 표시된다", () => {
    renderWithProviders(<ToolPage config={mockConfig} />);

    expect(screen.getByText("제거")).toBeInTheDocument();
  });
});
