import { Component, input, OnInit, output, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Habit } from '../../../models/habit.model';
import { DateUtils, DayColor } from '../../../utils/date.utils';

@Component({
  selector: 'app-habit-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './habit-item.component.html',
  styleUrls: ['./habit-item.component.css']
})
export class HabitItemComponent {
  readonly habit = input.required<Habit>();
  readonly delete = output<void>();
  readonly complete = output<void>();
  readonly edit = output<void>();

  // Computed signal for last 7 days history
  readonly dayColors = computed<DayColor[]>(() => {
    // Dependency on habit() ensures reactivity to history changes
    this.habit();

    const colors: DayColor[] = [];

    // Loop back 6 days + today = 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      colors.push({ date: d, color: this.getDayColor(d) });
    }
    return colors;
  });

  isCompleted(date: Date): boolean {
    if (!this.habit().history) return false;

    // Count completions for this day
    const count = this.habit().history!.filter(h => DateUtils.isSameDay(date, h)).length;

    // Check if goal is met (default to 1 if goal is missing/0)
    const goal = this.habit().goal || 1;

    return count >= goal;
  }

  getDayColor(date: Date): string {
    const dStr = DateUtils.toLocalISOString(date);

    // Check completion status
    if (this.isCompleted(date)) {
      return '#22c55e'; // Green-500 (Goal Met)
    }

    // Check partial completion
    if (this.habit().history) {
      const count = this.habit().history!.filter(h => DateUtils.isSameDay(date, h)).length;
      if (count > 0) {
        return '#86efac'; // Green-300 (Partial progress)
      }
    }

    // Check creation date
    // We compare strings YYYY-MM-DD. 
    // If date < createdAt (day based), it's slate-100.
    // Note: createdAt is full ISO from backend.
    const createdAtStr = this.habit().createdAt.split('T')[0]; // Assuming backend sends ISO

    if (dStr < createdAtStr || this.habit().history?.length === 0) {
      return '#f1f5f9'; // Slate-100 (Empty/Before creation)
    }

    return '#ef4444'; // Red-500 (Missed)
  }


  onDelete() {
    this.delete.emit();
  }

  onComplete() {
    this.complete.emit();
  }

  onEdit() {
    this.edit.emit();
  }

  get formattedFrequency(): string {
    const h = this.habit();
    if (h.frequency === 'daily') return 'Daily';
    if (h.frequency === 'weekly') return 'Weekly';
    if (h.frequency === 'interval') {
      return h.intervalDays === 1 ? 'Every day' : `Every ${h.intervalDays} days`;
    }
    if (h.frequency === 'specific_days' && h.daysOfWeek) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return h.daysOfWeek.map(d => days[d]).join(', ');
    }
    return 'Daily';
  }
}
