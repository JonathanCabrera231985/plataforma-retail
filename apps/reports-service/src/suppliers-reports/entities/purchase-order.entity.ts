// apps/reports-service/src/suppliers-reports/entities/purchase-order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Payment } from './payment.entity';

export enum PurchaseOrderStatus { PENDING = 'PENDIENTE', /* ...otros estados */ }
export enum PaymentStatus { PENDING = 'PENDIENTE', PARTIAL = 'ABONADO', PAID = 'PAGADO' }

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchaseOrders)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'enum', enum: PaymentStatus, name: 'payment_status' })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'decimal', name: 'amount_paid' })
  amountPaid: number;
  // ... (status, totalAmount, amountPaid) ...
 
  @OneToMany(() => Payment, (payment: Payment) => payment.purchaseOrder) // <-- AÑADE EL TIPO AQUÍ
  payments: Payment[];
}