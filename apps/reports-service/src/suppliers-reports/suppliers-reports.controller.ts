import { Controller, Get, Headers } from '@nestjs/common';
import { SuppliersReportsService } from './suppliers-reports.service';

@Controller('suppliers-reports')
export class SuppliersReportsController {
  constructor(private readonly suppliersReportsService: SuppliersReportsService) {}

  @Get()
  findAll(@Headers('authorization') authHeader?: string) {
    return this.suppliersReportsService.findAll(authHeader);
  }
}