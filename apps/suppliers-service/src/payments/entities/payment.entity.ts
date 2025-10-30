// apps/suppliers-service/src/payments/entities/payment.entity.ts

import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PaymentMethod {
  CASH = 'EFECTIVO',
  TRANSFER = 'TRANSFERENCIA',
  CREDIT_CARD = 'TARJETA_CREDITO',
  OTHER = 'OTRO',
}

@Entity('payments') // Nombre de la tabla
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relación con PurchaseOrder ---
  @ManyToOne(() => PurchaseOrder, {
    nullable: false,
    onDelete: 'CASCADE', // Si se borra la orden, se borran los pagos
  })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;
  // ---------------------------------

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Monto del abono

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.TRANSFER,
    name: 'payment_method',
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'text', nullable: true })
  notes: string; // Referencia del pago, etc.

  @CreateDateColumn({ name: 'payment_date' })
  paymentDate: Date;
}