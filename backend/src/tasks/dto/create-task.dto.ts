import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskPriority } from '../enum/task-priority.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;
}
