// apps/inventory-service/src/categories/categories.module.ts

import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Category } from './entities/category.entity'; // 2. Importar

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // 3. Añadir esto
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
exports: [CategoriesService]
