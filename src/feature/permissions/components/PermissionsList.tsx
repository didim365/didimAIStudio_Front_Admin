import { Permission, Role } from "../types";
import { Switch } from "@/shared/ui/switch";

interface PermissionsListProps {
  permissions: Permission[];
  selectedRole: Role;
  isDarkMode: boolean;
}

export function PermissionsList({
  permissions,
  selectedRole,
  isDarkMode,
}: PermissionsListProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      {permissions.map((permission) => (
        <div
          key={permission.id}
          className="flex items-center justify-between p-3 rounded-lg"
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
          <div>
            <div
              className="font-medium"
              style={{ color: isDarkMode ? "#ffffff" : undefined }}
            >
              {permission.name}
            </div>
            <div
              className="text-sm"
              style={{ color: isDarkMode ? "#cccccc" : undefined }}
            >
              {permission.description}
            </div>
          </div>
          <Switch
            defaultChecked={selectedRole.permissions.includes(permission.name)}
          />
        </div>
      ))}
    </div>
  );
}
