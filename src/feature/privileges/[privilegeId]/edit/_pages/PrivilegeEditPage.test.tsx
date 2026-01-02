import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import PrivilegeEditPage from "./PrivilegeEditPage";
import { GetPrivilegeResponse } from "../../_api/getPrivilege";

// usePutPrivilege 훅 mock
vi.mock("../_hooks/usePutPrivilege", () => ({
  usePutPrivilege: vi.fn(() => ({
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

describe("PrivilegeEditPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    expect(screen.getByText("권한 정보 수정")).toBeInTheDocument();
  });

  it("권한 ID가 표시된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    expect(screen.getByText(/권한 ID: 1/)).toBeInTheDocument();
  });

  it("저장 버튼이 표시된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    expect(screen.getByText("저장")).toBeInTheDocument();
  });

  it("권한 정보 카드가 표시된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    expect(screen.getByText("권한 정보")).toBeInTheDocument();
  });

  it("권한명 입력 필드가 표시된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    const input = screen.getByLabelText(/권한명/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("user.read");
  });

  it("리소스 타입 입력 필드가 표시된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    const input = screen.getByLabelText(/리소스 타입/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("users");
  });

  it("액션 타입 선택 필드가 표시된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    const actionTypeTexts = screen.getAllByText(/액션 타입/);
    expect(actionTypeTexts.length).toBeGreaterThan(0);
  });

  it("설명 입력 필드가 표시된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    const textarea = screen.getByLabelText(/설명/);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("사용자 조회 권한");
  });

  it("리소스 정보 카드가 표시된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    expect(screen.getByText("리소스 정보")).toBeInTheDocument();
  });

  it("추가 정보 카드가 표시된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    expect(screen.getByText("추가 정보")).toBeInTheDocument();
  });

  it("현재 권한 요약이 표시된다", () => {
    renderWithProviders(<PrivilegeEditPage privilege={mockPrivilege} />);

    expect(screen.getByText("현재 권한 요약")).toBeInTheDocument();
  });

  it("description이 null일 때 빈 문자열로 표시된다", () => {
    const privilegeWithoutDescription: GetPrivilegeResponse = {
      ...mockPrivilege,
      description: null,
    };

    renderWithProviders(
      <PrivilegeEditPage privilege={privilegeWithoutDescription} />
    );

    const textarea = screen.getByLabelText(/설명/);
    expect(textarea).toHaveValue("");
  });
});
