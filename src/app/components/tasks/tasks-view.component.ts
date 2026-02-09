import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, of, switchMap, map, BehaviorSubject } from 'rxjs';
import { TaskListComponent } from './task-list/task-list';
import { TaskBoardComponent } from './task-board/task-board';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';

/**
 * TasksViewComponent - Handles all task-related views
 * Routes: /tasks/today, /tasks/upcoming, /tasks/all, /tasks/list/:id
 */
@Component({
  selector: 'app-tasks-view',
  standalone: true,
  imports: [
    CommonModule,
    TaskListComponent,
    TaskBoardComponent,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="tasks-view-container">
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <div class="tasks-content">
          @if (viewMode() === 'all') {
            <app-task-board 
              [taskLists]="taskLists()"
              (syncCompleted)="onSyncCompleted()">
            </app-task-board>
          } @else {
            <app-task-list 
              [title]="currentTitle()" 
              [tasks]="currentTasks()"
              [listId]="currentTasks().length > 0 ? currentTasks()[0].listId : ''"
              (syncCompleted)="onSyncCompleted()">
            </app-task-list>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .tasks-view-container {
      height: 100%;
      width: 100%;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    
    .tasks-content {
      height: 100%;
    }
  `]
})
export class TasksViewComponent {
  private tasksService = inject(TasksService);
  private route = inject(ActivatedRoute);

  readonly refresh$ = this.tasksService.refresh$;
  // Get view mode from route
  readonly viewMode = toSignal(
    this.route.url.pipe(
      map(segments => {
        if (segments.length === 0) return 'today';
        const lastSegment = segments[segments.length - 1].path;
        return lastSegment; // 'today', 'upcoming', 'all', or list ID
      })
    ),
    { initialValue: 'today' }
  );

  // Data Source
  readonly taskLists = toSignal(
    this.refresh$.pipe(
      switchMap(() => this.tasksService.getLists()),
      switchMap((lists) => {
        if (!lists || lists.length === 0) return of([]);
        const tasksRequests = lists.map((list) =>
          this.tasksService.getTasks(list.id).pipe(
            map((tasks) => ({ ...list, tasks }))
          )
        );
        return forkJoin(tasksRequests);
      })
    ),
    { initialValue: [] }
  );

  // Computed Properties
  readonly isLoading = computed(() => this.taskLists().length === 0);

  readonly currentTitle = computed(() => {
    const view = this.viewMode();
    const lists = this.taskLists();

    if (view === 'today') return 'Today';
    if (view === 'upcoming') return 'Upcoming';
    if (view === 'all') return 'All Tasks';

    // It's a list ID
    const list = lists.find((l) => l.id === view);
    return list ? list.title : 'Tasks';
  });

  readonly currentTasks = computed(() => {
    const view = this.viewMode();
    const lists = this.taskLists();
    if (!lists.length) return [];

    // Flatten all tasks and attach listId to each task
    let result = lists.reduce((acc, l) => {
      const tasksWithListId = (l.tasks || []).map((t) => ({ ...t, listId: l.id }));
      return acc.concat(tasksWithListId);
    }, [] as Task[]);

    if (view === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result =  result.filter((t) => t.due && t.due.startsWith(today));
    }

    if (view === 'upcoming') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter((t) => t.due && t.due > today);
    }

    if (view === 'all') {
      return result;
    }

    // Specific List - view is the list ID
    const list = lists.find((l) => l.id === view);
    
    result = list ? (list.tasks || []).map((t) => ({ ...t, listId: list.id })) : result ?? [];
    return result.sort((a, b) => {
      // 1. Sort by completion status (incomplete first)
      if (a.completedAt !== b.completedAt) {
        return a.completedAt ? 1 : -1;
      }
      
      // 2. Sort by due date (earliest first, null/undefined last)
      if (a.due !== b.due) {
        if (!a.due) return 1;
        if (!b.due) return -1;
        return a.due.localeCompare(b.due);
      }
      
      // 3. Sort by updatedAt (most recent first)
      if (a.updated !== b.updated) {
        if (!a.updated) return 1;
        if (!b.updated) return -1;
        return b.updated.localeCompare(a.updated);
      }
      
      // 4. Sort by title (alphabetically)
      return (a.title || '').localeCompare(b.title || '');
    })
  });

  onSyncCompleted(): void {
    this.refresh$.next();
  }
}
