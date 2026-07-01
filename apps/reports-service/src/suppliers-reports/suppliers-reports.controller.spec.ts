import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersReportsController } from './suppliers-reports.controller';
import { SuppliersReportsService } from './suppliers-reports.service';
import { ConfigService } from '@nestjs/config';

describe('SuppliersReportsController', () => {
  let controller: SuppliersReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersReportsController],
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

    controller = module.get<SuppliersReportsController>(SuppliersReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
