import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../../models/task.model';
import { TaskDialogData, TaskDialogMode, TaskDialogResult, TaskDialogAction } from './task-dialog.model';
import moment from 'moment';

@Component({
    selector: 'app-task-dialog',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
    ],
    templateUrl: './task-dialog.html',
    styleUrls: ['./task-dialog.css'],
})
export class TaskDialogComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<TaskDialogComponent>);
    readonly data = inject<TaskDialogData>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);

    form: FormGroup;

    constructor() {
        this.form = this.fb.group({
            title: ['', Validators.required],
            details: [''],
            due: [null]
        });
    }

    get isEditMode(): boolean {
        return this.data.mode === TaskDialogMode.Edit;
    }

    ngOnInit(): void {
        if (this.isEditMode && this.data.task) {
            this.form.patchValue({
                title: this.data.task.title,
                details: this.data.task.notes || '',
                due: this.data.task.due ? new Date(this.data.task.due) : null
            });
        }
    }

    onSave() {
        if (this.form.invalid) return;

        const formVal = this.form.value;
        const payload: Partial<Task> = {
            title: formVal.title || '',
            notes: formVal.details || '',

            due: formVal.due ? moment.utc(formVal.due).startOf('day').add(1, 'day').format('YYYY-MM-DDTHH:mm:ss[Z]') : undefined,
        };

        // If editing, preserve ID
        if (this.isEditMode && this.data.task) {
            payload.id = this.data.task.id;
        }

        this.dialogRef.close({
            action: TaskDialogAction.Save,
            payload
        } as TaskDialogResult);
    
    }
}
