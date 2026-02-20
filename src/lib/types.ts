export interface TimeWindow {
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
}

export interface DayAvailability {
  day: string;
  windows: TimeWindow[];
}

export interface TeamMember {
  id: string;
  name: string;
  availability: DayAvailability[];
  createdAt: string;
}

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});
