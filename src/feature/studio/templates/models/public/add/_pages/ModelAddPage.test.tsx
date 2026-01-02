import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import ModelAddPage from "./ModelAddPage";

// usePostModel 훅 mock
vi.mock("../../../_hooks/usePostModel", () => ({
  usePostModel: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

describe("ModelAddPage (templates - public)", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<ModelAddPage />);

    expect(screen.getByText("새 모델 추가")).toBeInTheDocument();
  });

  it("기본 정보 입력 필드가 표시된다", () => {
    renderWithProviders(<ModelAddPage />);

    expect(screen.getByText("기본 정보")).toBeInTheDocument();
    expect(screen.getByLabelText(/모델 이름/)).toBeInTheDocument();
  });

  it("모델 추가 버튼이 표시된다", () => {
    renderWithProviders(<ModelAddPage />);

    expect(screen.getByText("모델 추가")).toBeInTheDocument();
  });
});
