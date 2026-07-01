// apps/orders-service/src/orders/orders.service.ts

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { HttpService } from '@nestjs/axios'; // 1. Importar HttpService
import { firstValueFrom } from 'rxjs'; // 2. Importar firstValueFrom
// ... (imports existentes)
import { OrderItemCustomization } from '../order-item-customizations/entities/order-item-customization.entity'; // 1. Importar


// DTO que espera el inventory-service (debe coincidir)
class AdjustStockDto {
  productId: string;
  locationId: string;
  amount: number;
}

@Injectable()
export class OrdersService {
  // Define la URL base del servicio de inventario
  //private inventoryServiceUrl = 'http://localhost:3001/inventory'; // (Puerto del inventory-service)
  private inventoryServiceUrl = 'http://inventory-service:3001/inventory';
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    // 3. Inyectar el HttpService
    private readonly httpService: HttpService,
  ) {}

  // Reemplaza tu método 'create' existente con este:
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, locationId, items } = createOrderDto;
    let total = 0;

    // Track successfully decremented items for rollback
    const decrementedItems: { productId: string; quantity: number }[] = [];

    // --- 4. Verificación y descuento de Stock ---
    try {
      for (const itemDto of items) {
        const stockAdjustment: AdjustStockDto = {
          productId: itemDto.productId,
          locationId: locationId,
          amount: itemDto.quantity,
        };

        await firstValueFrom(
          this.httpService.post(
            `${this.inventoryServiceUrl}/decrement`,
            stockAdjustment,
          ),
        );
        // Track success
        decrementedItems.push({
          productId: itemDto.productId,
          quantity: itemDto.quantity,
        });
      }
    } catch (error) {
      console.error(
        'Fallo al descontar stock:',
        error.response?.data || error.message,
      );
      // Revertir los stocks que ya se habían descontado
      await this.rollbackStock(locationId, decrementedItems);
      throw new BadRequestException(
        `Error al procesar el inventario: ${
          error.response?.data?.message || 'Servicio no disponible'
        }`,
      );
    }
    // --- Fin de la verificación de stock ---

    // 2. Crear las instancias de OrderItems Y SUS PERSONALIZACIONES
    const orderItems = items.map(itemDto => {
      total += itemDto.priceAtPurchase * itemDto.quantity;

      // --- Lógica de Personalización ---
      let customizations: OrderItemCustomization[] = [];
      if (itemDto.customizations && itemDto.customizations.length > 0) {
        customizations = itemDto.customizations.map(customDto => {
          const custom = new OrderItemCustomization();
          custom.attributeId = customDto.attributeId;
          custom.valueId = customDto.valueId;
          custom.attributeName = customDto.attributeName || null; // Usamos || null
          custom.valueName = customDto.valueName || null; // Usamos || null
          return custom;
        });
      }
      // --- Fin Lógica de Personalización ---

      // Crear la entidad OrderItem
      const item = new OrderItem();
      item.productId = itemDto.productId;
      item.quantity = itemDto.quantity;
      item.priceAtPurchase = itemDto.priceAtPurchase;
      item.customizations = customizations; // Asignar el array de personalizaciones

      return item;
    });

    // --- EL BLOQUE DUPLICADO FUE ELIMINADO ---

    // 3. Crear la entidad Order
    const order = this.orderRepository.create({
      userId,
      locationId,
      total: total,
      status: OrderStatus.PAID,
      items: orderItems,
    });

    try {
      // 4. Guardar todo
      return await this.orderRepository.save(order);
    } catch (error) {
      console.error('Error al guardar la orden, revirtiendo stock:', error.message);
      // Revertir TODOS los stocks descontados para esta orden
      await this.rollbackStock(locationId, decrementedItems);
      throw new InternalServerErrorException(
        'Error al crear la orden después de descontar stock.',
      );
    }
  }

  // Método auxiliar para revertir el stock en caso de fallas
  private async rollbackStock(
    locationId: string,
    items: { productId: string; quantity: number }[],
  ): Promise<void> {
    if (items.length === 0) return;
    try {
      await Promise.all(
        items.map(item => {
          const stockAdjustment: AdjustStockDto = {
            productId: item.productId,
            locationId: locationId,
            amount: item.quantity,
          };
          return firstValueFrom(
            this.httpService.post(
              `${this.inventoryServiceUrl}/increment`,
              stockAdjustment,
            ),
          );
        }),
      );
    } catch (rollbackError) {
      console.error(
        'Fallo crítico: No se pudo revertir el stock en inventory-service durante rollback.',
        rollbackError.response?.data || rollbackError.message,
      );
    }
  }

  // ... (findAll, findOne, update, remove) ...
  findAll() {
    return this.orderRepository.find();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // Compensar stock si el estado cambia a CANCELADO y antes no lo estaba
    if (
      updateOrderDto.status === OrderStatus.CANCELLED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      const itemsToRollback = order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      await this.rollbackStock(order.locationId, itemsToRollback);
    }

    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);

    // Compensar stock si la orden no estaba cancelada antes de ser eliminada
    if (order.status !== OrderStatus.CANCELLED) {
      const itemsToRollback = order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      await this.rollbackStock(order.locationId, itemsToRollback);
    }

    await this.orderRepository.remove(order);
  }
}