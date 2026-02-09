import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Task, TaskList, TaskStatus } from "../models/task.model";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    private apiUrl = environment.backendUrl;
    constructor(private http: HttpClient) { }

    refresh$ = new BehaviorSubject<void>(undefined);
    // --- Lists ---

    /**
     * Retrieves all task lists.
     * @returns Observable of an array of TaskList objects.
     */
    getLists(): Observable<TaskList[]> {
        return this.http.get<TaskList[]>(`${this.apiUrl}/lists`);
    }

    /**
     * Creates a new task list.
     * @param title The title of the new list.
     * @returns Observable of the created TaskList.
     */
    createList(title: string): Observable<TaskList> {
        return this.http.post<TaskList>(`${this.apiUrl}/lists`, { title });
    }

    // --- Tasks ---

    /**
     * Retrieves tasks for a specific list.
     * @param listId The ID of the task list.
     * @returns Observable of an array of Task objects.
     */
    getTasks(listId: string): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/lists/${listId}/tasks`);
    }

    /**
     * Creates a new task in a specific list.
     * @param listId The ID of the task list.
     * @param task Partial task object containing initial data.
     * @returns Observable of the created Task.
     */
    createTask(listId: string, task: Partial<Task>): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}/lists/${listId}/tasks`, task);
    }

    /**
     * Updates an existing task.
     * @param taskId The ID of the task to update.
     * @param updates Partial task object containing fields to update.
     * @returns Observable of the updated Task.
     */
    updateTask(taskId: string, updates: Partial<Task>): Observable<Task> {
        return this.http.patch<Task>(`${this.apiUrl}/tasks/${taskId}`, updates);
    }

    /**
     * Toggles the completion status of a task.
     * @param task The task to toggle.
     * @returns Observable of the updated Task.
     */
    toggleTaskStatus(task: Task): Observable<Task> {
        return this.http.patch<Task>(`${this.apiUrl}/tasks/${task.id}`, { status: task.status === TaskStatus.Completed ? TaskStatus.NeedsAction : TaskStatus.Completed });
    }

    /**
     * Deletes a task.
     * @param taskId The ID of the task to delete.
     * @returns Observable that completes when the deletion is finished.
     */
    deleteTask(taskId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
    }

    // --- Sync ---

    /**
     * Triggers a synchronization with the backend.
     * @returns Observable of the sync result.
     */
    sync(): Observable<any> {
        return this.http.post(`${this.apiUrl}/sync`, {});
    }

}
