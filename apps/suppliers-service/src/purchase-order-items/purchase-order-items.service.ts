// apps/suppliers-service/src/purchase-order-items/purchase-order-items.service.ts

import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderItemDto } from './dto/create-purchase-order-item.dto';
import { UpdatePurchaseOrderItemDto } from './dto/update-purchase-order-item.dto';
// ... (probablemente falten imports de TypeORM aquí)

@Injectable()
export class PurchaseOrderItemsService {

  // (Aquí irá tu constructor con @InjectRepository)

  create(createPurchaseOrderItemDto: CreatePurchaseOrderItemDto) {
    return 'This action adds a new purchaseOrderItem';
  }

  findAll() {
    return `This action returns all purchaseOrderItems`;
  }

  // --- CORRECCIÓN AQUÍ ---
  findOne(id: string) { // Cambia 'number' a 'string'
    return `This action returns a #${id} purchaseOrderItem`;
  }

  // --- CORRECCIÓN AQUÍ ---
  update(id: string, updatePurchaseOrderItemDto: UpdatePurchaseOrderItemDto) { // Cambia 'number' a 'string'
    return `This action updates a #${id} purchaseOrderItem`;
  }

  // --- CORRECCIÓN AQUÍ ---
  remove(id: string) { // Cambia 'number' a 'string'
    return `This action removes a #${id} purchaseOrderItem`;
  }
}