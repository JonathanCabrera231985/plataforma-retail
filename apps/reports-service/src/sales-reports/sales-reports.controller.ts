import { Controller, Get, Headers } from '@nestjs/common';
import { SalesReportsService } from './sales-reports.service';

@Controller('sales-reports')
export class SalesReportsController {
  constructor(private readonly salesReportsService: SalesReportsService) {}

  @Get()
  findAll(@Headers('authorization') authHeader?: string) {
    return this.salesReportsService.findAll(authHeader);
  }
}