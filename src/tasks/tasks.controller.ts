import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';

import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filter: GetTasksFilterDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filter,
      )}`,
    );

    return this.tasksService.getAllTasks(filter, user);
  }

  @Get('/:id')
  getTaskByID(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskByID(id, user);
  }

  @Post()
  createTask(
    @Body() createTask: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" is creating a new task. Data ${JSON.stringify(
        createTask,
      )}`,
    );

    return this.tasksService.createTask(createTask, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatus: UpdateTaskStatusDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatus;

    return this.tasksService.updateTask(id, status, user);
  }
}
