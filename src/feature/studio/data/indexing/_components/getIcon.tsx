import { Database, FileStack, Box } from "lucide-react";

/**
 * 컬렉션 타입에 따른 아이콘 반환
 * @param type 컬렉션 타입 (meta/vector)
 * @returns 해당 타입의 아이콘 컴포넌트
 */
export function getIcon(type: string) {
  switch (type) {
    case "meta":
      return <FileStack className="h-3.5 w-3.5" />;
    case "vector":
      return <Box className="h-3.5 w-3.5" />;
    default:
      return <Database className="h-3.5 w-3.5" />;
  }
}
