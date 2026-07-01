// apps/reports-service/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SalesReportsModule } from './sales-reports/sales-reports.module';
import { InventoryReportsModule } from './inventory-reports/inventory-reports.module';
import { SuppliersReportsModule } from './suppliers-reports/suppliers-reports.module';
import { StoreOpsReportsModule } from './store-ops-reports/store-ops-reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SalesReportsModule,
    InventoryReportsModule,
    SuppliersReportsModule,
    StoreOpsReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}