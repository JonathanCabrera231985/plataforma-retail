// apps/suppliers-service/src/purchase-order-items/entities/purchase-order-item.entity.ts

import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID del producto del 'inventory-service'.
  // Guardamos el ID y denormalizamos el nombre/SKU para reportes.
  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @Column({ type: 'varchar', length: 150, name: 'product_name' })
  productName: string; // Nombre del producto al momento de la compra

  @Column({ type: 'int' })
  quantity: number; // Cantidad pedida

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'cost_per_item' })
  costPerItem: number; // Costo unitario al proveedor

  // --- Relación con PurchaseOrder ---
  @ManyToOne(() => PurchaseOrder, (order) => order.items, {
    nullable: false,
    onDelete: 'CASCADE', // Si se borra la orden, se borran los ítems
  })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;
}