import ScenarioPage from "@/feature/studio/scenarios/[scenarioId]/_pages/page";
import getScenario from "@/feature/studio/scenarios/[scenarioId]/_api/getScenario";

export const dynamic = "force-dynamic";

async function Page({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;

  const scenario = await getScenario({
    scenario_id: Number(scenarioId),
  });

  return <ScenarioPage scenario={scenario} />;
}

export default Page;
