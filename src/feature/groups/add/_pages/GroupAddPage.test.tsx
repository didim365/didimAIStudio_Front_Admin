import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test/unit/test-utils";
import GroupAddPage from "./GroupAddPage";

// Mock 데이터
const mockMyInfo = {
  id: 1,
  email: "test@example.com",
  full_name: "테스트 사용자",
  status: "ACTIVE" as const,
  roles: {
    group_roles: [],
    in_group_roles: [],
    total_roles: [],
  },
  groups: {
    groups: [],
  },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const mockRoles = [
  {
    id: 1,
    role_name: "관리자",
    description: "시스템 관리자 역할",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    role_name: "사용자",
    description: "일반 사용자 역할",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// usePostGroups 훅 mock
vi.mock("../_hooks/usePostGroups", () => ({
  usePostGroups: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

// useQueryClient mock
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
    })),
  };
});

// GroupSelect 컴포넌트 mock
vi.mock("../../_components/GroupSelect", () => ({
  default: vi.fn(() => <div data-testid="group-select">Group Select</div>),
}));

// ManagerSelect 컴포넌트 mock
vi.mock("../../_components/ManagerSelect", () => ({
  default: vi.fn(() => <div data-testid="manager-select">Manager Select</div>),
}));

describe("GroupAddPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    expect(screen.getByText("새 그룹 추가")).toBeInTheDocument();
  });

  it("그룹 생성 버튼이 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    expect(screen.getByText("그룹 생성")).toBeInTheDocument();
  });

  it("기본 정보 섹션이 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    expect(screen.getByText("기본 정보")).toBeInTheDocument();
  });

  it("그룹명 입력 필드가 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    expect(screen.getByLabelText(/그룹명/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("예: 개발팀")).toBeInTheDocument();
  });

  it("그룹 타입 선택 필드가 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    expect(screen.getByText(/그룹 타입/)).toBeInTheDocument();
  });

  it("생성자 정보가 자동으로 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    const creatorInput = screen.getByLabelText(/생성자/);
    expect(creatorInput).toBeInTheDocument();
    expect(creatorInput).toHaveValue("테스트 사용자");
    expect(creatorInput).toBeDisabled();
  });

  it("역할 선택 필드가 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    const roleLabel = screen.getByLabelText(/역할 \*/);
    expect(roleLabel).toBeInTheDocument();
  });

  it("설명 입력 필드가 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    expect(screen.getByLabelText(/설명/)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("그룹에 대한 설명을 입력하세요")
    ).toBeInTheDocument();
  });

  it("그룹 계층 구조 섹션이 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    expect(screen.getByText("그룹 계층 구조")).toBeInTheDocument();
    expect(screen.getByText("상위 그룹")).toBeInTheDocument();
    expect(screen.getByText("하위 그룹")).toBeInTheDocument();
  });

  it("GroupSelect 컴포넌트가 렌더링된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    const groupSelects = screen.getAllByTestId("group-select");
    expect(groupSelects).toHaveLength(2);
  });

  it("관리자 섹션이 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    expect(screen.getByText("관리자")).toBeInTheDocument();
    expect(screen.getByTestId("manager-select")).toBeInTheDocument();
  });

  it("필수 입력 항목 안내 메시지가 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    expect(
      screen.getByText(/표시된 필드는 필수 입력 항목입니다/)
    ).toBeInTheDocument();
  });

  it("뒤로가기 버튼이 표시된다", () => {
    renderWithProviders(
      <GroupAddPage myInfo={mockMyInfo} roles={mockRoles} />
    );

    const backButton = screen.getByRole("button", { name: "" });
    expect(backButton).toBeInTheDocument();
  });
});
