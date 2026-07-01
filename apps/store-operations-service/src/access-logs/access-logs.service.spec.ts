import { Test, TestingModule } from '@nestjs/testing';
import { AccessLogsService } from './access-logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessLog } from './entities/access-log.entity';
import { StoresService } from '../stores/stores.service';

describe('AccessLogsService', () => {
  let service: AccessLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessLogsService,
        {
          provide: getRepositoryToken(AccessLog),
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

    service = module.get<AccessLogsService>(AccessLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
