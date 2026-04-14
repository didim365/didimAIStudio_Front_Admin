import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import { AgentAddPage } from "./AgentAddPage";

// usePostAgent 훅 mock
vi.mock("../../_hooks/usePostAgent", () => ({
  usePostAgent: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

// useGetMyInfo 훅 mock
vi.mock("@/shared/hooks/useGetMyInfo", () => ({
  useGetMyInfo: vi.fn(() => ({
    data: {
      id: 1,
      username: "testuser",
    },
  })),
}));

import { GetSettingsResponse } from "@/feature/studio/data/models/_api/getSettings";
import { GetMyPersonasResponse } from "@/feature/studio/data/personas/_api/getMyPersonas";

const mockSettings = [] as unknown as GetSettingsResponse;
const mockPersonas = { items: [], total: 0, page: 1, size: 10, total_pages: 1 } as unknown as GetMyPersonasResponse;

describe("AgentAddPage (templates)", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(
      <AgentAddPage settings={mockSettings} personas={mockPersonas} />
    );

    expect(screen.getByText("새 에이전트 추가")).toBeInTheDocument();
  });

  it("기본 정보 입력 필드가 표시된다", () => {
    renderWithProviders(
      <AgentAddPage settings={mockSettings} personas={mockPersonas} />
    );

    expect(screen.getByText("기본 정보")).toBeInTheDocument();
    expect(screen.getByLabelText(/에이전트 이름/)).toBeInTheDocument();
    expect(screen.getByLabelText(/설명/)).toBeInTheDocument();
  });

  it("에이전트 생성 버튼이 표시된다", () => {
    renderWithProviders(
      <AgentAddPage settings={mockSettings} personas={mockPersonas} />
    );

    expect(screen.getByText("에이전트 생성")).toBeInTheDocument();
  });
});
