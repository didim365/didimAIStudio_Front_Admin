import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import { UserEditPage } from "./UserEditPage";

// usePatchUser 훅 mock
vi.mock("../../../_hooks/usePatchUser", () => ({
  usePatchUser: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

// Next.js navigation mocks
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
}));

// next-themes mock
vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({
    theme: "light",
    setTheme: vi.fn(),
  })),
}));

// sonner toast mock
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// CodeMirror mock
vi.mock("@uiw/react-codemirror", () => ({
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <textarea
      data-testid="code-mirror"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

vi.mock("@codemirror/lang-json", () => ({
  json: vi.fn(() => ({})),
}));

vi.mock("@codemirror/theme-one-dark", () => ({
  oneDark: {},
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

describe("UserEditPage", () => {
  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    expect(screen.getByText("사용자 정보 수정")).toBeInTheDocument();
  });

  it("사용자 ID가 표시된다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    expect(screen.getByText(`사용자 ID: ${mockUser.id}`)).toBeInTheDocument();
  });

  it("프로필 정보 카드가 표시된다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    expect(screen.getByText("프로필 정보")).toBeInTheDocument();
  });

  it("이름 입력 필드가 기본값으로 채워진다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    const nameInput = screen.getByLabelText(/이름/);
    expect(nameInput).toHaveValue(mockUser.full_name);
  });

  it("이메일 입력 필드가 기본값으로 채워진다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    const emailInput = screen.getByLabelText(/이메일/);
    expect(emailInput).toHaveValue(mockUser.email);
  });

  it("전화번호 입력 필드가 포맷되어 채워진다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    const phoneInput = screen.getByLabelText(/전화번호/);
    expect(phoneInput).toHaveValue("010-1234-5678");
  });

  it("저장 버튼이 표시된다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    expect(screen.getByText("저장")).toBeInTheDocument();
  });

  it("뒤로 가기 버튼이 올바른 링크를 가진다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    const backLink = screen.getByRole("link", { name: "" });
    expect(backLink).toHaveAttribute("href", `/users/${mockUser.id}`);
  });

  it("상태 선택 드롭다운이 표시된다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    const statusSelect = screen.getByRole("combobox");
    expect(statusSelect).toBeInTheDocument();
  });

  it("CodeMirror로 preferences를 편집할 수 있다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    const codeMirror = screen.getByTestId("code-mirror");
    expect(codeMirror).toBeInTheDocument();
    expect(codeMirror).toHaveValue(
      JSON.stringify(mockUser.preferences, null, 2)
    );
  });

  it("전화번호 입력 필드가 최대 13자로 제한된다", () => {
    renderWithProviders(<UserEditPage user={mockUser} />);

    const phoneInput = screen.getByPlaceholderText("010-1234-5678");
    expect(phoneInput).toHaveAttribute("maxLength", "13");
  });

  it("preferences가 null일 때 빈 객체로 초기화된다", () => {
    const userWithoutPreferences = { ...mockUser, preferences: null };
    renderWithProviders(<UserEditPage user={userWithoutPreferences} />);

    const codeMirror = screen.getByTestId("code-mirror");
    expect(codeMirror).toHaveValue("{}");
  });

  it("전화번호가 null일 때 '-'로 초기화된다", () => {
    const userWithoutPhone = { ...mockUser, phone: null };
    renderWithProviders(<UserEditPage user={userWithoutPhone} />);

    const phoneInput = screen.getByLabelText(/전화번호/);
    // formatPhoneNumber(null)은 "-"를 반환
    expect(phoneInput).toHaveValue("-");
  });
});
