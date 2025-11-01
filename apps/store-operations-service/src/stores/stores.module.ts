// apps/store-operations-service/src/stores/stores.module.ts

import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Store } from './entities/store.entity'; // 2. Importar

@Module({
  imports: [TypeOrmModule.forFeature([Store])], // 3. Añadir esto
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService], // 4. Exporta el servicio
})
export class StoresModule {}