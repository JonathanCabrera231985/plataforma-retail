import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportsController } from './inventory-reports.controller';
import { InventoryReportsService } from './inventory-reports.service';
import { ConfigService } from '@nestjs/config';

describe('InventoryReportsController', () => {
  let controller: InventoryReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryReportsController],
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

    controller = module.get<InventoryReportsController>(InventoryReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
