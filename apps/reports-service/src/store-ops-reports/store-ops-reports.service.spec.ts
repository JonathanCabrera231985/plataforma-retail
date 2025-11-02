import { Test, TestingModule } from '@nestjs/testing';
import { StoreOpsReportsService } from './store-ops-reports.service';

describe('StoreOpsReportsService', () => {
  let service: StoreOpsReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreOpsReportsService],
    }).compile();

    service = module.get<StoreOpsReportsService>(StoreOpsReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
