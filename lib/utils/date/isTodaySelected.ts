import { getCurrentDayOfWeek } from "./getDayOfWeek";

export function isTodaySelectedDay(selectedDays: string[], timezone: string): boolean {
    const currentDay = getCurrentDayOfWeek(timezone);
    return selectedDays.includes(currentDay);
}