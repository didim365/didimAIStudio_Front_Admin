import ModelPage from "@/feature/studio/data/models/[userModelId]/_pages/ModelPage";

async function Page({ params }: { params: Promise<{ userModelId: string }> }) {
  const { userModelId } = await params;
  return <ModelPage userModelId={userModelId} />;
}

export default Page;
