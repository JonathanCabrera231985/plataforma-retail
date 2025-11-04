// apps/orders-service/src/order-items/entities/order-item.entity.ts

import { Order } from '../../orders/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany, // 1. Importar OneToMany
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItemCustomization } from '../../order-item-customizations/entities/order-item-customization.entity'; // 2. Importar
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string; // ID del producto (del inventory-service)

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price_at_purchase' })
  priceAtPurchase: number; // Precio al momento de la compra

  // --- Relación con Order ---
  @ManyToOne(() => Order, (order) => order.items, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
  // --- 3. AÑADIR ESTA RELACIÓN ---
  @OneToMany(() => OrderItemCustomization, (custom) => custom.orderItem, {
    cascade: true, // Guardar personalizaciones al guardar el ítem
    eager: true, // Cargar personalizaciones automáticamente
  })
  customizations: OrderItemCustomization[];
  // -----------------------------
}