import getPersona from "@/feature/personas/api/getPersona";
import PersonaEditPage from "@/feature/personas/pages/PersonaEditPage";

async function Page({ params }: { params: Promise<{ personaId: string }> }) {
  const { personaId } = await params;
  const persona = await getPersona({ persona_id: Number(personaId) });
  return <PersonaEditPage persona={persona} />;
}

export default Page;
