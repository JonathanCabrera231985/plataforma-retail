// apps/reports-service/src/inventory-reports/inventory-reports.controller.ts

import { Controller, Get, Param } from '@nestjs/common'; // Solo importamos Get y Param
import { InventoryReportsService } from './inventory-reports.service';
// Eliminamos los DTOs y otros métodos (Post, Patch, Delete)

@Controller('inventory-reports')
export class InventoryReportsController {
  constructor(private readonly inventoryReportsService: InventoryReportsService) {}

  @Get('detailed-stock') // Endpoint: GET /inventory-reports/detailed-stock
  getDetailedStock() {
    return this.inventoryReportsService.getDetailedStockReport();
  }

  @Get('by-location/:locationId') // Endpoint: GET /inventory-reports/by-location/uuid-de-la-ubicacion
  getStockByLocation(@Param('locationId') locationId: string) {
    // Validaremos el UUID con un Pipe más adelante
    return this.inventoryReportsService.getStockByLocation(locationId);
  }

  // Eliminamos los endpoints create(), update(), y remove()
}