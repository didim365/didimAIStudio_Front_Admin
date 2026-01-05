import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Container, Layers, Server } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { GetToolResponse } from "../../_api/getTool";

interface ContainerConfigSectionProps {
  tool: GetToolResponse;
  formData: {
    container_image: string;
  };
  onFormChange: (updates: Partial<ContainerConfigSectionProps["formData"]>) => void;
}

export function ContainerConfigSection({
  tool,
  formData,
  onFormChange,
}: ContainerConfigSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Container className="h-5 w-5" />
          컨테이너 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Container Image */}
        <div className="space-y-2">
          <Label htmlFor="container_image" className="flex items-center gap-2">
            <Container className="h-4 w-4" />
            <span>컨테이너 이미지</span>
          </Label>
          <Input
            id="container_image"
            value={formData.container_image}
            onChange={(e) => onFormChange({ container_image: e.target.value })}
            placeholder="docker.io/library/image:tag"
            className="font-mono"
          />
        </div>

        {/* Transport (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="transport" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>전송 방식</span>
          </Label>
          <Input
            id="transport"
            value={tool.transport || "-"}
            disabled
            className="bg-muted"
          />
        </div>

        {/* Server Type (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="server_type" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>서버 타입</span>
          </Label>
          <Input
            id="server_type"
            value={tool.server_type || "-"}
            disabled
            className="bg-muted"
          />
        </div>
      </CardContent>
    </Card>
  );
}
