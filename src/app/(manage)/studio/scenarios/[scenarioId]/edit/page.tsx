import ScenarioEditPage from "@/feature/studio/scenarios/[scenarioId]/edit/_pages/page";
import getScenario from "@/feature/studio/scenarios/[scenarioId]/_api/getScenario";

async function Page({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;

  const scenario = await getScenario({
    scenario_id: Number(scenarioId),
  });

  return <ScenarioEditPage scenario={scenario} />;
}

export default Page;
