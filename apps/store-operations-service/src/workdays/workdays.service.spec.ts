import { Test, TestingModule } from '@nestjs/testing';
import { WorkdaysService } from './workdays.service';

describe('WorkdaysService', () => {
  let service: WorkdaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkdaysService],
    }).compile();

    service = module.get<WorkdaysService>(WorkdaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
