import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog';
import { TaskDialogMode, TaskDialogAction, TaskDialogResult } from '../task-dialog/task-dialog.model';
import { TasksService } from '../../../services/tasks.service';
import { TaskStatus } from '../../../models/task.model';

@Component({ template: '' })
export abstract class BaseTaskContainer {
    protected tasksService = inject(TasksService);
    protected dialog = inject(MatDialog);

    openAddTask(listId: string) {
        const dialogRef = this.dialog.open(TaskDialogComponent, {
            width: '400px',
            data: { mode: TaskDialogMode.Create }
        });

        dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
            if (result && result.action === TaskDialogAction.Save && result.payload) {
                this.tasksService.createTask(listId, {
                    ...result.payload,
                    status: TaskStatus.NeedsAction
                }
            ).subscribe();

            }
        });
    }
}
