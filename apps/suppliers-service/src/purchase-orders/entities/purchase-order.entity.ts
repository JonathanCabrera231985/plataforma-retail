// apps/suppliers-service/src/purchase-orders/entities/purchase-order.entity.ts

import { Supplier } from '../../suppliers/entities/supplier.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PurchaseOrderStatus {
  PENDING = 'PENDIENTE',
  ORDERED = 'ORDENADA',
  RECEIVED_PARTIAL = 'RECIBIDA_PARCIAL',
  RECEIVED_COMPLETE = 'RECIBIDA_COMPLETA',
  CANCELLED = 'CANCELADA',
}

export enum PaymentStatus {
  PENDING = 'PENDIENTE',
  PARTIAL = 'ABONADO',
  PAID = 'PAGADO',
}

@Entity('purchase_orders') // Nombre de la tabla
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relación con Supplier ---
  @ManyToOne(() => Supplier, { nullable: false, eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;
  // -----------------------------

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.PENDING,
  })
  status: PurchaseOrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    name: 'payment_status',
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount', default: 0 })
  totalAmount: number; // Costo total de la orden

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'amount_paid', default: 0 })
  amountPaid: number; // Monto abonado

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Aquí añadiremos la relación @OneToMany con PurchaseOrderItems
  // ...
}