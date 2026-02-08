import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Habit } from '../models/habit.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HabitsService {
    private apiUrl = environment.backendUrl;
    private http = inject(HttpClient);

    /**
     * Retrieves all habits.
     * @returns Observable of an array of Habit objects.
     */
    getHabits(): Observable<Habit[]> {
        return this.http.get<Habit[]>(`${this.apiUrl}/habits`);
    }

    /**
     * Creates a new habit.
     * @param habit Partial habit object containing initial data.
     * @returns Observable of the created Habit.
     */
    createHabit(habit: Partial<Habit>): Observable<Habit> {
        return this.http.post<Habit>(`${this.apiUrl}/habits`, habit);
    }

    /**
     * Updates an existing habit.
     * @param habitId The ID of the habit to update.
     * @param updates Partial habit object containing fields to update.
     * @returns Observable of the updated Habit.
     */
    updateHabit(habitId: string, updates: Partial<Habit>): Observable<Habit> {
        return this.http.patch<Habit>(`${this.apiUrl}/habits/${habitId}`, updates);
    }

    /**
     * Deletes a habit.
     * @param habitId The ID of the habit to delete.
     * @returns Observable that completes when the deletion is finished.
     */
    deleteHabit(habitId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/habits/${habitId}`);
    }
}
