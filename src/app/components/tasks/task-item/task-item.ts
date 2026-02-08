import { Component, input, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog';
import { TaskDialogAction, TaskDialogMode, TaskDialogResult } from '../task-dialog/task-dialog.model';
import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  readonly task = input.required<Task>();

  private readonly dialog = inject(MatDialog);
  private readonly tasksService = inject(TasksService);

  // Helper to check if task is overdue
  readonly isOverdue = computed(() => {
    const due = this.task().due;
    if (!due) return false;
    return new Date(due) < new Date() && this.task().status !== 'completed';
  });

  onStatusChange() {
    this.tasksService.toggleTaskStatus(this.task()).subscribe();
  }

  private lastMouseDown = 0;

  onMouseDown() {
    this.lastMouseDown = Date.now();
  }

  onItemClick(event: Event) {
    // Determine if this was a drag (long press) or a click
    const duration = Date.now() - this.lastMouseDown;
    if (duration > 200) {
      return; // Assume drag
    }

    // If clicking checkbox or delete, don't trigger edit
    if ((event.target as HTMLElement).closest('mat-checkbox') ||
      (event.target as HTMLElement).closest('button')) {
      return;
    }

    this.openEditDialog();
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { mode: TaskDialogMode.Edit, task: this.task() }
    });

    dialogRef.afterClosed().subscribe((result: TaskDialogResult | undefined) => {
      if (result && result.action === TaskDialogAction.Save && result.payload) {
        this.tasksService.updateTask(this.task().id, result.payload).subscribe();
      }
    });
  }

  onDelete() {
    this.tasksService.deleteTask(this.task().id).subscribe();
  }
}
