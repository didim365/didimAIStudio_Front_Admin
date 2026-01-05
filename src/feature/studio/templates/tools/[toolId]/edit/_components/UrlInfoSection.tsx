import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Link2, GitBranch, Server } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface UrlInfoSectionProps {
  formData: {
    icon_url: string;
    repo_url: string;
    server_url: string;
  };
  onFormChange: (updates: Partial<UrlInfoSectionProps["formData"]>) => void;
}

export function UrlInfoSection({ formData, onFormChange }: UrlInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          URL 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Icon URL */}
        <div className="space-y-2">
          <Label htmlFor="icon_url" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            <span>아이콘 URL</span>
          </Label>
          <Input
            id="icon_url"
            value={formData.icon_url}
            onChange={(e) => onFormChange({ icon_url: e.target.value })}
            placeholder="https://example.com/icon.png"
            type="url"
          />
        </div>

        {/* Repo URL */}
        <div className="space-y-2">
          <Label htmlFor="repo_url" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            <span>저장소 URL</span>
          </Label>
          <Input
            id="repo_url"
            value={formData.repo_url}
            onChange={(e) => onFormChange({ repo_url: e.target.value })}
            placeholder="https://github.com/user/repo"
            type="url"
          />
        </div>

        {/* Server URL */}
        <div className="space-y-2">
          <Label htmlFor="server_url" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>서버 URL</span>
          </Label>
          <Input
            id="server_url"
            value={formData.server_url}
            onChange={(e) => onFormChange({ server_url: e.target.value })}
            placeholder="https://server.example.com"
            type="url"
          />
        </div>
      </CardContent>
    </Card>
  );
}
