/**
 * 파일 타입에 따른 스타일 클래스 반환
 * @param fileType 파일 확장자
 * @returns Tailwind CSS 클래스 문자열
 */
export function getFileTypeStyle(fileType: string): string {
  const styleMap: Record<string, string> = {
    pdf: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    docx: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    doc: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    xlsx: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    xls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pptx: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    ppt: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    txt: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
    csv: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    json: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    md: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return (
    styleMap[fileType?.toLowerCase()] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
  );
}
