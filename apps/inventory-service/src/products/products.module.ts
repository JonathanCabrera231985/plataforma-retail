// apps/inventory-service/src/products/products.module.ts

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from '../categories/categories.module'; // 1. Importar CategoriesModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule, // 2. Añadir CategoriesModule aquí
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // <-- Esta línea ya debe existir
})
export class ProductsModule {}