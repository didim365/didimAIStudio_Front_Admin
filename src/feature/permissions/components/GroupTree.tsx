"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Users,
  FolderTree,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Group, GroupMembersMap, GroupMember } from "../types";

interface GroupTreeProps {
  group: Group;
  level?: number;
  isDarkMode?: boolean;
  groupMembers?: GroupMembersMap;
}

export function GroupTree({
  group,
  level = 0,
  isDarkMode = false,
  groupMembers,
}: GroupTreeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);

  const getGroupMembers = (groupId: number): GroupMember[] => {
    return groupMembers?.[groupId] || [];
  };

  const membersCount = getGroupMembers(group.id).length;

  return (
    <div>
      {/* 그룹 헤더 */}
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg ${
          level > 0 ? "ml-6" : ""
        }`}
        style={{
          backgroundColor: undefined,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode
            ? "#1a1a1a"
            : "#f8fafc";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
          <FolderTree className="h-4 w-4 text-blue-600" />
          <span
            className="font-medium"
            style={{ color: isDarkMode ? "#ffffff" : undefined }}
          >
            {group.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{group.userCount}명</Badge>
          {membersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs px-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsMembersDialogOpen(true);
              }}
            >
              <Users className="h-3 w-3 mr-1" />
              목록보기
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className={level > 0 ? "ml-6" : ""}>
          {/* 하위 그룹 */}
          {group.children &&
            group.children.map((child: Group) => (
              <GroupTree
                key={child.id}
                group={child}
                level={level + 1}
                isDarkMode={isDarkMode}
                groupMembers={groupMembers}
              />
            ))}
        </div>
      )}

      {/* 회원 목록 Dialog */}
      <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{group.name} 회원 목록</DialogTitle>
            <DialogDescription>
              총 {membersCount}명의 회원이 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {getGroupMembers(group.id).map((member: GroupMember) => (
              <div
                key={member.id}
                className="flex items-center gap-3 py-3 px-4 rounded-md border bg-slate-50/50"
                style={{
                  backgroundColor: isDarkMode ? "#0a0a0a" : undefined,
                  borderColor: isDarkMode ? "#444444" : undefined,
                }}
              >
                <Users className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div
                    className="text-sm font-medium"
                    style={{ color: isDarkMode ? "#ffffff" : undefined }}
                  >
                    {member.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: isDarkMode ? "#999999" : undefined }}
                  >
                    {member.email}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    전역: {member.globalRole}
                  </Badge>
                  <Badge className="text-xs">그룹: {member.groupRole}</Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
