import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, of, forkJoin, BehaviorSubject } from 'rxjs';

import { TaskList } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private router = inject(Router);
  private tasksService = inject(TasksService);
  
  readonly refresh$ = new BehaviorSubject<void>(undefined);

  // Load task lists
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

  // Track current route to determine view mode and selected item
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).url)
    ),
    { initialValue: this.router.url }
  );

  readonly viewMode = computed(() => {
    const url = this.currentUrl();
    return url.includes('/habits') ? 'habits' : 'tasks';
  });

  readonly selectedId = computed(() => {
    const url = this.currentUrl();
    if (url.includes('/tasks/today')) return 'today';
    if (url.includes('/tasks/upcoming')) return 'upcoming';
    if (url.includes('/tasks/all')) return 'all';
    if (url.includes('/tasks/list/')) {
      const parts = url.split('/tasks/list/');
      return parts[1] || '';
    }
    if (url.includes('/habits')) return 'habits';
    return 'today';
  });

  onSync(): void {
    this.tasksService.sync().subscribe(() => {
      this.refresh$.next();
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateToList(listId: string): void {
    this.router.navigate(['/tasks/list', listId]);
  }

  setMode(mode: 'tasks' | 'habits'): void {
    if (mode === 'habits') {
      this.router.navigate(['/habits']);
    } else {
      this.router.navigate(['/tasks/today']);
    }
  }
}
