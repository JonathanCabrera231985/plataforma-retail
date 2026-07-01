import { Controller, Get, Headers } from '@nestjs/common';
import { StoreOpsReportsService } from './store-ops-reports.service';

@Controller('store-ops-reports')
export class StoreOpsReportsController {
  constructor(private readonly storeOpsReportsService: StoreOpsReportsService) {}

  @Get()
  findAll(@Headers('authorization') authHeader?: string) {
    return this.storeOpsReportsService.findAll(authHeader);
  }
}