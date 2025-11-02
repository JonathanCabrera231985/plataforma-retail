import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersReportsService } from './suppliers-reports.service';

describe('SuppliersReportsService', () => {
  let service: SuppliersReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuppliersReportsService],
    }).compile();

    service = module.get<SuppliersReportsService>(SuppliersReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
