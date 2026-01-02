import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import ModelsPage from "./ModelsPage";

// useGetSettings 훅 mock
vi.mock("../_hooks/useGetSettings", () => ({
  default: vi.fn(() => ({
    data: [],
    isLoading: false,
    refetch: vi.fn(),
    error: null,
  })),
}));

// useQueryParam 훅 mock
vi.mock("@/shared/hooks/useQueryParams", () => ({
  useQueryParam: vi.fn((_key: string, defaultValue: any) => {
    return [defaultValue, vi.fn()];
  }),
}));

describe("ModelsPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<ModelsPage />);

    expect(screen.getByText("모델 데이터 관리")).toBeInTheDocument();
  });

  it("배포 타입 선택 필드가 표시된다", () => {
    renderWithProviders(<ModelsPage />);

    expect(screen.getByText("전체 배포 타입")).toBeInTheDocument();
  });

  it("사용자 ID 필터 입력창이 표시된다", () => {
    renderWithProviders(<ModelsPage />);

    const searchInput = screen.getByPlaceholderText("사용자 ID 필터...");
    expect(searchInput).toBeInTheDocument();
  });

  it("새로고침 버튼이 표시된다", () => {
    renderWithProviders(<ModelsPage />);

    expect(screen.getByText("새로고침")).toBeInTheDocument();
  });

  it("설정 목록 테이블이 표시된다", () => {
    renderWithProviders(<ModelsPage />);

    expect(screen.getByText(/설정 목록/)).toBeInTheDocument();
  });
});
