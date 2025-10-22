import { User } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface UserEditDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserEditDialog({ user, isOpen, onClose }: UserEditDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>회원 정보 수정</DialogTitle>
          <DialogDescription>
            회원의 정보 및 사용량 제한을 설정합니다
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>이름</Label>
              <Input defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label>이메일</Label>
              <Input defaultValue={user.email} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>그룹</Label>
            <Input defaultValue={user.group} />
          </div>

          <div className="space-y-2">
            <Label>권한</Label>
            <Select defaultValue={user.role}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="관리자">관리자</SelectItem>
                <SelectItem value="매니저">매니저</SelectItem>
                <SelectItem value="일반 사용자">일반 사용자</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>챗 토큰 제한</Label>
              <Input
                type="number"
                defaultValue={user.chatLimit}
                placeholder="토큰 수"
              />
            </div>
            <div className="space-y-2">
              <Label>임베딩 토큰 제한</Label>
              <Input
                type="number"
                defaultValue={user.embeddingLimit}
                placeholder="토큰 수"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>계정 상태</Label>
              <p className="text-sm text-slate-500">
                계정을 활성화하거나 비활성화합니다
              </p>
            </div>
            <Switch defaultChecked={user.status === "active"} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={onClose}>저장</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
