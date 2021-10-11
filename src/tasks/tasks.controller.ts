import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import Task, { TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filter: GetTasksFilterDTO): Task[] {
    if (Object.keys(filter).length) {
      return this.tasksService.getTasksWithFilters(filter);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskByID(@Param('id') id: string): Task {
    return this.tasksService.getTaskByID(id);
  }

  @Post()
  createTask(@Body() createTask: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTask);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    return this.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTask(@Param('id') id: string, @Body() status: TaskStatus): Task {
    return this.tasksService.updateTask(id, status);
  }
}
