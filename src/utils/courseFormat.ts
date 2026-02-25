import type { CourseSchedule } from "@/types/course";

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export function formatTime24to12(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function formatScheduleSummary(schedules: CourseSchedule[]): string {
  if (!schedules.length) return "";
  const sameTime =
    schedules.length === 1 ||
    schedules.every(
      (s) =>
        s.start_time === schedules[0].start_time &&
        s.end_time === schedules[0].end_time
    );
  const days = schedules.map((s) => DAY_SHORT[s.day_of_week] ?? s.day_of_week.slice(0, 3));
  if (sameTime) {
    const [start, end] = [schedules[0].start_time, schedules[0].end_time];
    return `${days.join(", ")} ( ${formatTime24to12(start)}–${formatTime24to12(end)} )`;
  }
  return schedules
    .map(
      (s) =>
        `${DAY_SHORT[s.day_of_week] ?? s.day_of_week.slice(0, 3)} ( ${formatTime24to12(s.start_time)}–${formatTime24to12(s.end_time)} )`
    )
    .join(", ");
}
