import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersReportsService } from './suppliers-reports.service';
import { ConfigService } from '@nestjs/config';

describe('SuppliersReportsService', () => {
  let service: SuppliersReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersReportsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
          },
        },
      ],
    }).compile();

    service = module.get<SuppliersReportsService>(SuppliersReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
