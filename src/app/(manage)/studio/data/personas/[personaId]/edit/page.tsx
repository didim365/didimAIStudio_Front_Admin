import getMyPersona from "@/feature/studio/data/personas/[personaId]/_api/getMyPersona";
import PersonaEditPage from "@/feature/studio/data/personas/[personaId]/edit/_pages/PersonaEditPage";

async function Page({ params }: { params: Promise<{ personaId: string }> }) {
  const { personaId } = await params;
  const myPersona = await getMyPersona({ my_page_id: Number(personaId) });
  return <PersonaEditPage myPersona={myPersona} />;
}

export default Page;
