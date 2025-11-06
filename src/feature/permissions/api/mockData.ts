import { GroupMembersMap, Role, Group, Permission, Resource } from "../types";

// 임시 회원 데이터
export const groupMembers: GroupMembersMap = {
  1: [
    // 디딤365
    {
      id: 1,
      name: "김지현",
      email: "jihyun.kim@didim365.com",
      globalRole: "관리자",
      groupRole: "관리자",
    },
    {
      id: 2,
      name: "박근형",
      email: "geunhyung.park@didim365.com",
      globalRole: "매니저",
      groupRole: "매니저",
    },
  ],
  2: [
    // 클라우드부문
    {
      id: 3,
      name: "이수진",
      email: "sujin.lee@didim365.com",
      globalRole: "사용자",
      groupRole: "사용자",
    },
    {
      id: 4,
      name: "최민수",
      email: "minsu.choi@didim365.com",
      globalRole: "사용자",
      groupRole: "매니저",
    },
  ],
  3: [
    // R&D그룹
    {
      id: 5,
      name: "정다은",
      email: "daeun.jung@didim365.com",
      globalRole: "사용자",
      groupRole: "매니저",
    },
    {
      id: 6,
      name: "강호준",
      email: "hojun.kang@didim365.com",
      globalRole: "사용자",
      groupRole: "사용자",
    },
    {
      id: 7,
      name: "윤서아",
      email: "seoa.yoon@didim365.com",
      globalRole: "사용자",
      groupRole: "사용자",
    },
  ],
  4: [
    // 경영기획부문
    {
      id: 8,
      name: "한지우",
      email: "jiwoo.han@didim365.com",
      globalRole: "매니저",
      groupRole: "관리자",
    },
  ],
  5: [
    // HR팀
    {
      id: 9,
      name: "오준서",
      email: "junseo.oh@didim365.com",
      globalRole: "사용자",
      groupRole: "사용자",
    },
    {
      id: 10,
      name: "장서연",
      email: "seoyeon.jang@didim365.com",
      globalRole: "사용자",
      groupRole: "사용자",
    },
  ],
};

// 임시 역할 데이터
export const roles: Role[] = [
  {
    id: 1,
    name: "ADMIN",
    displayName: "관리자",
    description: "모든 기능과 리소스에 접근 가능",
    userCount: 5,
    permissions: ["READ", "WRITE", "DELETE", "MANAGE_USERS", "MANAGE_ROLES"],
  },
  {
    id: 2,
    name: "MANAGER",
    displayName: "매니저",
    description: "에이전트 관리 역할",
    userCount: 15,
    permissions: ["READ", "WRITE", "DELETE"],
  },
  {
    id: 3,
    name: "USER",
    displayName: "사용자",
    description: "기본 읽기 역할",
    userCount: 635,
    permissions: ["READ"],
  },
];

// 임시 그룹 데이터
export const groups: Group[] = [
  {
    id: 1,
    name: "디딤365",
    parent_id: null,
    children: [
      {
        id: 2,
        name: "클라우드부문",
        parent_id: 1,
        children: [
          { id: 3, name: "R&D그룹", parent_id: 2, children: [], userCount: 45 },
        ],
        userCount: 45,
      },
      {
        id: 4,
        name: "경영기획부문",
        parent_id: 1,
        children: [
          { id: 5, name: "HR팀", parent_id: 4, children: [], userCount: 12 },
        ],
        userCount: 12,
      },
    ],
    userCount: 57,
  },
];

// 임시 역할 데이터
export const permissions: Permission[] = [
  { id: 1, name: "READ", description: "리소스 읽기" },
  { id: 2, name: "WRITE", description: "리소스 생성/수정" },
  { id: 3, name: "DELETE", description: "리소스 삭제" },
  { id: 4, name: "MANAGE_USERS", description: "사용자 관리" },
  { id: 5, name: "MANAGE_ROLES", description: "역할 관리" },
  { id: 6, name: "VIEW_LOGS", description: "로그 조회" },
  { id: 7, name: "MANAGE_AGENTS", description: "에이전트 관리" },
  { id: 8, name: "MANAGE_MODELS", description: "모델 관리" },
];

// 임시 리소스 데이터
export const resources: Resource[] = [
  { name: "/v1/agents", description: "에이전트 API" },
  { name: "/v1/models", description: "모델 API" },
  { name: "/v1/users", description: "사용자 API" },
  { name: "/v1/indexing", description: "인덱싱 API" },
];
