// apps/reports-service/src/sales-reports/entities/order.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';    

// Definimos el Enum aquí también para que TypeORM lo reconozca
export enum OrderStatus {
  PENDING = 'PENDIENTE',
  PAID = 'PAGADO',
  SHIPPED = 'ENVIADO',
  DELIVERED = 'ENTREGADO',
  CANCELLED = 'CANCELADO',
}

@Entity('orders') // ¡Debe coincidir con el nombre de la tabla en la BD 'orders'!
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'location_id' })
  locationId: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}