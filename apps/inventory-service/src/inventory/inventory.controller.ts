// apps/inventory-service/src/inventory/inventory.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common'; // Añadir HttpCode, HttpStatus
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto'; // 1. Importar el nuevo DTO

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Endpoint para establecer stock (puede crear o actualizar)
  @Post()
  setStock(@Body() createInventoryDto: CreateInventoryDto) {
    // Renombramos 'create' a 'setStock' para claridad, llamando al método del servicio
    return this.inventoryService.setStock(createInventoryDto);
  }

  // --- NUEVO ENDPOINT PARA INCREMENTAR ---
  @Post('increment')
  @HttpCode(HttpStatus.OK) // Devolver 200 OK en lugar de 201 Created
  increment(@Body() adjustStockDto: AdjustStockDto) {
    const { productId, locationId, amount } = adjustStockDto;
    return this.inventoryService.incrementStock(productId, locationId, amount);
  }
  // --------------------------------------

  // --- NUEVO ENDPOINT PARA DECREMENTAR ---
  @Post('decrement')
  @HttpCode(HttpStatus.OK) // Devolver 200 OK en lugar de 201 Created
  decrement(@Body() adjustStockDto: AdjustStockDto) {
    const { productId, locationId, amount } = adjustStockDto;
    return this.inventoryService.decrementStock(productId, locationId, amount);
  }
  // --------------------------------------

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  // Este PATCH ahora actualiza la cantidad directamente a un valor específico
  @Patch(':id')
  adjustStockQuantity(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    // Renombramos 'update' para claridad, llamando al método del servicio
    return this.inventoryService.adjustStock(id, updateInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}