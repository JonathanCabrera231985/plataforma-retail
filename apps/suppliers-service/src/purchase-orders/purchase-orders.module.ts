// apps/suppliers-service/src/purchase-orders/purchase-orders.module.ts

import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { PurchaseOrder } from './entities/purchase-order.entity'; // 2. Importar
import { SuppliersModule } from '../suppliers/suppliers.module'; // 3. Importar SuppliersModule

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrder]), // 4. Registrar Entidad
    SuppliersModule, // 5. Importar Módulo
  ],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}