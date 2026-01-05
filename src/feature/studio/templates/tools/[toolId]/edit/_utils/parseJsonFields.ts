import { toast } from "sonner";

interface ParseJsonFieldsParams {
  envVarsText: string;
  dockerComposeText: string;
  resourceReqText: string;
  metadataText: string;
}

interface ParseJsonFieldsResult {
  envVars: Record<string, unknown>;
  dockerCompose: unknown;
  resourceReq: unknown;
  metadata: unknown;
  hasError: boolean;
}

export function parseJsonFields({
  envVarsText,
  dockerComposeText,
  resourceReqText,
  metadataText,
}: ParseJsonFieldsParams): ParseJsonFieldsResult {
  let envVars: Record<string, unknown> = {};
  let dockerCompose: unknown = null;
  let resourceReq: unknown = null;
  let metadata: unknown = null;
  let hasError = false;

  try {
    if (envVarsText.trim()) {
      envVars = JSON.parse(envVarsText);
    }
  } catch (error) {
    toast.error("환경 변수 JSON 형식이 올바르지 않습니다.");
    hasError = true;
  }

  if (hasError) return { envVars, dockerCompose, resourceReq, metadata, hasError };

  try {
    if (dockerComposeText.trim()) {
      dockerCompose = JSON.parse(dockerComposeText);
    }
  } catch (error) {
    toast.error("Docker Compose 설정 JSON 형식이 올바르지 않습니다.");
    hasError = true;
  }

  if (hasError) return { envVars, dockerCompose, resourceReq, metadata, hasError };

  try {
    if (resourceReqText.trim()) {
      resourceReq = JSON.parse(resourceReqText);
    }
  } catch (error) {
    toast.error("리소스 요구사항 JSON 형식이 올바르지 않습니다.");
    hasError = true;
  }

  if (hasError) return { envVars, dockerCompose, resourceReq, metadata, hasError };

  try {
    if (metadataText.trim()) {
      metadata = JSON.parse(metadataText);
    }
  } catch (error) {
    toast.error("메타데이터 JSON 형식이 올바르지 않습니다.");
    hasError = true;
  }

  return { envVars, dockerCompose, resourceReq, metadata, hasError };
}
