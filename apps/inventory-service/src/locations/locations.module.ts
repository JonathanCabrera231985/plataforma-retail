// apps/inventory-service/src/locations/locations.module.ts

import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Location } from './entities/location.entity'; // 2. Importar

@Module({
  imports: [TypeOrmModule.forFeature([Location])], // 3. Añadir esto
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService], // 4. Exporta el servicio para usarlo en InventoryService
})
export class LocationsModule {}