export function isEndDate(endDate: string, timezone: string): boolean {
    const now = new Date();
    const localDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    const endDateTime = new Date(endDate);

    // Compare only the date part (YYYY-MM-DD)
    const currentDateStr = localDate.toISOString().split('T')[0];
    const endDateStr = endDateTime.toISOString().split('T')[0];

    return currentDateStr >= endDateStr;
}