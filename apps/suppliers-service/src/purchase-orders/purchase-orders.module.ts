// apps/suppliers-service/src/purchase-orders/purchase-orders.module.ts

import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { PurchaseOrderItem } from '../purchase-order-items/entities/purchase-order-item.entity'; // 1. Importar

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrder, PurchaseOrderItem]), // 2. Añadir PurchaseOrderItem
    SuppliersModule, // (Ya debe estar importado)
  ],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
  exports: [PurchaseOrdersService], // <-- AÑADE ESTA LÍNEA
})
export class PurchaseOrdersModule {}