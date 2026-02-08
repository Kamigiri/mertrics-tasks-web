/**
 * Represents a collection of tasks.
 */
export interface TaskList {
  /** Unique identifier for the list. */
  id: string;
  /** Display title of the list. */
  title: string;
  /** Timestamp of the last update (ISO string). */
  updated?: string;
  /** API resource link. */
  selflink?: string;
  /** Collection of tasks within this list. */
  tasks?: Task[];
}

/**
 * Enumeration of possible task statuses.
 * Used for filtering and UI states.
 */
export enum TaskStatus {
  /** Task requires action (incomplete). */
  NeedsAction = 'needsAction',
  /** Task has been completed. */
  Completed = 'completed',
}

/**
 * Represents a single task item.
 */
export interface Task {
  /** Unique identifier for the task. */
  id: string;
  /** Main text content of the task. */
  title: string;
  /** Timestamp of the last update (ISO string). */
  updated?: string;
  /** API resource link. */
  selflink?: string;
  /** Current completion status. */
  status?: TaskStatus;
  /** Link to view the task in a web interface. */
  webViewLink?: string;
  /** Whether the task is hidden from the main view. */
  hidden?: boolean;
  /** Due date for the task (ISO date string). */
  due?: string;
  /** Additional definitions or details. */
  notes?: string;
  /** Timestamp when the task was completed (ISO string). */
  completed?: string;
  /** ID of the parent task if this is a subtask. */
  parent?: string;
  /** Positioning string for ordering tasks. */
  position?: string;
  /** Client-side field to track which list this task belongs to. */
  listId?: string;
}
