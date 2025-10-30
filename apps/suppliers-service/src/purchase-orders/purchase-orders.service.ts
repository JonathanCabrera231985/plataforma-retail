// apps/suppliers-service/src/purchase-orders/purchase-orders.service.ts

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder, PaymentStatus, PurchaseOrderStatus } from './entities/purchase-order.entity';
import { Repository } from 'typeorm';
import { SuppliersService } from '../suppliers/suppliers.service';
import { PurchaseOrderItem } from '../purchase-order-items/entities/purchase-order-item.entity';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,

    // Inyectamos el servicio de proveedores
    private readonly suppliersService: SuppliersService,
  ) {}

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const { supplierId, items } = createPurchaseOrderDto;
    let totalAmount = 0;

    // 1. Validar que el proveedor exista
    const supplier = await this.suppliersService.findOne(supplierId);
    // findOne ya lanza NotFoundException si no existe

    // 2. Crear las instancias de los PurchaseOrderItems y calcular el total
    const purchaseOrderItems = items.map(itemDto => {
      // Calcula el subtotal de este ítem
      totalAmount += itemDto.costPerItem * itemDto.quantity;

      // Crea la entidad PurchaseOrderItem
      const item = new PurchaseOrderItem();
      item.productId = itemDto.productId;
      item.productName = itemDto.productName; // Nombre denormalizado
      item.quantity = itemDto.quantity;
      item.costPerItem = itemDto.costPerItem;
      return item;
    });

    // 3. Crear la entidad PurchaseOrder
    const purchaseOrder = this.purchaseOrderRepository.create({
      supplier: supplier, // Asigna la entidad completa del proveedor
      items: purchaseOrderItems, // Asigna los ítems
      totalAmount: totalAmount, // Asigna el total calculado
      status: PurchaseOrderStatus.PENDING, // Estado inicial
      paymentStatus: PaymentStatus.PENDING, // Estado de pago inicial
      amountPaid: 0,
    });

    try {
      // 4. Guardar la Orden de Compra (y sus ítems, gracias a 'cascade: true')
      return await this.purchaseOrderRepository.save(purchaseOrder);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al crear la orden de compra.');
    }
  }

  findAll() {
    // Carga las órdenes con sus ítems gracias a 'eager: true'
    return this.purchaseOrderRepository.find();
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Orden de compra con ID "${id}" no encontrada`);
    }
    return order;
  }

  update(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    // TODO: Implementar lógica de actualización
    return `This action updates a #${id} purchaseOrder`;
  }

  remove(id: string) {
    // TODO: Implementar lógica de borrado
    return `This action removes a #${id} purchaseOrder`;
  }
}