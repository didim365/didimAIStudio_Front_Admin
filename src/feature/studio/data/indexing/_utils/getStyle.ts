/**
 * 컬렉션 타입에 따른 스타일 클래스 반환
 * @param type 컬렉션 타입 (meta/vector)
 * @returns Tailwind CSS 클래스 문자열
 */
export function getStyle(type: string): string {
  switch (type) {
    case "meta":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "vector":
      return "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
}
