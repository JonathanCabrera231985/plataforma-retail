import { Test, TestingModule } from '@nestjs/testing';
import { AccessLogsController } from './access-logs.controller';
import { AccessLogsService } from './access-logs.service';

describe('AccessLogsController', () => {
  let controller: AccessLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessLogsController],
      providers: [
        {
          provide: AccessLogsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccessLogsController>(AccessLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
