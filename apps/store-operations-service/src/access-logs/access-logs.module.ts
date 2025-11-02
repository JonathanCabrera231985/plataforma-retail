// apps/store-operations-service/src/access-logs/access-logs.module.ts

import { Module } from '@nestjs/common';
import { AccessLogsService } from './access-logs.service';
import { AccessLogsController } from './access-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar
import { AccessLog } from './entities/access-log.entity'; // Importar
import { StoresModule } from '../stores/stores.module'; // Importar

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessLog]), // Registrar Entidad
    StoresModule, // Importar StoresModule
  ],
  controllers: [AccessLogsController],
  providers: [AccessLogsService],
  exports: [AccessLogsService],
})
export class AccessLogsModule {}