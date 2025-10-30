// apps/orders-service/src/orders/entities/order.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany, // 1. Importar OneToMany
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from '../../order-items/entities/order-item.entity'; // 2. Importar OrderItem

// ... (export enum OrderStatus ... )
export enum OrderStatus {
  PENDING = 'PENDIENTE',
  PAID = 'PAGADO',
  SHIPPED = 'ENVIADO',
  DELIVERED = 'ENTREGADO',
  CANCELLED = 'CANCELADO',
}


@Entity('orders')
export class Order {
  // ... (id, userId, locationId, status, total ... )
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'location_id' })
  locationId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // --- 3. Añadir la relación ---
  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true, // Permite guardar ítems al guardar la orden
    eager: true, // Carga automáticamente los ítems al buscar una orden
  })
  items: OrderItem[];
  // -------------------------

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}