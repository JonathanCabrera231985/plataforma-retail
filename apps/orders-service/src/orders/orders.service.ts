// apps/orders-service/src/orders/orders.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from '../order-items/entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    // 1. Inyectar el repositorio de OrderItem
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // NOTA: En un escenario real, aquí llamaríamos al
    // inventory-service para verificar y descontar el stock.
    // Por ahora, solo creamos la orden.

    const { userId, locationId, items } = createOrderDto;
    let total = 0;

    // 2. Crear las instancias de los OrderItems y calcular el total
    const orderItems = items.map(itemDto => {
      // Calcula el subtotal de este ítem
      total += itemDto.priceAtPurchase * itemDto.quantity;

      // Crea la entidad OrderItem
      const item = new OrderItem();
      item.productId = itemDto.productId;
      item.quantity = itemDto.quantity;
      item.priceAtPurchase = itemDto.priceAtPurchase;
      return item;
      // No guardamos el 'order' aquí; TypeORM lo hará por la cascada
    });

    // 3. Crear la entidad Order
    const order = this.orderRepository.create({
      userId,
      locationId,
      total: total, // Asigna el total calculado
      status: OrderStatus.PENDING, // Estado inicial
      items: orderItems, // Asigna los ítems
    });

    try {
      // 4. Guardar la Orden.
      // Gracias a {cascade: true, eager: true} en la entidad Order,
      // TypeORM guardará la 'order' y todos sus 'orderItems' asociados
      // en una sola transacción.
      return await this.orderRepository.save(order);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al crear la orden.');
    }
  }

  findAll() {
    // ... (Implementar lógica de listar órdenes)
    return this.orderRepository.find();
  }

  findOne(id: string) {
     // ... (Implementar lógica de buscar una orden)
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}