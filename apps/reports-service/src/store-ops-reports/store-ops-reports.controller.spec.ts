import { Test, TestingModule } from '@nestjs/testing';
import { StoreOpsReportsController } from './store-ops-reports.controller';
import { StoreOpsReportsService } from './store-ops-reports.service';
import { ConfigService } from '@nestjs/config';

describe('StoreOpsReportsController', () => {
  let controller: StoreOpsReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreOpsReportsController],
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

    controller = module.get<StoreOpsReportsController>(StoreOpsReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
