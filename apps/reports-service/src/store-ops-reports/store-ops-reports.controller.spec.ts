import { Test, TestingModule } from '@nestjs/testing';
import { StoreOpsReportsController } from './store-ops-reports.controller';
import { StoreOpsReportsService } from './store-ops-reports.service';

describe('StoreOpsReportsController', () => {
  let controller: StoreOpsReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreOpsReportsController],
      providers: [StoreOpsReportsService],
    }).compile();

    controller = module.get<StoreOpsReportsController>(StoreOpsReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
