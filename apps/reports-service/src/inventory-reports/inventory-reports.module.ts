import { Module } from '@nestjs/common';
import { InventoryReportsService } from './inventory-reports.service';
import { InventoryReportsController } from './inventory-reports.controller';

@Module({
  imports: [],
  controllers: [InventoryReportsController],
  providers: [InventoryReportsService],
})
export class InventoryReportsModule {}