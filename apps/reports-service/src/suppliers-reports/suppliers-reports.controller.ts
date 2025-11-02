// apps/reports-service/src/suppliers-reports/suppliers-reports.controller.ts

import { Controller, Get } from '@nestjs/common'; // Solo importamos Get
import { SuppliersReportsService } from './suppliers-reports.service';

@Controller('suppliers-reports')
export class SuppliersReportsController {
  constructor(private readonly suppliersReportsService: SuppliersReportsService) {}

  @Get()
  findAll() {
    // Llama al método 'findAll' del servicio, que ahora devuelve el resumen de deudas.
    return this.suppliersReportsService.findAll();
  }

  // Eliminamos create, findOne, update, y remove
}