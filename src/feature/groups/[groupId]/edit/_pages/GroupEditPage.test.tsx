import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import { GroupEditPage } from "./GroupEditPage";

// Mock 데이터
const mockGroup = {
  id: 1,
  group_name: "개발팀",
  group_type: "TEAM" as const,
  description: "소프트웨어 개발팀",
  parent_group_id: null,
  manager: 1,
  role_id: 1,
  creator: 1,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  member_count: 5,
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

// usePatchGroup 훅 mock
vi.mock("../_hooks/usePatchGroup", () => ({
  usePatchGroup: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

// Mock 데이터를 컴포넌트 외부에 정의하여 안정적으로 유지
const mockGroupsData = {
  items: [],
  total: 0,
  page: 1,
  total_pages: 1,
};

// useGetGroups 훅 mock
vi.mock("../../../_hooks/useGetGroups", () => ({
  useGetGroups: vi.fn(() => ({
    data: mockGroupsData,
    isLoading: false,
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
vi.mock("../../../_components/GroupSelect", () => ({
  default: vi.fn(() => <div data-testid="group-select">Group Select</div>),
}));

// ManagerSelect 컴포넌트 mock
vi.mock("../../../_components/ManagerSelect", () => ({
  default: vi.fn(() => <div data-testid="manager-select">Manager Select</div>),
}));

describe("GroupEditPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("페이지가 정상적으로 렌더링된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    expect(screen.getByText("그룹 정보 수정")).toBeInTheDocument();
  });

  it("그룹 ID가 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    expect(screen.getByText(/그룹 ID: 1/)).toBeInTheDocument();
  });

  it("저장 버튼이 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    expect(screen.getByText("저장")).toBeInTheDocument();
  });

  it("그룹 정보 섹션이 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    expect(screen.getByText("그룹 정보")).toBeInTheDocument();
  });

  it("그룹 ID 입력 필드가 비활성화되어 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    const groupIdInput = screen.getByLabelText(/그룹 ID/);
    expect(groupIdInput).toBeInTheDocument();
    expect(groupIdInput).toBeDisabled();
    expect(groupIdInput).toHaveValue("1");
  });

  it("그룹명 입력 필드가 기본값으로 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    const groupNameInput = screen.getByLabelText(/그룹명/);
    expect(groupNameInput).toBeInTheDocument();
    expect(groupNameInput).toHaveValue("개발팀");
  });

  it("그룹 타입 선택 필드가 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    expect(screen.getByText(/그룹 타입/)).toBeInTheDocument();
  });

  it("역할 선택 필드가 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    expect(screen.getByText(/역할/)).toBeInTheDocument();
  });

  it("설명 입력 필드가 기본값으로 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    const descriptionInput = screen.getByLabelText(/설명/);
    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveValue("소프트웨어 개발팀");
  });

  it("그룹 계층 구조 섹션이 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    expect(screen.getByText("그룹 계층 구조")).toBeInTheDocument();
    expect(screen.getByText("상위 그룹")).toBeInTheDocument();
    expect(screen.getByText("하위 그룹")).toBeInTheDocument();
  });

  it("GroupSelect 컴포넌트가 렌더링된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    const groupSelects = screen.getAllByTestId("group-select");
    expect(groupSelects).toHaveLength(2);
  });

  it("관리자 섹션이 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    const managerSections = screen.getAllByText("관리자");
    expect(managerSections.length).toBeGreaterThan(0);
    expect(screen.getByTestId("manager-select")).toBeInTheDocument();
  });

  it("뒤로가기 버튼이 표시된다", () => {
    renderWithProviders(<GroupEditPage group={mockGroup} roles={mockRoles} />);

    const backButton = screen.getByRole("button", { name: "" });
    expect(backButton).toBeInTheDocument();
  });

  it("null 값이 있는 그룹 데이터도 처리한다", () => {
    const groupWithNulls = {
      ...mockGroup,
      description: null,
      parent_group_id: null,
      manager: null,
      role_id: null,
    };

    renderWithProviders(
      <GroupEditPage group={groupWithNulls} roles={mockRoles} />
    );

    expect(screen.getByText("그룹 정보 수정")).toBeInTheDocument();
  });
});
