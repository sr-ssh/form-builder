import { format } from "date-fns-jalali";

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = format(
    new Date().setHours(hours, minutes, remainingSeconds),
    "HH:mm:ss",
  );

  return formattedTime;
}
