import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HabitsService } from '../../services/habits.service';
import { HabitItemComponent } from './habit-item/habit-item.component';
import { Habit } from '../../models/habit.model';
import { MatDialog } from '@angular/material/dialog';
import { HabitDialogComponent } from './habit-dialog/habit-dialog.component';
import { HabitDialogMode, HabitDialogResult, HabitDialogAction } from './habit-dialog/habit-dialog.model';

@Component({
    selector: 'app-habits',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, HabitItemComponent],
    templateUrl: './habits.component.html',
    styleUrls: ['./habits.component.css']
})
export class HabitsComponent {
    private habitsService = inject(HabitsService);
    private refresh$ = new BehaviorSubject<void>(undefined);

    readonly habits = toSignal(
        this.refresh$.pipe(
            switchMap(() => this.habitsService.getHabits())
        ),
        { initialValue: [] }
    );

    private dialog = inject(MatDialog);

    addHabit() {
        const dialogRef = this.dialog.open(HabitDialogComponent, {
            width: '400px',
            data: { mode: HabitDialogMode.Create }
        });

        dialogRef.afterClosed().subscribe((result: HabitDialogResult | undefined) => {
            if (result && result.action === HabitDialogAction.Save && result.payload) {
                this.habitsService.createHabit(result.payload).subscribe(() => {
                    this.refresh$.next();
                });
            }
        });
    }

    deleteHabit(id: string) {
        this.habitsService.deleteHabit(id).subscribe(() => {
            this.refresh$.next();
        });
    }

    completeHabit(habit: Habit) {
        // Send completion timestamp only. 
        // Backend handles streak calculation and history appending.
        this.habitsService.updateHabit(habit.id, {
            lastCompletedAt: new Date().toISOString()
        }).subscribe(() => {
            this.refresh$.next();
        });
    }
    editHabit(habit: Habit) {
        const dialogRef = this.dialog.open(HabitDialogComponent, {
            width: '400px',
            data: { mode: HabitDialogMode.Edit, habit }
        });

        dialogRef.afterClosed().subscribe((result: HabitDialogResult | undefined) => {
            if (result && result.action === HabitDialogAction.Save && result.payload) {
                // Determine ID (should be in payload if dialog handled it, or from original habit)
                const id = result.payload.id || habit.id;
                this.habitsService.updateHabit(id, result.payload).subscribe(() => {
                    this.refresh$.next();
                });
            }
        });
    }
}
