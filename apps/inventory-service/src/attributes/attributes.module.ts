// apps/inventory-service/src/attributes/attributes.module.ts

import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Attribute } from './entities/attribute.entity'; // 2. Importar

@Module({
  imports: [TypeOrmModule.forFeature([Attribute])], // 3. Añadir esto
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [AttributesService], // 4. Exporta el servicio para uso futuro
})
export class AttributesModule {}