export function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

export function formatDateGroup(date: Date, groupBy: "year" | "quarter" | "month" | "day"): string {
  switch (groupBy) {
    case "year":
      return date.getFullYear().toString();
    case "quarter":
      return `${date.getFullYear()} Q${getQuarter(date)}`;
    case "month":
      return date.toLocaleString("default", { year: "numeric", month: "short" });
    case "day":
      return date.getDate().toString().padStart(2, "0");
    default:
      return date.toISOString().split("T")[0];
  }
}

export function formatTimeGroup(time: string, timeRange: number): string {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  const rangeStart = Math.floor(totalMinutes / timeRange) * timeRange;
  const rangeEnd = rangeStart + timeRange;
  const startHours = Math.floor(rangeStart / 60);
  const startMinutes = rangeStart % 60;
  const endHours = Math.floor(rangeEnd / 60);
  const endMinutes = rangeEnd % 60;
  return `${startHours.toString().padStart(2, "0")}:${startMinutes
    .toString()
    .padStart(2, "0")} - ${endHours.toString().padStart(2, "0")}:${endMinutes
    .toString()
    .padStart(2, "0")}`;
}
