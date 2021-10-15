import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getAllTasks(filter: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filter, user);
  }

  async getTaskByID(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  createTask(createTask: CreateTaskDTO, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTask, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}
