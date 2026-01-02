import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import { UserPage } from "./UserPage";

// @uiw/react-json-view mock
vi.mock("@uiw/react-json-view", () => ({
  default: ({ value }: { value: unknown }) => (
    <div data-testid="json-view">{JSON.stringify(value)}</div>
  ),
}));

const mockUser = {
  id: 1,
  email: "test@example.com",
  full_name: "홍길동",
  phone: "01012345678",
  status: "ACTIVE" as const,
  profile_image_url: null,
  preferences: { theme: "dark", language: "ko" },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
  last_login: "2024-01-03T00:00:00Z",
  role_id: null,
};

describe("UserPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    expect(screen.getByText("사용자 상세 정보")).toBeInTheDocument();
  });

  it("사용자 ID가 표시된다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    expect(screen.getByText(`사용자 ID: ${mockUser.id}`)).toBeInTheDocument();
  });

  it("사용자 이름이 표시된다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    expect(screen.getByText(mockUser.full_name)).toBeInTheDocument();
  });

  it("사용자 이메일이 표시된다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it("수정 버튼이 표시된다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    expect(screen.getByText("수정")).toBeInTheDocument();
  });

  it("제거 버튼이 표시된다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    expect(screen.getByText("제거")).toBeInTheDocument();
  });

  it("뒤로 가기 버튼이 표시된다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    const backLink = screen.getByRole("link", { name: "" });
    expect(backLink).toHaveAttribute("href", "/users");
  });

  it("수정 버튼이 올바른 링크를 가진다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    const editLink = screen.getByRole("link", { name: /수정/ });
    expect(editLink).toHaveAttribute("href", `/users/${mockUser.id}/edit`);
  });

  it("프로필 정보 카드가 표시된다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    expect(screen.getByText("프로필 정보")).toBeInTheDocument();
  });

  it("사용자 전화번호가 포맷되어 표시된다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    // formatPhoneNumber가 010-1234-5678 형식으로 변환
    expect(screen.getByText("010-1234-5678")).toBeInTheDocument();
  });

  it("사용자 preferences가 표시된다", () => {
    renderWithProviders(<UserPage user={mockUser} />);

    const jsonView = screen.getByTestId("json-view");
    expect(jsonView).toBeInTheDocument();
    expect(jsonView).toHaveTextContent("theme");
  });

  it("full_name이 없을 때 '정보 없음'이 표시된다", () => {
    const userWithoutName = { ...mockUser, full_name: null };
    renderWithProviders(<UserPage user={userWithoutName} />);

    expect(screen.getByText("정보 없음")).toBeInTheDocument();
  });

  it("전화번호가 없을 때 '-'가 표시된다", () => {
    const userWithoutPhone = { ...mockUser, phone: null };
    renderWithProviders(<UserPage user={userWithoutPhone} />);

    // phone이 null일 때 formatPhoneNumber는 "-" 반환
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("preferences가 없을 때 '없음'이 표시된다", () => {
    const userWithoutPreferences = { ...mockUser, preferences: null };
    renderWithProviders(<UserPage user={userWithoutPreferences} />);

    expect(screen.getByText("없음")).toBeInTheDocument();
  });
});
