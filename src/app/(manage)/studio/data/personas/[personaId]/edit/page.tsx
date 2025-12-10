import getPersona from "@/feature/personas/[personaId]/_api/getPersona";
import PersonaEditPage from "@/feature/personas/[personaId]/edit/_pages/PersonaEditPage";

async function Page({ params }: { params: Promise<{ personaId: string }> }) {
  const { personaId } = await params;
  const persona = await getPersona({ persona_id: Number(personaId) });
  return <PersonaEditPage persona={persona} />;
}

export default Page;
