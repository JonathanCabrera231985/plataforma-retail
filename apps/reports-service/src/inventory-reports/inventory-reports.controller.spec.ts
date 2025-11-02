import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportsController } from './inventory-reports.controller';
import { InventoryReportsService } from './inventory-reports.service';

describe('InventoryReportsController', () => {
  let controller: InventoryReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryReportsController],
      providers: [InventoryReportsService],
    }).compile();

    controller = module.get<InventoryReportsController>(InventoryReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
