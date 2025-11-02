// apps/reports-service/src/inventory-reports/inventory-reports.module.ts

import { Module } from '@nestjs/common';
import { InventoryReportsService } from './inventory-reports.service';
import { InventoryReportsController } from './inventory-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Product } from './entities/product.entity'; // 2. Importar
import { Location } from './entities/location.entity'; // 3. Importar
import { InventoryStock } from './entities/inventory-stock.entity'; // 4. Importar

@Module({
  imports: [
    // 5. Conectar estas entidades usando la conexión 'inventory_connection'
    TypeOrmModule.forFeature(
      [Product, Location, InventoryStock],
      'inventory_connection', // <-- Nombre de la conexión
    ),
  ],
  controllers: [InventoryReportsController],
  providers: [InventoryReportsService],
})
export class InventoryReportsModule {}