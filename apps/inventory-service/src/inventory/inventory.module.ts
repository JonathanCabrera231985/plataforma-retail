// apps/inventory-service/src/inventory/inventory.module.ts

import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryStock } from './entities/inventory-stock.entity';
import { LocationsModule } from '../locations/locations.module';
import { ProductsModule } from '../products/products.module'; // 1. Importar ProductsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryStock]),
    LocationsModule,
    ProductsModule, // 2. Añadir ProductsModule aquí
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  // Puedes exportar InventoryService si otros módulos lo necesitan
  // exports: [InventoryService]
})
export class InventoryModule {}