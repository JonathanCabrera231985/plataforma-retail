// apps/inventory-service/src/inventory/inventory.module.ts

import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryStock } from './entities/inventory-stock.entity';
import { LocationsModule } from '../locations/locations.module'; // 1. Importar LocationsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryStock]),
    LocationsModule, // 2. Añadir LocationsModule aquí
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  // Puedes exportar InventoryService si otros módulos lo necesitan
  // exports: [InventoryService]
})
export class InventoryModule {}