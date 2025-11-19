import { GetPersonaResponse } from "../api/getPersona";

interface PersonaEditPageProps {
  persona: GetPersonaResponse;
}

function PersonaEditPage({ persona }: PersonaEditPageProps) {
  return <div>PersonaEditPage</div>;
}

export default PersonaEditPage;
