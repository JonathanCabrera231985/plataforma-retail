// apps/orders-service/src/orders/orders.service.ts

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
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

  // --- 4. Verificación y descuento de Stock ---
  try {
    await Promise.all(
      items.map(itemDto => {
        const stockAdjustment: AdjustStockDto = {
          productId: itemDto.productId,
          locationId: locationId,
          amount: itemDto.quantity,
        };

        const request = this.httpService.post(
          `${this.inventoryServiceUrl}/decrement`,
          stockAdjustment,
        );
        return firstValueFrom(request);
      }),
    );
  } catch (error) {
    console.error('Fallo al descontar stock:', error.response?.data || error.message);
    throw new BadRequestException(`Error al procesar el inventario: ${error.response?.data?.message || 'Servicio no disponible'}`);
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
    console.error(error);
    throw new InternalServerErrorException('Error al crear la orden después de descontar stock.');
  }
}

  // ... (findAll, findOne, update, remove) ...
  findAll() {
    return this.orderRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}