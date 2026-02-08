import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Habit } from '../../../models/habit.model';
import { HabitDialogData, HabitDialogMode, HabitDialogResult, HabitDialogAction } from './habit-dialog.model';

@Component({
    selector: 'app-habit-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './habit-dialog.component.html',
    styleUrls: ['./habit-dialog.component.css']
})
export class HabitDialogComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<HabitDialogComponent>);
    readonly data = inject<HabitDialogData>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);

    form: FormGroup;
    readonly colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

    constructor() {
        this.form = this.fb.group({
            title: ['', Validators.required],
            frequency: ['daily', Validators.required],
            daysOfWeek: [[]], // Array of numbers
            intervalDays: [1],
            goal: [1, [Validators.required, Validators.min(1)]],
            color: [this.colors[0], Validators.required],
            notes: ['']
        });
    }

    get isEditMode(): boolean {
        return this.data.mode === HabitDialogMode.Edit;
    }

    ngOnInit(): void {
        if (this.isEditMode && this.data.habit) {
            this.form.patchValue({
                title: this.data.habit.title,
                frequency: this.data.habit.frequency,
                daysOfWeek: this.data.habit.daysOfWeek || [],
                intervalDays: this.data.habit.intervalDays || 1,
                goal: this.data.habit.goal,
                color: this.data.habit.color,
                notes: this.data.habit.notes || ''
            });
        }
    }

    onSave() {
        if (this.form.invalid) return;

        const formVal = this.form.value;
        const payload: Partial<Habit> = {
            title: formVal.title,
            frequency: formVal.frequency,
            // Implied goal of 1 for specific configurations
            goal: (formVal.frequency === 'specific_days' || formVal.frequency === 'interval') ? 1 : formVal.goal,
            color: formVal.color,
            notes: formVal.notes
        };

        if (formVal.frequency === 'specific_days') {
            payload.daysOfWeek = formVal.daysOfWeek;
            // Basic validation: ensure at least one day is selected
            if (!payload.daysOfWeek || payload.daysOfWeek.length === 0) {
                return; // Or show error

            }
        } else if (formVal.frequency === 'interval') {
            payload.intervalDays = formVal.intervalDays;
        }

        if (this.isEditMode && this.data.habit) {
            payload.id = this.data.habit.id;
        }

        this.dialogRef.close({
            action: HabitDialogAction.Save,
            payload
        } as HabitDialogResult);
    }

    toggleDay(dayIndex: number) {
        const currentDays = this.form.get('daysOfWeek')?.value as number[] || [];
        const idx = currentDays.indexOf(dayIndex);
        if (idx > -1) {
            currentDays.splice(idx, 1);
        } else {
            currentDays.push(dayIndex);
        }
        this.form.patchValue({ daysOfWeek: currentDays });
    }
}
