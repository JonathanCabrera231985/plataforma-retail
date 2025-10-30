// apps/suppliers-service/src/purchase-order-items/purchase-order-items.module.ts

import { Module } from '@nestjs/common';
import { PurchaseOrderItemsService } from './purchase-order-items.service';
import { PurchaseOrderItemsController } from './purchase-order-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar
import { PurchaseOrderItem } from './entities/purchase-order-item.entity'; // Importar

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderItem])], // Registrar la entidad
  controllers: [PurchaseOrderItemsController],
  providers: [PurchaseOrderItemsService],
})
export class PurchaseOrderItemsModule {}