// apps/orders-service/src/orders/orders.module.ts

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity'; // 1. Importar OrderItem

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])], // 2. Añadir OrderItem aquí
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}