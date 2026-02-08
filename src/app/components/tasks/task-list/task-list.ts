import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TaskItemComponent } from '../task-item/task-item';
import { Task, TaskStatus } from '../../../models/task.model';
import { BaseTaskContainer } from '../shared/base-task-container';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TaskItemComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent extends BaseTaskContainer {
  readonly title = input.required<string>();
  readonly tasks = input.required<Task[]>();
  readonly listId = input<string | undefined>('');
  readonly isMixedView = input<boolean>(false);

  drop(event: CdkDragDrop<string[]>) {
    // In a real app, we would emit this change to the parent/service
  }

  addTask(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value.trim()) return;
    // Only allow adding tasks in specific list views, not mixed views
    if (this.isMixedView()) {
      console.warn('Cannot add tasks in mixed view');
      return;
    }
    if(!this.listId()) {
      console.warn('List ID is required to add a task');
      return;
    }

    this.tasksService.createTask(this.listId()!, {
      title: input.value.trim(),
      status: TaskStatus.NeedsAction
    }).subscribe();
    input.value = '';
  }
}
