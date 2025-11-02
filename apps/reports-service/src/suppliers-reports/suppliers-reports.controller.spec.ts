import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersReportsController } from './suppliers-reports.controller';
import { SuppliersReportsService } from './suppliers-reports.service';

describe('SuppliersReportsController', () => {
  let controller: SuppliersReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersReportsController],
      providers: [SuppliersReportsService],
    }).compile();

    controller = module.get<SuppliersReportsController>(SuppliersReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
