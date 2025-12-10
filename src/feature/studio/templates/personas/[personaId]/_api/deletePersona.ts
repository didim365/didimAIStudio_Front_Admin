import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeletePersonaParams =
  paths["/v1/personas/data/{persona_id}"]["delete"]["parameters"]["path"];

/**
 * 페르소나 삭제 API
 * @param params - 페르소나 ID를 포함한 파라미터
 * @description 페르소나 원본 데이터를 삭제합니다. 관련된 마이페이지 항목들도 함께 삭제됩니다.
 */
const deletePersona = async (params: DeletePersonaParams): Promise<void> => {
  try {
    await axiosInstance.agent.delete<void>(
      `/personas/data/${params.persona_id}`
    );
  } catch (error) {
    throw error;
  }
};

export default deletePersona;
