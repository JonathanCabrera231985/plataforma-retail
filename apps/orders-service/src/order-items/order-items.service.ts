// apps/orders-service/src/order-items/order-items.service.ts

import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
// ... (probablemente falten imports de TypeORM aquí, pero nos enfocamos en el error)

@Injectable()
export class OrderItemsService {

  // (Aquí irá tu constructor con @InjectRepository)

  create(createOrderItemDto: CreateOrderItemDto) {
    return 'This action adds a new orderItem';
  }

  findAll() {
    return `This action returns all orderItems`;
  }

  // --- CORRECCIÓN AQUÍ ---
  findOne(id: string) { // Cambia 'number' a 'string'
    return `This action returns a #${id} orderItem`;
  }

  // --- CORRECCIÓN AQUÍ ---
  update(id: string, updateOrderItemDto: UpdateOrderItemDto) { // Cambia 'number' a 'string'
    return `This action updates a #${id} orderItem`;
  }

  // --- CORRECCIÓN AQUÍ ---
  remove(id: string) { // Cambia 'number' a 'string'
    return `This action removes a #${id} orderItem`;
  }
}