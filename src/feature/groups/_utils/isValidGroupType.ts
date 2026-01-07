import { GroupTypeEnum } from "../_types/groupType";

/**
 * 그룹 타입 유효성 검사 타입 가드 함수
 * @param value - 검증할 문자열
 * @returns value가 유효한 GroupTypeEnum인 경우 true
 */
export const isValidGroupType = (value: string): value is GroupTypeEnum => {
  return (
    value === "ALL" ||
    value === "COMPANY" ||
    value === "DEPARTMENT" ||
    value === "TEAM" ||
    value === "PERSONAL"
  );
};
