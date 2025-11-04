import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemCustomizationsService } from './order-item-customizations.service';

describe('OrderItemCustomizationsService', () => {
  let service: OrderItemCustomizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderItemCustomizationsService],
    }).compile();

    service = module.get<OrderItemCustomizationsService>(OrderItemCustomizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
