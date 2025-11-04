// apps/orders-service/src/orders/orders.module.ts

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { HttpModule } from '@nestjs/axios'; // 1. Importar HttpModule
// 1. Importar la nueva entidad
import { OrderItemCustomization } from '../order-item-customizations/entities/order-item-customization.entity';

@Module({
  imports: [
   // 2. Añadir la entidad al array
    TypeOrmModule.forFeature([Order, OrderItem, OrderItemCustomization]),
    HttpModule,  
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}