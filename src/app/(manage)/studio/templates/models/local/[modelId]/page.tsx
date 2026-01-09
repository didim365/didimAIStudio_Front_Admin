import LocalModel from "@/feature/studio/templates/models/local/[modelId]/_pages/LocalModel";
import getLocalModel from "@/feature/studio/templates/models/local/[modelId]/_api/getLocalModel";

interface PageProps {
  params: Promise<{
    modelId: string;
  }>;
}

export default async function LocalModelPage({ params }: PageProps) {
  const { modelId } = await params;
  const model = await getLocalModel(parseInt(modelId));

  return <LocalModel model={model} />;
}
