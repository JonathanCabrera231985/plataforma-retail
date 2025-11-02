// apps/reports-service/src/suppliers-reports/suppliers-reports.module.ts

import { Module } from '@nestjs/common';
import { SuppliersReportsService } from './suppliers-reports.service';
import { SuppliersReportsController } from './suppliers-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Supplier } from './entities/supplier.entity'; // 2. Importar
import { PurchaseOrder } from './entities/purchase-order.entity'; // 3. Importar
import { Payment } from './entities/payment.entity'; // 4. Importar

@Module({
  imports: [
    // 5. Conectar estas entidades usando la conexión 'suppliers_connection'
    TypeOrmModule.forFeature(
      [Supplier, PurchaseOrder, Payment],
      'suppliers_connection', // <-- Nombre de la conexión
    ),
  ],
  controllers: [SuppliersReportsController],
  providers: [SuppliersReportsService],
})
export class SuppliersReportsModule {}