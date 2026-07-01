import { Module } from '@nestjs/common';
import { SuppliersReportsService } from './suppliers-reports.service';
import { SuppliersReportsController } from './suppliers-reports.controller';

@Module({
  imports: [],
  controllers: [SuppliersReportsController],
  providers: [SuppliersReportsService],
})
export class SuppliersReportsModule {}