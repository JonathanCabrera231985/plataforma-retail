import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportsService } from './inventory-reports.service';
import { ConfigService } from '@nestjs/config';

describe('InventoryReportsService', () => {
  let service: InventoryReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryReportsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
          },
        },
      ],
    }).compile();

    service = module.get<InventoryReportsService>(InventoryReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
