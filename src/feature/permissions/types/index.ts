export interface GroupMember {
  id: number;
  name: string;
  email: string;
  globalRole: string;
  groupRole: string;
}

export interface Role {
  id: number;
  name: string;
  displayName: string;
  description: string;
  userCount: number;
  permissions: string[];
}

export interface Group {
  id: number;
  name: string;
  parent_id: number | null;
  children: Group[];
  userCount: number;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface Resource {
  name: string;
  description: string;
}

export interface Passport {
  user_id: number;
  global_roles: string[];
  group_roles: Record<string, string[]>;
  permissions: string[];
  groups: string[];
}

export type GroupMembersMap = Record<number, GroupMember[]>;
