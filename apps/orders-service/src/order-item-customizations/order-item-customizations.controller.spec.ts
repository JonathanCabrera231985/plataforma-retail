import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemCustomizationsController } from './order-item-customizations.controller';
import { OrderItemCustomizationsService } from './order-item-customizations.service';

describe('OrderItemCustomizationsController', () => {
  let controller: OrderItemCustomizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemCustomizationsController],
      providers: [OrderItemCustomizationsService],
    }).compile();

    controller = module.get<OrderItemCustomizationsController>(OrderItemCustomizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
