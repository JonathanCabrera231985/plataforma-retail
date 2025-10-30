// apps/orders-service/src/orders/entities/order.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Definimos los posibles estados de un pedido
export enum OrderStatus {
  PENDING = 'PENDIENTE',
  PAID = 'PAGADO',
  SHIPPED = 'ENVIADO',
  DELIVERED = 'ENTREGADO',
  CANCELLED = 'CANCELADO',
}

@Entity('orders') // Nombre de la tabla
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string; // ID del usuario que crea el pedido (del iam-service)

  @Column({ type: 'uuid', name: 'location_id' })
  locationId: string; // ID de la tienda/ubicación donde se hizo la venta (del inventory-service)

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // Aquí irán los @OneToMany con OrderItem
  // ...

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}