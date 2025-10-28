// apps/inventory-service/src/products/products.module.ts

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { Product } from './entities/product.entity'; // 2. Importar
import { CategoriesModule } from '../categories/categories.module'; // Importar CategoriesModule

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // 3. Añadir esto
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}