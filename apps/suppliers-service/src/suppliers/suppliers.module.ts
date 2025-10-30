// apps/suppliers-service/src/suppliers/suppliers.module.ts

import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Supplier } from './entities/supplier.entity'; // 2. Importar

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])], // 3. Añadir esto
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService], // 4. Exporta el servicio para uso futuro
})
export class SuppliersModule {}