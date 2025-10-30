// apps/orders-service/src/orders/orders.module.ts

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { HttpModule } from '@nestjs/axios'; // 1. Importar HttpModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    HttpModule, // 2. Añadir HttpModule aquí
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}