import { Module } from '@nestjs/common';
import { PurchaseOrderItemsService } from './purchase-order-items.service';
import { PurchaseOrderItemsController } from './purchase-order-items.controller';

@Module({
  controllers: [PurchaseOrderItemsController],
  providers: [PurchaseOrderItemsService],
})
export class PurchaseOrderItemsModule {}
