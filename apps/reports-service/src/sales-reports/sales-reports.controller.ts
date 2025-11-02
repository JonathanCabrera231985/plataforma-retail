// apps/reports-service/src/sales-reports/sales-reports.controller.ts

import { Controller, Get } from '@nestjs/common'; // Solo importamos Get
import { SalesReportsService } from './sales-reports.service';

@Controller('sales-reports')
export class SalesReportsController {
  constructor(private readonly salesReportsService: SalesReportsService) {}

  @Get()
  findAll() {
    // Llama al método 'findAll' del servicio, que ahora devuelve el resumen de ventas.
    return this.salesReportsService.findAll();
  }

  // Eliminamos create, findOne, update, y remove
  // ya que este controlador es solo para LEER reportes.
}