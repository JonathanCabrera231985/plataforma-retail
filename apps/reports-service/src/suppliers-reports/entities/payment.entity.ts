// apps/reports-service/src/suppliers-reports/entities/payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal' })
  amount: number;

  @ManyToOne(() => PurchaseOrder, (po) => po.payments)
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;
}