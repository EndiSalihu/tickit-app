import { TaskPriority } from "../enum/task-priority.enum";

export interface Task {
  title: string,
  description: string,
  priority: TaskPriority
}