import { ChangeDetectorRef, Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

import { TaskItemComponent } from '../task-item/task-item';
import { Task, TaskList } from '../../../models/task.model';
import { BaseTaskContainer } from '../shared/base-task-container';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatDialogModule,
    TaskItemComponent,
  ],
  templateUrl: './task-board.html',
  styleUrls: ['./task-board.css'],
})
export class TaskBoardComponent extends BaseTaskContainer {
  readonly taskLists = input.required<TaskList[]>();



  // Lists State
  readonly showCompletedStatus = signal<Map<string, boolean>>(new Map());
  readonly listSortStatus = signal<Map<string, 'custom' | 'date' | 'alpha'>>(new Map());

  toggleShowCompleted(listId: string) {
    const currentMap = new Map(this.showCompletedStatus());
    currentMap.set(listId, !currentMap.get(listId));
    this.showCompletedStatus.set(currentMap);
  }

  setSort(listId: string, sort: 'custom' | 'date' | 'alpha') {
    const currentMap = new Map(this.listSortStatus());
    currentMap.set(listId, sort);
    this.listSortStatus.set(currentMap);
  }


  dropList(event: CdkDragDrop<TaskList[]>) {
    moveItemInArray(this.taskLists(), event.previousIndex, event.currentIndex);
  }

  dropTask(event: CdkDragDrop<Task[]>, listId: string) {
    // Prevent custom ordering if sort is active
    const currentSort = this.listSortStatus().get(listId) || 'custom';
    if (currentSort !== 'custom') return;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const task = event.item.data as Task;
      // this.tasksService.moveTask(listId, task.id);
    }
  }

  getSortedTasks(listId: string, tasks: Task[]): Task[] {
    const sort = this.listSortStatus().get(listId) || 'custom';
    if (sort === 'custom') return tasks;

    const sorted = [...tasks];
    if (sort === 'alpha') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'date') {
      sorted.sort((a, b) => {
        const dateA = a.due ? new Date(a.due).getTime() : Infinity;
        const dateB = b.due ? new Date(b.due).getTime() : Infinity;
        return dateA - dateB;
      });
    }
    return sorted;
  }
}
