import { Brackets, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTask: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTask;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }

  async getTasks(filter: GetTasksFilterDTO): Promise<Task[]> {
    const { search, status } = filter;

    const query = this.createQueryBuilder('task');

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

    const tasks = await query.getMany();

    return tasks;
  }
}
