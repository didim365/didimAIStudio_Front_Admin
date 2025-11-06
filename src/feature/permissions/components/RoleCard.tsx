import { Role } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Shield } from "lucide-react";

interface RoleCardProps {
  role: Role;
  isSelected: boolean;
  isDarkMode: boolean;
  onClick: () => void;
}

export function RoleCard({
  role,
  isSelected,
  isDarkMode,
  onClick,
}: RoleCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? "border-blue-500 shadow-md" : "hover:border-slate-300"
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle
              className="text-lg"
              style={{ color: isDarkMode ? "#ffffff" : undefined }}
            >
              {role.displayName}
            </CardTitle>
            <p
              className="text-sm mt-1"
              style={{ color: isDarkMode ? "#cccccc" : undefined }}
            >
              {role.description}
            </p>
          </div>
          <Shield className="h-5 w-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: isDarkMode ? "#cccccc" : undefined }}>
              사용자 수
            </span>
            <Badge>{role.userCount}명</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: isDarkMode ? "#cccccc" : undefined }}>
              역할 수
            </span>
            <Badge variant="outline">{role.permissions.length}개</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
