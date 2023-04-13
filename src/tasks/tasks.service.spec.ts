import { Test, TestingModule } from '@nestjs/testing';
import { QueryBuilder, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

const mockRepo = () => ({
  getTaskBasedOnFilters: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const mockUser: User = {
  userName: 'PR',
  password: 'pwd',
  id: '1',
  tasks: [],
};

describe('TasksService', () => {
  let service: TasksService;
  let repo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: Task,
          useClass: Repository,
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get<Task>(Task);
  });

  describe('Get Tasks', () => {
    it('should be defined', async () => {
      // repo.createQueryBuilder.mockResolvedValue(QueryBuilder);
      const res = await service.getTasks({}, mockUser);
      // expect(repo.getTaskBasedOnFilters).toHaveBeenCalled();
      expect(res).toEqual('someValue');
    });
  });

  describe('Get Tasks By Id', () => {
    it('should be defined', async () => {
      const mockTask: Task = {
        title: 'Mock Title',
        description: 'Mock Description',
        user: mockUser,
        id: 'T1',
        status: TaskStatus.OPEN,
      };
      // repo.findOneBy.mockResolvedValue(mockTask);
      const res = await service.getTaskById('T1', mockUser);
      expect(res).toEqual(mockTask);
    });

    it('should be defined with error', async () => {
      // repo.findOneBy.mockResolvedValue(null);
      // expect(await service.getTaskById('T1', mockUser)).toContain('Not Found');
    });
  });
});
