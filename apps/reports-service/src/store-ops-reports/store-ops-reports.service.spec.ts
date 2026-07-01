import { Test, TestingModule } from '@nestjs/testing';
import { StoreOpsReportsService } from './store-ops-reports.service';
import { ConfigService } from '@nestjs/config';

describe('StoreOpsReportsService', () => {
  let service: StoreOpsReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreOpsReportsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
          },
        },
      ],
    }).compile();

    service = module.get<StoreOpsReportsService>(StoreOpsReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
