import { User } from '../auth/user.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';

import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', true);

  async createTask(createTask: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTask;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);

    return task;
  }

  async getTasks(filter: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { search, status } = filter;

    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            'task.title ILIKE :search OR task.description ILIKE :search',
            { search: `%${search}%` },
          );
        }),
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filter)}`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  }
}
