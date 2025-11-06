"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Badge } from "@/shared/ui/badge";
import { Document, PermissionLevel } from "../types";
import { mockGroups, mockUsers } from "../utils/mockData";
import { X, Plus } from "lucide-react";

interface PermissionEditDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (documentId: string, permissions: Document["permissions"]) => void;
}

export function PermissionEditDialog({
  document,
  open,
  onOpenChange,
  onSave,
}: PermissionEditDialogProps) {
  const [isPublic, setIsPublic] = useState(
    document?.permissions.isPublic || false
  );
  const [allowedGroups, setAllowedGroups] = useState(
    document?.permissions.allowedGroups || []
  );
  const [allowedUsers, setAllowedUsers] = useState(
    document?.permissions.allowedUsers || []
  );
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  if (!document) return null;

  const handleSave = () => {
    onSave(document.id, {
      isPublic,
      allowedGroups,
      allowedUsers,
      ownerId: document.permissions.ownerId,
    });
    onOpenChange(false);
  };

  const addGroup = () => {
    if (!selectedGroup) return;
    const group = mockGroups.find((g) => g.id === selectedGroup);
    if (!group) return;

    if (allowedGroups.some((g) => g.groupId === selectedGroup)) {
      return; // 이미 추가됨
    }

    setAllowedGroups([
      ...allowedGroups,
      { groupId: group.id, groupName: group.name, level: "read" },
    ]);
    setSelectedGroup("");
  };

  const removeGroup = (groupId: string) => {
    setAllowedGroups(allowedGroups.filter((g) => g.groupId !== groupId));
  };

  const updateGroupLevel = (groupId: string, level: PermissionLevel) => {
    setAllowedGroups(
      allowedGroups.map((g) => (g.groupId === groupId ? { ...g, level } : g))
    );
  };

  const addUser = () => {
    if (!selectedUser) return;
    const user = mockUsers.find((u) => u.id === selectedUser);
    if (!user) return;

    if (allowedUsers.some((u) => u.userId === selectedUser)) {
      return; // 이미 추가됨
    }

    setAllowedUsers([
      ...allowedUsers,
      { userId: user.id, userName: user.name, level: "read" },
    ]);
    setSelectedUser("");
  };

  const removeUser = (userId: string) => {
    setAllowedUsers(allowedUsers.filter((u) => u.userId !== userId));
  };

  const updateUserLevel = (userId: string, level: PermissionLevel) => {
    setAllowedUsers(
      allowedUsers.map((u) => (u.userId === userId ? { ...u, level } : u))
    );
  };

  const getLevelText = (level: PermissionLevel) => {
    const texts = {
      read: "읽기",
      write: "쓰기",
      admin: "관리",
    };
    return texts[level];
  };

  const getLevelColor = (level: PermissionLevel) => {
    const colors = {
      read: "secondary",
      write: "default",
      admin: "destructive",
    };
    return colors[level] as "secondary" | "default" | "destructive";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>문서 역할 설정</DialogTitle>
          <DialogDescription>
            {document.title}의 접근 역할을 설정합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 공개 설정 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>전체 공개</Label>
              <p className="text-sm text-muted-foreground">
                모든 사용자가 이 문서에 접근할 수 있습니다.
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {!isPublic && (
            <>
              {/* 그룹 역할 */}
              <div className="space-y-3">
                <Label>그룹별 역할</Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedGroup}
                    onValueChange={setSelectedGroup}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="그룹 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockGroups
                        .filter(
                          (g) =>
                            !allowedGroups.some((ag) => ag.groupId === g.id)
                        )
                        .map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addGroup} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {allowedGroups.map((group) => (
                    <div
                      key={group.groupId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{group.groupName}</span>
                        <Badge variant={getLevelColor(group.level)}>
                          {getLevelText(group.level)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={group.level}
                          onValueChange={(value) =>
                            updateGroupLevel(
                              group.groupId,
                              value as PermissionLevel
                            )
                          }
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="read">읽기</SelectItem>
                            <SelectItem value="write">쓰기</SelectItem>
                            <SelectItem value="admin">관리</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeGroup(group.groupId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 사용자 역할 */}
              <div className="space-y-3">
                <Label>개별 사용자 역할</Label>
                <div className="flex gap-2">
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="사용자 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers
                        .filter(
                          (u) => !allowedUsers.some((au) => au.userId === u.id)
                        )
                        .filter((u) => u.id !== document.permissions.ownerId)
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addUser} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {allowedUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.userName}</span>
                        <Badge variant={getLevelColor(user.level)}>
                          {getLevelText(user.level)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.level}
                          onValueChange={(value) =>
                            updateUserLevel(
                              user.userId,
                              value as PermissionLevel
                            )
                          }
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="read">읽기</SelectItem>
                            <SelectItem value="write">쓰기</SelectItem>
                            <SelectItem value="admin">관리</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUser(user.userId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
