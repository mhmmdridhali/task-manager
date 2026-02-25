/**
 * Returns the current date as a YYYY-MM-DD string in the local timezone,
 * not UTC. This prevents timezone offset bugs where 7 AM GMT+8
 * resolves to the previous day in UTC.
 */
export function getLocalTodayStr(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
