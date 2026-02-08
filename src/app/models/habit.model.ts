/**
 * Represents a habit to be tracked over time.
 */
export interface Habit {
    /** Unique identifier (UUID). */
    id: string;
    /** Title or name of the habit. */
    title: string;
    /** Optional description or notes. */
    notes?: string;
    /** Frequency of the habit tracking. */
    frequency: 'daily' | 'weekly' | 'specific_days' | 'interval';
    /** Days of the week for 'specific_days' (0=Sun, 6=Sat). */
    daysOfWeek?: number[];
    /** Interval in days for 'interval' frequency. */
    intervalDays?: number;
    /** Target number of completions per period. */
    goal: number;
    /** Current streak count. */
    streak: number;
    /** Date when the habit was last completed (ISO string). */
    lastCompletedAt?: string;
    /** Creation date of the habit (ISO string). */
    createdAt: string;
    /** Color code for UI representation (hex or specific name). */
    color: string;
    /** History of completion dates (Array of ISO date strings). */
    history?: string[];
}
