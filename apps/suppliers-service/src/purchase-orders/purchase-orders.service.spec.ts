import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrdersService } from './purchase-orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { SuppliersService } from '../suppliers/suppliers.service';

describe('PurchaseOrdersService', () => {
  let service: PurchaseOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrdersService,
        {
          provide: getRepositoryToken(PurchaseOrder),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: SuppliersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PurchaseOrdersService>(PurchaseOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
