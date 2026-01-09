import LocalModelDetail from "@/feature/studio/templates/models/local/_pages/LocalModelDetail";
import getLocalModel from "@/feature/studio/templates/models/local/_api/getLocalModel";

interface PageProps {
  params: Promise<{
    modelId: string;
  }>;
}

export default async function LocalModelPage({ params }: PageProps) {
  const { modelId } = await params;
  const model = await getLocalModel(parseInt(modelId));

  return <LocalModelDetail model={model} />;
}
