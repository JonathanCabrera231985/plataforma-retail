import { Module } from '@nestjs/common';
import { StoreOpsReportsService } from './store-ops-reports.service';
import { StoreOpsReportsController } from './store-ops-reports.controller';

@Module({
  controllers: [StoreOpsReportsController],
  providers: [StoreOpsReportsService],
})
export class StoreOpsReportsModule {}
