import { Test, TestingModule } from '@nestjs/testing';
import { WorkdaysController } from './workdays.controller';
import { WorkdaysService } from './workdays.service';

describe('WorkdaysController', () => {
  let controller: WorkdaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkdaysController],
      providers: [
        {
          provide: WorkdaysService,
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

    controller = module.get<WorkdaysController>(WorkdaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
