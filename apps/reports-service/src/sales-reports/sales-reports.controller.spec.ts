import { Test, TestingModule } from '@nestjs/testing';
import { SalesReportsController } from './sales-reports.controller';
import { SalesReportsService } from './sales-reports.service';
import { ConfigService } from '@nestjs/config';

describe('SalesReportsController', () => {
  let controller: SalesReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesReportsController],
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

    controller = module.get<SalesReportsController>(SalesReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
