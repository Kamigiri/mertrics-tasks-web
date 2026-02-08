import { Habit } from '../../../models/habit.model';

export enum HabitDialogMode {
    Create,
    Edit
}

export enum HabitDialogAction {
    Save,
    Cancel
}

export interface HabitDialogData {
    mode: HabitDialogMode;
    habit?: Habit;
}

export interface HabitDialogResult {
    action: HabitDialogAction;
    payload?: Partial<Habit>;
}
