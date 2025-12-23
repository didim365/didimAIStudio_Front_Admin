import { GetUserConfigResponse } from "../_api/getUserConfig";

interface ToolPageProps {
  config: GetUserConfigResponse;
}

function ToolPage({ config }: ToolPageProps) {
  return <div>ToolPage</div>;
}

export default ToolPage;
