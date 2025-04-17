import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  getAllTasks() { 
    return 'working'
  }
}
