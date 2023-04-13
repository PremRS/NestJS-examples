import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { TasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: TasksFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;

    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    queryBuilder.where({ user });

    if (status) {
      queryBuilder.andWhere('task.status = :status', {
        status,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        {
          search: `%${search}`,
        },
      );
    }

    const tasks = await queryBuilder.getMany();

    return tasks;
  }

  async createTask(task: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = task;

    const newTask: Task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(newTask);

    return newTask;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id: id, user: user });

    if (!task) {
      throw new NotFoundException(`Task with id - ${id} Not Found`);
    }

    return task;
  }

  async deleteTaskById(id: string, user: User): Promise<string> {
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id - ${id} Not Found`);
    }

    return 'Deleted Successfully';
  }

  async updateTaskStatus(
    id: string,
    taskStatus: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const { status } = taskStatus;

    const oldTask = await this.getTaskById(id, user);

    oldTask.status = status;

    const updatedTask = await this.taskRepository.save(oldTask);

    return updatedTask;
  }
}
