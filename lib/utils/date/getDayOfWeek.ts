import { DAYS_OF_WEEK } from "@/lib/constants";

export function getCurrentDayOfWeek(timezone: string): string {
    const now = new Date();
    const localDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    const dayIndex = localDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Convert Sunday (0) to index 6, and shift others accordingly
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return DAYS_OF_WEEK[adjustedIndex];
}