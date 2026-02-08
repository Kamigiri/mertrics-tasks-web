import { Task } from '../../../models/task.model';

export enum TaskDialogMode {
    Create,
    Edit
}

export enum TaskDialogAction {
    Save,
    Cancel
}

export interface TaskDialogData {
    mode: TaskDialogMode;
    task?: Task;
}

export interface TaskDialogResult {
    action: TaskDialogAction;
    payload?: Partial<Task>;
}
