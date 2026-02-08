export const DateUtils = {
    /**
     * Returns the date string in 'YYYY-MM-DD' format based on the local timezone.
     * Use this instead of .toISOString() which uses UTC.
     */
    toLocalISOString(date: Date): string {
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().split('T')[0];
    },

    /**
     * Checks if two dates represent the same calendar day (ignoring time).
     */
    isSameDay(d1: Date | string, d2: Date | string): boolean {
        const str1 = typeof d1 === 'string' ? d1.split('T')[0] : DateUtils.toLocalISOString(d1);
        const str2 = typeof d2 === 'string' ? d2.split('T')[0] : DateUtils.toLocalISOString(d2);
        return str1 === str2;
    },

    /**
     * Returns the difference in calendar days between two dates.
     * Postive if d2 is after d1.
     */
    diffInDays(d1: Date | string, d2: Date | string): number {
        const date1 = new Date(typeof d1 === 'string' ? d1.split('T')[0] : DateUtils.toLocalISOString(d1));
        const date2 = new Date(typeof d2 === 'string' ? d2.split('T')[0] : DateUtils.toLocalISOString(d2));

        // Reset times to midnight to ensure pure day difference
        date1.setHours(0, 0, 0, 0);
        date2.setHours(0, 0, 0, 0);

        const diffTime = date2.getTime() - date1.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
};

export interface DayColor {
    date: Date;
    color: string;
}
