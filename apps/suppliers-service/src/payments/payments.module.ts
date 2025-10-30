// apps/suppliers-service/src/payments/payments.module.ts

import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Payment } from './entities/payment.entity'; // 2. Importar
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module'; // 3. Importar

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]), // 4. Registrar Entidad
    PurchaseOrdersModule, // 5. Importar Módulo
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}