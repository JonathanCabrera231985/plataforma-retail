// apps/inventory-service/src/inventory/inventory.module.ts

import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { InventoryStock } from './entities/inventory-stock.entity'; // 2. Importar (con el nuevo nombre)

@Module({
  imports: [TypeOrmModule.forFeature([InventoryStock])], // 3. Usar el nuevo nombre
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}