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
import { paths } from "@/shared/types/api/auth";

type UserResponse =
  paths["/api/v1/users/admin/users"]["get"]["responses"]["200"]["content"]["application/json"]["items"][number];

interface UserEditDialogProps {
  user: UserResponse | null;
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
              <Input defaultValue={user.full_name || ""} />
            </div>
            <div className="space-y-2">
              <Label>이메일</Label>
              <Input defaultValue={user.email} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>전화번호</Label>
            <Input defaultValue={user.phone || ""} />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>계정 상태</Label>
              <p className="text-sm text-slate-500">
                계정을 활성화하거나 비활성화합니다
              </p>
            </div>
            <Switch defaultChecked={user.status === "ACTIVE"} />
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
