import { Test, TestingModule } from '@nestjs/testing';
import { SalesReportsService } from './sales-reports.service';
import { ConfigService } from '@nestjs/config';

describe('SalesReportsService', () => {
  let service: SalesReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesReportsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
          },
        },
      ],
    }).compile();

    service = module.get<SalesReportsService>(SalesReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
