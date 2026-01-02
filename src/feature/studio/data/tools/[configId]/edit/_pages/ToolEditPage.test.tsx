import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import ToolEditPage from "./ToolEditPage";

// usePutUserConfig 훅 mock
vi.mock("../_hooks/usePutUserConfig", () => ({
  usePutUserConfig: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

// useTheme 훅 mock
vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({
    theme: "light",
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

describe("ToolEditPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<ToolEditPage config={mockConfig} />);

    expect(screen.getByText("도구 설정 수정")).toBeInTheDocument();
  });

  it("기본 정보 입력 필드가 표시된다", () => {
    renderWithProviders(<ToolEditPage config={mockConfig} />);

    expect(screen.getByText("기본 정보")).toBeInTheDocument();
    expect(screen.getByLabelText(/설정 이름/)).toBeInTheDocument();
    expect(screen.getByLabelText(/활성 상태/)).toBeInTheDocument();
  });

  it("서버 설정 입력 필드가 표시된다", () => {
    renderWithProviders(<ToolEditPage config={mockConfig} />);

    expect(screen.getByText("서버 설정")).toBeInTheDocument();
  });

  it("민감정보 입력 필드가 표시된다", () => {
    renderWithProviders(<ToolEditPage config={mockConfig} />);

    expect(screen.getByText("민감정보 (Secrets)")).toBeInTheDocument();
  });

  it("저장 버튼이 표시된다", () => {
    renderWithProviders(<ToolEditPage config={mockConfig} />);

    expect(screen.getByText("저장")).toBeInTheDocument();
  });

  it("기존 데이터가 폼에 채워진다", () => {
    renderWithProviders(<ToolEditPage config={mockConfig} />);

    const configNameInput = screen.getByLabelText(/설정 이름/) as HTMLInputElement;
    expect(configNameInput.value).toBe("테스트 설정");
  });
});
