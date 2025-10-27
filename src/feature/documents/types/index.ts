// 문서 타입 정의
export interface Document {
  id: string;
  title: string;
  content?: string;
  authorId: string;
  authorName: string;
  groupId: string;
  groupName: string;

  // 상태 정보
  isEmbedded: boolean;
  embeddingStatus: "pending" | "processing" | "completed" | "failed";
  tokenUsage: number;

  // 권한
  permissions: DocumentPermissions;

  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
  fileSize?: number;
  fileType?: string;
  tags?: string[];
}

// 권한 타입
export type PermissionLevel = "read" | "write" | "admin";

export interface DocumentPermissions {
  // 전체 공개 여부
  isPublic: boolean;

  // 그룹 권한
  allowedGroups: {
    groupId: string;
    groupName: string;
    level: PermissionLevel;
  }[];

  // 개별 사용자 권한
  allowedUsers: {
    userId: string;
    userName: string;
    level: PermissionLevel;
  }[];

  // 소유자는 항상 admin 권한
  ownerId: string;
}

// 문서 접근 로그
export interface DocumentAccessLog {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  action: "view" | "edit" | "download" | "permission_change";
  timestamp: Date;
  tokenUsed?: number;
}

// 문서 필터
export interface DocumentFilter {
  search?: string;
  groupId?: string;
  authorId?: string;
  embeddingStatus?: Document["embeddingStatus"];
  permissionLevel?: PermissionLevel;
  tags?: string[];
}

// API 응답 타입
export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
}
