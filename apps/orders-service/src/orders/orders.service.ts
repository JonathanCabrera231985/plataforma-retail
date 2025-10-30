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

// DTO que espera el inventory-service (debe coincidir)
class AdjustStockDto {
  productId: string;
  locationId: string;
  amount: number;
}

@Injectable()
export class OrdersService {
  // Define la URL base del servicio de inventario
  private inventoryServiceUrl = 'http://localhost:3001/inventory'; // (Puerto del inventory-service)

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    // 3. Inyectar el HttpService
    private readonly httpService: HttpService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, locationId, items } = createOrderDto;
    let total = 0;

    // --- 4. Verificación y descuento de Stock (Paso Crítico) ---
    try {
      // Usamos Promise.all para ejecutar todas las llamadas de descuento en paralelo
      await Promise.all(
        items.map(itemDto => {
          const stockAdjustment: AdjustStockDto = {
            productId: itemDto.productId,
            locationId: locationId, // Descontamos de la ubicación de la venta
            amount: itemDto.quantity,
          };
          
          // Llama al endpoint /decrement del inventory-service
          const request = this.httpService.post(
            `${this.inventoryServiceUrl}/decrement`,
            stockAdjustment,
          );
          return firstValueFrom(request); // Convierte el Observable en una Promesa
        }),
      );
    } catch (error) {
      // Si falla (ej. "Stock insuficiente" o el servicio está caído)
      console.error('Fallo al descontar stock:', error.response?.data || error.message);
      // Lanza un error claro al cliente
      throw new BadRequestException(`Error al procesar el inventario: ${error.response?.data?.message || 'Servicio no disponible'}`);
    }
    // --- Fin de la verificación de stock ---

    // 5. Si el stock se descontó correctamente, procede a crear la orden
    const orderItems = items.map(itemDto => {
      total += itemDto.priceAtPurchase * itemDto.quantity;
      const item = new OrderItem();
      item.productId = itemDto.productId;
      item.quantity = itemDto.quantity;
      item.priceAtPurchase = itemDto.priceAtPurchase;
      return item;
    });

    const order = this.orderRepository.create({
      userId,
      locationId,
      total: total,
      status: OrderStatus.PAID, // Marcamos como PAGADO ya que el stock fue descontado
      items: orderItems,
    });

    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      // TODO: Aquí deberíamos tener lógica para revertir la llamada de stock si
      // falla el guardado de la orden (Saga Pattern).
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