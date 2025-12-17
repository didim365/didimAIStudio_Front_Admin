import getMyPersona from "@/feature/studio/data/personas/[personaId]/_api/getMyPersona";
import getPersona from "@/feature/studio/templates/personas/[personaId]/_api/getPersona";
import PersonaEditPage from "@/feature/studio/data/personas/[personaId]/edit/_pages/PersonaEditPage";

async function Page({ params }: { params: Promise<{ personaId: string }> }) {
  const { personaId } = await params;
  const myPersona = await getMyPersona({ my_page_id: Number(personaId) });
  const persona = await getPersona({ persona_id: myPersona.persona_data_id });
  return <PersonaEditPage myPersona={myPersona} persona={persona} />;
}

export default Page;
