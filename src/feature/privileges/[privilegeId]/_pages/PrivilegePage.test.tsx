import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import PrivilegePage from "./PrivilegePage";
import { GetPrivilegeResponse } from "../_api/getPrivilege";

// useDeletePrivilege 훅 mock
vi.mock("../_hooks/useDeletePrivilege", () => ({
  useDeletePrivilege: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

const mockPrivilege: GetPrivilegeResponse = {
  id: 1,
  privilege_name: "user.read",
  description: "사용자 조회 권한",
  resource_type: "users",
  action_type: "READ",
};

describe("PrivilegePage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText("권한 상세 정보")).toBeInTheDocument();
  });

  it("권한 ID가 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText(/권한 ID: 1/)).toBeInTheDocument();
  });

  it("수정 버튼이 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText("수정")).toBeInTheDocument();
  });

  it("제거 버튼이 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText("제거")).toBeInTheDocument();
  });

  it("권한 정보 카드가 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText("권한 정보")).toBeInTheDocument();
  });

  it("권한명이 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText("user.read")).toBeInTheDocument();
  });

  it("설명이 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText("사용자 조회 권한")).toBeInTheDocument();
  });

  it("리소스 타입이 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    const usersTexts = screen.getAllByText("users");
    expect(usersTexts.length).toBeGreaterThan(0);
  });

  it("상세 정보 카드가 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText("상세 정보")).toBeInTheDocument();
  });

  it("권한 요약이 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText("권한 요약")).toBeInTheDocument();
  });

  it("리소스 정보가 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText("리소스 정보")).toBeInTheDocument();
  });

  it("액션 정보가 표시된다", () => {
    renderWithProviders(<PrivilegePage privilege={mockPrivilege} />);

    expect(screen.getByText("액션 정보")).toBeInTheDocument();
  });
});
