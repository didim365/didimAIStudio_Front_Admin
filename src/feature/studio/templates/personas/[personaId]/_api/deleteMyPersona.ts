import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeleteMyPersonaParams =
  paths["/v1/personas/my/{my_page_id}"]["delete"]["parameters"]["path"];

/**
 * 마이페이지 페르소나 제거 API
 * @param params - 마이페이지 ID를 포함한 파라미터
 * @description 마이페이지에서 특정 페르소나 항목을 제거합니다.
 */
const deleteMyPersona = async (
  params: DeleteMyPersonaParams
): Promise<void> => {
  try {
    await axiosInstance.agent.delete<void>(`/personas/my/${params.my_page_id}`);
  } catch (error) {
    throw error;
  }
};

export default deleteMyPersona;
