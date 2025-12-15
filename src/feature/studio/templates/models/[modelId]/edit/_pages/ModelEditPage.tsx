import type { GetCatalogResponse } from "../../_api/getCatalog";

interface ModelEditPageProps {
  catalog: GetCatalogResponse;
}

function ModelEditPage({ catalog }: ModelEditPageProps) {
  return <div>ModelEditPage</div>;
}

export default ModelEditPage;
