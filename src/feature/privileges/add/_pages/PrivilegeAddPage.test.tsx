import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import PrivilegeAddPage from "./PrivilegeAddPage";

// usePostPrivilege 훅 mock
vi.mock("../_hooks/usePostPrivilege", () => ({
  usePostPrivilege: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

describe("PrivilegeAddPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(screen.getByText("새 권한 추가")).toBeInTheDocument();
  });

  it("권한 생성 버튼이 표시된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(screen.getByText("권한 생성")).toBeInTheDocument();
  });

  it("권한 정보 카드가 표시된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(screen.getByText("권한 정보")).toBeInTheDocument();
  });

  it("권한명 입력 필드가 표시된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    const input = screen.getByPlaceholderText("예: user.read, role.write");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("리소스 타입 입력 필드가 표시된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    const input = screen.getByPlaceholderText(
      "예: users, roles, groups, privileges"
    );
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("액션 타입 선택 필드가 표시된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(screen.getByText(/액션 타입/)).toBeInTheDocument();
  });

  it("설명 입력 필드가 표시된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    const textarea = screen.getByPlaceholderText(
      "권한에 대한 설명을 입력하세요"
    );
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("");
  });

  it("권한 미리보기 카드가 표시된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(screen.getByText("권한 미리보기")).toBeInTheDocument();
  });

  it("권한 요약이 표시된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(screen.getByText("권한 요약")).toBeInTheDocument();
  });

  it("필수 입력 항목 안내 메시지가 표시된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(
      screen.getByText(/표시된 필드는 필수 입력 항목입니다/)
    ).toBeInTheDocument();
  });

  it("권한명 레이블에 필수 표시가 있다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(screen.getByText("권한명 *")).toBeInTheDocument();
  });

  it("리소스 타입 레이블에 필수 표시가 있다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(screen.getByText("리소스 타입 *")).toBeInTheDocument();
  });

  it("액션 타입 레이블에 필수 표시가 있다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(screen.getByText("액션 타입 *")).toBeInTheDocument();
  });

  it("설명이 입력되지 않았을 때 placeholder가 표시된다", () => {
    renderWithProviders(<PrivilegeAddPage />);

    expect(screen.getByText("설명이 입력되지 않았습니다")).toBeInTheDocument();
  });
});
