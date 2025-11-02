// apps/reports-service/src/sales-reports/sales-reports.module.ts

import { Module } from '@nestjs/common';
import { SalesReportsService } from './sales-reports.service';
import { SalesReportsController } from './sales-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Order } from './entities/order.entity'; // 2. Importar
import { OrderItem } from './entities/order-item.entity'; // 3. Importar

@Module({
  imports: [
    // 4. Conectar estas entidades usando la conexión 'orders_connection'
    TypeOrmModule.forFeature(
      [Order, OrderItem],
      'orders_connection', // <-- Este es el nombre de la conexión
    ),
  ],
  controllers: [SalesReportsController],
  providers: [SalesReportsService],
})
export class SalesReportsModule {}