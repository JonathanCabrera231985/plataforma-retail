// apps/reports-service/src/store-ops-reports/store-ops-reports.controller.ts

import { Controller, Get } from '@nestjs/common'; // Solo importamos Get
import { StoreOpsReportsService } from './store-ops-reports.service';

@Controller('store-ops-reports')
export class StoreOpsReportsController {
  constructor(private readonly storeOpsReportsService: StoreOpsReportsService) {}

  @Get()
  findAll() {
    // Llama al método 'findAll' del servicio, que devuelve el resumen de alquileres pendientes.
    return this.storeOpsReportsService.findAll();
  }

  // Eliminamos create, findOne, update, y remove
}