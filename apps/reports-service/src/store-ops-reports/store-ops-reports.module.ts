// apps/reports-service/src/store-ops-reports/store-ops-reports.module.ts

import { Module } from '@nestjs/common';
import { StoreOpsReportsService } from './store-ops-reports.service';
import { StoreOpsReportsController } from './store-ops-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { RentalPayment } from './entities/rental-payment.entity';
import { Workday } from './entities/workday.entity';
import { AccessLog } from './entities/access-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Store, RentalPayment, Workday, AccessLog],
      'store_ops_connection', // <-- Nombre de la conexión
    ),
  ],
  controllers: [StoreOpsReportsController],
  providers: [StoreOpsReportsService],
})
export class StoreOpsReportsModule {}