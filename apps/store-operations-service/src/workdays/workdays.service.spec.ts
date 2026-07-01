import { Test, TestingModule } from '@nestjs/testing';
import { WorkdaysService } from './workdays.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workday } from './entities/workday.entity';
import { StoresService } from '../stores/stores.service';

describe('WorkdaysService', () => {
  let service: WorkdaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkdaysService,
        {
          provide: getRepositoryToken(Workday),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: StoresService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WorkdaysService>(WorkdaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
