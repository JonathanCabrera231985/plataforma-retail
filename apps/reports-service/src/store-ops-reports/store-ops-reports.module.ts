// apps/reports-service/src/store-ops-reports/store-ops-reports.module.ts

import { Module } from '@nestjs/common';
import { StoreOpsReportsService } from './store-ops-reports.service';
import { StoreOpsReportsController } from './store-ops-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Store } from './entities/store.entity'; // 2. Importar
import { RentalPayment } from './entities/rental-payment.entity'; // 3. Importar
import { Workday } from './entities/workday.entity'; // 4. Importar

@Module({
  imports: [
    // 5. Conectar estas entidades usando la conexión 'store_ops_connection'
    TypeOrmModule.forFeature(
      [Store, RentalPayment, Workday],
      'store_ops_connection', // <-- Nombre de la conexión
    ),
  ],
  controllers: [StoreOpsReportsController],
  providers: [StoreOpsReportsService],
})
export class StoreOpsReportsModule {}